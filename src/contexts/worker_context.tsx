import React, {createContext, useRef, useContext} from 'react';
import keccak from '@cafeca/keccak';
import useState from 'react-usestateref';
import {formatAPIRequest, FormatedTypeRequest, TypeRequest} from '../constants/api_request';

import {Events} from '../constants/events';
import {TideBitEvent} from '../constants/tidebit_event';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import Pusher from 'pusher-js';
import {NotificationContext} from './notification_context';
import {
  IPusherData,
  IPusherPrivateData,
  PusherChannel,
} from '../interfaces/tidebit_defi_background/pusher_data';
import {ICandlestick} from '../interfaces/tidebit_defi_background/candlestickData';
import {getCookieByName} from '../lib/common';

type IJobType = 'API' | 'WS';

export interface IJobTypeConstant {
  API: IJobType;
  WS: IJobType;
}
export const JobType: IJobTypeConstant = {
  API: 'API',
  WS: 'WS',
};

interface IWorkerProvider {
  children: React.ReactNode;
}
interface IWorkerContext {
  init: () => void;
  requestHandler: (data: TypeRequest) => Promise<unknown>;
  subscribeUser: (address: string) => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  init: () => null,
  requestHandler: () => Promise.resolve(),
  subscribeUser: () => null,
});

let jobTimer: NodeJS.Timeout | null = null;
/** Deprecated: replaced by pusher (20230502 - tzuhan) 
let wsWorker: WebSocket | null;
*/

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const pusherKey = process.env.PUSHER_KEY!;
  const pusherCluster = process.env.PUSHER_CLUSTER!;
  const notificationCtx = useContext(NotificationContext);
  const [apiWorker, setAPIWorker, apiWorkerRef] = useState<Worker | null>(null);
  const [pusher, setPuser, pusherRef] = useState<Pusher | null>(null);
  const jobQueueOfWS = useRef<((...args: []) => Promise<void>)[]>([]);
  const jobQueueOfAPI = useRef<((...args: []) => Promise<void>)[]>([]);
  const [sockedId, setSocketId, sockedIdRef] = useState<string | null>(null);
  /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
  const requests = useRef<IRequest>({});
  */

  const apiInit = () => {
    const apiWorker = new Worker(new URL('../lib/workers/api.worker.ts', import.meta.url));
    setAPIWorker(apiWorker);
    /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
    apiWorker.onmessage = event => {
      const {name, result, error} = event.data;
      requests.current[name]?.callback(result, error);
      delete requests.current[name];
    };
    */
  };

  const subscribeTickers = () => {
    if (pusherRef.current) {
      const channel = pusherRef.current.subscribe(PusherChannel.GLOBAL_CHANNEL);
      channel.bind(Events.TICKERS, (pusherData: IPusherData) => {
        const {data} = pusherData;
        const tickerData = data as ITickerData;
        notificationCtx.emitter.emit(TideBitEvent.TICKER, tickerData);
      });
    }
  };

  const subscribeCandlesticks = () => {
    if (pusherRef.current) {
      const channel = pusherRef.current?.subscribe(PusherChannel.GLOBAL_CHANNEL);
      channel.bind(Events.CANDLE_ON_UPDATE, (pusherData: IPusherData) => {
        const {action, data} = pusherData;
        const candlesticks = data as ICandlestick;
        notificationCtx.emitter.emit(TideBitEvent.CANDLESTICK, action, candlesticks);
      });
    }
  };

  const subscribeUser = (address: string) => {
    if (pusherRef.current) {
      const channelName = `${PusherChannel.PRIVATE_CHANNEL}-${keccak
        .keccak256(address.toLowerCase().replace(`0x`, ``))
        .slice(0, 8)}`;
      // eslint-disable-next-line no-console
      // console.log(`when subscribeUser DeWT`, getCookieByName('DeWT'));
      const channel = pusherRef.current?.subscribe(channelName);

      // eslint-disable-next-line no-console
      // console.log(`pusher channel:`, channel);

      channel.bind_global((data: string, metadata: any) => {
        // eslint-disable-next-line no-console
        console.log(`pusher PRIVATE_CHANNEL bind_global:`, data, `metadata`, metadata);
      });

      channel.bind(Events.BALANCE, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.BALANCE, data);
      });
      channel.bind(Events.CFD, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.CFD, data);
      });
      channel.bind(Events.BOLT_TRANSACTION, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.BOLT_TRANSACTION, data);
      });
    }
  };

  const pusherInit = () => {
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      channelAuthorization: {
        transport: 'jsonp',
        endpoint: `http://localhost:3000/api/pusher/auth`,
        // endpoint: `${process.env.PUSHER_API}/pusher/auth`,
        headers: {
          deWT: getCookieByName('DeWT'),
        },
        params: {
          deWT: getCookieByName('DeWT'),
        },
      },
    });
    pusher.connection.bind('connected', function () {
      const socketId = pusher.connection.socket_id;
      // eslint-disable-next-line no-console
      // console.log('My socket ID is ' + socketId);
      setSocketId(sockedId);
    });
    setPuser(pusher);
    subscribeTickers();
    subscribeCandlesticks();
  };

  const init = async () => {
    apiInit();
    pusherInit();
    await _apiWorker();
  };

  const _apiWorker = async () => {
    const job = jobQueueOfAPI.current.shift();
    if (job) {
      await job();
      await _apiWorker();
    } else {
      if (jobTimer) clearTimeout(jobTimer);
      jobTimer = setTimeout(() => _apiWorker(), 1000);
    }
  };

  const createJob = (type: IJobType, callback: () => Promise<unknown>) => {
    const job = () => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          await callback();
          resolve();
        } catch {
          reject();
        }
      });
    };
    switch (type) {
      case JobType.API:
        jobQueueOfAPI.current = [...jobQueueOfAPI.current, job];
        break;
      case JobType.WS:
        jobQueueOfWS.current = [...jobQueueOfWS.current, job];
        break;
      default:
        break;
    }
  };

  const requestHandler = async (data: TypeRequest) => {
    if (apiWorkerRef.current) {
      const request: FormatedTypeRequest = formatAPIRequest(data);
      const promise = new Promise((resolve, reject) => {
        apiWorkerRef.current!.onmessage = event => {
          const {name, result, error} = event.data;
          if (name === request.name) {
            if (error) reject(error);
            else resolve(result);
          }
        };
      });
      apiWorkerRef.current.postMessage(request.request);
      return promise;
    } else {
      createJob(JobType.API, () => requestHandler(data));
    }
  };

  const defaultValue = {
    init,
    requestHandler,
    subscribeUser,
  };

  return <WorkerContext.Provider value={defaultValue}>{children}</WorkerContext.Provider>;
};

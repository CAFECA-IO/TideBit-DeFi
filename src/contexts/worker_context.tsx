import React, {createContext, useRef, useContext} from 'react';
import keccak from '@cafeca/keccak';
import useState from 'react-usestateref';
import {formatAPIRequest, FormatedTypeRequest, TypeRequest} from '../constants/api_request';

import {Events} from '../constants/events';
import {TideBitEvent} from '../constants/tidebit_event';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import Pusher, {Channel} from 'pusher-js';
import {NotificationContext} from './notification_context';
import {
  IPusherData,
  IPusherPrivateData,
  PusherChannel,
} from '../interfaces/tidebit_defi_background/pusher_data';
import {ITrade} from '../interfaces/tidebit_defi_background/candlestickData';
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

const jobTimer: NodeJS.Timeout | null = null;
/** Deprecated: replaced by pusher (20230502 - tzuhan) 
let wsWorker: WebSocket | null;
*/

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const pusherKey = process.env.PUSHER_APP_KEY ?? '';
  const pusherHost = process.env.PUSHER_HOST ?? '';
  const pusherPort = +(process.env.PUSHER_PORT ?? '0');
  const notificationCtx = useContext(NotificationContext);
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apiWorker, setAPIWorker, apiWorkerRef] = useState<Worker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pusher, setPuser, pusherRef] = useState<Pusher | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [publicChannel, setPublicChannel, publicChannelRef] = useState<Channel | null>(null);
  const jobQueueOfWS = useRef<((...args: []) => Promise<void>)[]>([]);
  const jobQueueOfAPI = useRef<((...args: []) => Promise<void>)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socketId, setSocketId, socketIdRef] = useState<string | null>(null);
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
        const tickerData = pusherData as ITickerData;
        notificationCtx.emitter.emit(TideBitEvent.TICKER, tickerData);
      });
    }
  };

  const subscribeTrades = () => {
    if (publicChannelRef.current) {
      publicChannelRef.current.bind(Events.TRADES, (pusherData: IPusherData) => {
        const trade = pusherData as ITrade;
        notificationCtx.emitter.emit(TideBitEvent.TRADES, trade);
      });
    }
  };

  const subscribeUser = (address: string) => {
    if (pusherRef.current) {
      const channelName = `${PusherChannel.PRIVATE_CHANNEL}-${keccak
        .keccak256(address.toLowerCase().replace(`0x`, ``))
        .slice(0, 8)}`;
      const channel = pusherRef.current?.subscribe(channelName);
      channel.bind(Events.BALANCE, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.BALANCE, data);
      });
      channel.bind(Events.CFD, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.CFD, data);
      });
      channel.bind(Events.BOLT_TRANSACTION, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.BOLT_TRANSACTION, data);
      });
      channel.bind(Events.ASSETS, (data: IPusherPrivateData) => {
        notificationCtx.emitter.emit(Events.ASSETS, data);
      });
    }
  };

  const pusherInit = () => {
    const pusher = new Pusher(pusherKey, {
      cluster: '',
      wsHost: pusherHost,
      wsPort: pusherPort,
      channelAuthorization: {
        transport: 'jsonp',
        endpoint: `${pusherHost}/api/pusher/auth`,
        headers: {
          deWT: getCookieByName('DeWT'),
        },
        params: {
          deWT: getCookieByName('DeWT'),
        },
      },
    });
    setPuser(pusher);
    pusher.connection.bind('connected', function () {
      const socketId = pusher.connection.socket_id;
      setSocketId(socketId);
      const channel = pusherRef.current?.subscribe(PusherChannel.GLOBAL_CHANNEL);
      if (channel) {
        setPublicChannel(channel);
        subscribeTickers();
        subscribeTrades();
      }
    });
  };

  const init = async () => {
    apiInit();
    // pusherInit();
    await _apiWorker();
  };

  const _apiWorker = async () => {
    const job = jobQueueOfAPI.current.shift();
    if (job) {
      await job();
      await _apiWorker();
    } else {
      if (jobTimer) clearTimeout(jobTimer);
      // jobTimer = setTimeout(() => _apiWorker(), 1000);
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
    const apiWorker = apiWorkerRef.current;

    if (apiWorker) {
      const request: FormatedTypeRequest = formatAPIRequest(data);
      const promise = new Promise((resolve, reject) => {
        apiWorker.onmessage = event => {
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

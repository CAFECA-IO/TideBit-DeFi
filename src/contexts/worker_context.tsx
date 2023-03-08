import React, {createContext, useRef, useContext} from 'react';
import useState from 'react-usestateref';
import {IAPIRequest} from '../constants/api_request';
import {Events} from '../constants/events';
import {TideBitEvent} from '../constants/tidebit_event';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {NotificationContext} from './notification_context';

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
type TypeRequest = {
  name: IAPIRequest;
  request: {
    name: IAPIRequest;
    method: string;
    url: string;
    body?: object;
    options?: {
      headers?: object;
    };
  };
  callback: (...args: any[]) => void;
};

interface IRequest {
  [name: string]: TypeRequest;
}

interface IWorkerContext {
  wsWorker: WebSocket | null;
  apiWorker: Worker | null;
  init: () => void;
  requestHandler: (request: TypeRequest) => void;
  tickerChangeHandler: (ticker: ITickerData) => void;
  registerUserHandler: (address: string) => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  wsWorker: null,
  apiWorker: null,
  init: () => null,
  requestHandler: () => null,
  tickerChangeHandler: () => null,
  registerUserHandler: () => null,
});

let jobTimer: NodeJS.Timeout | null = null;
let wsWorker: WebSocket | null;

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const notificationCtx = useContext(NotificationContext);
  const [apiWorker, setAPIWorker, apiWorkerRef] = useState<Worker | null>(null);
  const jobQueueOfWS = useRef<((...args: []) => Promise<void>)[]>([]);
  const jobQueueOfAPI = useRef<((...args: []) => Promise<void>)[]>([]);
  const requests = useRef<IRequest>({});

  const apiInit = () => {
    const apiWorker = new Worker(new URL('../lib/workers/api.worker.ts', import.meta.url));
    setAPIWorker(apiWorker);
    apiWorker.onmessage = event => {
      const {name, result} = event.data;
      requests.current[name]?.callback(result);
      delete requests.current[name];
    };
  };

  const wsInit = async () => {
    wsWorker = new WebSocket(`wss://new.tidebit.com/ws`);
    if (wsWorker) {
      wsWorker.onmessage = msg => {
        const metaData = JSON.parse(msg.data);
        switch (metaData.type) {
          case Events.TICKERS:
            // notificationCtx.emitter.emit(TideBitEvent.TICKER, metaData.data);
            break;
          case Events.UPDATE:
            break;
          case Events.TRADES:
            break;
          case Events.PUBILC_TRADES:
            break;
          case Events.ACCOUNT:
            break;
          case Events.ORDER:
            break;
          case Events.TRADE:
            break;
          case Events.CANDLE_ON_UPDATE:
            // notificationCtx.emitter.emit(TideBitEvent.CANDLESTICK, metaData.data);
            break;
          default:
            break;
        }
      };
    }
  };

  const init = async () => {
    apiInit();
    await wsInit();
    await _apiWorker();
    await _wsWorker();
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

  const _wsWorker = async () => {
    if (wsWorker?.readyState === 1) {
      const job = jobQueueOfWS.current.shift();
      if (job) {
        await job();
        await _wsWorker();
      } else {
        if (jobTimer) clearTimeout(jobTimer);
        jobTimer = setTimeout(() => _wsWorker(), 1000);
      }
    } else {
      if (jobTimer) clearTimeout(jobTimer);
      jobTimer = setTimeout(() => _wsWorker(), 1000);
    }
  };

  const createJob = (type: IJobType, callback: (...args: []) => Promise<void>) => {
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

  const requestHandler = async (request: TypeRequest) => {
    if (apiWorkerRef.current) {
      apiWorkerRef.current.postMessage(request.request);
      requests.current[request.name] = request;
    } else {
      createJob(JobType.API, () => requestHandler(request));
    }
  };

  const tickerChangeHandler = async (ticker: ITickerData) => {
    notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
    // eslint-disable-next-line no-console
    // console.log(`tickerChangeHandler wsWorker?.readyState`, wsWorker?.readyState, ticker)
    if (wsWorker?.readyState === 1) {
      wsWorker.send(
        JSON.stringify({
          op: 'registerMarket',
          args: {
            market: ticker.currency,
          },
        })
      );
    } else {
      createJob(JobType.WS, () => tickerChangeHandler(ticker));
    }
  };

  const registerUserHandler = async (address: string) => {
    notificationCtx.emitter.emit(TideBitEvent.SERVICE_TERM_ENABLED, address);
    if (wsWorker?.readyState === 1) {
      wsWorker.send(
        JSON.stringify({
          op: 'userStatusUpdate',
          args: {
            address: address,
          },
        })
      );
    } else {
      createJob(JobType.WS, () => registerUserHandler(address));
    }
  };

  const defaultValue = {
    apiWorker: apiWorkerRef.current,
    wsWorker,
    init,
    requestHandler,
    tickerChangeHandler,
    registerUserHandler,
  };

  return <WorkerContext.Provider value={defaultValue}>{children}</WorkerContext.Provider>;
};

import React, {createContext, useRef, useContext} from 'react';
import useState from 'react-usestateref';
import io, {Socket} from 'socket.io-client';
import {IAPIRequest} from '../constants/api_request';
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
  wsWorker: Socket | null;
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
let wsWorker: Socket | null;

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const notificationCtx = useContext(NotificationContext);
  const [wsIsConnected, setWSIsConnected] = useState<boolean>(false);
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
    try {
      await fetch('/api/socketio');
    } catch (error) {
      // ++TODO
      // eslint-disable-next-line no-console
      console.error(`fetch('/api/socketio') error`, error);
    }
    wsWorker = io();
    wsWorker.on('connect', () => {
      if (wsWorker) {
        wsWorker.emit(TideBitEvent.NOTIFICATIONS);
        setWSIsConnected(true);
      }
    });

    wsWorker.on(TideBitEvent.NOTIFICATIONS, data => {
      notificationCtx.emitter.emit(TideBitEvent.NOTIFICATIONS, data);
    });

    wsWorker.on(TideBitEvent.TICKER, data => {
      notificationCtx.emitter.emit(TideBitEvent.TICKER, data);
    });

    wsWorker.on(TideBitEvent.TICKER_STATISTIC, data => {
      notificationCtx.emitter.emit(TideBitEvent.TICKER_STATISTIC, data);
    });

    wsWorker.on(TideBitEvent.TICKER_STATISTIC, data => {
      notificationCtx.emitter.emit(TideBitEvent.TICKER_STATISTIC, data);
    });

    wsWorker.on(TideBitEvent.CANDLESTICK, data => {
      notificationCtx.emitter.emit(TideBitEvent.CANDLESTICK, data);
    });

    wsWorker.on(TideBitEvent.BALANCE, data => {
      notificationCtx.emitter.emit(TideBitEvent.BALANCE, data);
    });

    wsWorker.on(TideBitEvent.ORDER, data => {
      notificationCtx.emitter.emit(TideBitEvent.ORDER, data);
    });

    wsWorker.on('disconnect', () => {
      // console.log('disconnect');
      setWSIsConnected(false);
    });
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
    if (wsIsConnected) {
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
    if (wsIsConnected && wsWorker) {
      wsWorker.emit(TideBitEvent.TICKER_CHANGE, ticker.currency);
    } else {
      createJob(JobType.WS, () => tickerChangeHandler(ticker));
    }
  };

  const registerUserHandler = async (address: string) => {
    notificationCtx.emitter.emit(TideBitEvent.SERVICE_TERM_ENABLED, address);
    if (wsIsConnected && wsWorker) {
      wsWorker.emit(TideBitEvent.SERVICE_TERM_ENABLED, address);
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

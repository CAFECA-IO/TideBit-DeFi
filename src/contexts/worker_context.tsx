import React, {useEffect, createContext, useRef, useContext} from 'react';
import useState from 'react-usestateref';
import io, {Socket} from 'socket.io-client';
import {IAPIRequest} from '../constants/api_request';
// import EventEmitter from 'events';
import {TideBitEvent} from '../constants/tidebit_event';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {NotificationContext} from './notification_context';

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
  // emitter: EventEmitter;
  jobQueue: ((...args: any[]) => Promise<void>)[];
  // isInit: boolean;
  wsWorker: Socket | null;
  apiWorker: Worker | null;
  init: () => void;
  requestHandler: (request: TypeRequest) => void;
  tickerChangeHandler: (ticker: ITickerData) => void;
  registerUserHandler: (address: string) => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  // emitter: new EventEmitter(),
  jobQueue: [],
  // isInit: false,
  wsWorker: null,
  apiWorker: null,
  init: () => null,
  requestHandler: request => null,
  tickerChangeHandler: (ticker: ITickerData) => null,
  registerUserHandler: (address: string) => null,
});

let jobTimer: NodeJS.Timeout | null = null;

export const WorkerProvider = ({children}: IWorkerProvider) => {
  // const emitter = React.useMemo(() => new EventEmitter(), []);
  const notificationCtx = useContext(NotificationContext);
  // const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const [wsWorker, setWsWorker, wsWorkerRef] = useState<Socket | null>(null);
  const [apiWorker, setAPIWorker, apiWorkerRef] = useState<Worker | null>(null);
  const jobQueue = useRef<((...args: []) => Promise<void>)[]>([]);
  const requests = useRef<IRequest>({});

  const init = () => {
    const apiWorker = new Worker(new URL('../lib/workers/api.worker.ts', import.meta.url));
    setAPIWorker(apiWorker);
    apiWorkerRef.current!.onmessage = event => {
      const {name, result} = event.data;
      requests.current[name]?.callback(result);
      delete requests.current[name];
    };
    fetch('/api/socketio').finally(() => {
      const socket = io();
      setWsWorker(socket);
      socket.on('connect', () => {
        socket.emit(TideBitEvent.NOTIFICATIONS);
      });

      socket.on(TideBitEvent.NOTIFICATIONS, data => {
        notificationCtx.emitter.emit(TideBitEvent.NOTIFICATIONS, data);
      });

      socket.on(TideBitEvent.TICKER, data => {
        notificationCtx.emitter.emit(TideBitEvent.TICKER, data);
      });

      socket.on(TideBitEvent.TICKER_STATISTIC, data => {
        notificationCtx.emitter.emit(TideBitEvent.TICKER_STATISTIC, data);
      });

      socket.on(TideBitEvent.TICKER_STATISTIC, data => {
        notificationCtx.emitter.emit(TideBitEvent.TICKER_STATISTIC, data);
      });

      socket.on(TideBitEvent.CANDLESTICK, data => {
        notificationCtx.emitter.emit(TideBitEvent.CANDLESTICK, data);
      });

      socket.on(TideBitEvent.BALANCE, data => {
        notificationCtx.emitter.emit(TideBitEvent.BALANCE, data);
      });

      socket.on(TideBitEvent.ORDER, data => {
        notificationCtx.emitter.emit(TideBitEvent.ORDER, data);
      });

      socket.on('disconnect', () => {
        // console.log('disconnect');
      });
    });
    worker();
  };

  const worker = async () => {
    const job = jobQueue.current.shift();
    if (job) {
      await job();
      await worker();
    } else {
      if (jobTimer) clearTimeout(jobTimer);
      jobTimer = setTimeout(() => worker(), 1000);
    }
  };

  const createJob = (callback: (...args: []) => Promise<void>) => {
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
    jobQueue.current = [...jobQueue.current, job];
  };

  const requestHandler = async (request: TypeRequest) => {
    if (apiWorkerRef.current) {
      apiWorkerRef.current.postMessage(request.request);
      requests.current[request.name] = request;
      // eslint-disable-next-line no-console
      console.log(`requests.current`, requests.current);
    } else {
      createJob(() => requestHandler(request));
    }
  };

  const tickerChangeHandler = async (ticker: ITickerData) => {
    if (wsWorkerRef.current) {
      notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
      wsWorkerRef.current.emit(TideBitEvent.TICKER_CHANGE, ticker.currency);
    } else createJob(() => tickerChangeHandler(ticker));
  };

  const registerUserHandler = async (address: string) => {
    if (wsWorkerRef.current) {
      notificationCtx.emitter.emit(TideBitEvent.SERVICE_TERM_ENABLED, address);
      wsWorkerRef.current.emit(TideBitEvent.SERVICE_TERM_ENABLED, address);
    } else createJob(() => registerUserHandler(address));
  };

  const defaultValue = {
    // emitter,
    jobQueue: jobQueue.current,
    // isInit: isInitRef.current,
    apiWorker: apiWorkerRef.current,
    wsWorker,
    init,
    requestHandler,
    tickerChangeHandler,
    registerUserHandler,
  };

  return <WorkerContext.Provider value={defaultValue}>{children}</WorkerContext.Provider>;
};

/* eslint-disable no-console */
import React, {useEffect, createContext, useRef, useContext} from 'react';
import useState from 'react-usestateref';
import io, {Socket} from 'socket.io-client';
// import EventEmitter from 'events';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';

interface IWorkerProvider {
  children: React.ReactNode;
}

interface IWorkerContext {
  // emitter: EventEmitter;
  jobQueue: ((...args: []) => Promise<void>)[];
  // isInit: boolean;
  wsWorker: Socket | null;
  apiWorker: Worker | undefined;
  init: () => void;
  tickerChangeHandler: (currency: string) => void;
  registerUserHandler: (address: string) => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  // emitter: new EventEmitter(),
  jobQueue: [],
  // isInit: false,
  wsWorker: null,
  apiWorker: undefined,
  init: () => null,
  tickerChangeHandler: (currency: string) => null,
  registerUserHandler: (address: string) => null,
});

let jobTimer: NodeJS.Timeout | null = null;

export const WorkerProvider = ({children}: IWorkerProvider) => {
  // const emitter = React.useMemo(() => new EventEmitter(), []);
  const notificationCtx = useContext(NotificationContext);
  // const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const [wsWorker, setWsWorker, wsWorkerRef] = useState<Socket | null>(null);
  const apiWorkerRef = useRef<Worker>();
  const jobQueue = useRef<((...args: []) => Promise<void>)[]>([]);

  const init = () => {
    console.log('WorkerProvider init');
    apiWorkerRef.current = new Worker(new URL('../lib/workers/api.worker.ts', import.meta.url));
    apiWorkerRef.current.onmessage = event => {
      // eslint-disable-next-line no-console
      console.log(`apiWorkerRef.current event`, event);
    };
    fetch('/api/socketio').finally(() => {
      const socket = io();
      setWsWorker(socket);
      socket.on('connect', () => {
        console.log('connect');
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

      socket.on('a user connected', () => {
        console.log('a user connected');
      });

      socket.on('disconnect', () => {
        console.log('disconnect');
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

  const tickerChangeHandler = async (currency: string) => {
    if (wsWorkerRef.current) {
      wsWorkerRef.current.emit(TideBitEvent.TICKER_CHANGE, currency);
    } else createJob(() => tickerChangeHandler(currency));
  };

  const registerUserHandler = async (address: string) => {
    if (wsWorkerRef.current) {
      console.log(`registerUserHandler address`, address);
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
    tickerChangeHandler,
    registerUserHandler,
  };

  return <WorkerContext.Provider value={defaultValue}>{children}</WorkerContext.Provider>;
};

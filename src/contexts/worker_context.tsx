/* eslint-disable no-console */
import React, {useEffect, createContext, useRef} from 'react';
import useState from 'react-usestateref';
import io, {Socket} from 'socket.io-client';
import EventEmitter from 'events';
import {TideBitEvent} from '../constants/tidebit_event';

export interface IJob {
  type: string;
  callback: (...args: []) => void;
}

interface IWorkerProvider {
  children: React.ReactNode;
}

interface IWorkerContext {
  emitter: EventEmitter;
  jobQueue: IJob[];
  isInit: boolean;
  worker: Worker | undefined;
  init: () => void;
  registerTicker: (currency: string) => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  emitter: new EventEmitter(),
  jobQueue: [],
  isInit: false,
  worker: undefined,
  init: () => null,
  registerTicker: (currency: string) => null,
});

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const emitter = React.useMemo(() => new EventEmitter(), []);
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const [wsWorker, setWsWorker, wsWorkerRef] = useState<Socket | null>(null);
  const workerRef = useRef<Worker>();
  const jobQueue = useRef<IJob[]>([]);

  const init = () => {
    workerRef.current = new Worker(new URL('../lib/workers/worker.ts', import.meta.url));
    workerRef.current.onmessage = event => {
      // eslint-disable-next-line no-console
      console.log(`workerRef.current event`, event);
    };
  };

  const registerTicker = (currency: string) => {
    if (wsWorker) {
      console.log('registerTicker currency', currency);
      wsWorker.emit(TideBitEvent.TICKER_CHANGE, currency);
    }
  };

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      const socket = io();

      socket.on('connect', () => {
        console.log('connect');
        socket.emit(TideBitEvent.NOTIFICATIONS);
      });

      socket.on(TideBitEvent.NOTIFICATIONS, data => {
        console.log(TideBitEvent.NOTIFICATIONS, data);
        emitter.emit(TideBitEvent.NOTIFICATIONS, data);
      });

      socket.on('a user connected', () => {
        console.log('a user connected');
      });

      socket.on('disconnect', () => {
        console.log('disconnect');
      });
    });
  }, []); // Added [] as useEffect filter so it will be executed only once, when component is mounted

  const defaultValue = {
    emitter,
    jobQueue: jobQueue.current,
    isInit: isInitRef.current,
    worker: workerRef.current,
    init,
    registerTicker,
  };

  return <WorkerContext.Provider value={defaultValue}>{children}</WorkerContext.Provider>;
};

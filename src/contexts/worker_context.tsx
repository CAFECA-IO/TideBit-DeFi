import React, {useContext, createContext, useRef} from 'react';
import useState from 'react-usestateref';

export interface IJob {
  type: string;
  callback: (...args: []) => void;
}

interface IWorkerProvider {
  children: React.ReactNode;
}

interface IWorkerContext {
  jobQueue: IJob[];
  isInit: boolean;
  worker: Worker | undefined;
  init: () => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  jobQueue: [],
  isInit: false,
  worker: undefined,
  init: () => null,
});

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const workerRef = useRef<Worker>();
  const jobQueue = useRef<IJob[]>([]);

  const init = () => {
    workerRef.current = new Worker(new URL('../lib/workers/worker.ts', import.meta.url));
    workerRef.current.onmessage = event => {
      if (event.data === 'done') {
        // Handle the result of the Web Worker's task
        // eslint-disable-next-line no-console
        console.log(`event.data === 'done'`);
      }
      if (event.data === 'start') {
        setIsInit(true);
        // eslint-disable-next-line no-console
        console.log(`event.data === 'start'`);
      }
    };
    workerRef.current.postMessage('start');
  };

  const defaultValue = {
    jobQueue: jobQueue.current,
    isInit: isInitRef.current,
    worker: workerRef.current,
    init,
  };

  return <WorkerContext.Provider value={defaultValue}>{children}</WorkerContext.Provider>;
};

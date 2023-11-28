import {create} from 'zustand';

type IJobType = 'API' | 'WS';

export interface IJobTypeConstant {
  API: IJobType;
  WS: IJobType;
}
export const JobType: IJobTypeConstant = {
  API: 'API',
  WS: 'WS',
};

interface IJob {
  url: string;
  type: IJobType;
  retries: number; // Number of retries for failed requests
}

type NewWorkerStore = {
  jobQueue: IJob[];

  fetchData: (input: string) => Promise<unknown>;
  processQueue: () => void;
  init: () => void;
};

const useNewWorkerStore = create<NewWorkerStore>((set, get) => {
  const jobQueue: IJob[] = [];

  const fetchData = async (input: string) => {
    // Check if the job is already in the queue
    // eslint-disable-next-line no-console
    console.log('fetchData called', input);
    if (!jobQueue.find(job => job.url === input)) {
      jobQueue.push({url: input, type: 'API', retries: 0});
    }
  };

  const processQueue = async () => {
    while (jobQueue.length > 0) {
      const currentJob = jobQueue.shift();

      // Check if currentJob is not undefined
      if (currentJob) {
        try {
          const response = await fetch(currentJob.url);
          const data = await response.json();
          // eslint-disable-next-line no-console
          console.log('Data fetched', data);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Fetch error', error);
          if (currentJob.retries < 3) {
            currentJob.retries++;
            jobQueue.push(currentJob); // Re-add job to the end of the queue
          }
        }
      }
    }
  };

  const init = () => {
    setInterval(() => {
      // eslint-disable-next-line no-console
      console.log('newWorkerStore interval called', Date.now());
      get().processQueue();
    }, 1000); // Adjust interval as needed
  };

  return {
    fetchData,
    jobQueue,
    processQueue,
    init,
  };
});

export default useNewWorkerStore;

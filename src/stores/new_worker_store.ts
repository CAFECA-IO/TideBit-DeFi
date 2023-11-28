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

type NewWorkerStore = {
  jobQueue: string[];

  fetchData: (input: string) => Promise<unknown>;
  init: () => Promise<void>;
};

const useNewWorkerStore = create<NewWorkerStore>((set, get) => {
  const jobQueue = [''];

  const fetchData = async (input: string) => {
    jobQueue.shift();

    jobQueue.push(input);
    try {
      const response = await fetch(input);
      const data = await response.json();
      // eslint-disable-next-line no-console
      console.log('fetchData in worker store', 'input', input, 'data', data);

      jobQueue.shift();
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error in worker store fetchData', error);
    }
  };

  // setInterval(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('interval called in newWorkerStore', Date.now());
  //   const randomNum = Math.random().toString();
  // }, 100);

  const init = async () => {
    // eslint-disable-next-line no-console
    console.log('newworker init called');
  };

  return {
    fetchData,
    jobQueue,
    init,
  };
});

export default useNewWorkerStore;

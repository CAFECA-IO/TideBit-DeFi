import {create} from 'zustand';
import useNewWorkerStore from './new_worker_store';

type UserStore = {
  badge: string[];
  init: () => Promise<void>;
};

interface NationData {
  data: {
    'ID Nation': string;
    Nation: string;
    'ID Year': number;
    Year: string;
    Population: number;
    'Slug Nation': string;
  }[];
}

const useUserStore = create<UserStore>((set, get) => {
  const badge = ['123'];

  const fetcher = useNewWorkerStore.getState().fetchData;

  const updateData = async () => {
    // eslint-disable-next-line no-console
    console.log('updateData called in user store');
    const data = (await fetcher(
      'https://datausa.io/api/data?drilldowns=Nation&measures=Population'
    )) as NationData;

    set({badge: [...badge, data.data[0]['ID Nation']]});
    // eslint-disable-next-line no-console
    console.log('data in updateData', data, 'badge in user store', get().badge);
  };

  // setInterval(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('interval called in userStore', Date.now());
  //   const randomNum = Math.random().toString();
  //   set({badge: [...badge, randomNum]});
  // }, 10000);

  // updateData();

  const init = async () => {
    // eslint-disable-next-line no-console
    console.log('user init called');
    await updateData();
  };

  return {
    badge,
    init,
  };
});

export default useUserStore;

import {createStore, useStore} from 'zustand';
import Pusher, {Channel} from 'pusher-js';
import keccak from '@cafeca/keccak';
import {formatAPIRequest, FormatedTypeRequest, TypeRequest} from '../constants/api_request';
import {Events} from '../constants/events';
import {TideBitEvent} from '../constants/tidebit_event';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {
  IPusherData,
  IPusherPrivateData,
  PusherChannel,
} from '../interfaces/tidebit_defi_background/pusher_data';
import {ITrade} from '../interfaces/tidebit_defi_background/candlestickData';
import {getCookieByName} from '../lib/common';
import {createContext, useContext, useRef} from 'react';
import {NotificationContext} from './notification_context';
import useState from 'react-usestateref';

type IJobType = 'API' | 'WS';
export interface IJobTypeConstant {
  API: IJobType;
  WS: IJobType;
}
export const JobType: IJobTypeConstant = {
  API: 'API',
  WS: 'WS',
};

interface WorkerProps {
  // Define the state variables
  apiWorker: Worker | null;
  pusher: Pusher | null;
  publicChannel: Channel | null;
  socketId: string | null;
  // Other state variables...
}

const DEFAULT_PROPS: WorkerProps = {
  apiWorker: null,
  pusher: null,
  publicChannel: null,
  socketId: null,
};

interface WorkerState extends WorkerProps {
  // Define the actions
  init: () => Promise<void>;
  requestHandler: (data: TypeRequest) => Promise<unknown>;
  subscribeUser: (address: string) => void;
  // Other actions...
}

type WorkerStore = ReturnType<typeof createWorkerStore>;

let jobTimer: NodeJS.Timeout | null = null;

export const createWorkerStore = (initProps?: Partial<WorkerState>) => {
  const pusherKey = process.env.PUSHER_APP_KEY ?? '';
  const pusherHost = process.env.PUSHER_HOST ?? '';
  const pusherPort = +(process.env.PUSHER_PORT ?? '0');
  const notificationCtx = useContext(NotificationContext);

  // const apiWorker = useRef<Worker | null>(null);
  // const pusher = useRef<Pusher | null>(null);
  // const publicChannel = useRef<Channel | null>(null);
  // const socketId = useRef<string | null>(null);

  // const jobQueueOfWS = useRef<((...args: []) => Promise<void>)[]>([]);
  // const jobQueueOfAPI = useRef<((...args: []) => Promise<void>)[]>([]);

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

  // const _apiWorker = async () => {
  //   // eslint-disable-next-line no-console
  //   console.log('API worker called');
  //   const job = jobQueueOfAPI.current.shift();
  //   if (job) {
  //     await job();
  //     await _apiWorker();
  //   } else {
  //     if (jobTimer) clearTimeout(jobTimer);
  //     jobTimer = setTimeout(() => _apiWorker(), 1000);
  //   }
  // };

  // const createJob = (type: IJobType, callback: () => Promise<unknown>) => {
  //   const job = () => {
  //     return new Promise<void>(async (resolve, reject) => {
  //       try {
  //         await callback();
  //         resolve();
  //       } catch {
  //         reject();
  //       }
  //     });
  //   };
  //   switch (type) {
  //     case JobType.API:
  //       jobQueueOfAPI.current = [...jobQueueOfAPI.current, job];
  //       break;
  //     case JobType.WS:
  //       jobQueueOfWS.current = [...jobQueueOfWS.current, job];
  //       break;
  //     default:
  //       break;
  //   }
  // };

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
    pusherInit();
    await _apiWorker();
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
    // eslint-disable-next-line no-console
    console.log('requestHandler called', data);
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

  return createStore<WorkerState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,

    // Actions
    init,
    requestHandler: requestHandler,
    subscribeUser,
  }));

  // return createStore<WorkerProps & WorkerState>()((set, get) => ({
  //   ...DEFAULT_PROPS,
  //   ...initProps,

  //   // Actions
  //   init: async () => {
  //     // Initialize API Worker
  //     const apiWorker = new Worker(new URL('../lib/workers/api.worker.ts', import.meta.url));
  //     set({apiWorker});

  //     console.log('apiWorker get()', get().apiWorker, 'apiWorker', apiWorker);

  //     // Initialize Pusher
  //     const pusher = new Pusher(pusherKey, {
  //       cluster: '',
  //       wsHost: pusherHost,
  //       wsPort: pusherPort,
  //       channelAuthorization: {
  //         transport: 'jsonp',
  //         endpoint: `${pusherHost}/api/pusher/auth`,
  //         headers: {
  //           deWT: getCookieByName('DeWT'),
  //         },
  //         params: {
  //           deWT: getCookieByName('DeWT'),
  //         },
  //       },
  //     });
  //     set({pusher});

  //     await _apiWorker();
  //   },

  //   subscribeTickers: () => {
  //     // Info: subscribeTickers();
  //     if (get().pusher) {
  //       const pusher = get().pusher;
  //       const channel = pusher?.subscribe(PusherChannel.GLOBAL_CHANNEL);
  //       if (!channel) return;
  //       channel.bind(Events.TICKERS, (pusherData: IPusherData) => {
  //         const tickerData = pusherData as ITickerData;

  //         notificationCtx.emitter.emit(TideBitEvent.TICKER, tickerData);
  //       });
  //     }
  //   },

  //   subscribeTrades: () => {
  //     const pusher = get().pusher;
  //     pusher.connection.bind('connected', function () {
  //       const socketId = pusher.connection.socket_id;
  //       set({socketId});
  //       const channel = get().pusher?.subscribe(PusherChannel.GLOBAL_CHANNEL);
  //       if (channel) {
  //         set({publicChannel: channel});

  //         // Info: subscribeTrades();
  //         if (get().publicChannel) {
  //           const publicChannel = get().publicChannel;
  //           if (!publicChannel) return;
  //           publicChannel.bind(Events.TRADES, (pusherData: IPusherData) => {
  //             const trade = pusherData as ITrade;

  //             notificationCtx.emitter.emit(TideBitEvent.TRADES, trade);
  //           });
  //         }
  //       }
  //     });
  //   },

  //   requestHandler: async (data: TypeRequest) => {
  //     console.log('requestHandler called', data);
  //     const apiWorker = get().apiWorker;

  //     if (apiWorker) {
  //       const request: FormatedTypeRequest = formatAPIRequest(data);
  //       const promise = new Promise((resolve, reject) => {
  //         apiWorker.onmessage = event => {
  //           const {name, result, error} = event.data;
  //           if (name === request.name) {
  //             if (error) reject(error);
  //             else resolve(result);
  //           }
  //         };
  //       });
  //       apiWorker.postMessage(request.request);
  //       return promise;
  //     } else {
  //       createJob(JobType.API, () => get().requestHandler(data));
  //     }
  //   },

  //   subscribeUser: (address: string) => {
  //     // User subscription logic
  //     // Similar logic to your original subscribeUser
  //     const pusher = get().pusher;
  //     if (pusher) {
  //       const channelName = `${PusherChannel.PRIVATE_CHANNEL}-${keccak
  //         .keccak256(address.toLowerCase().replace(`0x`, ``))
  //         .slice(0, 8)}`;
  //       const channel = pusher?.subscribe(channelName);
  //       channel.bind(Events.BALANCE, (data: IPusherPrivateData) => {
  //         notificationCtx.emitter.emit(Events.BALANCE, data);
  //       });
  //       channel.bind(Events.CFD, (data: IPusherPrivateData) => {
  //         notificationCtx.emitter.emit(Events.CFD, data);
  //       });
  //       channel.bind(Events.BOLT_TRANSACTION, (data: IPusherPrivateData) => {
  //         notificationCtx.emitter.emit(Events.BOLT_TRANSACTION, data);
  //       });
  //       channel.bind(Events.ASSETS, (data: IPusherPrivateData) => {
  //         notificationCtx.emitter.emit(Events.ASSETS, data);
  //       });
  //     }
  //   },

  //   pusherInit: () => {
  //     const pusher = new Pusher(pusherKey, {
  //       cluster: '',
  //       wsHost: pusherHost,
  //       wsPort: pusherPort,
  //       channelAuthorization: {
  //         transport: 'jsonp',
  //         endpoint: `${pusherHost}/api/pusher/auth`,
  //         headers: {
  //           deWT: getCookieByName('DeWT'),
  //         },
  //         params: {
  //           deWT: getCookieByName('DeWT'),
  //         },
  //       },
  //     });
  //     set({pusher});
  //     pusher.connection.bind('connected', function () {
  //       const socketId = pusher.connection.socket_id;
  //       set({socketId});
  //       const pusherGet = get().pusher;
  //       const channel = pusherGet?.subscribe(PusherChannel.GLOBAL_CHANNEL);
  //       if (channel) {
  //         set({publicChannel});
  //         subscribeTickers();
  //         subscribeTrades();
  //       }
  //     });
  //   },
  // }));
};

export const WorkerStoreContext = createContext<WorkerStore | null>(null);

// export const useMarketStore = () => {
//   const context = useContext(MarketStoreContext);
//   // Info: If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.

//   return context;
// };

// FIXME: folder structure and `CustomError`
export function useWorkerStoreContext<T>(selector: (state: WorkerState) => T): T {
  const store = useContext(WorkerStoreContext);
  if (!store) throw new Error('Missing WorkerStoreContext.Provider in the tree');
  return useStore(store, selector);
}

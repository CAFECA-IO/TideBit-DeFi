import {create} from 'zustand';
import keccak from '@cafeca/keccak';
import Pusher, {Channel} from 'pusher-js';
import {
  APIName,
  formatAPIRequest,
  FormatedTypeRequest,
  Method,
  TypeRequest,
} from '../constants/api_request';
import {Events} from '../constants/events';
import {TideBitEvent} from '../constants/tidebit_event';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {ITrade} from '../interfaces/tidebit_defi_background/candlestickData';
import {
  IPusherData,
  IPusherPrivateData,
  PusherChannel,
} from '../interfaces/tidebit_defi_background/pusher_data';
import {getCookieByName} from '../lib/common';
import EventEmitter from 'events';
import {useRef} from 'react';
import useMarketStore from './market_store';

type IJobType = 'API' | 'WS';

export interface IJobTypeConstant {
  API: IJobType;
  WS: IJobType;
}
export const JobType: IJobTypeConstant = {
  API: 'API',
  WS: 'WS',
};

type WorkerStore = {
  apiWorker: Worker | null;
  pusher: Pusher | null;
  publicChannel: Channel | null;
  socketId: string | null;
  notificationEmitter: EventEmitter;
  jobQueueOfWS: ((...args: []) => Promise<void>)[];
  jobQueueOfAPI: ((...args: []) => Promise<void>)[];

  trades: ITrade[];
  tickers: ITickerData[] | null;
  userData: any;

  init: () => Promise<void>;
  // apiInit: () => void;
  // pusherInit: () => void;
  subscribeTickers: () => void;
  subscribeTrades: () => void;
  subscribeUser: (address: string) => void;
  // _apiWorker: () => void;
  requestHandler: (data: TypeRequest) => Promise<unknown>;
};

let jobTimer: NodeJS.Timeout | null = null;

const useWorkerStore = create<WorkerStore>((set, get) => {
  let jobQueueOfWS: ((...args: []) => Promise<void>)[] = [];
  let jobQueueOfAPI: ((...args: []) => Promise<void>)[] = [];

  const apiInit = () => {
    const apiWorker = new Worker(new URL('../lib/workers/api.worker.ts', import.meta.url));
    set({apiWorker});
  };

  const pusherInit = () => {
    const pusherKey = process.env.PUSHER_APP_KEY ?? '';
    const pusherHost = process.env.PUSHER_HOST ?? '';
    const pusherPort = +(process.env.PUSHER_PORT ?? '0');

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

    set({pusher});

    pusher.connection.bind('connected', function () {
      const socketId = pusher.connection.socket_id;
      set({socketId});
      const channel = pusher.subscribe(PusherChannel.GLOBAL_CHANNEL);
      if (channel) {
        set({publicChannel: channel});
        get().subscribeTickers();
        get().subscribeTrades();
      }
    });
  };

  const _apiWorker = async () => {
    const job = jobQueueOfAPI.shift();
    if (job) {
      await job();
      await _apiWorker();
    } else {
      if (jobTimer) clearTimeout(jobTimer);
      jobTimer = setTimeout(() => _apiWorker(), 1000);
    }
  };

  const init = async () => {
    apiInit();
    pusherInit();
    await _apiWorker();
    /* Info:
Unhandled Runtime Error
TypeError: Failed to fetch

Source
src/lib/workers/api.worker.ts (16:27) @ fetch

  14 |   // mode: 'cors' as RequestMode, //Info: due to enable cors in backend, so here is no need to set request mode (20230508 - Tzuhan)
  15 | };
> 16 | const response = await fetch(url, request);
     |                       ^
    */
    // const rsInWorker = await requestHandler({
    //   name: APIName.GET_TICKER_STATIC,
    //   method: Method.GET,
    //   params: 'BTC-USDT',
    // });
    // // eslint-disable-next-line no-console
    // console.log('rsInWorker', rsInWorker);
  };

  const createJob = (type: IJobType, callback: () => Promise<unknown>) => {
    // eslint-disable-next-line no-console
    console.log('createJob called', type, callback);
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
        jobQueueOfAPI = [...jobQueueOfAPI, job];

        break;
      case JobType.WS:
        jobQueueOfWS = [...jobQueueOfWS, job];
        break;
      default:
        break;
    }
  };

  const requestHandler = async (data: TypeRequest) => {
    // eslint-disable-next-line no-console
    console.log('worker store requestHandler called', data);
    const apiWorker = get().apiWorker;

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

      apiWorker.postMessage(request.request);
      return promise;
    } else {
      createJob(JobType.API, () => requestHandler(data));
    }
  };

  const subscribeTickers = () => {
    const pusher = get().pusher;
    if (pusher) {
      const channel = pusher.subscribe(PusherChannel.GLOBAL_CHANNEL);
      channel.bind(Events.TICKERS, (pusherData: IPusherData) => {
        const tickerData = pusherData as ITickerData;
        // get().notificationEmitter.emit(TideBitEvent.TICKER, tickerData);
        set(prev => {
          // eslint-disable-next-line no-console
          // console.log(
          //   'prev.ticker in subscribeTickers',
          //   prev.tickers,
          //   'tickerData in subscribeTickers',
          //   tickerData
          // );
          // 如果 prev.tickers 是 null 或 undefined，則初始化為空陣列
          const updatedTickers = prev.tickers ? [...prev.tickers, tickerData] : [tickerData];
          return {tickers: updatedTickers};
        });
      });
    }
  };

  const subscribeTrades = () => {
    const publicChannel = get().publicChannel;
    if (publicChannel) {
      publicChannel.bind(Events.TRADES, (pusherData: IPusherData) => {
        const trades = pusherData as ITrade[];
        const newTrades = trades.filter(trade => trade.instId === 'ETH-USDT');
        if (!newTrades || newTrades.length === 0) return;

        // eslint-disable-next-line no-console
        // console.log('newTrades in subscribeTrades', newTrades);

        set(prev => {
          // eslint-disable-next-line no-console
          // console.log('prev trades in subscribeTrades', prev.trades);
          // return {trades: [...prev.trades, ...newTrades]};
          return {trades: [...newTrades]};
        });
        // eslint-disable-next-line no-console
        // console.log('all trades in subscribeTrades', get().trades);
      });
    }
  };

  const subscribeUser = (address: string) => {
    const pusher = get().pusher;
    if (pusher) {
      const channelName = `${PusherChannel.PRIVATE_CHANNEL}-${keccak
        .keccak256(address.toLowerCase().replace(`0x`, ``))
        .slice(0, 8)}`;
      const channel = pusher.subscribe(channelName);
      channel.bind(Events.BALANCE, (data: IPusherPrivateData) => {
        // get().notificationEmitter.emit(Events.BALANCE, data);
        set({userData: data});
      });
      channel.bind(Events.CFD, (data: IPusherPrivateData) => {
        // get().notificationEmitter.emit(Events.CFD, data);
        const rest = get().userData;
        set({userData: data});
      });
      channel.bind(Events.BOLT_TRANSACTION, (data: IPusherPrivateData) => {
        // get().notificationEmitter.emit(Events.BOLT_TRANSACTION, data);
        set({userData: data});
      });
      channel.bind(Events.ASSETS, (data: IPusherPrivateData) => {
        // get().notificationEmitter.emit(Events.ASSETS, data);
        set(prev => {
          // // eslint-disable-next-line no-console
          // console.log('prev in assets', prev, 'data in assets', data);
          return {userData: {...prev.userData, assets: data}};
        });
      });
    }
  };

  // const syncCandlestickData = (data: ITrade) => {

  return {
    apiWorker: null,
    pusher: null,
    publicChannel: null,
    socketId: null,
    notificationEmitter: new EventEmitter(),
    init,
    trades: [],
    tickers: null,
    userData: null,

    jobQueueOfWS,
    jobQueueOfAPI,

    subscribeTickers,
    subscribeTrades,
    subscribeUser,
    requestHandler,
  };
});

export default useWorkerStore;

import React, {createContext, useRef, useContext} from 'react';
import useState from 'react-usestateref';
import {formatAPIRequest, FormatedTypeRequest, TypeRequest} from '../constants/api_request';

import {WS_URL} from '../constants/config';
import {Events} from '../constants/events';
import {TideBitEvent} from '../constants/tidebit_event';
import {
  convertToTickerMartketData,
  ITBETicker,
  ITickerData,
  ITickerMarket,
} from '../interfaces/tidebit_defi_background/ticker_data';
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
/* Deprecated: callback in requestHandler (Tzuhan - 20230420)
interface IRequest {
  [name: string]: FormatedTypeRequest;
}
*/

interface IWorkerContext {
  wsWorker: WebSocket | null;
  apiWorker: Worker | null;
  init: () => void;
  requestHandler: (data: TypeRequest) => Promise<unknown>;
  tickerChangeHandler: (ticker: ITickerData) => void;
  registerUserHandler: (address: string) => void;
}

export const WorkerContext = createContext<IWorkerContext>({
  wsWorker: null,
  apiWorker: null,
  init: () => null,
  requestHandler: () => Promise.resolve(),
  tickerChangeHandler: () => null,
  registerUserHandler: () => null,
});

let jobTimer: NodeJS.Timeout | null = null;
let wsWorker: WebSocket | null;

export const WorkerProvider = ({children}: IWorkerProvider) => {
  const notificationCtx = useContext(NotificationContext);
  const [apiWorker, setAPIWorker, apiWorkerRef] = useState<Worker | null>(null);
  const jobQueueOfWS = useRef<((...args: []) => Promise<void>)[]>([]);
  const jobQueueOfAPI = useRef<((...args: []) => Promise<void>)[]>([]);
  /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
  const requests = useRef<IRequest>({});
  */

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

  const wsInit = async () => {
    wsWorker = new WebSocket(WS_URL);
    if (wsWorker) {
      wsWorker.onmessage = msg => {
        const metaData = JSON.parse(msg.data);
        switch (metaData.type) {
          case Events.TICKERS:
            if (metaData.data) {
              const data = Object.values(metaData.data).shift() as ITBETicker;
              const tickerMarketData: ITickerMarket | null = convertToTickerMartketData(data);
              if (tickerMarketData) {
                notificationCtx.emitter.emit(TideBitEvent.TICKER, tickerMarketData);
              }
            }
            break;
          case Events.UPDATE:
            break;
          case Events.TRADES:
            break;
          case Events.PUBILC_TRADES:
            /* Deprecate: replaced by TideBitEvent.TRADES (20230407 - tzuhan)
            notificationCtx.emitter.emit(
              TideBitEvent.CANDLESTICK,
              metaData.data.market,
              metaData.data.trades
            );
            */
            notificationCtx.emitter.emit(
              TideBitEvent.TRADES,
              metaData.data.market,
              metaData.data.trades
            );
            break;
          case Events.ACCOUNT:
            break;
          case Events.ORDER:
            break;
          case Events.TRADE:
            break;
          case Events.CANDLE_ON_UPDATE:
            break;
          default:
            break;
        }
      };
    }
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
    if (wsWorker?.readyState === 1) {
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
    if (apiWorkerRef.current) {
      /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
      const request: TypeRequest = formatAPIRequest(data);
      apiWorkerRef.current.postMessage(request.request);
      requests.current[request.name] = request;
      */
      const request: FormatedTypeRequest = formatAPIRequest(data);
      const promise = new Promise((resolve, reject) => {
        apiWorkerRef.current!.onmessage = event => {
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

  const tickerChangeHandler = async (ticker: ITickerData) => {
    notificationCtx.emitter.emit(TideBitEvent.TICKER_CHANGE, ticker);
    if (wsWorker?.readyState === 1) {
      wsWorker.send(
        JSON.stringify({
          op: 'registerMarket',
          args: {
            market: `${ticker.currency.toLowerCase()}usdt`,
          },
        })
      );
    } else {
      createJob(JobType.WS, () => tickerChangeHandler(ticker));
    }
  };

  const registerUserHandler = async (address: string) => {
    notificationCtx.emitter.emit(TideBitEvent.SERVICE_TERM_ENABLED, address);
    if (wsWorker?.readyState === 1) {
      wsWorker.send(
        JSON.stringify({
          op: 'userStatusUpdate',
          args: {
            address: address,
          },
        })
      );
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

import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {MarketProvider} from '../contexts/market_context';
import {UserProvider} from '../contexts/user_context';
import {GlobalProvider} from '../contexts/global_context';
import {NotificationProvider} from '../contexts/notification_context';
import {AppProvider} from '../contexts/app_context';
import {WorkerProvider} from '../contexts/worker_context';
import React, {useContext, useEffect, useRef} from 'react';
import {MarketStoreContext, createMarketStore} from '../contexts/market_store_context';
import {useStore} from 'zustand';
import {WorkerStoreContext, createWorkerStore} from '../contexts/worker_store';

function MyApp({Component, pageProps}: AppProps) {
  const marketStore = useRef(createMarketStore()).current;
  const workerStore = useRef(createWorkerStore()).current;

  // const marketStore1 = useMarketStore();
  // TODO: if marketStore is null, throw Alert (20231120 - Shirley)
  // if (!marketStore) throw new Error('Missing BearContext.Provider in the tree');
  // const [timeSpan, selectTimeSpanHandler, init] = useStore(marketStore, s => [
  //   s.timeSpan,
  //   s.selectTimeSpanHandler,
  //   s.init,
  // ]);

  // init();

  return (
    <>
      <div className="selection:bg-tidebitTheme dark:selection:bg-tidebitTheme">
        <NotificationProvider>
          <WorkerProvider>
            <UserProvider>
              <MarketProvider>
                <GlobalProvider>
                  <AppProvider>
                    <WorkerStoreContext.Provider value={workerStore}>
                      <MarketStoreContext.Provider value={marketStore}>
                        <Component {...pageProps} />
                      </MarketStoreContext.Provider>
                    </WorkerStoreContext.Provider>
                  </AppProvider>
                </GlobalProvider>
              </MarketProvider>
            </UserProvider>
          </WorkerProvider>
        </NotificationProvider>
      </div>
    </>
  );
}

export default appWithTranslation(MyApp);

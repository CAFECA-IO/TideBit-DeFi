import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {MarketProvider} from '../contexts/market_context';
import {UserProvider} from '../contexts/user_context';
import {GlobalProvider} from '../contexts/global_context';
import {NotificationProvider} from '../contexts/notification_context';
import {AppProvider} from '../contexts/app_context';
import React from 'react';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <div className="custom-no-scrollbar selection:bg-tidebitTheme dark:selection:bg-tidebitTheme">
        <NotificationProvider>
          <UserProvider>
            <MarketProvider>
              <GlobalProvider>
                <AppProvider>
                  <Component {...pageProps} />
                </AppProvider>
              </GlobalProvider>
            </MarketProvider>
          </UserProvider>
        </NotificationProvider>
      </div>
    </>
  );
}

export default appWithTranslation(App);

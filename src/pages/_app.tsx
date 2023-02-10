import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {MarketProvider} from '../lib/contexts/market_context';
import {UserProvider} from '../lib/contexts/user_context';
import {GlobalProvider} from '../lib/contexts/global_context';
import {ToastContainer} from 'react-toastify';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <div className="custom-no-scrollbar selection:bg-tidebitTheme dark:selection:bg-tidebitTheme">
        <UserProvider>
          <MarketProvider>
            <GlobalProvider>
              <Component {...pageProps} />
            </GlobalProvider>
          </MarketProvider>
        </UserProvider>
      </div>
    </>
  );
}

export default appWithTranslation(App);

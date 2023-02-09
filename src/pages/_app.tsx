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
            <ViewportProvider>
              <Component {...pageProps} />
            </ViewportProvider>
            {/* One container avoids duplicating toast overlaying */}
            <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              theme="dark"
              limit={10}
            />
          </MarketProvider>
        </UserProvider>
      </div>
    </>
  );
}

export default appWithTranslation(App);

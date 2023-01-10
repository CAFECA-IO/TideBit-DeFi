import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {MarketProvider} from '../lib/contexts/market_context';
import {UserProvider} from '../lib/contexts/user_context';
import {ViewportProvider} from '../lib/contexts/theme_context';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <div className="custom-no-scrollbar selection:bg-tidebitTheme">
        {/* <MarketProvider> */}
        {/* <UserProvider> */}
        <ViewportProvider>
          <Component {...pageProps} />
        </ViewportProvider>
        {/* </UserProvider> */}
        {/* </MarketProvider> */}
      </div>
    </>
  );
}

export default appWithTranslation(App);

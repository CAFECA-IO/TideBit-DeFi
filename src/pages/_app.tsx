import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {MarketProvider} from '../lib/contexts/market_context';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <div className="custom-no-scrollbar selection:bg-tidebitTheme">
        <MarketProvider>
          <Component {...pageProps} />
        </MarketProvider>
      </div>
    </>
  );
}

export default appWithTranslation(App);

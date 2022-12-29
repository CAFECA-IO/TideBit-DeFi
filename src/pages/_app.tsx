import '../styles/globals.css';
import '../styles/dpr.css';
import '../styles/custom.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <div className="custom-no-scrollbar selection:bg-tidebitTheme">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default appWithTranslation(App);

import '../styles/globals.css';
import '../styles/dpr.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import NavBar from '../components/nav_bar/nav_bar';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <div className="custom-no-scrollbar">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default appWithTranslation(App);

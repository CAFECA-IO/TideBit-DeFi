import '../styles/globals.css';
import '../styles/dpr.css';
import type {AppProps} from 'next/app';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <div className="custom-no-scrollbar">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

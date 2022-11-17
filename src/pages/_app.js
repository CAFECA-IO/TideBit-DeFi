import '../styles/globals.css';
import '../styles/dpr.css';

function MyApp({Component, pageProps}) {
  return (
    <div className="">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

import '../styles/globals.css';
import '../styles/dpr.css';

function MyApp({Component, pageProps}) {
  return (
    <div className="font-barlow">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

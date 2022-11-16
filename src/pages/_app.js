import '../styles/globals.css';

function MyApp({Component, pageProps}) {
  return (
    <div className="font-barlow">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

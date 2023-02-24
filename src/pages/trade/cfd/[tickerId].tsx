import Image from 'next/image';
import Head from 'next/head';
import TrialComponent from '../../../components/trial_component/trial_component';
import NavBar from '../../../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import OrderSection from '../../../components/order_section/order_section';
import TradePageBody from '../../../components/trade_page_body/trade_page_body';
import {MarketContext, MarketProvider} from '../../../contexts/market_context';
import {UserContext, UserProvider} from '../../../contexts/user_context';
import {GlobalContext, useGlobal} from '../../../contexts/global_context';
import NavBarMobile from '../../../components/nav_bar_mobile/nav_bar_mobile';
import {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
// import ErrorPage from 'next/error';
import Error from 'next/error';

interface ILocale {
  // locale: string;
  locale: any;
}

interface IPageProps {
  tickerId: string;
  // content:
  // locale: ILocale;
}

// {tickerId}
// props: IPageProps
const Trading = (props: IPageProps) => {
  const marketCtx = useContext(MarketContext);

  const router = useRouter();
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;
  const appCtx = useContext(AppContext);

  // // // TODO: should be used
  if (!router.isFallback && !props.tickerId) {
    // return <Error statusCode={404} />;
    // throw new Error('Internal Server Error');
    // return <p>404</p>;
    // return <ErrorPage statusCode={404} />;
  }

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return appCtx.isInit ? (
    <>
      <Head>
        <title>CFD - TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {displayedNavBar}

      <main>
        {/* {router.isFallback && <TradePageBody />} */}
        <TradePageBody />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
};

// Original solution to use i18n ssr
const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

// const getStaticRoutes: GetStaticProps = async ({params}) => {
//   // const {locale: any, params} = parameter;
//   // const {locale: locale1}= {locale}

//   const tickerData = {
//     tickerId: params?.tickerId as string,
//   };

//   // ...(await serverSideTranslations(locale, ['common', 'footer']))
//   return {
//     props: {tickerData},
//   };
// };

// export const getStaticProps = {...getStaticPropsFunction, ...getStaticRoutes};
export const getStaticProps = getStaticPropsFunction;

// Trial
// export const getStaticProps: GetStaticProps = async parameter => {
//   const {locale: any, params} = parameter;
//   // const {locale: locale1}= {locale}

//   const tickerData = {
//     tickerId: params?.tickerId as string,
//   };

//   // ...(await serverSideTranslations(locale, ['common', 'footer']))
//   return {
//     props: {tickerData},
//   };
// };

// Works when there's no limit of path fallback
// const getStaticPropsFunction = async ({locale}: {locale: any}) => {
//   return {
//     props: {
//       // tickerId: 'ethusdt',
//       // tickerId: id,
//       ...(await serverSideTranslations(locale, ['common', 'footer'])),
//     },
//   };
// };
// export const getStaticProps = getStaticPropsFunction;

/**
 * @note getStaticPaths
 * In development (npm run dev or yarn dev), getStaticPaths runs on every request.
 * In production, getStaticPaths runs at build time.
 */

// {locales}
export const getStaticPaths: GetStaticPaths = async () => {
  // const marketCtx = useContext(MarketContext);
  // TODO: Get available tickerIds from API
  // const res = marketCtx.availableTickers;
  // console.log(res);

  // TODO: 收到路徑之後切換 ticker

  const tickerIds = [
    'ethusdt',
    'btcusdt',
    'ltcusdt',
    'maticusdt',
    'bnbusdt',
    'solusdt',
    'shibusdt',
    'dotusdt',
    'adausdt',
    'avaxusdt',
    'daiusdt',
    'mkrusdt',
    'xrpusdt',
    'dogeusdt',
    'uniusdt',
    'flowusdt',
  ];

  const paths = tickerIds.map(id => ({
    params: {tickerId: id},
    // params: {tickerId: 'ethusdt'},
  }));

  // // Trial: getStaticPaths with locale
  // const pathss = tickerIds
  //   .map(id => {
  //     locales?.map(locale => ({
  //       params: {tickerId: id},
  //       locale: locale, //locale should be outside `params`
  //     }));
  //   })
  //   .flat(); // to avoid nested arrays

  // console.log(pathss);

  return {
    // paths: [],
    paths: paths,
    fallback: true, //TODO: should be false
  };
};

// Simulate error
// export async function getServerSideProps() {
//   throw new TypeError("Oops, It didn't return a reasonable response.");
// }

// export async function getServerSideProps() {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js');
//   const errorCode = res.ok ? false : res.status;
//   const json = await res.json();

//   return {
//     props: {errorCode, stars: json.stargazers_count},
//   };
// }

export default Trading;

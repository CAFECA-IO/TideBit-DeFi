import Image from 'next/image';
import Head from 'next/head';
import TrialComponent from '../../../components/trial_component/trial_component';
import NavBar from '../../../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect, useState} from 'react';
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
import useStateRef from 'react-usestateref';
import {capitalized, hasValue, wait} from '../../../lib/common';

interface IPageProps {
  tickerId: string;
}

const Trading = (props: IPageProps) => {
  const marketCtx = useContext(MarketContext);
  const {layoutAssertion} = useGlobal();
  const appCtx = useContext(AppContext);

  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const router = useRouter();
  const {tickerId} = router.query;

  const currency = tickerId ? tickerId.toString().replace('usdt', '').toUpperCase() : undefined;

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    const capitalizeCurrency = ['Flow', 'Dai'];

    const redirectTicker = async () => {
      if (hasValue(marketCtx.availableTickers) && currency) {
        if (capitalizeCurrency.includes(capitalized(currency))) {
          marketCtx.selectTickerHandler(capitalized(currency));
          return;
        }

        marketCtx.selectTickerHandler(currency);
        // eslint-disable-next-line no-console
        console.log('[UseEffect] isinit so call selectTickerHandler');
        // eslint-disable-next-line no-console
        console.log('[UseEffect] available tickers: ', marketCtx.availableTickers);
      }

      // eslint-disable-next-line no-console
      console.log('[UseEffect] availableTickers has value', hasValue(marketCtx.availableTickers));
      // eslint-disable-next-line no-console
      console.log('[UseEffect] currency init: ', currency);
      // eslint-disable-next-line no-console
      console.log('[UseEffect] is init: ', appCtx.isInit);
    };

    redirectTicker();
  }, [marketCtx.availableTickers]);

  if (!router.isFallback && !props.tickerId) {
    return <Error statusCode={404} />;
  }

  return appCtx.isInit ? (
    <>
      <Head>
        <title>CFD - TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {displayedNavBar}

      <main>
        <TradePageBody />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
};

// ToDo: (20230417 - Shirley) Original solution to use i18n ssr
// const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common', 'footer'])),
//   },
// });

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
// ToDo: (20230417 - Shirley) Original solution to use i18n ssr
// export const getStaticProps = getStaticPropsFunction;
export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.tickerId || typeof params.tickerId !== 'string') {
    return {
      notFound: true,
    };
  }

  // ToDo: footer?
  return {
    props: {
      tickerId: params.tickerId,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

/**
 * @note getStaticPaths
 * In development (npm run dev or yarn dev), getStaticPaths runs on every request.
 * In production, getStaticPaths runs at build time.
 */
export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  // const marketCtx = useContext(MarketContext);
  // console.log('in static path, marketCtx', marketCtx);
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

  const paths = tickerIds
    .flatMap(id => {
      return locales?.map(locale => ({
        params: {tickerId: id},
        locale: locale,
      }));
    })
    .filter((path): path is {params: {tickerId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: false,
  };
};

export default Trading;

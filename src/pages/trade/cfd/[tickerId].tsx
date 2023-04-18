import Image from 'next/image';
import Head from 'next/head';
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
import Error from 'next/error';
import useStateRef from 'react-usestateref';
import {capitalized, hasValue, wait} from '../../../lib/common';
import {CAPITALIZED_CURRENCY} from '../../../constants/config';
import {Currency, ICurrency} from '../../../constants/currency';

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

  const currency: ICurrency = tickerId
    ? (tickerId.toString().replace('usdt', '').toUpperCase() as ICurrency)
    : Currency.ETH;

  const redirectToTicker = async () => {
    if (hasValue(marketCtx.availableTickers) && currency) {
      // if (CAPITALIZED_CURRENCY.includes(capitalized(currency))) {
      //   marketCtx.selectTickerHandler(capitalized(currency));
      //   return;
      // }

      marketCtx.selectTickerHandler(currency);
    }
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    if ((marketCtx?.selectedTickerRef?.current?.currency?.toString() ?? '') === currency) return;
    redirectToTicker();
    // eslint-disable-next-line no-console
    console.log('selected currenct', marketCtx?.selectedTickerRef?.current?.currency?.toString());
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

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.tickerId || typeof params.tickerId !== 'string') {
    return {
      notFound: true,
    };
  }

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

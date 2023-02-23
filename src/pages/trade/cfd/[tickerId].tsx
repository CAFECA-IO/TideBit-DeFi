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

interface ILocale {
  // locale: string;
  locale: any;
}

interface IPageProps {
  tickerId: string;
  locale: ILocale;
}

const Trading = () => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;
  const appCtx = useContext(AppContext);

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

      {/* <MarketProvider> */}
      {/* <UserProvider> */}
      {displayedNavBar}
      {/* <NavBar /> */}

      <main>
        <TradePageBody />
      </main>
      {/* </UserProvider> */}
      {/* </MarketProvider> */}
    </>
  ) : (
    <div>Loading...</div>
  );
};

// const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common', 'footer'])),
//   },
// });
// export const getStaticProps = getStaticPropsFunction;

export const getStaticProps: GetStaticProps = async parameter => {
  const {locale: any, params} = parameter;
  // const {locale: locale1}= {locale}

  const tickerData = {
    tickerId: params?.tickerId as string,
  };

  // ...(await serverSideTranslations(locale, ['common', 'footer']))
  return {
    props: {tickerData},
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
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

  return {
    // paths: [],
    paths,
    fallback: false,
  };
};

export default Trading;

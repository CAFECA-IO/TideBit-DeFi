import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
// import {initReactI18next} from 'react-i18next';
// import {i18n} from 'next-i18next';
import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HeroDescription from '../components/hero_description/hero_description';
import {MarketProvider} from '../contexts/market_context';
import {useContext, useEffect} from 'react';
import {GlobalContext, GlobalProvider, useGlobal} from '../contexts/global_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';
import {AppContext} from '../contexts/app_context';

const Home = () => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, [appCtx.isInit]);

  return appCtx.isInit ? (
    <>
      <Head>
        <title>TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {displayedNavBar}
      {/* <NavBar /> */}

      {/* <MarketProvider> */}
      <main>
        <HeroDescription />
      </main>
      {/* </MarketProvider> */}
    </>
  ) : (
    <></>
  );
};

const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Home;

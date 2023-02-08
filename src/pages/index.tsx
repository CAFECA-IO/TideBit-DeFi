import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
// import {initReactI18next} from 'react-i18next';
// import {i18n} from 'next-i18next';
import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HeroDescription from '../components/hero_description/hero_description';
import {MarketProvider} from '../lib/contexts/market_context';
import {useContext} from 'react';
import {GlobalContext, useGlobal} from '../lib/contexts/global_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';

const Home = () => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  return (
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
  );
};

const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Home;

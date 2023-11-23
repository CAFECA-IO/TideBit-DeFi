import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HeroDescription from '../components/hero_description/hero_description';
import React, {useContext, useEffect} from 'react';
import {AppContext} from '../contexts/app_context';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import {TIDEBIT_FAVICON} from '../constants/display';
import Footer from '../components/footer/footer';

const Home = () => {
  const displayedNavBar = <NavBar />;

  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return (
    <>
      <Head>
        <title>[Zustand test] TideBit DeFi</title>
        <link rel="icon" href={TIDEBIT_FAVICON} />
      </Head>

      {displayedNavBar}
      <main className="mx-auto max-w-1920px">
        <HeroDescription />
      </main>

      <Footer />
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Home;

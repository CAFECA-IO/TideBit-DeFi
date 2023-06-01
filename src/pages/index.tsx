import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HeroDescription from '../components/hero_description/hero_description';
import {useContext, useEffect} from 'react';
import {useGlobal} from '../contexts/global_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';
import {AppContext} from '../contexts/app_context';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import {TIDEBIT_FAVICON} from '../constants/display';

const Home = () => {
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
        <title>TideBit DeFi</title>
        <link rel="icon" href={TIDEBIT_FAVICON} />
      </Head>

      {displayedNavBar}
      <main>
        <HeroDescription />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Home;

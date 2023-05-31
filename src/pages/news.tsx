import React, {useContext, useEffect} from 'react';
import NewsPageBody from '../components/news_page_body/news_page_body';
import Head from 'next/head';
import {useGlobal} from '../contexts/global_context';
import {AppContext} from '../contexts/app_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';

const News = () => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  const initUI = (
    <>
      {appCtx.isInit ? (
        <>
          <Head>
            <title>News - TideBit DeFi</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <nav className="">{displayedNavBar}</nav>

          <main className="pt-32 pb-10">
            <div>
              <NewsPageBody />
            </div>
          </main>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );

  return <>{initUI}</>;
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default News;

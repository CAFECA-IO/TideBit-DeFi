import React, {useContext, useEffect} from 'react';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {AppContext} from '../contexts/app_context';
import {useGlobal} from '../contexts/global_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';
import Footer from '../components/footer/footer';
import AssetsPageBody from '../components/assets_page_body/assets_page_body';
import Head from 'next/head';

// TODO: layoutAssertion is constants objects
const MyAssets = () => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return (
    <>
      <Head>
        <title>My Assets - TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {displayedNavBar}

        <main>
          {/*  min-h-screen */}
          <div className="flex flex-col items-center justify-center overflow-hidden">
            {' '}
            <AssetsPageBody />
            {/* <div className="">~AssetsPageBody~</div>
          <div className="">Balance / Withdraw / Deposit</div>
          <div className="">PnL Section</div>
          <div className="">Interest Section</div>
          <div className="">Receipt Section</div> */}
          </div>
        </main>
        {/* <div className="">
          <Footer />
        </div> */}
      </div>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default MyAssets;

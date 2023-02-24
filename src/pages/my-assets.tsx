import React, {useContext, useEffect} from 'react';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {AppContext} from '../contexts/app_context';
import {useGlobal} from '../contexts/global_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';
import Footer from '../components/footer/footer';

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
    <div>
      {displayedNavBar}

      <main>
        <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden pt-0">
          <div className="">~AssetsPageBody~</div>
          <div className="">Balance / Withdraw / Deposit</div>
          <div className="">PnL Section</div>
          <div className="">Interest Section</div>
          <div className="">Receipt Section</div>
        </div>
        <div className="">
          <Footer />
        </div>
      </main>
    </div>
  );
};

const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default MyAssets;

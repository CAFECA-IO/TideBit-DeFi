import React, {useContext, useEffect} from 'react';
import NavBar from '../components/nav_bar/nav_bar';
import Head from 'next/head';
import BoardPageBody from '../components/board_page_body/board_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {AppContext} from '../contexts/app_context';
import {useGlobal} from '../contexts/global_context';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import {TIDEBIT_FAVICON} from '../constants/display';
import {LayoutAssertion} from '../constants/layout_assertion';

const Leaderboard = () => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = <NavBar />;

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
            <title>Leaderboard - TideBit DeFi</title>
            <link rel="icon" href={TIDEBIT_FAVICON} />
          </Head>

          <div>
            {displayedNavBar}

            <main>
              <div className="">
                <BoardPageBody />
              </div>
            </main>
          </div>
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

export default Leaderboard;

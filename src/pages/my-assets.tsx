import React, {useContext, useEffect} from 'react';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {AppContext} from '../contexts/app_context';
import AssetsPageBody from '../components/assets_page_body/assets_page_body';
import Head from 'next/head';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import {TIDEBIT_FAVICON} from '../constants/display';

const MyAssets = () => {
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
            <title>My Assets - TideBit DeFi</title>
            <link rel="icon" href={TIDEBIT_FAVICON} />
          </Head>

          <div>
            {displayedNavBar}

            <main>
              <div>
                <AssetsPageBody />
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

export default MyAssets;

import React, {useContext, useEffect} from 'react';
import Lottie from 'lottie-react';
import comingSoonAnimation from '../../public/animation/coming-soon.json';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {AppContext} from '../contexts/app_context';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import Footer from '../components/footer/footer';
import Head from 'next/head';
import {TIDEBIT_FAVICON} from '../constants/display';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const ComingSoon = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

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
            <title>Coming Soon - TideBit DeFi</title>
            <link rel="icon" href={TIDEBIT_FAVICON} />
          </Head>
          <div>
            {displayedNavBar}
            <div className="relative flex min-h-600px flex-col items-center justify-center">
              <Lottie animationData={comingSoonAnimation} />
              <div className="absolute bottom-1/3 text-center text-white">
                <div>{t('COMING_SOON_PAGE.DESCRIPTION1')}</div>
                <div>{t('COMING_SOON_PAGE.DESCRIPTION2')}</div>
              </div>
            </div>
            <Footer />
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

export default ComingSoon;

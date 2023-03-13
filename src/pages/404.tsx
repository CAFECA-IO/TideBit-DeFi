import React, {useContext, useEffect} from 'react';
import Lottie from 'lottie-react';
import notFoundAnimation from '../../public/animation/404.json';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Footer from '../components/footer/footer';
import {AppContext} from '../contexts/app_context';
import {ILocale} from '../interfaces/tidebit_defi_background/json';

// TODO: layoutAssertion
// TODO: AppInit
const Custom404 = () => {
  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return (
    <div>
      <NavBar />
      <Lottie animationData={notFoundAnimation} />
      <Footer />
    </div>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Custom404;

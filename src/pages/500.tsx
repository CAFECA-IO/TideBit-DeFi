import React, {useContext, useEffect} from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '../../public/animation/oops.json';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {AppContext} from '../contexts/app_context';
import {ILocale} from '../interfaces/tidebit_defi_background/json';

// function Error({statusCode}: any) {
//   return (
//     <div>
//       <NavBar />
//       <Lottie animationData={errorAnimation} />
//     </div>
//   );
// }

// Error.getInitialProps = ({res, err}: any) => {
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
//   return {statusCode};
// };

// export default Error;

// TODO: layoutAssertion
// TODO: AppInit
const Custom500 = () => {
  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return (
    <div>
      <NavBar />
      <Lottie animationData={errorAnimation} />
    </div>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Custom500;

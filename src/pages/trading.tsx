import Image from 'next/image';
import Head from 'next/head';
import TrialComponent from '../components/trial_component/trial_component';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import OrderSection from '../components/order_section/order_section';
import TradePageBody from '../components/trade_page_body/trade_page_body';
import {MarketContext, MarketProvider} from '../lib/contexts/market_context';
import {UserContext, UserProvider} from '../lib/contexts/user_context';
import {useContext} from 'react';
import {ViewportContext} from '../lib/contexts/theme_context';
import {LAYOUT_BREAKPOINT} from '../constants/display';

const Trading = () => {
  // const {layoutAssertion, initialColorMode} = useContext(ViewportContext);
  // console.log('layoutAssertion:', layoutAssertion);
  // console.log('initialColorMode:', initialColorMode);
  // const displayedLayout = width < LAYOUT_BREAKPOINT ? <></> : <NavBar />;

  return (
    <>
      <Head>
        <title>Trading - TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* {displayedLayout} */}
      <NavBar />

      {/* <MarketProvider> */}
      {/* <UserProvider> */}
      <main>
        <TradePageBody />
      </main>
      {/* </UserProvider> */}
      {/* </MarketProvider> */}
    </>
  );
};

const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});
export const getStaticProps = getStaticPropsFunction;

export default Trading;

import Image from 'next/image';
import Head from 'next/head';
import TestReserveRatio from '../components/reserve_ratio/test_reserve_ratio';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import OrderSection from '../components/order_section/order_section';
import TradePageBody from '../components/trade_page_body/trade_page_body';

const Trading = () => {
  return (
    <>
      <Head>
        <title>Trading - TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main>
        <TradePageBody />
      </main>
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

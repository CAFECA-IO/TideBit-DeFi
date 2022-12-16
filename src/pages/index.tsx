import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HeroDescription from '../components/hero_description/hero_description';

const Home = () => {
  return (
    <>
      <Head>
        <title>TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main>
        <HeroDescription />
      </main>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: {locale: any}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export default Home;
export const getStaticProps = getStaticPropsFunction;

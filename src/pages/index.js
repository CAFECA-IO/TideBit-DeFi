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

export default Home;

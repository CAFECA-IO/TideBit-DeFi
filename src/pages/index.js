import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/layout/banner';
import Hero from '../components/layout/hero';
import NavBar from '../components/layout/nav_bar';
import StatisticBlock from '../components/layout/statistic';
import CryptoCategory from '../components/layout/crypto_category';
import HeroReverse from '../components/layout/hero_reverse';
import AppDowloadContainer from '../components/layout/app_download_container';
import Footer from '../components/layout/footer';
import Cta from '../components/layout/cta';

const Home = () => {
  return (
    <>
      <Head>
        <title>TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black py-24">
        <main>
          <div className="">
            <div className="overflow-y-auto">
              <Cta />
              <StatisticBlock className="py-40 md:py-0" />
              <CryptoCategory className="py-40" />
              <Banner />
              <HeroReverse heading={`Web 3.0`} />
              <Hero heading={`Easy Trade`} />
              <HeroReverse heading={`Security System`} />
              <Hero heading={`Free Online Courses`} />

              <h1 className="flex flex-shrink-0 items-center justify-center py-20 px-2 text-lg font-bold text-white sm:text-2xl md:px-20 md:text-3xl lg:text-4xl">
                Trade on&nbsp;<span className="text-cyan-400">TideBit</span>
                &nbsp;anywhere, anytime
              </h1>
              <AppDowloadContainer />
            </div>
            <div className="-mb-[100px] h-1/2 w-screen">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

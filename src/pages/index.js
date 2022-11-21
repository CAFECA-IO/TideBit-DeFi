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
import HeroReverse1 from '../components/layout/hero_reverse1';

const Home = () => {
  return (
    <>
      <Head>
        <title>TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className=""></div>

      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black py-24">
        <main>
          <div className="">
            <div className="">
              <Cta />
              <StatisticBlock className="py-40 md:py-0" />
              <CryptoCategory className="py-40" />
              <Banner />

              <HeroReverse
                heading={`Web`}
                highlight={`3.0`}
                content={`To fit in the new generation, TideBit uses Web 3.0 technology. Make it easy to buy and sell crypto currency.`}
                img={<Image src="/elements/2634@2x.png" width={976} height={588} />}
              />
              <Hero heading={`Easy Trade`} />

              <HeroReverse1
                heading={
                  <div className="font-bold">
                    <span className="text-tidebitTheme">{`Secure `}</span>
                    {` System`}
                  </div>
                }
                content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam`}
                img={<Image src="/elements/group_15145@2x.png" width={1366} height={930} />}
              />
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

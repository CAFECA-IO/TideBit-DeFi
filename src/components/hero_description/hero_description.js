import React from 'react';
import AppDowloadContainer from '../app_download_container/app_download_container';
import Banner from '../banner/banner';
import CryptoCategory from '../crypto_category/crypto_category';
import Cta from '../cta/cta';
import Footer from '../footer/footer';
import Hero from '../hero/hero';
import Hero1 from '../hero1/hero1';
import HeroReverse from '../hero_reverse/hero_reverse';
import HeroReverse1 from '../hero_reverse1/hero_reverse1';
import StatisticBlock from '../statistic/statistic';
import Image from 'next/image';

export default function HeroDescription() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black py-24">
      <div>
        <div className="">
          <div className="">
            <Cta />
            <div className="py-5 lg:py-20"></div>

            <StatisticBlock />
            <div className="py-10 lg:py-40"></div>

            <CryptoCategory />
            <div className="py-10 lg:py-40"></div>

            <Banner />
            <div className="py-16 lg:py-40"></div>

            {/* Web3.0 */}
            <HeroReverse
              heading={`Web`}
              highlight={`3.0`}
              content={`To fit in the new generation, TideBit uses Web 3.0 technology. Make it easy to buy and sell crypto currency.`}
              img={<Image src="/elements/2634@2x.png" width={976} height={588} />}
            />

            <div className="pt-48 lg:pt-96"></div>

            {/* Easy Trade */}
            <Hero
              heading={
                <div className="font-bold">
                  <span className="text-tidebitTheme">{`Easy `}</span>
                  {` Trade`}
                </div>
              }
              content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam`}
              img={<Image src="/elements/group_15200@2x.png" width={1252} height={879} />}
            />

            <div className="pt-48 lg:pt-96"></div>

            {/* Secure System */}
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

            <div className="pt-48 lg:pt-96"></div>

            {/* Free Online Courses */}
            <Hero1
              heading={
                <div className="font-bold">
                  <span className="text-tidebitTheme">{`Free `}</span>
                  {` Online courses`}
                </div>
              }
              content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam`}
              img={<Image src={`/elements/group_15201.svg`} width={1364} height={820} />}
            />

            {/* App download */}
            <h1 className="flex shrink-0 items-center justify-center py-20 px-2 text-lg font-bold text-white sm:text-2xl md:px-20 md:text-3xl lg:text-4xl xl:text-6xl">
              Trade on&nbsp;<span className="text-cyan-400">TideBit</span>
              &nbsp;anywhere, anytime
            </h1>
            <AppDowloadContainer />
          </div>
          {/* Footer */}
          <div className="-mb-100px h-1/2 w-screen">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

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
import ReserveRatio from '../reserve_ratio/reserve_ratio';
import TrialComponent from '../trial_component/trial_component';
import {MarketProvider} from '../../contexts/market_context';

export default function HeroDescription() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24">
      {/* Body */}
      <div className="">
        <Cta />
        <div className="py-5 lg:py-20"></div>

        <StatisticBlock />
        <div className="py-10 lg:py-40"></div>

        {/* <MarketProvider> */}
        <ReserveRatio />
        <div className="pb-40 lg:pb-60 2xl:pb-72"></div>
        <div className="pt-52"></div>

        <CryptoCategory />
        {/* </MarketProvider> */}
        <div className="py-10 lg:py-40"></div>

        <Banner />
        <div className="py-16 lg:pb-2/5 lg:pt-40"></div>

        {/* Web3.0 */}
        <HeroReverse
          heading={`Web`}
          highlight={`3.0`}
          content={`To fit in the new generation, TideBit uses Web 3.0 technology. Make it easy to buy and sell crypto currency.`}
          img="/elements/2634@2x.png"
        />
        <div className="py-5 lg:py-40"></div>

        {/* Easy Trade */}
        <Hero
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">{`Easy `}</span>
              {` Trade`}
            </div>
          }
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam`}
          img="/elements/group_15200@2x.png"
        />
        <div className="py-5 lg:py-40"></div>

        {/* Secure System */}
        <HeroReverse1
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">{`Secure `}</span>
              {` System`}
            </div>
          }
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam`}
          img="/elements/group_15145@2x.png"
        />
        <div className="py-5 lg:py-40"></div>

        {/* Free Online Courses */}
        <Hero1
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">{`Free `}</span>
              {` Online courses`}
            </div>
          }
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam`}
          img={`/elements/group_15201.svg`}
        />
        <div className="py-5 lg:py-10"></div>

        {/* App download */}
        <div className="flex w-full justify-center">
          <AppDowloadContainer />
        </div>
      </div>

      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

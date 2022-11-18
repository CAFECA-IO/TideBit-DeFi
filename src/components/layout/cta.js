import React from 'react';
import Image from 'next/image';
import TideButton from '../shared/button/tide_button';
// [url('/public/elements/Group_15198@2x.png')]
const Cta = () => {
  return (
    <section className="h-[800px] w-screen bg-black  bg-landingPageCta1 object-fill text-gray-400">
      <div className="pl-[150px]">
        <div className="top-[5rem] left-[2rem] text-white md:top-[20rem] md:left-[12rem] ">
          <div className="max-w-lg text-3xl font-bold leading-[60px] tracking-wide md:max-w-3xl md:text-7xl">
            <span className="text-tidebitTheme">Trusted</span> platform for Crypto investment
          </div>
          <div className="mt-[55px] max-w-md text-[20px] text-lightGray md:max-w-2xl">
            Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with
            the best quality.{' '}
          </div>
          <div className="pt-8">
            <TideButton content={`Get Started`.toUpperCase()} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;

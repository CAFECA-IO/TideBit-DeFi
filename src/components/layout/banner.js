import Image from 'next/image';
import React from 'react';
import TideButton from '../shared/button/tide_button';
// mx-auto flex flex-col items-center justify-center px-5 py-24
const Banner = () => {
  return (
    <section className="w-screen">
      <div className="">
        <div className="relative">
          <Image
            className="absolute top-0 left-0"
            alt="hero"
            src="/elements/group_14583.svg"
            width={1920}
            height={1080}
          />
          <Image
            className="absolute"
            height={100}
            width={200}
            src="/elements/group_15199@2x.png"
            contain
          />
        </div>

        {/* Slogan and Btn */}
        <div className="flex w-full justify-center text-4xl lg:text-6xl">
          <div className="flex flex-col items-start justify-start space-y-10 text-start">
            <div className="text-white">New Wallet available</div>
            <div className="text-tidebitTheme">iSunOne</div>
            <TideButton
              className="px-2 py-1 xxs:text-xxs sm:py-2 sm:px-5 sm:text-base xl:py-4 xl:px-9 xl:text-3xl"
              content={`Try it now`.toUpperCase()}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

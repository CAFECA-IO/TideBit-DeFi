import Image from 'next/image';
import React from 'react';
import TideButton from '../shared/button/tide_button';
// mx-auto flex flex-col items-center justify-center px-5 py-24
const Banner = () => {
  return (
    <section className="relative w-screen">
      <div className="">
        <div>
          <img
            className="mb-10 h-1/6 w-screen rounded object-cover object-center"
            alt="hero"
            src="/elements/group_14583.svg"
          />
          <img src="/elements/group_15199@2x.png" fill="true" />
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

import Image from 'next/image';
import React from 'react';
import TideButton from '../shared/button/tide_button';
// mx-auto flex flex-col items-center justify-center px-5 py-24
// pb-[600px]
const Banner = () => {
  return (
    <section className="h-fit w-screen md:mb-10 lg:mb-40 xl:mb-80">
      <div className="">
        <div className="">
          <div className="relative">
            <Image
              className="absolute top-0 left-0 h-fit bg-darkGray3 opacity-80"
              alt="hero"
              src="/elements/group_14583.svg"
              width={1920}
              height={1080}
            />
            <Image
              className="absolute right-20 top-1 w-1/3 xs:top-2 xs:right-24 md:right-40 lg:right-52"
              width={892}
              height={712}
              src="/elements/group_15199@2x.png"
              contain="true"
            />
            <div className="absolute left-16 top-0 mt-5 flex text-xs xxs:left-20 xxs:mt-7 xxs:text-sm xs:left-28 xs:mt-10 xs:text-base sm:left-36 sm:top-3 sm:text-xl md:left-40 md:top-5 md:mt-12 md:text-3xl lg:top-5 lg:left-52 lg:mt-16 lg:text-4xl xl:top-5 xl:left-56 xl:text-5xl 2xl:left-72 2xl:text-6xl">
              <div className="flex flex-col items-start justify-start space-y-2 text-start font-bold sm:space-y-4 lg:space-y-8">
                <div className="text-white">New Wallet available</div>
                <div className="text-tidebitTheme">iSunOne</div>
                <TideButton
                  className="px-2 py-1 text-3xs sm:py-2 sm:px-4 sm:text-sm md:px-6 md:py-2 xl:py-4 xl:px-9 xl:text-3xl"
                  content={`Try it now`.toUpperCase()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slogan and Btn */}
      </div>
    </section>
  );
};

export default Banner;

import Image from 'next/image';
import React from 'react';
import TideButton from '../tide_button/tide_button';
// mx-auto flex flex-col items-center justify-center px-5 py-24
// pb-[600px]
// FIXME: remove `contain={true}` in Image components
const Banner = () => {
  return (
    <>
      {/* Desktop version (width >= 1024 px) */}

      <div className="hidden lg:block">
        <section className="">
          <div className="">
            <div className="">
              <div className="relative">
                <Image
                  className="absolute top-0 left-0 h-fit w-screen bg-darkGray3 opacity-80"
                  alt="background image"
                  src="/elements/group_14583.svg"
                  width={1920}
                  height={1080}
                />
                <Image
                  className="absolute right-20 top-1 w-1/3 xs:top-2 xs:right-24 md:right-40 lg:right-52 xl:right-64"
                  width={892}
                  height={712}
                  alt="isunone"
                  src="/elements/group_15199@2x.png"
                />
                <div className="absolute left-16 top-0 mt-5 flex text-xs xxs:left-20 xxs:mt-7 xxs:text-sm xs:left-28 xs:mt-10 xs:text-base sm:left-36 sm:top-3 sm:text-xl md:left-40 md:top-5 md:mt-12 md:text-3xl lg:top-5 lg:left-52 lg:mt-16 lg:text-4xl xl:top-5 xl:left-56 xl:text-5xl 2xl:left-96 2xl:top-20 2xl:text-6xl">
                  <div className="flex flex-col items-start justify-start space-y-2 text-start font-bold sm:space-y-4 lg:space-y-8">
                    <div className="text-white">New Wallet available</div>
                    <div className="text-tidebitTheme">iSunOne</div>
                    <TideButton className="rounded bg-tidebitTheme px-5 py-2 font-normal text-white transition-all duration-300 hover:bg-cyan-600 xxs:text-xxs sm:py-2 sm:px-5 sm:text-base xl:py-3 xl:px-5 xl:text-lg">
                      TRY IT NOW
                    </TideButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Slogan and Btn */}
          </div>
        </section>
      </div>

      {/* Mobile version (width < 1024 px) */}
      <section className="lg:hidden">
        <div className="">
          <div className="">
            <div className="relative bg-darkGray4 pt-10 pb-10">
              <Image
                className="mx-auto flex w-1/2 pb-5 sm:pb-10"
                width={490}
                height={354}
                alt="isunone"
                src="/elements/group_15221@2x.png"
              />

              <div className="flex justify-center text-center">
                <div className="mx-1/10 w-fit text-2xl font-bold tracking-wide text-white xxs:text-3xl xs:w-4/5 xs:text-4xl md:text-4xl">
                  <div className="mx-auto mb-5 flex flex-col items-center justify-center space-y-2 text-center font-bold sm:mb-10 sm:space-y-4 lg:space-y-8">
                    <div className="text-white">New Wallet available</div>
                    <div className="text-tidebitTheme">iSunOne</div>
                  </div>
                  <TideButton className="rounded bg-tidebitTheme px-4 py-2 font-normal transition-all hover:opacity-90 xxs:text-xs sm:py-2 sm:px-5 sm:text-base xl:py-3 xl:px-5 xl:text-lg">
                    TRY IT NOW
                  </TideButton>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan and Btn */}
        </div>
      </section>

      {/* group_15221@2x */}
    </>
  );
};

export default Banner;

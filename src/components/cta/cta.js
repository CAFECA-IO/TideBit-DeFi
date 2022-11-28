import React from 'react';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';

const Cta = () => {
  return (
    <>
      {/* Desktop version (width >= 1024 px) */}
      <section className="relative hidden w-screen pl-50px lg:flex">
        <Image
          width={2409}
          height={1500}
          className="h-auto max-w-full"
          src="/elements/group_15198@2x.png"
          alt="image description"
        />

        <div className="absolute top-3rem left-2rem flex flex-col justify-start xxs:top-4rem xxs:left-4rem xs:left-5rem xs:top-5rem sm:left-6rem sm:top-7rem md:left-5rem md:top-9rem lg:top-11rem xl:top-13rem 2xl:top-15rem 3xl:top-20rem 3xl:left-8rem">
          <div className="max-w-200px text-lg font-bold tracking-wide text-white xs:text-2xl sm:max-w-350px sm:text-3xl md:max-w-sm md:text-4xl lg:max-w-lg lg:text-5xl xl:max-w-xl xl:text-6xl 2xl:max-w-2xl 2xl:text-7xl">
            <span className="text-tidebitTheme">Trusted</span> platform for Crypto investment
            <div className="mt-10 max-w-160px text-xxs font-normal tracking-0.02rem text-lightGray xs:max-w-250px sm:max-w-200px sm:text-xs md:max-w-md md:text-sm lg:mt-14 lg:w-3/5 xl:text-lg 2xl:text-xl">
              Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with
              the best quality.{' '}
            </div>
            <div className="pt-2 md:pt-8 xl:pt-10">
              <TideButton
                className="px-2 py-1 font-normal xxs:text-xxs sm:py-2 sm:px-5 sm:text-base xl:py-3 xl:px-5 xl:text-lg"
                content={`GET STARTED`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile version (width < 1024 px) */}
      <section className="mb-1/10 flex w-screen flex-col items-center justify-center lg:hidden">
        <Image
          className="ml-1/10"
          alt="candlestick chart view"
          src="/elements/group_15215@2x.png"
          width={596}
          height={545}
        />
        <div className="flex justify-center text-center">
          <div className="mx-1/10 w-fit text-2xl font-bold tracking-wide text-white xxs:mx-1/5 xxs:text-3xl xs:w-4/5 xs:text-4xl md:text-5xl">
            <span className="text-tidebitTheme">Trusted</span> platform for Crypto investment
            <div className="mx-1/10 mt-10 max-w-md text-sm font-normal tracking-0.02rem text-lightGray md:text-xl">
              Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with
              the best quality.{' '}
            </div>
            <div className="mx-auto pt-2 md:pt-8">
              <TideButton className="px-5 py-2 font-normal " content={`GET STARTED`} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cta;

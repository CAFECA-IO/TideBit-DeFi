import React from 'react';
import Image from 'next/image';
import TideButton from '../shared/button/tide_button';

const Cta = () => {
  return (
    <section className="relative w-screen pl-[50px]">
      <Image
        width={2409}
        height={1500}
        className="h-auto max-w-full"
        src="/elements/group_15198@2x.png"
        alt="image description"
      />

      <div className="absolute top-[3rem] left-[2rem] flex flex-col justify-start xxs:top-[4rem] xxs:left-[4rem] xs:left-[5rem] xs:top-[5rem] sm:left-[6rem] sm:top-[7rem] md:left-[5rem] md:top-[9rem] lg:top-[11rem] xl:top-[13rem] 2xl:top-[15rem] 3xl:top-[20rem] 3xl:left-[8rem]">
        <div className="max-w-[200px] text-lg font-bold tracking-wide text-white xs:text-2xl sm:max-w-[350px] sm:text-3xl md:max-w-sm md:text-4xl lg:max-w-lg lg:text-5xl xl:max-w-xl xl:text-6xl 2xl:max-w-2xl 2xl:text-7xl">
          <span className="text-tidebitTheme">Trusted</span> platform for Crypto investment
          <div className="mt-[20px] max-w-[160px] text-xxs font-normal tracking-[0.02rem] text-lightGray xs:max-w-[250px] sm:max-w-[200px] sm:text-xs md:max-w-md md:text-sm lg:mt-[55px] lg:max-w-2xl xl:text-lg 2xl:text-xl">
            Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with
            the best quality.{' '}
          </div>
          <div className="pt-2 md:pt-8 xl:pt-20">
            <TideButton
              className="px-2 py-1 font-normal xxs:text-xxs sm:py-2 sm:px-5 sm:text-base xl:py-3 xl:px-5 xl:text-lg"
              content={`Get Started`.toUpperCase()}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;

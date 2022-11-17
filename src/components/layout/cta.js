import React from 'react';
import Image from 'next/image';

const Cta = () => {
  return (
    <section className="bg-black text-gray-400">
      <div className="relative mx-auto pl-[150px]">
        <Image
          width={2409}
          height={1500}
          className="landingPageCTA1 w-full object-fill object-center"
          src="/elements/Group 15198@2x.png"
          alt="landing page call to action"
        />
        <div className="absolute top-[5rem] left-[2rem] text-white md:top-[20rem] md:left-[12rem] ">
          <div className="max-w-lg text-3xl font-bold leading-[60px] tracking-wide md:max-w-3xl md:text-7xl">
            <span className="text-tidebitTheme">Trusted</span> platform for Crypto investment
          </div>
          <div className="mt-[55px] max-w-md text-[20px] text-lightGray md:max-w-2xl">
            Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with
            the best quality.{' '}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;

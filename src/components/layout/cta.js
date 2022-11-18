import React from 'react';
import Image from 'next/image';
import TideButton from '../shared/button/tide_button';
// [url('/public/elements/Group_15198@2x.png')]

// <div className="absolute bottom-[10rem] left-[2rem] bg-blue-400 px-4 text-lg text-white">
//       <p>Do you want to get notified when a new component is added to Flowbite?</p>
// </div>
const Cta = () => {
  return (
    <section className="relative w-screen pl-[50px]">
      <img className="" src="/elements/Group 15198@2x.png" alt="image description" />
      <div className="absolute top-[20rem] left-[8rem] flex flex-col justify-start">
        <div className="max-w-lg text-3xl font-bold leading-[60px] tracking-wide text-white md:max-w-3xl md:text-7xl">
          <span className="text-tidebitTheme">Trusted</span> platform for Crypto investment
        </div>
        <div className="mt-[55px] max-w-md text-[20px] text-lightGray md:max-w-2xl">
          Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with the
          best quality.{' '}
        </div>
        <div className="pt-8">
          <TideButton content={`Get Started`.toUpperCase()} />
        </div>
      </div>
    </section>
  );
};

export default Cta;

import React from 'react';
import Lottie from 'lottie-react';

import runningDog from '../../../public/animation/70560-puli-dog-run.json';

const InterestSection = () => {
  const interestInfo = {
    APY: 1,
    interest30Days: 20,
    cumulativeInterest: 241,
  };

  // const interestContent =

  const interestContentJsx = Object.entries(interestInfo).map(([key, value]) => (
    <div className="mb-6 flex w-full grow justify-center p-4 text-lightGray lg:mx-0 lg:mb-0 lg:w-1/4">
      <div className="h-full w-full space-y-8 text-center lg:text-start">
        <h1 className={`text-lg leading-relaxed xl:text-xl`}>{key}</h1>
        {/* <h2 className={`text-3xl font-medium text-white xl:text-4xl`}>content</h2> */}
        <p
          className={`leading-relaxed text-lightWhite xl:text-xl ${
            key === 'APY' ? 'text-4xl' : 'pt-3 text-base'
          }`}
        >
          <span className="text-4xl text-tidebitTheme">{value}</span>&nbsp;
          {key === 'APY' ? '%' : 'USDT'}
        </p>
      </div>
    </div>
  ));

  return (
    <div className=" bg-darkGray4">
      <h1 className="flex justify-center pt-8 text-2xl">Earning Interest</h1>

      <div className="mx-20 pb-16 xl:mx-40">
        <div className="mb-6 flex w-full flex-nowrap justify-center space-y-10 text-lightGray lg:mx-0 lg:mb-0">
          <Lottie className="mx-auto flex w-150px pt-10 lg:hidden" animationData={runningDog} />

          {interestContentJsx}
          {/* <div className="flex flex-wrap">{interestContentJsx}</div> */}

          <Lottie
            className="-mr-10 hidden w-250px pt-2 lg:flex xl:-mr-20"
            animationData={runningDog}
          />
        </div>
      </div>
    </div>
  );
};

export default InterestSection;

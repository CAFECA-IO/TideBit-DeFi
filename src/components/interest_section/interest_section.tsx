import React from 'react';
import Lottie from 'lottie-react';

import runningDog from '../../../public/animation/70560-puli-dog-run.json';
import {useGlobal} from '../../contexts/global_context';

const InterestSection = () => {
  const {layoutAssertion} = useGlobal();
  const interestInfo = {
    APY: 1,
    interest30Days: 20,
    cumulativeInterest: 241,
  };

  // const interestContent =

  const interestContentJsx = Object.entries(interestInfo).map(([key, value]) => (
    <div
      className={`${
        key === 'APY' ? `lg:w-1/10` : `lg:w-1/4`
      } mb-6 hidden w-full justify-center p-4 text-lightGray lg:mx-0 lg:mb-0 lg:flex lg:grow`}
    >
      <div className="h-full w-full space-y-8 text-center lg:text-start">
        <h1 className={`text-center text-lg leading-relaxed xl:text-xl`}>
          {key === 'interest30Days'
            ? 'Interest you earn in 30 days'
            : key === 'cumulativeInterest'
            ? 'Cumulative Interest'
            : key}
        </h1>
        {/* <h2 className={`text-3xl font-medium text-white xl:text-4xl`}>content</h2> */}
        <p
          className={`text-center leading-relaxed text-lightWhite xl:text-xl ${
            key === 'APY' ? 'pt-3 text-lg' : 'pt-3 text-base'
          }`}
        >
          <span className="text-4xl text-tidebitTheme">{value}</span>&nbsp;
          {key === 'APY' ? '%' : 'USDT'}
        </p>
      </div>
    </div>
  ));

  const interestContentJsxMobile = Object.entries(interestInfo).map(([key, value]) => (
    <div className="mt-5 flex w-full justify-center text-lightGray lg:hidden">
      <div className="h-full w-full space-y-5 pt-5 text-center lg:text-start">
        <h1 className={`text-base leading-3 md:leading-relaxed lg:text-lg xl:text-xl`}>
          {key === 'interest30Days'
            ? 'Interest you earn in 30 days'
            : key === 'cumulativeInterest'
            ? 'Cumulative Interest'
            : key}
        </h1>
        {/* <h2 className={`text-3xl font-medium text-white xl:text-4xl`}>content</h2> */}
        <p
          className={`text-sm leading-relaxed text-lightWhite lg:pt-3 lg:text-base xl:text-xl ${
            key === 'APY' ? 'text-lg' : 'text-base'
          }`}
        >
          <span className="text-2xl text-tidebitTheme lg:text-4xl">{value}</span>&nbsp;
          {key === 'APY' ? '%' : 'USDT'}
        </p>
      </div>
    </div>
  ));

  const mobileLayout = (
    <>
      <Lottie className="mx-auto flex w-150px pt-10" animationData={runningDog} />
      {interestContentJsxMobile}
    </>
  );

  const desktopLayout = (
    <div className="mb-6 flex w-full flex-nowrap justify-center space-y-10 text-lightGray lg:mx-0 lg:mb-0">
      <Lottie className="mx-auto flex w-150px pt-10 lg:hidden" animationData={runningDog} />

      {interestContentJsx}
      {/* <div className="flex flex-wrap">{interestContentJsx}</div> */}

      <Lottie className="-mr-10 hidden w-250px pt-2 lg:flex xl:-mr-20" animationData={runningDog} />
    </div>
  );

  return (
    <div className=" bg-darkGray4">
      <h1 className="flex justify-center pt-8 text-2xl">Earning Interest</h1>

      <div className="mx-20 pb-16 xl:mx-40">
        {layoutAssertion === 'mobile' ? <>{mobileLayout}</> : <>{desktopLayout}</>}
      </div>
    </div>
  );
};

export default InterestSection;

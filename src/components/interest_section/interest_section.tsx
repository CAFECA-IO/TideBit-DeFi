import React, {useContext} from 'react';
import Lottie from 'lottie-react';
import {unitAsset} from '../../constants/config';
import {DEFAULT_INTEREST_RATE} from '../../constants/display';
import runningDog from '../../../public/animation/70560-puli-dog-run.json';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'next-i18next';
import {numberFormatted} from '../../lib/common';

type TranslateFunction = (s: string) => string;

const InterestSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const {userAssets} = userCtx;

  /* ToDo: (20230420 - Julian) getUserAssets by currency */
  const interestInfo = {
    APY: userAssets?.interest.apy ?? DEFAULT_INTEREST_RATE,
    interest30Days: numberFormatted(userAssets?.interest.monthly),
    cumulativeInterest: numberFormatted(userAssets?.interest.cumulative),
  };

  const interestContentJsx = Object.entries(interestInfo).map(([key, value]) => (
    <div key={key} className={`justify-center p-4 text-lightGray`}>
      <div className="h-full w-full space-y-4 text-center lg:text-start">
        <h1 className={`text-base text-center lg:text-lg leading-relaxed xl:text-xl`}>
          {key === 'interest30Days'
            ? t('MY_ASSETS_PAGE.INTEREST_SECTION_30_DAYS')
            : key === 'cumulativeInterest'
            ? t('MY_ASSETS_PAGE.INTEREST_SECTION_CUMULATIVE')
            : t('MY_ASSETS_PAGE.INTEREST_SECTION_APY')}
        </h1>
        <p
          className={`text-center lg:pt-3 leading-relaxed text-lightWhite whitespace-nowrap lg:text-base xl:text-xl`}
        >
          <span className="lg:text-4xl text-2xl text-tidebitTheme">{value}</span>
          &nbsp;
          {key === 'APY' ? '%' : unitAsset}
        </p>
      </div>
    </div>
  ));

  return (
    <div className="bg-darkGray4 w-full px-4 lg:px-20 py-16 flex items-center flex-col">
      <h1 className="text-2xl">{t('MY_ASSETS_PAGE.INTEREST_SECTION_TITLE')}</h1>

      <div className="flex w-full lg:flex-row flex-col flex-nowrap items-center justify-center gap-5 text-lightGray">
        <Lottie className="w-150px lg:hidden block mt-5" animationData={runningDog} />

        <div className="flex flex-1 gap-5 lg:flex-row flex-col lg:mt-10 justify-between mx-10">
          {interestContentJsx}
        </div>

        {/* Info: (20231201 - Julian) running dog for desktop */}
        <Lottie className="hidden w-250px lg:block" animationData={runningDog} />
      </div>
    </div>
  );
};

export default InterestSection;

import React, {useContext} from 'react';
import Lottie from 'lottie-react';
import {unitAsset, FRACTION_DIGITS} from '../../constants/config';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import runningDog from '../../../public/animation/70560-puli-dog-run.json';
import {useGlobal} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'react-i18next';

type TranslateFunction = (s: string) => string;

const InterestSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {layoutAssertion} = useGlobal();

  const userCtx = useContext(UserContext);

  /* ToDo: (20230420 - Julian) getMyAssets by currency */
  const interestInfo = {
    APY: userCtx.getMyAssets('')?.interest.apy ?? 0,
    interest30Days:
      userCtx
        .getMyAssets('')
        ?.interest.monthly.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS) ?? 0,
    cumulativeInterest:
      userCtx
        .getMyAssets('')
        ?.interest.cumulative.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS) ?? 0,
  };

  const interestContentJsx = Object.entries(interestInfo).map(([key, value]) => (
    <div
      className={`${
        key === 'APY' ? `lg:w-1/10` : `lg:w-1/4`
      } mb-6 hidden w-full justify-center p-4 text-lightGray lg:mx-0 lg:mb-0 lg:flex lg:grow`}
    >
      <div className="h-full w-full space-y-8 text-center lg:text-start">
        <h1 className={`text-center text-lg leading-relaxed xl:text-xl`}>
          {key === 'interest30Days'
            ? t('MY_ASSETS_PAGE.INTEREST_SECTION_30_DAYS')
            : key === 'cumulativeInterest'
            ? t('MY_ASSETS_PAGE.INTEREST_SECTION_CUMULATIVE')
            : t('MY_ASSETS_PAGE.INTEREST_SECTION_APY')}
        </h1>
        <p
          className={`text-center leading-relaxed text-lightWhite xl:text-xl ${
            key === 'APY' ? 'pt-3 text-lg' : 'pt-3 text-base'
          }`}
        >
          <span className="text-4xl text-tidebitTheme">{value}</span>
          &nbsp;
          {key === 'APY' ? '%' : unitAsset}
        </p>
      </div>
    </div>
  ));

  const interestContentJsxMobile = Object.entries(interestInfo).map(([key, value]) => (
    <div className="mt-5 flex w-full justify-center text-lightGray lg:hidden">
      <div className="h-full w-full space-y-5 pt-5 text-center lg:text-start">
        <h1 className={`text-base leading-3 md:leading-relaxed lg:text-lg xl:text-xl`}>
          {key === 'interest30Days'
            ? t('MY_ASSETS_PAGE.INTEREST_SECTION_30_DAYS')
            : key === 'cumulativeInterest'
            ? t('MY_ASSETS_PAGE.INTEREST_SECTION_CUMULATIVE')
            : t('MY_ASSETS_PAGE.INTEREST_SECTION_APY')}
        </h1>
        <p
          className={`text-sm leading-relaxed text-lightWhite lg:pt-3 lg:text-base xl:text-xl ${
            key === 'APY' ? 'text-lg' : 'text-base'
          }`}
        >
          <span className="text-2xl text-tidebitTheme lg:text-4xl">{value}</span>&nbsp;
          {key === 'APY' ? '%' : unitAsset}
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

      <Lottie className="-mr-10 hidden w-250px pt-2 lg:flex xl:-mr-20" animationData={runningDog} />
    </div>
  );

  return (
    <div className=" bg-darkGray4">
      <h1 className="flex justify-center pt-8 text-2xl">
        {t('MY_ASSETS_PAGE.INTEREST_SECTION_TITLE')}
      </h1>

      <div className="mx-20 pb-16 xl:mx-40">
        {layoutAssertion === 'mobile' ? <>{mobileLayout}</> : <>{desktopLayout}</>}
      </div>
    </div>
  );
};

export default InterestSection;

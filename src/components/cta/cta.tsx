import React from 'react';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const Cta = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

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
            <span className="leading-normal text-tidebitTheme">
              {t('HOME_PAGE.CTA_HIGHLIGHT_TITLE')}
            </span>{' '}
            {t('HOME_PAGE.CTA_REST_TITLE')}
            <div className="mt-10 max-w-160px text-xxs font-normal leading-loose tracking-0.02rem text-lightGray xs:max-w-250px sm:max-w-200px sm:text-xs md:max-w-md md:text-sm lg:mt-14 lg:w-3/5 xl:text-lg 2xl:text-xl">
              {t('HOME_PAGE.CTA_DESCRIPTION')}
            </div>
            <div className="pt-2 md:pt-8 xl:pt-5">
              <Link
                href="/trade/cfd/ethusdt"
                className="px-2 py-1 font-normal xxs:text-xxs sm:py-2 sm:px-5 sm:text-base xl:py-3 xl:px-5 xl:text-lg"
              >
                <TideButton
                  className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0`}
                >
                  {t('HOME_PAGE.CTA_BUTTON')}
                </TideButton>
              </Link>
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
        <div className="mx-5 flex w-fit flex-col items-center justify-center text-center text-2xl font-bold tracking-wide text-white">
          <div className="w-8/10">
            <span className="leading-normal text-tidebitTheme">
              {t('HOME_PAGE.CTA_HIGHLIGHT_TITLE')}
            </span>{' '}
            {t('HOME_PAGE.CTA_REST_TITLE')}
          </div>
          <div className="mx-5 mt-4 max-w-md text-sm font-normal leading-7 tracking-0.02rem text-white md:text-xl">
            {t('HOME_PAGE.CTA_DESCRIPTION')}
          </div>
          <div className="mx-auto pt-4 md:pt-8">
            <Link href="/trade/cfd/ethusdt">
              {/* Todo: (20230328 - Julian) 手機版點不到按鈕 -> 檢查結構 */}
              <TideButton
                className={`mt-4 rounded border-0 bg-tidebitTheme py-3 px-5 text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0`}
              >
                {t('HOME_PAGE.CTA_BUTTON')}
              </TideButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cta;

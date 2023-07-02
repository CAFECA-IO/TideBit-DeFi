import React from 'react';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import Link from 'next/link';
import {CONTACT_EMAIL} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {FiMail, FiBookOpen} from 'react-icons/fi';
import {TBDURL} from '../../constants/api_request';
import version from '../../lib/version';

type TranslateFunction = (s: string) => string;

const Cta = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <>
      {/* Info: Desktop version (width >= 1024 px) (20230628 - Shirley) */}
      <section className="relative hidden w-screen pl-50px lg:flex">
        <Image
          width={2409}
          height={1500}
          className="h-auto max-w-full"
          src="/elements/group_15198@2x.png"
          alt="image description"
        />

        <div className="absolute left-2rem top-3rem flex flex-col justify-start xxs:left-4rem xxs:top-4rem xs:left-5rem xs:top-5rem sm:left-6rem sm:top-7rem md:left-5rem md:top-9rem lg:top-11rem xl:top-13rem 2xl:top-15rem 3xl:left-8rem 3xl:top-20rem">
          <div className="max-w-200px text-lg font-bold tracking-wide text-white xs:text-2xl sm:max-w-350px sm:text-3xl md:max-w-sm md:text-4xl lg:max-w-lg lg:text-5xl xl:max-w-xl xl:text-6xl 2xl:max-w-2xl 2xl:text-7xl">
            <span className="leading-normal text-tidebitTheme">
              {t('HOME_PAGE.CTA_HIGHLIGHT_TITLE')}
            </span>{' '}
            {t('HOME_PAGE.CTA_REST_TITLE')}
            <div className="mt-10 max-w-160px text-xxs font-normal leading-loose tracking-0.02rem text-lightGray xs:max-w-250px sm:max-w-200px sm:text-xs md:max-w-md md:text-sm lg:mt-14 lg:w-3/5 xl:text-lg 2xl:text-xl">
              {t('HOME_PAGE.CTA_DESCRIPTION')}
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <a
                href={t('HOME_PAGE.WHITEPAPER_LINK')}
                download
                className={`flex items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
              >
                <p>{t('HOME_PAGE.WHITEPAPER')}</p>
                <FiBookOpen size={20} />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`flex items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
              >
                <p>{CONTACT_EMAIL}</p>
                <FiMail size={20} />
              </a>
            </div>
            <div className="pt-2 md:pt-8 xl:pt-5">
              <Link href={TBDURL.TRADE}>
                <TideButton
                  className={`mt-4 rounded border-0 bg-tidebitTheme px-5 py-2 text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0`}
                >
                  {t('HOME_PAGE.CTA_BUTTON')}
                </TideButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info: Mobile version (width < 1024 px) (20230628 - Shirley) */}
      <div className="w-full lg:hidden">
        <div className="mb-10 flex justify-center">
          <Image src="/elements/nav_logo.svg" height={50} width={150} alt="TideBit_logo" />
        </div>
        <p className="-mt-20 mb-20 flex justify-end pr-1/11 text-end text-xs text-lightGray">
          v {version}
        </p>
      </div>

      <section className="mb-1/10 flex flex-col items-center justify-center lg:hidden">
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
          <div className="flex flex-col items-center space-y-4 pt-4">
            <a
              href={t('HOME_PAGE.WHITEPAPER_LINK')}
              className={`flex items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
            >
              <p>{t('HOME_PAGE.WHITEPAPER')}</p>
              <FiBookOpen size={20} />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`flex items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
            >
              <p>{CONTACT_EMAIL}</p>
              <FiMail size={20} />
            </a>
          </div>
          <div className="mx-auto pt-4 md:pt-8">
            <Link href={TBDURL.TRADE}>
              <TideButton
                className={`mt-4 rounded border-0 bg-tidebitTheme px-5 py-3 text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0`}
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

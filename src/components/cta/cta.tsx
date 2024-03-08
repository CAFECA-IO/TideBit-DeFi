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
      {/* Info: Mobile version (width < 1024 px) (20230628 - Shirley) */}
      <div className="mb-20 flex flex-col justify-center items-center lg:hidden">
        <Image src="/elements/nav_logo.svg" height={50} width={150} alt="TideBit_logo" />
        <p className="-mt-2 ml-90px text-center text-xs text-lightGray">v {version}</p>
      </div>

      {/* Info: Desktop version (width >= 1024 px) (20230628 - Shirley) */}
      <section className="relative flex-col lg:flex-row w-full lg:justify-start justify-center max-w-1920px flex lg:h-750px lg:px-1/20">
        {/* Info: (20231207 - Julian) Image for desktop */}
        <Image
          width={2409}
          height={1500}
          className="lg:block hidden absolute"
          src="/elements/group_15198@2x.png"
          alt="candlestick chart view"
        />
        {/* Info: (20231207 - Julian) Image for mobile */}
        <Image
          className="block lg:hidden mx-auto"
          alt="candlestick chart view"
          src="/elements/group_15215@2x.png"
          width={596}
          height={545}
        />

        <div className="flex flex-col justify-start px-8 lg:py-1/6 z-10">
          <div className="flex flex-col items-center text-center lg:text-left lg:items-start space-y-4 lg:space-y-8 lg:w-3/5">
            {/* Info: (20231207 - Julian) Main Title */}
            <h1 className="font-bold tracking-wide text-2xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              <span className="leading-normal text-tidebitTheme">
                {t('HOME_PAGE.CTA_HIGHLIGHT_TITLE')}
              </span>
              {t('HOME_PAGE.CTA_REST_TITLE')}
            </h1>
            {/* Info: (20231207 - Julian) Main Description */}
            <p className="text-sm leading-loose w-full tracking-0.02rem lg:text-lg 2xl:text-xl lg:w-4/5">
              {t('HOME_PAGE.CTA_DESCRIPTION')}
            </p>
            {/* Info: (20231207 - Julian) Buttons */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <a
                id="WhitepaperLink"
                href={t('HOME_PAGE.WHITEPAPER_LINK')}
                download
                className={`flex items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
              >
                <p>{t('HOME_PAGE.WHITEPAPER')}</p>
                <FiBookOpen size={20} />
              </a>
              <a
                id="ContactEmailButton"
                href={`mailto:${CONTACT_EMAIL}`}
                className={`flex items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
              >
                <p>{CONTACT_EMAIL}</p>
                <FiMail size={20} />
              </a>
            </div>
            {/* Info: (20231207 - Julian) Start Trading Button */}
            <div className="pt-4">
              <Link href={TBDURL.TRADE}>
                <TideButton
                  id="StartTradingButton"
                  className={`rounded bg-tidebitTheme px-5 py-2 text-base text-white transition-all duration-300 hover:bg-cyan-600`}
                >
                  {t('HOME_PAGE.CTA_BUTTON')}
                </TideButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cta;

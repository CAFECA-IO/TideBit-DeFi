import Image from 'next/image';
import React from 'react';
import {useTranslation} from 'next-i18next';
import {useGlobal} from '../../contexts/global_context';
import {LayoutAssertion} from '../../constants/layout_assertion';
import useCheckLink from '../../lib/hooks/use_check_link';
import {I_SUN_ONE_LINK} from '../../constants/config';

type TranslateFunction = (s: string) => string;

const Banner = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {layoutAssertion} = useGlobal();
  const iSunOneIconSize = layoutAssertion === LayoutAssertion.MOBILE ? 35 : 50;
  const shrink = 0.7;

  const iSunOneLink = useCheckLink(I_SUN_ONE_LINK, I_SUN_ONE_LINK);

  return (
    <>
      <div className="">
        <section className="w-full">
          <div
            className="hidden w-screen lg:flex flex-col items-start pt-5 xl:pt-20 lg:pt-10 pl-1/4 md:pl-2/5 xl:pl-1/2 bg-iSunOneBg bg-center bg-no-repeat bg-cover"
            style={{
              height: `${layoutAssertion === LayoutAssertion.MOBILE ? '200px' : '356px'}`,
            }}
          >
            <p className="text-white text-2xl md:text-4xl lg:text-5.5xl font-bold tracking-normal">
              {t('HOME_PAGE.ISUNONE_PROMOTION_TITLE_1')}{' '}
              <span className="text-lightGreen6">USDT</span>
              <span className="text-lg lg:text-4xl mx-2">&</span>
              <span className="text-lightBlue mr-2">USDC</span>
              {t('HOME_PAGE.ISUNONE_PROMOTION_TITLE_2')}
            </p>
            <div className="pt-5 lg:pt-12 group">
              <a
                className="flex text-center items-center tracking-wider"
                href={iSunOneLink}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={`/elements/isunone_logo.svg`}
                  width={iSunOneIconSize}
                  height={iSunOneIconSize}
                  alt="isunone logo"
                />
                <p className="ml-3 mr-2 text-white text-lg md:text-2xl lg:text-4xl font-bold group-hover:text-lightYellow3 transition-all duration-300">
                  {t('HOME_PAGE.ISUNONE_PROMOTION_DESCRIPTION')}
                </p>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={iSunOneIconSize * shrink}
                    height={iSunOneIconSize * shrink}
                    fill="none"
                    viewBox="0 0 30 31"
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  >
                    <g clipPath="url(#clip0_9_1330)">
                      <g>
                        <path
                          className="fill-current text-white group-hover:text-yellow-400 transition-colors duration-300"
                          d="M25.896 16.357a1.875 1.875 0 000-2.65l-7.07-7.074a1.875 1.875 0 10-2.652 2.652l3.87 3.872H5.625a1.875 1.875 0 100 3.75h14.419l-3.87 3.87a1.875 1.875 0 002.652 2.652l7.07-7.072z"
                        ></path>
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_9_1330">
                        <path
                          fill="#fff"
                          d="M0 0H30V30H0z"
                          transform="rotate(90 14.984 15.016)"
                        ></path>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          <div className="relative h-120vh md:h-200vh w-screen flex items-center justify-center lg:hidden bg-center bg-no-repeat bg-iSunOneBgMobile bg-contain">
            <div className="flex flex-col mb-250px xs:mb-2/3 sm:mb-2/3 items-center w-full z-20">
              <p className="text-white text-2xl xs:text-3xl sm:text-4xl font-bold tracking-normal">
                {t('HOME_PAGE.ISUNONE_PROMOTION_TITLE_1')}{' '}
                <span className="text-lightGreen6">USDT</span>
                <span className="mx-2">&</span>
                <span className="text-lightBlue mr-2">USDC</span>
                {t('HOME_PAGE.ISUNONE_PROMOTION_TITLE_2')}
              </p>
              <div className="pt-5 sm:pt-12 group">
                <a
                  className="flex text-center items-center tracking-wider"
                  href={iSunOneLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={`/elements/isunone_logo.svg`}
                    width={iSunOneIconSize}
                    height={iSunOneIconSize}
                    alt="isunone logo"
                  />
                  <p className="ml-3 mr-2 text-white text-base xs:text-2xl sm:text-3xl font-bold group-hover:text-lightYellow3 transition-all duration-300">
                    {t('HOME_PAGE.ISUNONE_PROMOTION_DESCRIPTION')}
                  </p>
                  <div className="">
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={iSunOneIconSize * shrink}
                        height={iSunOneIconSize * shrink}
                        fill="none"
                        viewBox="0 0 30 31"
                        className="transition-transform duration-300 group-hover:translate-x-2"
                      >
                        <g clipPath="url(#clip0_9_1330)">
                          <g>
                            <path
                              className="fill-current text-white group-hover:text-yellow-400 transition-colors duration-300"
                              d="M25.896 16.357a1.875 1.875 0 000-2.65l-7.07-7.074a1.875 1.875 0 10-2.652 2.652l3.87 3.872H5.625a1.875 1.875 0 100 3.75h14.419l-3.87 3.87a1.875 1.875 0 002.652 2.652l7.07-7.072z"
                            ></path>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_9_1330">
                            <path
                              fill="#fff"
                              d="M0 0H30V30H0z"
                              transform="rotate(90 14.984 15.016)"
                            ></path>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Banner;

import Image from 'next/image';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useGlobal} from '../../contexts/global_context';
import {LayoutAssertion} from '../../constants/layout_assertion';

// mx-auto flex flex-col items-center justify-center px-5 py-24
// pb-[600px]
// FIXME: remove `contain={true}` in Image components

type TranslateFunction = (s: string) => string;
const Banner = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {layoutAssertion} = useGlobal();
  const iSunOneIconSize = layoutAssertion === LayoutAssertion.MOBILE ? 35 : 50;
  const shrink = 0.7;

  return (
    <>
      {/* Info: (20230815 - Shirley) Desktop version (width >= 1024 px) */}

      <div className="">
        <section className="">
          <div
            className="w-full flex flex-col items-center pt-5 lg:pt-10 pl-1/4 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: 'url(/elements/isunone_banner_bg@2x.png)',
              height: `${layoutAssertion === LayoutAssertion.MOBILE ? '200px' : '356px'}`,
            }}
          >
            <p className="text-white text-2xl md:text-4xl lg:text-6xl font-bold tracking-normal">
              {t('HOME_PAGE.ISUNONE_PROMOTION_TITLE_1')}{' '}
              <span className="text-lightGreen6">USDT</span>
              <span className="text-lg lg:text-4xl mx-2">&</span>
              <span className="text-lightBlue mr-2">USDC</span>
              {t('HOME_PAGE.ISUNONE_PROMOTION_TITLE_2')}
            </p>
            <div className="pt-5 lg:pt-12 group">
              <a
                className="flex text-center items-center tracking-wider"
                href="https://www.isun1.com/"
                target="_blank"
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
        </section>
      </div>

      {/* Info: (20230815 - Shirley) Mobile version (width < 1024 px) */}
      {/* <section className="lg:hidden">
        {' '}
        <div
          className="w-screen flex flex-col items-center pt-10 pl-1/4 bg-black bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: 'url(/elements/isunone_banner_bg@2x.png)',
            height: '256px',
          }}
        >
          <p className="text-white text-4xl font-bold tracking-normal">
            Pay with <span className="text-lightGreen6">USDT</span>
            <span className="text-4xl mx-2">&</span>
            <span className="text-lightBlue">USDC</span>
          </p>
          <div className="pt-12 group">
            <a
              className="flex text-center text-2xl items-center tracking-wider"
              href="https://www.isun1.com/"
              target="_blank"
            >
              <Image
                src={`/elements/isunone_logo.svg`}
                width={iSunOneIconSize}
                height={iSunOneIconSize}
                alt="isunone logo"
              />
              <p className="ml-3 mr-2 text-white text-2xl font-bold group-hover:text-lightYellow3 transition-all duration-300">
                iSunOne Visa Card
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
      </section> */}
    </>
  );
};

export default Banner;

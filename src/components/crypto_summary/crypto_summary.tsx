import React, {useContext} from 'react';
import {BiLinkAlt} from 'react-icons/bi';
import {MarketContext} from '../../contexts/market_context';
import {useTranslation} from 'react-i18next';

type TranslateFunction = (s: string) => string;
interface ICryptoSummary {
  icon: string;
  label: string;
  introduction: string;
  whitePaperLink: string;
  websiteLink: string;

  price: string;
  rank: number;
  publishTime: string;
  publishAmount: string;
  tradingVolume: string;
  totalValue: string;
  tradingValue: string;
}

const CryptoSummary = ({
  icon,
  label,
  introduction,
  whitePaperLink,
  websiteLink,
  price,
  rank,
  publishTime,
  publishAmount,
  tradingVolume,
  totalValue,
  tradingValue,
}: ICryptoSummary) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';

  const cryptoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43">
      <g data-name="Group 2330">
        <circle cx="21.5" cy="21.5" r="21.5" fill="#627eea" data-name="Ellipse 12"></circle>
        <g data-name="Group 2325" transform="translate(12.198 5.422)">
          <path
            fill="rgba(255,255,255,0.6)"
            d="M226.9 67.826v12.021l10.161 4.541z"
            data-name="Path 25757"
            transform="translate(-216.741 -67.826)"
          ></path>
          <path
            fill="#fff"
            d="M219.81 67.826l-10.162 16.562 10.162-4.541z"
            data-name="Path 25758"
            transform="translate(-209.648 -67.826)"
          ></path>
          <path
            fill="rgba(255,255,255,0.6)"
            d="M226.9 105.059v8.169l10.171-14.068z"
            data-name="Path 25759"
            transform="translate(-216.741 -80.706)"
          ></path>
          <path
            fill="#fff"
            d="M219.81 113.227v-8.17l-10.162-5.9z"
            data-name="Path 25760"
            transform="translate(-209.648 -80.706)"
          ></path>
          <path
            fill="rgba(255,255,255,0.2)"
            d="M226.9 98.68l10.161-5.9-10.161-4.537z"
            data-name="Path 25761"
            transform="translate(-216.741 -76.219)"
          ></path>
          <path
            fill="rgba(255,255,255,0.6)"
            d="M209.648 92.781l10.162 5.9V88.243z"
            data-name="Path 25762"
            transform="translate(-209.648 -76.219)"
          ></path>
        </g>
      </g>
    </svg>
  );

  return (
    <>
      <div style={{width: '97%'}} className="flex-col justify-start">
        {' '}
        <h1 className="pr-12 text-start text-xl text-lightWhite">
          {t('TRADE_PAGE.CRYPTO_SUMMARY_TITLE')}
        </h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
        <div className={`${overallWidth}`}>
          <section className="">
            <div className="mx-auto flex flex-wrap pb-5">
              {/* Left side */}
              <div className="mb-0 border-b border-white/30 pb-10 lg:mb-0 lg:w-1/2 lg:border-r-2 lg:border-b-0 lg:py-0 lg:pr-12">
                {/* Icon and name */}
                <div className="flex items-center space-x-3 text-center">
                  {/* <div className="">{cryptoIcon}</div> */}
                  <span className="relative h-40px w-40px">
                    <img src={icon} alt={label} />
                  </span>
                  <h1 className="text-lg font-medium text-white">{label}</h1>
                </div>

                <p className="pt-2 text-sm leading-relaxed text-lightGray5">{introduction}</p>

                {/* Links */}
                <div className="mt-5 flex space-x-2">
                  <div
                    className={`flex w-120px flex-row items-center justify-center rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite`}
                  >
                    <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_WHITEPAPER')}</p>
                    <a href={whitePaperLink} className="pl-2">
                      <BiLinkAlt size={20} />
                    </a>
                  </div>

                  <div
                    className={`flex w-100px flex-row items-center justify-center rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite`}
                  >
                    <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_WEBSITE')}</p>
                    <a href={websiteLink} className="pl-2">
                      <BiLinkAlt size={20} />
                    </a>
                  </div>
                </div>

                {/* <a className="mt-4 inline-flex items-center text-blue-400">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a> */}
              </div>

              {/* Right side */}
              <div className="mt-4 flex w-full flex-col justify-start lg:w-1/2 lg:pl-12">
                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_PRICE')}</p>
                  <p>{price}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_RANK')}</p>
                  <p>{rank}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_PUBLISH_TIME')}</p>
                  <p>{publishTime}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_PUBLISH_AMOUNT')}</p>
                  <p>{publishAmount}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_TRADING_VOLUME')}</p>
                  <p>{tradingVolume}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_TOTAL_VALUE')}</p>
                  <p>{totalValue}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_TRADING_VALUE')}</p>
                  <p>{tradingValue}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CryptoSummary;

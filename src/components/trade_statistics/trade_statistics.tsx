import React from 'react';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {FRACTION_DIGITS} from '../../constants/config';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface ITradeStatistics {
  bullAndBearIndex: number;
  long: number;
  short: number;
  fiveMin: {low: number; high: number; now: string};
  sixtyMin: {low: number; high: number; now: string};
  oneDay: {low: number; high: number; now: string};
}

const TradeStatistics = ({
  bullAndBearIndex,
  long,
  short,
  fiveMin,
  sixtyMin,
  oneDay,
}: ITradeStatistics) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';
  // const displayedBBI = `w-${bullAndBearIndex}`;

  // const fiveMinNow = `ml-${fiveMin.now} -mb-4`;
  // const sixtyMinNow = `ml-${sixtyMin.now} -mb-4`;
  // const oneDayNow = `ml-${oneDay.now} -mb-4`;

  // const fiveMinStyle = {
  //   '@media (minWidth: 1024px)': {marginLeft: `${fiveMin.now}rem`},
  //   '@media (minWidth: 700px)': {marginLeft: `${Number(fiveMin.now) / 2}rem`},
  // };

  // console.log('oneDay', oneDay);

  const nowPointer = (
    <div className="">
      <svg xmlns="http://www.w3.org/2000/svg" width="33" height="31" viewBox="0 0 33 31">
        <defs>
          <filter id="Polygon_17" width="33" height="31" x="0" y="0" filterUnits="userSpaceOnUse">
            <feOffset dy="3"></feOffset>
            <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
            <feFlood floodOpacity="0.502"></feFlood>
            <feComposite in2="blur" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
        </defs>
        <g filter="url(#Polygon_17)">
          <path
            fill="#f2f2f2"
            d="M7.5 0L15 13H0z"
            data-name="Polygon 17"
            transform="rotate(180 12 9.5)"
          ></path>
        </g>
      </svg>
    </div>
  );

  return (
    <>
      <div className="flex-col justify-start">
        <h1 className="text-start text-xl text-lightWhite">
          {t('TRADE_PAGE.TRADE_STATISTICS_LIVE_STATISTICS')}
        </h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>

        {/* ----------Sellers vs. Buyers---------- */}
        <p className="mb-3 text-base text-lightGray">
          {t('TRADE_PAGE.TRADE_STATISTICS_TRADERS_SENTIMENT')}
        </p>
        <div className={`${overallWidth}`}>
          {/* Text */}
          <div className="flex w-full justify-between">
            <p className="text-sm text-lightRed">
              {short}% {t('TRADE_PAGE.TRADE_STATISTICS_SELLERS')}
            </p>
            <p className="text-sm text-lightGreen5">
              {long}% {t('TRADE_PAGE.TRADE_STATISTICS_BUYERS')}
            </p>
          </div>
          {/* Bar */}
          <div className={`relative mb-4 h-2 w-full rounded-full bg-lightGreen5`}>
            <div
              className={`absolute left-0 top-0 h-2 rounded-l bg-lightRed`}
              style={{width: `${100 - bullAndBearIndex}%`}}
            ></div>
          </div>
        </div>

        {/* ----------High and Low vs. Now---------- */}
        <p className="mb-3 text-base text-lightGray">
          {t('TRADE_PAGE.TRADE_STATISTICS_HIGH_AND_LOW')}
        </p>
        <div className={`${overallWidth}`}>
          {/* Text */}
          <div className="-mb-2 flex w-full justify-between">
            <p className="text-sm text-lightWhite">{t('TRADE_PAGE.TRADE_STATISTICS_LOW')}</p>
            <p className="text-sm text-lightWhite">{t('TRADE_PAGE.TRADE_STATISTICS_HIGH')}</p>
          </div>

          {/* [5 min] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4`} style={{marginLeft: `${fiveMin.now}%`}}>
                {nowPointer}
              </div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">
                {fiveMin.low.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
              </p>
              <p className="text-sm text-lightWhite">
                {t('TRADE_PAGE.TRADE_STATISTICS_5_MINUTES')}
              </p>
              <p className="text-sm text-lightWhite">
                {fiveMin.high.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
              </p>
            </div>
          </div>

          {/* [60 min] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4`} style={{marginLeft: `${sixtyMin.now}%`}}>
                {nowPointer}
              </div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">
                {sixtyMin.low.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
              </p>
              <p className="text-sm text-lightWhite">
                {t('TRADE_PAGE.TRADE_STATISTICS_60_MINUTES')}
              </p>
              <p className="text-sm text-lightWhite">
                {sixtyMin.high.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
              </p>
            </div>
          </div>

          {/* [1 day] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4`} style={{marginLeft: `${oneDay.now}%`}}>
                {nowPointer}
              </div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">
                {oneDay.low.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
              </p>
              <p className="text-sm text-lightWhite">{t('TRADE_PAGE.TRADE_STATISTICS_1_DAY')}</p>
              <p className="text-sm text-lightWhite">
                {oneDay.high.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeStatistics;

import {useTranslation} from 'next-i18next';
import {numberFormatted} from '../../lib/common';
import React from 'react';

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

        {/* ----------Info: (20231013 - Shirley) Sellers vs. Buyers---------- */}
        <p className="mb-3 text-base text-lightGray">
          {t('TRADE_PAGE.TRADE_STATISTICS_TRADERS_SENTIMENT')}
        </p>
        <div className={`${overallWidth}`}>
          {/* Info: (20231013 - Shirley) Text */}
          <div className="flex w-full justify-between">
            <p className="text-sm text-lightRed">
              {short}% {t('TRADE_PAGE.TRADE_STATISTICS_SELLERS')}
            </p>
            <p className="text-sm text-lightGreen5">
              {long}% {t('TRADE_PAGE.TRADE_STATISTICS_BUYERS')}
            </p>
          </div>
          {/* Info: (20231013 - Shirley) Bar */}
          <div className={`relative mb-4 h-2 w-full rounded-full bg-lightGreen5`}>
            <div
              className={`absolute left-0 top-0 h-2 rounded-l bg-lightRed`}
              style={{width: `${100 - bullAndBearIndex}%`}}
            ></div>
          </div>
        </div>

        {/* ----------Info: (20231013 - Shirley) High and Low vs. Now---------- */}
        <p className="mb-3 text-base text-lightGray">
          {t('TRADE_PAGE.TRADE_STATISTICS_HIGH_AND_LOW')}
        </p>
        <div className={`${overallWidth}`}>
          {/* Info: (20231013 - Shirley) Text */}
          <div className="-mb-2 flex w-full justify-between">
            <p className="text-sm text-lightWhite">{t('TRADE_PAGE.TRADE_STATISTICS_LOW')}</p>
            <p className="text-sm text-lightWhite">{t('TRADE_PAGE.TRADE_STATISTICS_HIGH')}</p>
          </div>

          {/* Info: (20231013 - Shirley) [5 min] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4`} style={{marginLeft: `${fiveMin.now}%`}}>
                {nowPointer}
              </div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">{numberFormatted(fiveMin.low)}</p>
              <p className="text-sm text-lightWhite">
                {t('TRADE_PAGE.TRADE_STATISTICS_5_MINUTES')}
              </p>
              <p className="text-sm text-lightWhite">{numberFormatted(fiveMin.high)}</p>
            </div>
          </div>

          {/* Info: (20231013 - Shirley) [60 min] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4`} style={{marginLeft: `${sixtyMin.now}%`}}>
                {nowPointer}
              </div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">{numberFormatted(sixtyMin.low)}</p>
              <p className="text-sm text-lightWhite">
                {t('TRADE_PAGE.TRADE_STATISTICS_60_MINUTES')}
              </p>
              <p className="text-sm text-lightWhite">{numberFormatted(sixtyMin.high)}</p>
            </div>
          </div>

          {/* Info: (20231013 - Shirley) [1 day] Progress bar and triangle */}
          <div className="mb-3">
            <div>
              <div className={`-mb-4`} style={{marginLeft: `${oneDay.now}%`}}>
                {nowPointer}
              </div>
              <div className={`-z-10 mb-2 h-2 w-full rounded-full bg-lightGray3`}></div>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm text-lightWhite">{numberFormatted(oneDay.low)}</p>
              <p className="text-sm text-lightWhite">{t('TRADE_PAGE.TRADE_STATISTICS_1_DAY')}</p>
              <p className="text-sm text-lightWhite">{numberFormatted(oneDay.high)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeStatistics;

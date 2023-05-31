import {useContext} from 'react';
import TickerSelectorBox from '../ticker_selector_box/ticker_selector_box';
import {CgSearchLoading} from 'react-icons/cg';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {
  DEFAULT_FLUCTUATION,
  DEFAULT_PRICE_CHANGE,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import {Trend} from '../../constants/trend';
import {useTranslation} from 'next-i18next';
import {FRACTION_DIGITS, unitAsset} from '../../constants/config';

type TranslateFunction = (s: string) => string;

const TradingHeader = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);

  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const tickerBoxClickHandler = () => {
    setTickerBoxVisible(!tickerBoxVisible);
  };

  const priceShadowColor =
    marketCtx.selectedTicker?.upOrDown === Trend.UP ? 'priceUpShadow' : 'priceDownShadow';

  const priceChange = Math.abs(
    marketCtx.selectedTicker?.priceChange ?? DEFAULT_PRICE_CHANGE
  ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);

  const priceChangePercentage = Math.abs(
    marketCtx.selectedTicker?.fluctuating ?? DEFAULT_FLUCTUATION
  ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);

  const tickerTitle = (
    <h1 className="text-3xl font-medium">{marketCtx.selectedTicker?.currency}</h1>
  );

  const tickerHeader = (
    <>
      <div className="flex flex-col items-center justify-center space-y-5 text-start text-white lg:items-start lg:justify-start">
        {/* Ticker */}
        <div className="flex w-200px items-center space-x-3 text-center">
          <button
            type="button"
            className="flex items-center space-x-3 text-center hover:cursor-pointer"
            onClick={tickerBoxClickHandler}
          >
            <span className="relative h-40px w-40px">
              <img
                src={marketCtx.selectedTicker?.tokenImg}
                alt={marketCtx.selectedTicker?.currency}
              />
            </span>
            {tickerTitle}

            <div className="pl-0 hover:cursor-pointer">
              <CgSearchLoading size={35} />
            </div>
          </button>
        </div>

        <div
          className={`${priceShadowColor} flex w-200px flex-wrap items-start space-x-7 text-center lg:w-400px lg:items-end lg:text-start`}
        >
          <div className="text-3xl">
            <span className="">
              ₮{' '}
              {marketCtx.selectedTicker?.price.toLocaleString(
                UNIVERSAL_NUMBER_FORMAT_LOCALE,
                FRACTION_DIGITS
              )}
            </span>
          </div>
          <div className="text-lg">{`${
            marketCtx.selectedTicker?.upOrDown === Trend.UP ? '▴' : '▾'
          } ${priceChange} (${priceChangePercentage}%)`}</div>
        </div>

        {/* Trading volume */}
        <div className="relative">
          <div className="absolute -right-48 top-10 w-300px text-sm text-lightWhite/60 lg:left-0">
            {t('TRADE_PAGE.TRADING_VIEW_24H_VOLUME')}{' '}
            {Number(marketCtx.selectedTicker?.tradingVolume).toLocaleString(
              UNIVERSAL_NUMBER_FORMAT_LOCALE,
              FRACTION_DIGITS
            )}{' '}
            {unitAsset}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {tickerHeader}
      <TickerSelectorBox
        tickerSelectorBoxRef={tickerBoxRef}
        tickerSelectorBoxVisible={tickerBoxVisible}
        tickerSelectorBoxClickHandler={tickerBoxClickHandler}
      />
    </div>
  );
};

export default TradingHeader;

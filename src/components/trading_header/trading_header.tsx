import React, {useContext} from 'react';
import TickerSelectorBox from '../ticker_selector_box/ticker_selector_box';
import {CgSearchLoading} from 'react-icons/cg';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {DEFAULT_FLUCTUATION, DEFAULT_ICON, DEFAULT_PRICE_CHANGE} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import {Trend} from '../../constants/trend';
import {useTranslation} from 'next-i18next';
import {DEFAULT_CRYPTO, unitAsset} from '../../constants/config';
import {LayoutAssertion} from '../../constants/layout_assertion';
import {useGlobal} from '../../contexts/global_context';
import {numberFormatted} from '../../lib/common';
import Image from 'next/image';
import {TickerContext} from '../../contexts/ticker_context';

type TranslateFunction = (s: string) => string;

const TradingHeader = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);
  const tickerCtx = useContext(TickerContext);
  const globalCtx = useGlobal();

  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const tickerBoxClickHandler = () => {
    setTickerBoxVisible(!tickerBoxVisible);
  };

  const priceShadowColor =
    tickerCtx.selectedTicker?.upOrDown === Trend.UP ? 'priceUpShadow' : 'priceDownShadow';

  const priceChange = numberFormatted(
    Math.abs(tickerCtx.selectedTicker?.priceChange ?? DEFAULT_PRICE_CHANGE)
  );

  const priceChangePercentage = numberFormatted(
    Math.abs(tickerCtx.selectedTicker?.fluctuating ?? DEFAULT_FLUCTUATION)
  );

  const tickerTitle = (
    <h1 className="text-3xl font-medium">{marketCtx.selectedTickerProperty?.currency}</h1>
  );

  const tickerHeaderDesktop = (
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
              <Image
                src={marketCtx.selectedTickerProperty?.tokenImg ?? DEFAULT_ICON}
                alt={marketCtx.selectedTickerProperty?.currency ?? DEFAULT_CRYPTO}
                width={40}
                height={40}
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
            <span className="">₮ {numberFormatted(tickerCtx.selectedTicker?.price)}</span>
          </div>
          <div className="text-lg">{`${
            tickerCtx.selectedTicker?.upOrDown === Trend.UP ? '▴' : '▾'
          } ${priceChange} (${priceChangePercentage}%)`}</div>
        </div>

        {/* Trading volume */}
        <div className="relative">
          <div className="absolute -right-48 top-5 w-300px text-sm text-lightWhite/60 lg:left-0">
            {t('TRADE_PAGE.TRADING_VIEW_24H_VOLUME')}{' '}
            {numberFormatted(tickerCtx.selectedTicker?.tradingVolume)} {unitAsset}
          </div>
        </div>
      </div>
    </>
  );

  const tickerHeaderMobile = (
    <>
      <div className="flex w-9/10 flex-col items-center justify-center space-y-5 text-start text-white">
        {/* Ticker */}
        <div className="flex items-center space-x-3 text-center">
          <button
            type="button"
            className="flex items-center space-x-3 text-center hover:cursor-pointer"
            onClick={tickerBoxClickHandler}
          >
            <span className="relative h-40px w-40px">
              {/* ToDo (20230419 - Julian) default currency icon */}
              <Image
                src={marketCtx.selectedTickerProperty?.tokenImg ?? DEFAULT_ICON}
                alt={marketCtx.selectedTickerProperty?.currency ?? DEFAULT_CRYPTO}
                width={40}
                height={40}
              />
            </span>
            {tickerTitle}

            <div className="pl-0 hover:cursor-pointer">
              <CgSearchLoading size={35} />
            </div>
          </button>
        </div>

        {/* Price and fluctuation percentage */}
        {/* border-spacing-1 border-2 border-cyan-400  */}
        {/*  bg-gradient-to-r from-lightGreen to-purple-800 bg-clip-text text-transparent */}
        <div className={`${priceShadowColor} flex flex-col items-center space-x-7 text-center`}>
          <div className="text-3xl">
            <span className="">₮ {numberFormatted(tickerCtx.selectedTicker?.price)}</span>
          </div>
          <div className="text-lg">{`${
            tickerCtx.selectedTicker?.upOrDown === Trend.UP ? '▴' : '▾'
          } ${priceChange} (${priceChangePercentage}%)`}</div>
        </div>
      </div>
    </>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? tickerHeaderMobile : tickerHeaderDesktop;

  return (
    <div>
      {displayedLayout}
      <TickerSelectorBox
        tickerSelectorBoxRef={tickerBoxRef}
        tickerSelectorBoxVisible={tickerBoxVisible}
        tickerSelectorBoxClickHandler={tickerBoxClickHandler}
      />
    </div>
  );
};

export default TradingHeader;

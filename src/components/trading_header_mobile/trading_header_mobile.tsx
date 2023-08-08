import {useContext} from 'react';
import Image from 'next/image';
import {CgSearchLoading} from 'react-icons/cg';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import {Trend} from '../../constants/trend';
import TickerSelectorBoxMobile from '../ticker_selector_box_mobile/ticker_selector_box_mobile';
import {FRACTION_DIGITS} from '../../constants/config';

const TradingHeaderMobile = () => {
  const marketCtx = useContext(MarketContext);
  // if (
  //   marketCtx.selectedTicker?.upOrDown !== Trend.UP &&
  //   marketCtx.selectedTicker?.upOrDown !== Trend.DOWN
  // )
  //   return <></>;

  // const [ticker, setTicker] = useState('ETH/USDT');
  // const [showTickerSelector, setShowTickerSelector] = useState(false);
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const tickerBoxClickHandler = () => {
    setTickerBoxVisible(!tickerBoxVisible);

    // console.log('header clicked', !tickerBoxVisible);
  };

  const priceShadowColor =
    marketCtx.selectedTicker?.upOrDown === Trend.UP ? 'priceUpShadow' : 'priceDownShadow';

  // const displayedTickerBox = showTickerSelector ? <TickerSelectorModal /> : null;

  const priceChange = Math.abs(marketCtx.selectedTicker?.priceChange ?? 0).toLocaleString(
    UNIVERSAL_NUMBER_FORMAT_LOCALE,
    FRACTION_DIGITS
  );

  const priceChangePercentage = Math.abs(marketCtx.selectedTicker?.fluctuating ?? 0).toLocaleString(
    UNIVERSAL_NUMBER_FORMAT_LOCALE,
    FRACTION_DIGITS
  );

  const tickerTitle = (
    <h1 className="text-3xl font-medium">{marketCtx.selectedTicker?.currency}</h1>
  );

  const tickerHeader = (
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
                src={marketCtx.selectedTicker?.tokenImg ?? '/asset_icon/eth.svg'}
                alt={marketCtx.selectedTicker?.currency ?? 'ETH'}
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
      </div>
    </>
  );

  return (
    <div>
      {tickerHeader}
      <TickerSelectorBoxMobile
        tickerSelectorBoxRef={tickerBoxRef}
        tickerSelectorBoxVisible={tickerBoxVisible}
        tickerSelectorBoxClickHandler={tickerBoxClickHandler}
      />
    </div>
  );
};

export default TradingHeaderMobile;

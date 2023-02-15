import {useContext} from 'react';
import TickerSelectorBox from '../ticker_selector_box/ticker_selector_box';
import {CgArrowsExchange} from 'react-icons/cg';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import {Trend} from '../../constants/trend';

interface ITradingHeaderProps {
  upOrDown: string;
  tradingVolume: string | number;
}

const TradingHeader = ({upOrDown, tradingVolume}: ITradingHeaderProps) => {
  const marketCtx = useContext(MarketContext);
  if (
    marketCtx.selectedTicker.upOrDown !== Trend.UP &&
    marketCtx.selectedTicker.upOrDown !== Trend.DOWN
  )
    return <></>;

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
    marketCtx.selectedTicker.upOrDown === Trend.UP ? 'priceUpShadow' : 'priceDownShadow';

  // const displayedTickerBox = showTickerSelector ? <TickerSelectorModal /> : null;

  const ethIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 43 43">
      <g id="Group_2330" data-name="Group 2330" transform="translate(0)">
        <circle
          id="Ellipse_12"
          data-name="Ellipse 12"
          cx="21.5"
          cy="21.5"
          r="21.5"
          transform="translate(0 0)"
          fill="#627eea"
        />
        <g id="Group_2325" data-name="Group 2325" transform="translate(12.198 5.422)">
          <path
            id="Path_25757"
            data-name="Path 25757"
            d="M226.9,67.826V79.847l10.161,4.541Z"
            transform="translate(-216.741 -67.826)"
            fill="rgba(255,255,255,0.6)"
          />
          <path
            id="Path_25758"
            data-name="Path 25758"
            d="M219.81,67.826,209.648,84.388l10.162-4.541Z"
            transform="translate(-209.648 -67.826)"
            fill="#fff"
          />
          <path
            id="Path_25759"
            data-name="Path 25759"
            d="M226.9,105.059v8.169L237.071,99.16Z"
            transform="translate(-216.741 -80.706)"
            fill="rgba(255,255,255,0.6)"
          />
          <path
            id="Path_25760"
            data-name="Path 25760"
            d="M219.81,113.227v-8.17l-10.162-5.9Z"
            transform="translate(-209.648 -80.706)"
            fill="#fff"
          />
          <path
            id="Path_25761"
            data-name="Path 25761"
            d="M226.9,98.68l10.161-5.9L226.9,88.243Z"
            transform="translate(-216.741 -76.219)"
            fill="rgba(255,255,255,0.2)"
          />
          <path
            id="Path_25762"
            data-name="Path 25762"
            d="M209.648,92.781l10.162,5.9V88.243Z"
            transform="translate(-209.648 -76.219)"
            fill="rgba(255,255,255,0.6)"
          />
        </g>
      </g>
    </svg>
  );
  const ethTitle = <h1 className="text-3xl font-medium">{marketCtx.selectedTicker.currency}</h1>;

  const ethHeader = (
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
                src={marketCtx.selectedTicker.tokenImg}
                alt={marketCtx.selectedTicker.currency}
              />
            </span>
            {ethTitle}
          </button>

          <div className="pl-0 hover:cursor-pointer">
            <CgArrowsExchange size={35} />
          </div>
        </div>

        {/* Price and fluctuation percentage */}
        {/* border-spacing-1 border-2 border-cyan-400  */}
        {/*  bg-gradient-to-r from-lightGreen to-purple-800 bg-clip-text text-transparent */}
        <div
          className={`${priceShadowColor} flex w-200px flex-wrap items-start space-x-7 text-center lg:w-400px lg:items-end lg:text-start`}
        >
          <div className="text-3xl">
            <span className="">
              {marketCtx.selectedTicker.price.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </span>
          </div>
          <div className="text-lg">{`${
            marketCtx.selectedTicker.upOrDown === Trend.UP ? '▴' : '▾'
          } $${marketCtx.selectedTicker.priceChange} (${
            marketCtx.selectedTicker.upOrDown === Trend.UP ? '+' : '-'
          }${marketCtx.selectedTicker.fluctuating}%)`}</div>
        </div>

        {/* Trading volume */}
        <div className="relative">
          <div className="absolute -right-48 top-10 w-300px text-sm text-lightWhite/60 lg:left-0">
            24h Volume {marketCtx.selectedTicker.tradingVolume} USDT
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {ethHeader}
      <TickerSelectorBox
        tickerSelectorBoxRef={tickerBoxRef}
        tickerSelectorBoxVisible={tickerBoxVisible}
        tickerSelectorBoxClickHandler={tickerBoxClickHandler}
      />
    </div>
  );
};

export default TradingHeader;

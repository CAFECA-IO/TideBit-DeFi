import {useState} from 'react';
import TickerSelectorModal from '../ticker_selector/ticker_selector';
import {CgArrowsExchange} from 'react-icons/cg';
import useOuterClick from '../../lib/hooks/use_outer_click';

const TradingHeader = () => {
  // const [ticker, setTicker] = useState('ETH/USDT');
  const [showTickerSelector, setShowTickerSelector] = useState(false);
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const tickerBoxClickHandler = () => {
    setTickerBoxVisible(!tickerBoxVisible);
  };

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
  const ethTitle = <h1 className="text-3xl font-medium">ETH</h1>;

  const ethHeader = (
    <>
      <div className="flex flex-col space-y-5">
        {/* Ticker */}
        <div className="flex w-200px items-center space-x-3 text-center">
          <div
            className="flex items-center space-x-3 text-center hover:cursor-pointer"
            onClick={tickerBoxClickHandler}
          >
            {ethIcon}
            {ethTitle}
          </div>

          <div className="pl-0 hover:cursor-pointer">
            {' '}
            <CgArrowsExchange size={35} />
          </div>
        </div>

        {/* Price and fluctuation percentage */}
        {/* border-spacing-1 border-2 border-cyan-400  */}
        {/*  bg-gradient-to-r from-lightGreen to-purple-800 bg-clip-text text-transparent */}
        <div className="flex items-end space-x-7">
          <div className="text-3xl">$ 1,288.4</div>
          <div className="text-lg">▴ $24.7 (+1.14%)</div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {ethHeader}
      <TickerSelectorModal
        tickerSelectorModalRef={tickerBoxRef}
        tickerSelectorModalVisible={tickerBoxVisible}
        tickerSelectorModalClickHandler={tickerBoxClickHandler}
      />
    </div>
  );
};

export default TradingHeader;

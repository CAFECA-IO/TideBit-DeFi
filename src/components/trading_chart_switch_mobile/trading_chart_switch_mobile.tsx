import {useState, useContext, useId} from 'react';
import {
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  TRADING_CHART_SWITCH_BUTTON_SIZE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {MarketContext} from '../../contexts/market_context';
import useWindowSize from '../../lib/hooks/use_window_size';

interface ITradingChartSwitchProps {
  getTradingViewType: (tradingViewState: string) => void;
  getCandlestickOn: (bool: boolean) => void;
  getLineGraphOn: (bool: boolean) => void;

  getTradingViewInterval: (tradingViewInterval: string) => void;
  getDisplayedPositionLabel: (bool: boolean) => void;
}

const TradingChartSwitchMobile = ({
  getTradingViewType,
  getCandlestickOn,
  getLineGraphOn,

  getTradingViewInterval,
  getDisplayedPositionLabel,
}: ITradingChartSwitchProps) => {
  const [activeButton, setActiveButton] = useState('live');

  const [activeChartType, setActiveChartType] = useState('candlestick');
  const {showPositionOnChartHandler} = useContext(MarketContext);

  // Info: Get toggle state and pass to `trading_view` component
  const getDisplayedPositionsState = (bool: boolean) => {
    getDisplayedPositionLabel(bool);
    showPositionOnChartHandler(bool);
  };

  const timeIntervalButtonStyle =
    'mr-1 rounded-sm px-2 md:px-6 transition-all duration-300 text-white';

  const timeIntervalButtonClickedStyle = `text-white bg-tidebitTheme hover:bg-tidebitTheme ${timeIntervalButtonStyle}`;

  // TODO: Refactor to object type (easier to read)
  const liveButtonStyle =
    activeButton === 'live' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const fiveMinButtonStyle =
    activeButton === '5m' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const fifteenMinButtonStyle =
    activeButton === '15m' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const oneHrButtonStyle =
    activeButton === '1h' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const twelveHrButtonStyle =
    activeButton === '12h' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const oneDayButtonStyle =
    activeButton === '1d' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;

  const stickSwitchHandler = () => {
    if (activeChartType === 'candlestick') {
      setActiveChartType('line');
      getLineGraphOn(true);
      getCandlestickOn(false);
      getTradingViewType('line');
    } else {
      setActiveChartType('candlestick');
      getCandlestickOn(true);
      getLineGraphOn(false);
      getTradingViewType('candlestick');
    }
  };

  const liveButtonClickHandler = () => {
    setActiveButton('live');
    getTradingViewInterval('live');
  };

  const fiveMinButtonClickHandler = () => {
    setActiveButton('5m');
    getTradingViewInterval('5m');
  };

  const fifteenMinButtonClickHandler = () => {
    setActiveButton('15m');
    getTradingViewInterval('15m');
  };

  const oneHrButtonClickHandler = () => {
    setActiveButton('1h');
    getTradingViewInterval('1h');
  };

  const twelveHrButtonClickHandler = () => {
    setActiveButton('12h');
    getTradingViewInterval('12h');
  };

  const oneDayButtonClickHandler = () => {
    setActiveButton('1d');
    getTradingViewInterval('1d');
  };

  const stickSwitchButton = (
    <div>
      <button
        onClick={stickSwitchHandler}
        type="button"
        className="rounded-sm bg-darkGray5 p-1 hover:opacity-90"
      >
        {activeChartType === 'candlestick' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={TRADING_CHART_SWITCH_BUTTON_SIZE}
            height={TRADING_CHART_SWITCH_BUTTON_SIZE}
            data-name="Group 2293"
            viewBox="0 0 22.703 30"
          >
            <path
              fill="#29c1e1"
              d="M3.243 25.135V21.08H0V6.486h3.243V.811a.811.811 0 111.621 0v5.675h3.245V21.08H4.864v4.054a.811.811 0 11-1.621 0z"
              data-name="Union 35"
            ></path>
            <path
              fill="#29c1e1"
              d="M3.243 25.135V20.27H0V5.676h3.243V.811a.811.811 0 111.621 0v4.865h3.245V20.27H4.864v4.864a.811.811 0 11-1.621 0z"
              data-name="Union 36"
              transform="translate(14.594 4.054)"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={TRADING_CHART_SWITCH_BUTTON_SIZE}
            height={TRADING_CHART_SWITCH_BUTTON_SIZE}
            viewBox="0 0 31.403 30.697"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0.5"
                x2="0.5"
                y1="0.019"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#29c1e1"></stop>
                <stop offset="1" stopColor="#121214" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <g data-name="Group 15162" transform="translate(-41.294 -205.625)">
              <path
                fill="url(#linear-gradient)"
                d="M-3222 349.957v-5.068l10.292-10.759 11 5.374 8.71-13.075v29.808h-30z"
                data-name="Path 26342"
                transform="translate(3264 -119.915)"
              ></path>
              <path
                fill="none"
                stroke="#29c1e1"
                strokeLinecap="round"
                strokeWidth="1"
                d="M42 225.516l10.038-11.212 10.828 4.934L72 206.322"
                data-name="Path 503"
              ></path>
            </g>
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="flex w-full items-center justify-between space-x-1 md:space-x-5">
        {/* Switch chart types */}
        <div className="flex space-x-2">{stickSwitchButton}</div>

        {/* Diplaying position info toggle */}
        <div className="hidden items-center space-x-5 md:flex">
          <p className="text-lightGray">Positions</p>
          <div className="pt-1">
            {' '}
            <Toggle
              initialToggleState={INITIAL_POSITION_LABEL_DISPLAYED_STATE}
              getToggledState={getDisplayedPositionsState}
            />
          </div>
        </div>

        {/* Switch time interval */}
        <div className="flex w-full justify-between whitespace-nowrap rounded-sm bg-darkGray6 py-2 px-2">
          <button type="button" className={`${liveButtonStyle}`} onClick={liveButtonClickHandler}>
            Live
          </button>
          <button
            type="button"
            className={`${fiveMinButtonStyle}`}
            onClick={fiveMinButtonClickHandler}
          >
            5 m
          </button>
          <button
            type="button"
            className={`${fifteenMinButtonStyle}`}
            onClick={fifteenMinButtonClickHandler}
          >
            15 m
          </button>
          <button type="button" className={`${oneHrButtonStyle}`} onClick={oneHrButtonClickHandler}>
            1 h
          </button>
          <button
            type="button"
            className={`${twelveHrButtonStyle}`}
            onClick={twelveHrButtonClickHandler}
          >
            12 h
          </button>
          <button
            type="button"
            className={`${oneDayButtonStyle}`}
            onClick={oneDayButtonClickHandler}
          >
            1 d
          </button>
        </div>
      </div>
    </>
  );
};

export default TradingChartSwitchMobile;

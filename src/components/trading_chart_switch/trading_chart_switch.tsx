import {useState, useContext, useId} from 'react';
import {
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  TRADING_CHART_SWITCH_BUTTON_SIZE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {MarketContext} from '../../contexts/market_context';
import useWindowSize from '../../lib/hooks/use_window_size';
import {useGlobal} from '../../contexts/global_context';

interface ITradingChartSwitchProps {
  getTradingViewType: (tradingViewState: string) => void;
  getCandlestickOn: (bool: boolean) => void;
  getLineGraphOn: (bool: boolean) => void;

  getTradingViewInterval: (tradingViewInterval: string) => void;
  getDisplayedPositionLabel: (bool: boolean) => void;
}

const DEFAULT_CHART_WIDTH = 900;
const DEFAULT_CHART_HEIGHT = 400;
const MIN_SCREEN_WIDTH = 1024;
const TRADE_TAB_WIDTH = 350;
const SWITCH_HEIGHT = 40;

const getChartSize = () => {
  const windowSize = useWindowSize();
  const defaultChartSize = {width: DEFAULT_CHART_WIDTH, height: DEFAULT_CHART_HEIGHT};
  const chartWidth =
    windowSize.width - TRADE_TAB_WIDTH > MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH
      ? windowSize.width - TRADE_TAB_WIDTH
      : MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH;
  const chartSize = {
    width: chartWidth.toString(),
    height: ((defaultChartSize.height / defaultChartSize.width) * chartWidth).toString(),
  };

  return chartSize;
};

const getSwitchWidth = () => {
  const windowSize = useWindowSize();
  const switchWidth =
    windowSize.width > MIN_SCREEN_WIDTH ? windowSize.width - TRADE_TAB_WIDTH : windowSize.width;

  const switchSize = {
    width: switchWidth.toString(),
    height: SWITCH_HEIGHT.toString(),
  };
  return switchSize;
};

const TradingChartSwitch = ({
  getTradingViewType,
  getCandlestickOn,
  getLineGraphOn,

  getTradingViewInterval,
  getDisplayedPositionLabel,
}: ITradingChartSwitchProps) => {
  const [activeButton, setActiveButton] = useState('live');
  const [candlestickOn, setCandlestickOn] = useState(true);
  const [lineGraphOn, setLineGraphOn] = useState(false);

  // const [activeChartType, setActiveChartType] = useState('candlestick');
  const {showPositionOnChartHandler} = useContext(MarketContext);

  const chartSize = getChartSize();
  const switchSize = getSwitchWidth();

  // Get toggle state and pass to `trading_view` component
  const getDisplayedPositionsState = (bool: boolean) => {
    // console.log('bool:', bool);
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
  const thirtyMinButtonStyle =
    activeButton === '30m' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const oneHrButtonStyle =
    activeButton === '1h' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const fourHrButtonStyle =
    activeButton === '4h' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const twelveHrButtonStyle =
    activeButton === '12h' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const oneDayButtonStyle =
    activeButton === '1d' ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;

  const candlestickClickHandler = () => {
    setCandlestickOn(!candlestickOn);
    getCandlestickOn(!candlestickOn);
    // setActiveChartType('candlestick');
    getTradingViewType('candlestick');
  };

  const lineClickHandler = () => {
    setLineGraphOn(!lineGraphOn);
    getLineGraphOn(!lineGraphOn);
    // setActiveChartType('line');
    getTradingViewType('line');
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

  const thirtyMinButtonClickHandler = () => {
    setActiveButton('30m');
    getTradingViewInterval('30m');
  };

  const oneHrButtonClickHandler = () => {
    setActiveButton('1h');
    getTradingViewInterval('1h');
  };

  const fourHrButtonClickHandler = () => {
    setActiveButton('4h');
    getTradingViewInterval('4h');
  };

  const twelveHrButtonClickHandler = () => {
    setActiveButton('12h');
    getTradingViewInterval('12h');
  };

  const oneDayButtonClickHandler = () => {
    setActiveButton('1d');
    getTradingViewInterval('1d');
  };

  const candlestickChartButton = (
    <div>
      <button
        onClick={candlestickClickHandler}
        type="button"
        className="rounded-sm bg-darkGray5 p-1 hover:opacity-90"
      >
        {candlestickOn ? (
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
            data-name="Group 2293"
            viewBox="0 0 22.703 30"
          >
            <path
              fill="#8b8e91"
              d="M3.243 25.135V21.08H0V6.486h3.243V.811a.811.811 0 111.621 0v5.675h3.245V21.08H4.864v4.054a.811.811 0 11-1.621 0z"
              data-name="Union 35"
            ></path>
            <path
              fill="#8b8e91"
              d="M3.243 25.135V20.27H0V5.676h3.243V.811a.811.811 0 111.621 0v4.865h3.245V20.27H4.864v4.864a.811.811 0 11-1.621 0z"
              data-name="Union 36"
              transform="translate(14.594 4.054)"
            ></path>
          </svg>
        )}
      </button>
    </div>
  );

  const lineGraphChartButton = (
    <div className="hidden md:block">
      <button
        onClick={lineClickHandler}
        type="button"
        className="rounded-sm bg-darkGray5 p-1 hover:opacity-90"
      >
        {lineGraphOn ? (
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
                <stop offset="0" stopColor="#8b8e91"></stop>
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
                stroke="#8b8e91"
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
      <div
        style={{width: `${Number(switchSize.width) - 100}px`}}
        className="flex items-center space-x-1 md:space-x-5 xl:w-full"
      >
        {/* Switch chart types */}
        <div className="flex space-x-2">
          {candlestickChartButton}
          {lineGraphChartButton}
        </div>

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
        <div
          className="flex rounded-sm bg-darkGray6 py-2 px-2"
          style={{
            width: '95%',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
          }}
        >
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
          <button
            type="button"
            className={`${thirtyMinButtonStyle}`}
            onClick={thirtyMinButtonClickHandler}
          >
            30 m
          </button>
          <button type="button" className={`${oneHrButtonStyle}`} onClick={oneHrButtonClickHandler}>
            1 h
          </button>
          <button
            type="button"
            className={`${fourHrButtonStyle}`}
            onClick={fourHrButtonClickHandler}
          >
            4 h
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

export default TradingChartSwitch;

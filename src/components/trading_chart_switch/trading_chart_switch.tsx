import React, {useState, useContext, useEffect} from 'react';
import {
  INITIAL_POSITION_LABEL_DISPLAYED_STATE,
  TRADING_CHART_SWITCH_BUTTON_SIZE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {MarketContext} from '../../contexts/market_context';
import {TimeSpanUnion} from '../../constants/time_span_union';
import useStateRef from 'react-usestateref';
import {CandlestickContext} from '../../contexts/candlestick_context';
import {useRouter} from 'next/router';

interface ITradingChartSwitchProps {
  getTradingViewType: (tradingViewState: string) => void;
  getCandlestickOn: (bool: boolean) => void;
  getLineGraphOn: (bool: boolean) => void;
  getTradingViewInterval: (tradingViewInterval: string) => void;
  getDisplayedPositionLabel: (bool: boolean) => void;
  switchWidth: string;
}

const TradingChartSwitch = ({
  getTradingViewType,
  getCandlestickOn,
  getLineGraphOn,
  getTradingViewInterval,
  getDisplayedPositionLabel,
  switchWidth,
}: ITradingChartSwitchProps) => {
  const marketCtx = useContext(MarketContext);
  const candlestickCtx = useContext(CandlestickContext);
  const [activeButton, setActiveButton] = useState(TimeSpanUnion._1s);
  const [candlestickOn, setCandlestickOn] = useState(true);
  const [lineGraphOn, setLineGraphOn] = useState(true);
  const [activeChartTypeMobile, setActiveChartTypeMobile] = useState('candlestick');
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [disabled, setDisabled, disabledRef] = useStateRef(true);

  const router = useRouter();
  const instId = router.query?.instId as string;
  const ticker = instId?.toUpperCase();

  // Info: disable the time-span buttons when the market is not initialized or the candlestick is loading (20240109 - Shirley)
  useEffect(() => {
    setDisabled(!marketCtx.isInit || candlestickCtx.candlestickIsLoading);
  }, [marketCtx.isInit, candlestickCtx.candlestickIsLoading]);

  // Info: set the active button when the market is changed or the time span is changed (20240109 - Shirley)
  useEffect(() => {
    const handleTickerChange = () => {
      setActiveButton(candlestickCtx.timeSpan);
    };
    handleTickerChange();
  }, [marketCtx.selectedTickerProperty?.instId, candlestickCtx.timeSpan]);

  const getDisplayedPositionsState = (bool: boolean) => {
    getDisplayedPositionLabel(bool);
  };

  const timeIntervalButtonStyle =
    'mr-1 whitespace-nowrap rounded-sm px-2 sm:px-6 lg:px-2 xl:px-6 transition-all duration-300 text-white disabled:text-lightGray disabled:opacity-50';

  const timeIntervalButtonClickedStyle = `text-white bg-tidebitTheme hover:bg-tidebitTheme ${timeIntervalButtonStyle}`;

  const liveButtonStyle =
    activeButton === TimeSpanUnion._1s ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const fiveMinButtonStyle =
    activeButton === TimeSpanUnion._5m ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const fifteenMinButtonStyle =
    activeButton === TimeSpanUnion._15m ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const thirtyMinButtonStyle =
    activeButton === TimeSpanUnion._30m ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const oneHrButtonStyle =
    activeButton === TimeSpanUnion._1h ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const fourHrButtonStyle =
    activeButton === TimeSpanUnion._4h ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const twelveHrButtonStyle =
    activeButton === TimeSpanUnion._12h ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;
  const oneDayButtonStyle =
    activeButton === TimeSpanUnion._1d ? timeIntervalButtonClickedStyle : timeIntervalButtonStyle;

  const stickSwitchHandler = () => {
    if (activeChartTypeMobile === 'candlestick') {
      setActiveChartTypeMobile('line');
      getLineGraphOn(true);
      getCandlestickOn(false);
      getTradingViewType('line');
    } else {
      setActiveChartTypeMobile('candlestick');
      getCandlestickOn(true);
      getLineGraphOn(false);
      getTradingViewType('candlestick');
    }
  };

  const candlestickClickHandler = () => {
    setCandlestickOn(!candlestickOn);
    getCandlestickOn(!candlestickOn);
    getTradingViewType('candlestick');
  };

  const lineClickHandler = () => {
    setLineGraphOn(!lineGraphOn);
    getLineGraphOn(!lineGraphOn);
    getTradingViewType('line');
  };

  const liveButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._1s);
    getTradingViewInterval(TimeSpanUnion._1s);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._1s,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const fiveMinButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._5m);
    getTradingViewInterval(TimeSpanUnion._5m);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._5m,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const fifteenMinButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._15m);
    getTradingViewInterval(TimeSpanUnion._15m);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._15m,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const thirtyMinButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._30m);
    getTradingViewInterval(TimeSpanUnion._30m);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._30m,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const oneHrButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._1h);
    getTradingViewInterval(TimeSpanUnion._1h);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._1h,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const fourHrButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._4h);
    getTradingViewInterval(TimeSpanUnion._4h);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._4h,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const twelveHrButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._12h);
    getTradingViewInterval(TimeSpanUnion._12h);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._12h,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const oneDayButtonClickHandler = () => {
    setActiveButton(TimeSpanUnion._1d);
    getTradingViewInterval(TimeSpanUnion._1d);
    candlestickCtx.selectTimeSpanHandler(
      TimeSpanUnion._1d,
      marketCtx.selectedTickerProperty?.instId ?? ticker
    );
  };

  const candlestickChartButton = (
    <button
      id="CandlestickButton"
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
  );

  const lineGraphChartButton = (
    <button
      id="LineGraphSwitch"
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
  );

  const stickSwitchButton = (
    <button
      id="StickSwitchButton"
      onClick={stickSwitchHandler}
      type="button"
      className="rounded-sm bg-darkGray5 p-1 hover:opacity-90"
    >
      {activeChartTypeMobile === 'candlestick' ? (
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
  );

  return (
    <div
      style={{width: switchWidth}}
      className="flex items-center space-x-1 justify-between md:space-x-5 lg:space-x-2 xl:w-full"
    >
      {/* Info: (20230809 - Shirley) Switch chart types for desktop */}
      <div className="hidden md:flex space-x-2">
        {candlestickChartButton}
        {lineGraphChartButton}
      </div>
      {/* Info: (20231130 - Julian) Switch chart types for mobile */}
      <div className="flex md:hidden space-x-2">{stickSwitchButton}</div>

      {/* Info: (20230809 - Shirley) Displaying position info toggle */}
      <div className="hidden items-center space-x-5 md:flex">
        <p className="text-lightGray">Positions</p>
        <div className="pt-1">
          <Toggle
            id="ChartSwitchToggle"
            initialToggleState={INITIAL_POSITION_LABEL_DISPLAYED_STATE}
            getToggledState={getDisplayedPositionsState}
          />
        </div>
      </div>

      {/* Info: (20230809 - Shirley) Switch time interval */}
      <div className="rounded-sm flex-1 bg-darkGray6 py-2 inline-flex justify-between">
        <button
          id="ChartLiveButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._1s}
          type="button"
          className={`${liveButtonStyle}`}
          onClick={liveButtonClickHandler}
        >
          Live
        </button>
        <button
          id="Chart5MinButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._5m}
          type="button"
          className={`${fiveMinButtonStyle}`}
          onClick={fiveMinButtonClickHandler}
        >
          5 m
        </button>
        <button
          id="Chart15MinButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._15m}
          type="button"
          className={`${fifteenMinButtonStyle}`}
          onClick={fifteenMinButtonClickHandler}
        >
          15 m
        </button>
        <button
          id="Chart30MinButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._30m}
          type="button"
          className={`${thirtyMinButtonStyle} md:block hidden`}
          onClick={thirtyMinButtonClickHandler}
        >
          30 m
        </button>
        <button
          id="Chart1HrButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._1h}
          type="button"
          className={`${oneHrButtonStyle}`}
          onClick={oneHrButtonClickHandler}
        >
          1 h
        </button>
        <button
          id="Chart4HrButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._4h}
          type="button"
          className={`${fourHrButtonStyle} md:block hidden`}
          onClick={fourHrButtonClickHandler}
        >
          4 h
        </button>
        <button
          id="Chart12HrButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._12h}
          type="button"
          className={`${twelveHrButtonStyle}`}
          onClick={twelveHrButtonClickHandler}
        >
          12 h
        </button>
        <button
          id="Chart1DayButton"
          disabled={disabledRef.current && activeButton !== TimeSpanUnion._1d}
          type="button"
          className={`${oneDayButtonStyle}`}
          onClick={oneDayButtonClickHandler}
        >
          1 d
        </button>
      </div>
    </div>
  );
};

export default TradingChartSwitch;

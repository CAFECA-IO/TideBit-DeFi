import React, {useState, useContext, useEffect} from 'react';
import CandlestickChart from '../candlestick_chart/candlestick_chart';
import TradingChartSwitch from '../trading_chart_switch/trading_chart_switch';
import useWindowSize from '../../lib/hooks/use_window_size';
import {CANDLESTICK_SIZE, INITIAL_POSITION_LABEL_DISPLAYED_STATE} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';
import {unitAsset} from '../../constants/config';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useTranslation} from 'next-i18next';
import {LayoutAssertion} from '../../constants/layout_assertion';
import {useGlobal} from '../../contexts/global_context';

const DEFAULT_CHART_WIDTH = 900;
const DEFAULT_CHART_HEIGHT = 400;
const MIN_SCREEN_WIDTH = 1024;
const TRADE_TAB_WIDTH = 350;
const SWITCH_HEIGHT = 40;

const DEFAULT_CHART_WIDTH_MOBILE = 300;
const DEFAULT_CHART_HEIGHT_MOBILE = 250;
const SWITCH_HEIGHT_MOBILE = 30;

const MAX_SCREEN_WIDTH = 1920;

const getChartSize = () => {
  const windowSize = useWindowSize();

  const getDesktopChartSize = () => {
    const defaultChartSize = {width: DEFAULT_CHART_WIDTH, height: DEFAULT_CHART_HEIGHT};
    const chartWidth =
      windowSize.width > MAX_SCREEN_WIDTH
        ? MAX_SCREEN_WIDTH / 1.3
        : windowSize.width - TRADE_TAB_WIDTH > MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH
        ? windowSize.width / 1.05 - TRADE_TAB_WIDTH
        : MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH;
    const chartSize = {
      width: chartWidth,
      height: ((defaultChartSize.height / defaultChartSize.width) * chartWidth).toString(),
    };

    return chartSize;
  };

  const getMobileChartSize = () => {
    const defaultChartSize = {
      width: DEFAULT_CHART_WIDTH_MOBILE,
      height: DEFAULT_CHART_HEIGHT_MOBILE,
    };
    const chartWidth = windowSize.width / 1.02;
    const chartSize = {
      width: chartWidth,
      height: ((defaultChartSize.height / defaultChartSize.width) * chartWidth).toString(),
    }; // eslint-disable-next-line no-console
    console.log('chartSize getMobileChartSize', chartSize);

    return chartSize;
  };

  return {
    desktop: getDesktopChartSize(),
    mobile: getMobileChartSize(),
  };
};

const getSwitchWidth = () => {
  const windowSize = useWindowSize();

  const getDesktopSwitchSize = () => {
    const switchWidth =
      windowSize.width > MAX_SCREEN_WIDTH
        ? 1450 // 固定寬度
        : windowSize.width - TRADE_TAB_WIDTH > MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH
        ? windowSize.width / 1.09 - TRADE_TAB_WIDTH
        : MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH;
    // eslint-disable-next-line no-console
    console.log('getDesktopSwitchSize', switchWidth);

    return {
      width: switchWidth.toString(),
      height: SWITCH_HEIGHT.toString(),
    };
  };

  const getMobileSwitchSize = () => {
    // 留下原本的行動裝置尺寸計算
    const switchWidth = windowSize.width - 40;
    return {
      width: switchWidth.toString(),
      height: SWITCH_HEIGHT_MOBILE.toString(),
    };
  };

  return {
    desktop: getDesktopSwitchSize(),
    mobile: getMobileSwitchSize(),
  };
};

const TradingView = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [candlestickOn, setCandlestickOn, candlestickOnRef] = useStateRef(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lineGraphOn, setLineGraphOn, lineGraphOnRef] = useStateRef(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedChartInterval, setSelectedChartInterval, selectedChartIntervalRef] =
    useStateRef('live');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showPositionLabel, setShowPositionLabel, showPositionLabelRef] = useStateRef(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  );
  // const [chartSize, setChartSize] = useState({
  //   width: DEFAULT_CHART_WIDTH.toString(),
  //   height: DEFAULT_CHART_HEIGHT.toString(),
  // });
  // const [switchSize, setSwitchSize] = useState({
  //   width: DEFAULT_CHART_WIDTH.toString(),
  //   height: SWITCH_HEIGHT.toString(),
  // });

  const getDisplayedPositionLabelState = (bool: boolean) => {
    setShowPositionLabel(bool);
  };

  const chartSize = getChartSize();
  const switchSize = getSwitchWidth();

  const getCandlestickOn = (bool: boolean) => {
    setCandlestickOn(bool);
    return bool;
  };

  const getLineGraphOn = (bool: boolean) => {
    setLineGraphOn(bool);
    return bool;
  };

  const getTradingViewSelected = (props: string) => {
    if (props !== 'candlestick' && props !== 'line') return;
    setSelectedChartType(props);
  };

  const getTradingViewIntervaleSelected = (props: string) => {
    if (
      props !== 'live' &&
      props !== '5m' &&
      props !== '15m' &&
      props !== '30m' &&
      props !== '1h' &&
      props !== '4h' &&
      props !== '12h' &&
      props !== '1d'
    )
      return;
    setSelectedChartInterval(props);
  };

  const displayedTradingView = (
    <>
      <CandlestickChart
        candleSize={CANDLESTICK_SIZE}
        showPositionLabel={showPositionLabelRef.current}
        candlestickOn={candlestickOnRef.current}
        lineGraphOn={lineGraphOnRef.current}
        strokeColor={[`#17BF88`]}
        candlestickChartWidth={chartSize.desktop.width}
        candlestickChartHeight={chartSize.desktop.height}
      />
    </>
  );

  const displayedTradingViewMobile = (
    <>
      <CandlestickChart
        candleSize={CANDLESTICK_SIZE}
        strokeColor={[`#17BF88`]}
        showPositionLabel={showPositionLabelRef.current}
        candlestickOn={candlestickOnRef.current}
        lineGraphOn={lineGraphOnRef.current}
        candlestickChartWidth={chartSize.mobile.width}
        candlestickChartHeight={chartSize.mobile.height}
      />
    </>
  );

  const desktopLayout = (
    <div>
      <div className="">
        <div className="pt-20">{displayedTradingView}</div>
        <div
          className="ml-5 py-10"
          style={{width: `${switchSize.desktop.width}px`, height: `${switchSize.desktop.height}px`}}
        >
          <TradingChartSwitch
            getCandlestickOn={getCandlestickOn}
            getLineGraphOn={getLineGraphOn}
            getTradingViewType={getTradingViewSelected}
            getTradingViewInterval={getTradingViewIntervaleSelected}
            getDisplayedPositionLabel={getDisplayedPositionLabelState}
            switchWidth={switchSize.desktop.width}
          />
        </div>
      </div>
    </div>
  );

  const mobileLayout = (
    <div className="relative">
      <div className="absolute top-0 text-sm text-lightWhite/60">
        {t('TRADE_PAGE.TRADING_VIEW_24H_VOLUME')} {marketCtx.selectedTicker?.tradingVolume}{' '}
        {unitAsset}
      </div>
      <div className="pt-20">{displayedTradingViewMobile}</div>
      <div
        className="pb-16"
        style={{width: `${switchSize.mobile.width}px`, height: `${switchSize.mobile.height}px`}}
      >
        <TradingChartSwitch
          getCandlestickOn={getCandlestickOn}
          getLineGraphOn={getLineGraphOn}
          getTradingViewType={getTradingViewSelected}
          getTradingViewInterval={getTradingViewIntervaleSelected}
          getDisplayedPositionLabel={getDisplayedPositionLabelState}
          switchWidth={switchSize.mobile.width}
        />
      </div>
    </div>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <>{displayedLayout}</>;
};

export default TradingView;

import {useState, useContext} from 'react';
import CandlestickChart from '../candlestick_chart/candlestick_chart';
import TradingChartSwitch from '../trading_chart_switch/trading_chart_switch';
import useWindowSize from '../../lib/hooks/use_window_size';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';

const DEFAULT_CHART_WIDTH = 300;
const DEFAULT_CHART_HEIGHT = 250;
const SWITCH_HEIGHT = 30;

const getChartSize = () => {
  const windowSize = useWindowSize();
  const defaultChartSize = {width: DEFAULT_CHART_WIDTH, height: DEFAULT_CHART_HEIGHT};
  const chartWidth = windowSize.width;
  const chartSize = {
    width: chartWidth.toString(),
    height: ((defaultChartSize.height / defaultChartSize.width) * chartWidth).toString(),
  };

  return chartSize;
};

const getSwitchWidth = () => {
  const windowSize = useWindowSize();
  const switchWidth = windowSize.width;
  const switchSize = {
    width: switchWidth.toString(),
    height: SWITCH_HEIGHT.toString(),
  };
  return switchSize;
};

const TradingViewMobile = () => {
  const marketCtx = useContext(MarketContext);

  const {showPositionOnChart} = useContext(MarketContext);

  const [candlestickOn, setCandlestickOn, candlestickOnRef] = useStateRef(true);
  const [lineGraphOn, setLineGraphOn, lineGraphOnRef] = useStateRef(false);

  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedChartInterval, setSelectedChartInterval] = useState('live');

  const chartSize = getChartSize();
  const switchSize = getSwitchWidth();

  const getDisplayedPositionLabelState = (bool: boolean) => {
    // console.log('bool in trading_view', bool);
    // setShowPositionLabel(bool);
    // return bool;
  };

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
      props !== '1h' &&
      props !== '12h' &&
      props !== '1d'
    )
      return;
    setSelectedChartInterval(props);
  };
  /* 
  const displayedTradingView = (
    <>
      <CandlestickChart
        strokeColor={[`#17BF88`]}
        candlestickOn={candlestickOnRef.current}
        lineGraphOn={lineGraphOnRef.current}
        candlestickChartWidth={chartSize.width}
        candlestickChartHeight={chartSize.height}
      />
    </>
  ); */

  return (
    <div className="relative">
      TradingViewMobile
      {/* Trading volume */}
      {/* ToDo: Fix chart & switch size (20230314 - Julian)       
      <div className="absolute top-10 text-sm text-lightWhite/60">
        24h Volume {marketCtx.selectedTicker?.tradingVolume} USDT
      </div>

      <div className="">{displayedTradingView}</div>

      <div
        className="pt-5 pb-16"
        style={{width: `${switchSize.width}px`, height: `${switchSize.height}px`}}
      >
        <TradingChartSwitch
          getCandlestickOn={getCandlestickOn}
          getLineGraphOn={getLineGraphOn}
          getTradingViewType={getTradingViewSelected}
          getTradingViewInterval={getTradingViewIntervaleSelected}
          getDisplayedPositionLabel={getDisplayedPositionLabelState}
        />
      </div> */}
    </div>
  );
};

export default TradingViewMobile;

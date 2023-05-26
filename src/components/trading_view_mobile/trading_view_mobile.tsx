import {useState, useContext} from 'react';
import CandlestickChart from '../candlestick_chart/candlestick_chart';
import TradingChartSwitchMobile from '../trading_chart_switch_mobile/trading_chart_switch_mobile';
import useWindowSize from '../../lib/hooks/use_window_size';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';
import {INITIAL_POSITION_LABEL_DISPLAYED_STATE} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {unitAsset} from '../../constants/config';

type TranslateFunction = (s: string) => string;

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
  const switchWidth = windowSize.width - 40;
  const switchSize = {
    width: switchWidth.toString(),
    height: SWITCH_HEIGHT.toString(),
  };
  return switchSize;
};

const TradingViewMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);

  const [candlestickOn, setCandlestickOn, candlestickOnRef] = useStateRef(true);
  const [lineGraphOn, setLineGraphOn, lineGraphOnRef] = useStateRef(false);

  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedChartInterval, setSelectedChartInterval, selectedChartIntervalRef] =
    useStateRef('live');
  const [showPositionLabel, setShowPositionLabel, showPositionLabelRef] = useStateRef(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  );

  const chartSize = getChartSize();
  const switchSize = getSwitchWidth();

  const getDisplayedPositionLabelState = (bool: boolean) => {
    setShowPositionLabel(bool);
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

  const displayedTradingView = (
    <>
      <CandlestickChart
        timeSpan={selectedChartIntervalRef.current}
        strokeColor={[`#17BF88`]}
        showPositionLabel={showPositionLabelRef.current}
        candlestickOn={candlestickOnRef.current}
        lineGraphOn={lineGraphOnRef.current}
        candlestickChartWidth={chartSize.width}
        candlestickChartHeight={chartSize.height}
      />
    </>
  );

  return (
    <div className="relative">
      <div className="absolute top-10 text-sm text-lightWhite/60">
        {t('TRADE_PAGE.TRADING_VIEW_24H_VOLUME')} {marketCtx.selectedTicker?.tradingVolume}{' '}
        {unitAsset}
      </div>
      <div className="">{displayedTradingView}</div>
      <div
        className="pb-16"
        style={{width: `${switchSize.width}px`, height: `${switchSize.height}px`}}
      >
        <TradingChartSwitchMobile
          getCandlestickOn={getCandlestickOn}
          getLineGraphOn={getLineGraphOn}
          getTradingViewType={getTradingViewSelected}
          getTradingViewInterval={getTradingViewIntervaleSelected}
          getDisplayedPositionLabel={getDisplayedPositionLabelState}
        />
      </div>
    </div>
  );
};

export default TradingViewMobile;

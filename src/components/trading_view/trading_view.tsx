import {useState, useEffect, useContext} from 'react';
import CandlestickChart from '../candlestick_chart/candlestick_chart';
import TradingChartSwitch from '../trading_chart_switch/trading_chart_switch';
import TradingLineGraphChart from '../trading_line_graph_chart/trading_line_graph_chart';
import useWindowSize from '../../lib/hooks/use_window_size';
import Lottie from 'lottie-react';
import spotAnimation from '../../../public/animation/circle.json';
import {INITIAL_POSITION_LABEL_DISPLAYED_STATE} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';

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
    windowSize.width - TRADE_TAB_WIDTH > MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH
      ? windowSize.width - TRADE_TAB_WIDTH
      : MIN_SCREEN_WIDTH - TRADE_TAB_WIDTH;
  const switchSize = {
    width: switchWidth.toString(),
    height: SWITCH_HEIGHT.toString(),
  };
  return switchSize;
};

const TradingView = () => {
  const {showPositionOnChart} = useContext(MarketContext);
  // console.log('showPositionOnChart in Trading view', showPositionOnChart);

  const [candlestickOn, setCandlestickOn, candlestickOnRef] = useStateRef(true);
  const [lineGraphOn, setLineGraphOn, lineGraphOnRef] = useStateRef(false);

  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedChartInterval, setSelectedChartInterval] = useState('live');
  const [showPositionLabel, setShowPositionLabel, showPositionLabelRef] = useStateRef(
    INITIAL_POSITION_LABEL_DISPLAYED_STATE
  );

  // Get toggle state from `trading_chart_switch`, which gets it from `toggle`
  // and pass to `candlestick_chart` component
  const getDisplayedPositionLabelState = (bool: boolean) => {
    // console.log('bool in trading_view', bool);
    setShowPositionLabel(bool);
    // return bool;
  };
  const chartSize = getChartSize();
  const switchSize = getSwitchWidth();

  const getCandlestickOn = (bool: boolean) => {
    setCandlestickOn(bool);
    return bool;
  };

  const getLineGraphOn = (bool: boolean) => {
    setLineGraphOn(bool);
    // console.log('[Trading view] line graph on: ', bool);
    return bool;
  };

  const getTradingViewSelected = (props: string) => {
    if (props !== 'candlestick' && props !== 'line') return;
    setSelectedChartType(props);
    // console.log('market section get chart type: ', props);
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
    // console.log('market section get chart interval: ', props);
  };

  // function getRandomIntInclusive(min, max) {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  // }

  // function getRandomArray(elementNumber: number, min: number, max: number) {
  //   const arr: number[] = [];

  //   for (let i = 0; i < elementNumber; i++) {
  //     arr.push(getRandomIntInclusive(min, max));
  //   }

  //   return arr;
  // }

  // const randomArray = getRandomArray(18, 6582, 6612);
  // console.log('randomArray', randomArray);

  const displayedTradingView = (
    <>
      <CandlestickChart
        showPositionLabel={showPositionLabelRef.current}
        candlestickOn={candlestickOnRef.current}
        lineGraphOn={lineGraphOnRef.current}
        strokeColor={[`#17BF88`]}
        candlestickChartWidth={chartSize.width}
        candlestickChartHeight={chartSize.height}
      />
    </>
  );
  // selectedChartType === 'candlestick' ? (
  //   <div className="relative">
  //     <Lottie className="absolute left-505px top-70px w-50px" animationData={spotAnimation} />
  //     <CandlestickChart
  //       strokeColor={[`#17BF88`]}
  //       candlestickChartWidth={chartSize.width}
  //       candlestickChartHeight={chartSize.height}
  //     />
  //   </div>
  // ) : (
  //   <div className="relative">
  //     <Lottie className="absolute left-505px top-60px w-50px" animationData={spotAnimation} />

  //     <TradingLineGraphChart
  //       strokeColor={['#29C1E1']}
  //       dataArray={[
  //         {
  //           x: new Date(1538854200000),
  //           y: [6593.13, 6596.01, 6590, 6593.34],
  //         },
  //         {
  //           x: new Date(1538856000000),
  //           y: [6593.34, 6604.76, 6582.63, 6593.86],
  //         },
  //         {
  //           x: new Date(1538857800000),
  //           y: [6593.86, 6604.28, 6586.57, 6600.01],
  //         },
  //         {
  //           x: new Date(1538859600000),
  //           y: [6601.81, 6603.21, 6592.78, 6596.25],
  //         },
  //         {
  //           x: new Date(1538861400000),
  //           y: [6596.25, 6604.2, 6590, 6602.99],
  //         },
  //         {
  //           x: new Date(1538863200000),
  //           y: [6602.99, 6606, 6584.99, 6587.81],
  //         },
  //         {
  //           x: new Date(1538865000000),
  //           y: [6587.81, 6595, 6583.27, 6591.96],
  //         },
  //         {
  //           x: new Date(1538866800000),
  //           y: [6591.97, 6596.07, 6585, 6588.39],
  //         },
  //         {
  //           x: new Date(1538868600000),
  //           y: [6587.6, 6598.21, 6587.6, 6594.27],
  //         },
  //         {
  //           x: new Date(1538870400000),
  //           y: [6596.44, 6601, 6590, 6596.55],
  //         },
  //         {
  //           x: new Date(1538872200000),
  //           y: [6598.91, 6605, 6596.61, 6600.02],
  //         },
  //         {
  //           x: new Date(1538874000000),
  //           y: [6600.55, 6605, 6589.14, 6593.01],
  //         },
  //         {
  //           x: new Date(1538875800000),
  //           y: [6593.15, 6605, 6592, 6603.06],
  //         },
  //         {
  //           x: new Date(1538877600000),
  //           y: [6603.07, 6604.5, 6599.09, 6603.89],
  //         },
  //         {
  //           x: new Date(1538879400000),
  //           y: [6604.44, 6604.44, 6600, 6603.5],
  //         },
  //         {
  //           x: new Date(1538881200000),
  //           y: [6603.5, 6603.99, 6597.5, 6603.86],
  //         },
  //         {
  //           x: new Date(1538883000000),
  //           y: [6603.85, 6605, 6600, 6604.07],
  //         },
  //         {
  //           x: new Date(1538884800000),
  //           y: [6604.98, 6606, 6604.07, 6606],
  //         },
  //         {
  //           x: new Date(1538886600000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538888400000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538890200000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538892000000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538893800000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538895600000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538897400000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538899200000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538901000000),
  //           y: [null, null, null, null],
  //         },
  //         {
  //           x: new Date(1538902800000),
  //           y: [null, null, null, null],
  //         },
  //       ]}
  //       lineGraphWidth={'900'}
  //       lineGraphHeight={'400'}
  //       annotatedValue={1324.4}
  //     />
  //   </div>
  // );

  return (
    <div>
      {/* <div className="pt-700px text-7xl text-blue-100">Market Section</div> */}
      <div className="">
        <div className="pt-10">{displayedTradingView}</div>
        <div
          className="ml-5 py-10"
          style={{width: `${switchSize.width}px`, height: `${switchSize.height}px`}}
        >
          <TradingChartSwitch
            getCandlestickOn={getCandlestickOn}
            getLineGraphOn={getLineGraphOn}
            getTradingViewType={getTradingViewSelected}
            getTradingViewInterval={getTradingViewIntervaleSelected}
            getDisplayedPositionLabel={getDisplayedPositionLabelState}
          />
        </div>
      </div>
    </div>
  );
};

export default TradingView;

import {useState} from 'react';
import CandlestickChart from '../candlestick_chart/candlestick_chart';
import TradingChartSwitch from '../trading_chart_switch/trading_chart_switch';
import TradingLineGraphChart from '../trading_line_graph_chart/trading_line_graph_chart';

const TradingView = () => {
  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedChartInterval, setSelectedChartInterval] = useState('live');

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

  const displayedTradingView =
    selectedChartType === 'candlestick' ? (
      <CandlestickChart
        strokeColor={[`#17BF88`]}
        candlestickChartWidth="900"
        candlestickChartHeight="400"
      />
    ) : (
      <TradingLineGraphChart
        strokeColor={['#29C1E1']}
        dataArray={[
          6594,
          6599,
          6606,
          6609,
          6592,
          6595,
          6593,
          6608,
          6589,
          6611,
          6593,
          6590,
          6602,
          6598,
          6596,
          6590,
          6607,
          6610,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ]}
        lineGraphWidth={'900'}
        lineGraphHeight={'400'}
        annotatedValue={1324.4}
      />
    );

  return (
    <div>
      {/* <div className="pt-700px text-7xl text-blue-100">Market Section</div> */}
      <div className="">
        <div className="pt-10">{displayedTradingView}</div>
        <div className="ml-5 py-10">
          <TradingChartSwitch
            getTradingViewType={getTradingViewSelected}
            getTradingViewInterval={getTradingViewIntervaleSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default TradingView;

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

  const displayedTradingView =
    selectedChartType === 'candlestick' ? (
      <CandlestickChart
        strokeColor={[`#1AE2A0`]}
        candlestickChartWidth="900"
        candlestickChartHeight="400"
      />
    ) : (
      <TradingLineGraphChart />
    );

  return (
    <div>
      {/* <div className="pt-700px text-7xl text-blue-100">Market Section</div> */}
      <div className="">
        <div className="pt-10">{displayedTradingView}</div>
        <div className="py-10">
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

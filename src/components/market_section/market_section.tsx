import React from 'react';
import TradingHeader from '../trading_header/trading_header';
import CandlestickChart from '../candlestick_chart/candlestick_chart';

const MarketSection = () => {
  return (
    <div>
      {/* <div className="pt-700px text-7xl text-blue-100">Market Section</div> */}
      <div className="ml-5 pt-100px">
        <TradingHeader upOrDown="down" />
        <div className="pt-10">
          <CandlestickChart
            strokeColor={[`#1AE2A0`]}
            candlestickChartWidth="900"
            candlestickChartHeight="400"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketSection;

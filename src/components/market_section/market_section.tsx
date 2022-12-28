import React from 'react';
import TradingHeader from '../trading_header/trading_header';
import CandlestickChart from '../candlestick_chart/candlestick_chart';

const MarketSection = () => {
  return (
    <div>
      {/* <div className="pt-700px text-7xl text-blue-100">Market Section</div> */}
      <div className="ml-5 pt-100px">
        <TradingHeader upOrDown="down" />
        {/* <div className="pt-20">
          <CandlestickChart />
        </div> */}
      </div>
    </div>
  );
};

export default MarketSection;

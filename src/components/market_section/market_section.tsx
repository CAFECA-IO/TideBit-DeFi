import {useState} from 'react';
import TradingHeader from '../trading_header/trading_header';
import TradingView from '../trading_view/trading_view';

const MarketSection = () => {
  return (
    <div>
      {/* <div className="pt-700px text-7xl text-blue-100">Market Section</div> */}
      <div className="ml-5 pt-100px">
        <div className="ml-5">
          <TradingHeader upOrDown="up" tradingVolume="217,268,645" />
        </div>

        <div>
          <TradingView />
        </div>
      </div>
    </div>
  );
};

export default MarketSection;

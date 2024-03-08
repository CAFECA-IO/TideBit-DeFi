import OrderSection from '../order_section/order_section';
import MarketSection from '../market_section/market_section';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
import React from 'react';

interface ITradePageBodyProps {
  briefs: IRecommendedNews[];
  hideTradingView?: boolean;
  hideOpenLineGraph?: boolean;
}

const TradePageBody = (props: ITradePageBodyProps) => {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden">
        <MarketSection briefs={props.briefs} hideTradingView={props?.hideTradingView} />

        <OrderSection hideOpenLineGraph={props?.hideOpenLineGraph} />
      </div>
    </>
  );
};

export default TradePageBody;

import OrderSection from '../order_section/order_section';
import MarketSection from '../market_section/market_section';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';

interface ITradePageBodyProps {
  briefs: IRecommendedNews[];
}

const TradePageBody = (props: ITradePageBodyProps) => {
  const displayedOrdersection = <OrderSection />;

  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden">
        <MarketSection briefs={props.briefs} />

        {displayedOrdersection}
      </div>
    </>
  );
};

export default TradePageBody;

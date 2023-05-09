import OrderSection from '../order_section/order_section';
import MarketSection from '../market_section/market_section';
import {useGlobal} from '../../contexts/global_context';
import OrderSectionMobile from '../order_section_mobile/order_section_mobile';

const TradePageBody = () => {
  const {layoutAssertion} = useGlobal();

  const displayedOrdersection =
    layoutAssertion === 'mobile' ? <OrderSectionMobile /> : <OrderSection />;

  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden">
        <MarketSection />

        {displayedOrdersection}
      </div>
    </>
  );
};

export default TradePageBody;

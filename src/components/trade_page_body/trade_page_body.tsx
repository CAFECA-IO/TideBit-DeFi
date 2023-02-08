import {useContext} from 'react';
import OrderSection from '../order_section/order_section';
import Footer from '../footer/footer';
import MarketSection from '../market_section/market_section';
import {MarketProvider} from '../../lib/contexts/market_context';
import {UserProvider} from '../../lib/contexts/user_context';
import {GlobalContext, useGlobal} from '../../lib/contexts/global_context';
import OrderSectionMobile from '../order_section_mobile/order_section_mobile';

const TradePageBody = () => {
  const {layoutAssertion} = useGlobal();

  const displayedOrdersection =
    layoutAssertion === 'mobile' ? <OrderSectionMobile /> : <OrderSection />;

  return (
    <>
      {/* <MarketProvider> */}
      {/* <UserProvider> */}
      <div className="flex min-h-screen flex-col overflow-hidden">
        <MarketSection />

        {displayedOrdersection}
        {/* <OrderSection /> */}

        {/* <div>
          <Footer />
        </div> */}
      </div>
      {/* </UserProvider> */}
      {/* </MarketProvider> */}
    </>
  );
};

export default TradePageBody;

import React from 'react';
import OrderSection from '../order_section/order_section';
import Footer from '../footer/footer';
import MarketSection from '../market_section/market_section';
import {MarketProvider} from '../../lib/contexts/market_context';
import {UserProvider} from '../../lib/contexts/user_context';

const TradePageBody = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden bg-black">
        <MarketProvider>
          <UserProvider>
            <MarketSection />
            <OrderSection />
          </UserProvider>
        </MarketProvider>

        {/* <div>
          <Footer />
        </div> */}
      </div>
    </>
  );
};

export default TradePageBody;

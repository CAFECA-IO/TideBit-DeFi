import React from 'react';
import OrderSection from '../order_section/order_section';
import Footer from '../footer/footer';
import MarketSection from '../market_section/market_section';
import {MarketProvider} from '../../lib/contexts/market_context';
import {UserProvider} from '../../lib/contexts/user_context';

const TradePageBody = () => {
  return (
    <>
      <MarketProvider>
        <UserProvider>
          <div className="flex min-h-screen flex-col overflow-hidden">
            <MarketSection />
            <OrderSection />

            {/* <div>
          <Footer />
        </div> */}
          </div>
        </UserProvider>
      </MarketProvider>
    </>
  );
};

export default TradePageBody;

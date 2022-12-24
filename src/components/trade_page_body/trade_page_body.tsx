import React from 'react';
import OrderSection from '../order_section/order_section';
import Footer from '../footer/footer';
import MarketSection from '../market_section/market_section';

const TradePageBody = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden bg-black">
        <MarketSection />
        <OrderSection />

        {/* <div>
          <Footer />
        </div> */}
      </div>
    </>
  );
};

export default TradePageBody;

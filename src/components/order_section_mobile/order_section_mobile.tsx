import React from 'react';
import PositionTabMobile from '../position_tab_mobile/position_tab_mobile';
import TradeTabMobile from '../trade_tab_mobile/trade_tab_mobile';

const OrderSectionMobile = () => {
  return (
    <div
      className={`${'h-76px'} fixed bottom-0 flex w-screen basis-full items-center justify-center bg-darkGray py-3 px-5`}
    >
      <TradeTabMobile />
      <PositionTabMobile />
    </div>
  );
};

export default OrderSectionMobile;

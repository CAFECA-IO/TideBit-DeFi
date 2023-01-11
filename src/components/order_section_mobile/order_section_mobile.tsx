import React from 'react';
import PositionTabMobile from '../position_tab_mobile/position_tab_mobile';
import TradeTabMobile from '../trade_tab_mobile/trade_tab_mobile';

const OrderSectionMobile = () => {
  return (
    <div className="text-blue-300">
      OrderSectionMobile
      <TradeTabMobile />
      <PositionTabMobile />
    </div>
  );
};

export default OrderSectionMobile;

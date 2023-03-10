import React from 'react';
import {IOrderStateConstant, OrderState} from '../../constants/order_state';
import {VictoryLine} from 'victory';

// TODO: Specify the type
export interface IOpenPriceLineProps {
  openPrice?: number;
  openTime?: number;
  positionState?: IOrderStateConstant['OPENING'];
  horizontalData?: any;
}
// OrderState
const OpenPriceLine = ({
  openPrice,
  openTime,
  positionState,
  horizontalData,
}: IOpenPriceLineProps) => {
  if (positionState !== OrderState.OPENING) return;

  const isDisplayedPositionLine =
    horizontalData && horizontalData.length > 0 ? <VictoryLine data={horizontalData} /> : <></>;

  return <>{isDisplayedPositionLine}</>;
};

export default OpenPriceLine;

import React from 'react';
import {IOrderStateConstant, OrderState} from '../../constants/order_state';
import {VictoryLine} from 'victory';
import {LINE_GRAPH_STROKE_COLOR} from '../../constants/display';

// TODO: Specify the type
export interface IOpenPriceLineProps {
  openPrice?: number;
  openTime?: number;
  positionState?: IOrderStateConstant['OPENING'];
  horizontalData: {
    x: Date;
    y: number;
  }[];
}
// OrderState
const OpenPriceLine = ({
  openPrice,
  openTime,
  positionState,
  horizontalData,
}: IOpenPriceLineProps): JSX.Element => {
  // if (positionState !== OrderState.OPENING) return <></>;

  // const isDisplayedPositionLine =
  //   horizontalData && horizontalData.length > 0 ? (
  //     <VictoryLine
  //       style={{data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1}}}
  //       data={horizontalData}
  //     />
  //   ) : (
  //     <></>
  //   );

  // console.log('openPriceLine', horizontalData);

  return (
    <VictoryLine
      style={{data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1}}}
      data={horizontalData}
    />
  );
};

export default OpenPriceLine;

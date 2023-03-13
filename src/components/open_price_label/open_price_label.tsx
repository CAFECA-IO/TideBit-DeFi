import React from 'react';
import {VictoryLabel} from 'victory';
import {LINE_GRAPH_STROKE_COLOR} from '../../constants/display';

const OpenPriceLabel = ({x}: {x: number}) => {
  return (
    // <rect x={x - 5} y={5} width={10} height={10} />
    <text>⬆️</text>
  );
};

export default OpenPriceLabel;

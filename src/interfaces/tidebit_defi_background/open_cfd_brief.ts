import PositionLineGraph from '../../components/position_line_graph/position_line_graph';
import {ICFDBrief} from './cfd_brief';
import {dummyOpenCFDDetails} from './open_cfd_details';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDBrief extends ICFDBrief {
  positionLineGraph: ITickerLineGraph;
}

export const dummyOpenCFDBrief: IOpenCFDBrief = {
  id: dummyOpenCFDDetails.id,
  ticker: dummyOpenCFDDetails.ticker,
  typeOfPosition: dummyOpenCFDDetails.typeOfPosition,
  openPrice: dummyOpenCFDDetails.openPrice,
  openValue: dummyOpenCFDDetails.openValue,
  openTimestamp: dummyOpenCFDDetails.openTimestamp,
  pNL: dummyOpenCFDDetails.pnl,
  positionLineGraph: {dataArray: [153000, 137200, 122000, 126500, 134200, 129900]},
};

import {NextApiRequest, NextApiResponse} from 'next';
import {ITimeSpanUnion} from '../../../interfaces/depre_tidebit_defi_background';
import {getDummyCandlestickChartData} from '../../../interfaces/tidebit_defi_background/candlestickData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  console.log(`req.query`, req.query);
  if (req.method === 'GET') {
    const {timespan} = req.query;
    const candlestickChartData = getDummyCandlestickChartData(50, timespan as ITimeSpanUnion);
    res.status(200).json([...candlestickChartData]);
  }
}

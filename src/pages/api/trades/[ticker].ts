import {NextApiRequest, NextApiResponse} from 'next';
import {API_VERSION, TBE_URL} from '../../../constants/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  // console.log(`candlestick/ticker req`,req);
  try {
    if (req.method === 'GET') {
      // const candlestickChartData = getDummyCandlestickChartData(50, req.query.timespan as ITimeSpanUnion);
      // res.status(200).json([...candlestickChartData]);
      const response = await fetch(
        `${TBE_URL}${API_VERSION}/market/trades?market=${req.query.ticker}usdt&limit=50`
      );
      const data = await response.json();
      res.status(200).json(data);
    } else res.status(500).json({error: 'Internal Server Error'});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

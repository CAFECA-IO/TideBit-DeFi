import {NextApiRequest, NextApiResponse} from 'next';
import {API_VERSION, AVAILABLE_TICKERS, TBE_URL} from '../../../constants/config';
import {getDummyCandlestickChartData} from '../../../interfaces/tidebit_defi_background/candlestickData';
import {ITimeSpanUnion} from '../../../interfaces/tidebit_defi_background/time_span_union';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (AVAILABLE_TICKERS.find(ticker => ticker.toLowerCase() === req.query.ticker)) {
        const url = `${TBE_URL}${API_VERSION}/tradingview/history?symbol=${req.query.ticker}usdt&resolution=${req.query.timespan}&limit=${req.query.limit}`;
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
          const data = result.payload.map(
            (d: {
              time: number;
              open: number;
              high: number;
              low: number;
              close: number;
              volume: number;
            }) => ({x: new Date(d.time), y: [d.open, d.high, d.low, d.close]})
          );
          res.status(200).json(data);
        } else {
          const candlestickChartData = getDummyCandlestickChartData(
            50,
            req.query.timespan as ITimeSpanUnion
          );
          res.status(200).json([...candlestickChartData]);
        }
      } else res.status(500).json({error: 'Internal Server Error'});
    } else res.status(500).json({error: 'Internal Server Error'});
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
}

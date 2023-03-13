import {NextApiRequest, NextApiResponse} from 'next';
import {API_VERSION, AVAILABLE_TICKERS, TBE_URL} from '../../../constants/config';
import {dummyTickers, ITickerData} from '../../../interfaces/tidebit_defi_background/ticker_data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let tickers: {[currency: string]: ITickerData} = {};
    tickers = dummyTickers.reduce((prev, curr) => {
      if (!prev[curr.currency]) prev[curr.currency] = curr;
      return prev;
    }, tickers);
    for (const ticker of AVAILABLE_TICKERS) {
      const response = await fetch(
        `${TBE_URL}${API_VERSION}/tradingview/history?symbol=${ticker.toLowerCase()}usdt&resolution==${
          req.query.timespan
        }&limit=${req.query.limit}`
      );
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
          }) => d.open
        );
        tickers[ticker].lineGraphProps.dataArray = data;
      }
    }
    res.status(200).json(Object.values(tickers));
  }
}

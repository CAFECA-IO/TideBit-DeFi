import {NextApiRequest, NextApiResponse} from 'next';
import {TBEURL} from '../../../constants/api_request';
import {API_VERSION, AVAILABLE_TICKERS, BASE_URL, unitAsset} from '../../../constants/config';
import {dummyTickers, ITickerData} from '../../../interfaces/tidebit_defi_background/ticker_data';
import {toQuery} from '../../../lib/common';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const query = req.query as {[key: string]: string} | undefined;
    let tickers: {[currency: string]: ITickerData} = {};
    tickers = dummyTickers.reduce((prev, curr) => {
      if (!prev[curr.currency]) prev[curr.currency] = curr;
      return prev;
    }, tickers);
    for (const ticker of AVAILABLE_TICKERS) {
      const _query = query
        ? {...query, symbol: `${ticker.toLowerCase()}${unitAsset.toLowerCase()}`}
        : undefined;
      const url = `${BASE_URL}${API_VERSION}${TBEURL.GET_CANDLESTICK_DATA}${toQuery(_query)}`;
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
          }) => d.open
        );
        tickers[ticker].lineGraphProps.dataArray = data;
      }
    }
    res.status(200).json(Object.values(tickers));
  }
}

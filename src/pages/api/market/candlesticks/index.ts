import {NextApiRequest, NextApiResponse} from 'next';
import {TBEURL} from '../../../../constants/api_request';
import {API_VERSION, AVAILABLE_TICKERS, BASE_URL, unitAsset} from '../../../../constants/config';
import {getDummyCandlestickChartData} from '../../../../interfaces/tidebit_defi_background/candlestickData';
import {
  ITimeSpanUnion,
  TimeSpanUnion,
} from '../../../../interfaces/tidebit_defi_background/time_span_union';
import {convertTradesToCandlestickData, toQuery} from '../../../../lib/common';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const params = req.query as {[key: string]: string} | undefined;
    let query = toQuery(
      params
        ? {
            ...params,
            symbol: params.symbol ? `${params.symbol.toLowerCase()}${unitAsset.toLowerCase()}` : ``,
          }
        : undefined
    );
    try {
      if (AVAILABLE_TICKERS.find(ticker => ticker === params?.symbol)) {
        if (
          params?.timespan === TimeSpanUnion._1s ||
          params?.timespan === TimeSpanUnion._15s ||
          params?.timespan === TimeSpanUnion._30s
        ) {
          query = toQuery(
            params
              ? {
                  market: params.symbol
                    ? `${params.symbol.toLowerCase()}${unitAsset.toLowerCase()}`
                    : ``,
                  limit: 500,
                }
              : undefined
          );
          const url = `${BASE_URL}${API_VERSION}${TBEURL.LIST_TRADES}${query}`;
          const response = await fetch(url);
          const result = await response.json();
          if (result.success) {
            const data = convertTradesToCandlestickData(result.payload, params.timespan);
            res.status(200).json(data);
          } else res.status(500).json({error: 'Internal Server Error'});
        } else {
          const url = `${BASE_URL}${API_VERSION}${TBEURL.GET_CANDLESTICK_DATA}${query}`;
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
              }) => ({x: new Date(d.time), open: d.open, high: d.high, low: d.low, close: d.close})
            );
            res.status(200).json(data);
          } else res.status(500).json({error: 'Internal Server Error'});
        }
      } else {
        const candlestickChartData = getDummyCandlestickChartData(
          50,
          req.query.timespan as ITimeSpanUnion
        );
        res.status(200).json([...candlestickChartData]);
      }
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  } else res.status(500).json({error: 'Internal Server Error'});
}

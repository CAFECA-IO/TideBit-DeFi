import {NextApiRequest, NextApiResponse} from 'next';
import {APIURL, TBEURL} from '../../../../constants/api_request';
import {Code, Reason} from '../../../../constants/code';
import {
  API_VERSION,
  AVAILABLE_TICKERS,
  BASE_URL,
  TRADING_CRYPTO_DATA,
  URL,
  unitAsset,
} from '../../../../constants/config';
import {Trend} from '../../../../constants/trend';
import {
  ITickerItem,
  ITBETicker,
  ITickerMarket,
  convertToTickerMartket,
  ITickerProperty,
} from '../../../../interfaces/tidebit_defi_background/ticker_data';

/** info: get tickers from tbe and dummy data (20230328 - tzuhan)
 * 1. generate tickers: ITickerItem[]
 * 2. get tickers from tbe
 * 3. filter tickers by AVAILABLE_TICKERS and unitAsset
 * 4. return result
 * 5. error handle
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const testURL = `${URL}/market/tickers`;
  const response = await fetch(testURL);
  // eslint-disable-next-line no-console
  console.log(`LIST_TICKERS testURL(${testURL}):`, response);

  if (req.method === 'GET') {
    try {
      let tickers: {[currency: string]: ITickerItem} = {};
      tickers = TRADING_CRYPTO_DATA.reduce((prev, curr) => {
        const price = parseFloat((Math.random() * 1000).toFixed(2));
        const priceChange = parseFloat((Math.random() * 100).toFixed(2));
        const fluctuating = parseFloat((priceChange / (price + priceChange)).toFixed(2));
        const tradingVolume = (Math.random() * 1000).toFixed(2);
        const upOrDown =
          Math.random() >= 0.5 ? (Math.random() === 0.5 ? Trend.EQUAL : Trend.UP) : Trend.DOWN;
        const tickerItem: ITickerItem = {
          ...curr,
          price,
          priceChange,
          upOrDown,
          fluctuating,
          tradingVolume,
        };
        prev[curr.currency] = tickerItem;
        return prev;
      }, tickers);
      const url = `${BASE_URL}${API_VERSION}${TBEURL.LIST_TICKERS}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        const tickerDatas = (result.payload as ITBETicker[]).filter(
          d =>
            d.quoteUnit === unitAsset.toLowerCase() &&
            AVAILABLE_TICKERS.includes(d.baseUnit.toUpperCase())
        );
        for (const tickerData of tickerDatas) {
          const tickerProperty: ITickerProperty = tickers[tickerData.baseUnit.toUpperCase()];
          if (tickerProperty) {
            const marketData: ITickerMarket = convertToTickerMartket(tickerProperty, tickerData);
            tickers[tickerData.baseUnit.toUpperCase()] = {
              ...tickers[tickerData.baseUnit.toUpperCase()],
              ...marketData,
            };
          }
        }
      }
      res.status(200).json(Object.values(tickers));
    } catch (error) {
      res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
    }
  } else res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
}

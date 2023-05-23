import {
  ITickerData,
  ITickerItem,
  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  ISortedTrade,
  ITBETrade,
  ITickerMarket,
  strokeColorDisplayed,
  */
} from '../../interfaces/tidebit_defi_background/ticker_data';
/** Deprecated: replaced by pusher (20230424 - tzuhan)
import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import {ITickerHistoryData} from '../../interfaces/tidebit_defi_background/ticker_history_data';
import {millesecondsToSeconds} from '../common';
*/
import {ITimeSpanUnion, TimeSpanUnion} from '../../constants/time_span_union';
import {ICurrency} from '../../constants/currency';
import {unitAsset} from '../../constants/config';

class TickerBook {
  private _dataLength = 1000;
  private _timeSpan: ITimeSpanUnion = TimeSpanUnion._1s;
  private _limit = 50;
  private _tickers: {[currency: string]: ITickerData} = {};

  constructor() {
    this._tickers = {};
  }

  listTickerPositions(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ): number[] {
    // TODO: temporary need further discussion on how to calculate the position (20230424 - tzuhan)
    return this.tickers[ticker]?.lineGraphProps.dataArray || ([] as number[]);
  }

  listTickers(): {[currency in ICurrency]: ITickerData} {
    let tickers: {[currency in ICurrency]?: ITickerData} = {};
    tickers = Object.values(this.tickers).reduce((prev, curr) => {
      // const dataArray = this.listTickerPositions(curr.currency, {});
      // const strokeColor = strokeColorDisplayed(dataArray);
      const ticker: ITickerData = {
        ...curr,
        // lineGraphProps: {
        //   dataArray,
        //   strokeColor,
        //   lineGraphWidth: '170',
        //   lineGraphWidthMobile: '140',
        // },
      };
      prev[curr.currency] = ticker;
      return prev;
    }, tickers);
    return tickers as {[currency in ICurrency]: ITickerData};
  }

  updateTicker(value: ITickerData) {
    const updateTicker: ITickerData = {...this._tickers[value.currency]};
    updateTicker.lineGraphProps = value.lineGraphProps;
    updateTicker.fluctuating = value.fluctuating;
    updateTicker.price = value.price;
    updateTicker.priceChange = value.priceChange;
    updateTicker.tradingVolume = value.tradingVolume;
    updateTicker.upOrDown = value.upOrDown;
    this._tickers[value.currency] = updateTicker;
  }

  updateTickers(value: ITickerData[]) {
    let tickers: {[currency: string]: ITickerData} = {};
    tickers = [...value].reduce((prev, curr) => {
      if (!prev[curr.currency])
        prev[curr.currency] = {
          ...curr,
          lineGraphProps: {
            dataArray: curr.lineGraphProps.dataArray ? [...curr.lineGraphProps.dataArray] : [],
          },
        };
      return prev;
    }, tickers);
    this.tickers = tickers;
    return tickers;
  }

  getCurrencyRate(currency: string): number {
    return currency === unitAsset ? 1 : this._tickers[currency]?.price || 0;
  }

  get tickers(): {[currency: string]: ITickerData} {
    return this._tickers;
  }

  set tickers(value: {[currency: string]: ITickerData}) {
    this._tickers = value;
  }

  get timeSpan(): ITimeSpanUnion {
    return this._timeSpan;
  }

  set timeSpan(value: ITimeSpanUnion) {
    this._timeSpan = value;
  }

  get limit(): number {
    return this._limit;
  }

  set limit(value: number) {
    this._limit = value;
  }
}

const TickerBookInstance = new TickerBook();
export default TickerBookInstance;

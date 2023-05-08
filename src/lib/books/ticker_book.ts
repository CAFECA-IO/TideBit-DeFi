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

  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  private _trades: {
    [currency: string]: ISortedTrade;
  } = {};
  */

  constructor() {
    this._tickers = {};
    /** Deprecated: replaced by pusher (20230424 - tzuhan)
    this._trades = {};
    */
  }

  /** Deprecated: replaced by pusher (20230424 - tzuhan)
  formatTrades(ticker: string, trades: ITBETrade[]) {
    const newTrades = [...trades].sort((a, b) => +a.ts - +b.ts);
    let formattedTrades: ISortedTrade = {},
      begin: number;
    if (this._trades[ticker] && Object.keys(this._trades[ticker]).length > 0) {
      begin = Math.min(
        millesecondsToSeconds(+newTrades[0].ts),
        +Object.keys(this._trades[ticker])[0]
      );
    } else {
      this._trades[ticker] = {};
      begin = millesecondsToSeconds(+newTrades[0].ts);
    }
    const timeSpan = millesecondsToSeconds(getTime(TimeSpanUnion._1s));
    formattedTrades = newTrades.reduce((prev, curr, index) => {
      const span = begin + index * timeSpan;
      const timestamp = millesecondsToSeconds(+curr.ts);
      if (!prev[span])
        prev[span] = {
          second: span,
          trades: {
            open: curr,
            high: curr,
            low: curr,
            close: curr,
          },
          datas: [],
        };
      if (!prev[timestamp])
        prev[timestamp] = {
          second: timestamp,
          trades: {
            open: curr,
            high: curr,
            low: curr,
            close: curr,
          },
          datas: [curr],
        };
      if (+curr.price > +prev[timestamp].trades.high.price) prev[timestamp].trades.high = curr;
      if (+curr.price < +prev[timestamp].trades.low.price) prev[timestamp].trades.low = curr;
      if (+curr.id < +prev[timestamp].trades.open.id) prev[timestamp].trades.open = curr;
      if (+curr.id > +prev[timestamp].trades.close.id) prev[timestamp].trades.close = curr;
      prev[timestamp].datas = [...prev[timestamp].datas, curr];

      return prev;
    }, formattedTrades);
    return formattedTrades;
  }

  combineTrades(trades: ISortedTrade, newTrades: ISortedTrade) {
    for (const key of Object.keys(newTrades)) {
      if (trades[key]) {
        if (+newTrades[key].trades.open.price > +trades[key].trades.open.price)
          trades[key].trades.open = newTrades[key].trades.open;
        if (+newTrades[key].trades.low.price < +trades[key].trades.low.price)
          trades[key].trades.low = newTrades[key].trades.low;
        if (+newTrades[key].trades.close.ts > +trades[key].trades.close.ts)
          trades[key].trades.close = newTrades[key].trades.close;
      } else {
        trades[key] = {...newTrades[key]};
      }
    }
    return trades;
  }

  trimTrades(sortedTrades: ISortedTrade) {
    let _trimedTrades = Object.values(sortedTrades),
      trimTrades: ISortedTrade = {};
    if (_trimedTrades.length > this._dataLength) {
      _trimedTrades = _trimedTrades.slice(
        _trimedTrades.length - this._dataLength,
        _trimedTrades.length
      );
      trimTrades = _trimedTrades.reduce((prev, curr) => {
        prev[curr.second] = curr;
        return prev;
      }, trimTrades);
    } else trimTrades = {...sortedTrades};
    return trimTrades;
  }

  sortTrades(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ) {
    if (!this._trades[ticker]) this._trades[ticker] = {};
    const _timeSpan = options.timeSpan || this.timeSpan;
    let trades = Object.values(this._trades[ticker]).filter(
      trade =>
        (!options.begin || (options.begin && trade.second >= options.begin)) &&
        (!options.end || (options.end && trade.second <= options.end))
    );
    let sortedTrades: ISortedTrade = {};
    if (trades.length > 0 && _timeSpan !== TimeSpanUnion._1s) {
      const begin = trades[0].second; //Math.min(...Object.keys(trades).map(second => +second));
      const timeSpan = millesecondsToSeconds(getTime(_timeSpan));
      let nextSpan = begin + timeSpan;
      for (const trade of trades) {
        if (!sortedTrades[nextSpan])
          sortedTrades[nextSpan] = {
            second: nextSpan,
            trades: sortedTrades[nextSpan - timeSpan]
              ? {...sortedTrades[nextSpan - timeSpan].trades}
              : {...trades[0].trades},
            datas: [],
          };
        const timestamp = +trade.second;

        if (timestamp <= nextSpan) {
          if (+trade.trades.high.price > +sortedTrades[nextSpan].trades.high.price)
            sortedTrades[nextSpan].trades.high = trade.trades.high;
          if (+trade.trades.low.price < +sortedTrades[nextSpan].trades.low.price)
            sortedTrades[nextSpan].trades.low = trade.trades.low;
          if (+trade.trades.close.id < +sortedTrades[nextSpan].trades.open.id)
            sortedTrades[nextSpan].trades.open = trade.trades.close;
          if (+trade.trades.open.id > +sortedTrades[nextSpan].trades.close.id)
            sortedTrades[nextSpan].trades.close = trade.trades.open;
          sortedTrades[nextSpan].datas = [...sortedTrades[nextSpan].datas, ...trade.datas];
        } else {
          nextSpan += timeSpan;
          sortedTrades[nextSpan] = {
            ...trade,
            second: nextSpan,
          };
        }
      }
    } else {
      sortedTrades = trades.reduce((prev, curr) => {
        prev[curr.second] = curr;
        return prev;
      }, sortedTrades);
    }
    if (options.limit) trades = trades.slice(trades.length - options.limit, trades.length);
    return sortedTrades;
  }

  getTickerHistory(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ) {
    const sortedTrades = this.sortTrades(ticker, options);
    const tickerHistories: ITickerHistoryData[] = Object.values(sortedTrades).map(t => ({
      date: new Date(t.second * 1000),
      open: +t.trades.open.price,
    }));

    return tickerHistories;
  }

  updateTrades(ticker: string, newTrades: ITBETrade[]) {
    if (!this._trades[ticker]) this._trades[ticker] = {};
    const trades: ISortedTrade = this._trades[ticker];
    let updatedTrades: ISortedTrade = {};
    if (newTrades.length > 0) {
      const formattedTrades: ISortedTrade = this.formatTrades(ticker, newTrades);
      updatedTrades = this.combineTrades(trades, formattedTrades);
      this._trades[ticker] = updatedTrades;
    }
    return updatedTrades;
  }

  listCandlestickData(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ): ICandlestickData[] {
    const sortedTrades = this.sortTrades(ticker, options);
    const candlestickData: ICandlestickData[] = Object.values(sortedTrades).map(t => ({
      x: new Date(t.second * 1000),
      y: {
        open: +t.trades.open.price,
        high: +t.trades.high.price,
        low: +t.trades.low.price,
        close: +t.trades.open.price,
      },
    }));
    return candlestickData;
  }
  */

  listTickerPositions(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ): number[] {
    // const sortedTrades = this.sortTrades(ticker, options);
    // const dataArray: number[] = Object.values(sortedTrades).map(t => +t.trades.open.price);
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

  updateTickers(value: ITickerItem[]) {
    let tickers: {[currency: string]: ITickerData} = {};
    tickers = [...value].reduce((prev, curr) => {
      if (!prev[curr.currency]) prev[curr.currency] = {...curr, lineGraphProps: {dataArray: []}};
      return prev;
    }, tickers);
    this.tickers = tickers;
    return tickers;
  }

  getCurrencyRate(currency: string): number {
    if (!this._tickers[currency]) return 0;
    return currency === unitAsset ? 1 : this._tickers[currency].price;
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

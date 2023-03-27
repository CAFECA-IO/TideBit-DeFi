import {TRADING_CRYPTO_DATA} from '../../constants/config';
import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import {
  ISortedTrade,
  ITBETrade,
  ITickerData,
  ITickerMarket,
} from '../../interfaces/tidebit_defi_background/ticker_data';
import {ITickerHistoryData} from '../../interfaces/tidebit_defi_background/ticker_history_data';
import {
  getTime,
  ITimeSpanUnion,
  TimeSpanUnion,
} from '../../interfaces/tidebit_defi_background/time_span_union';
import {convertTradesToCandlestickData, millesecondsToSeconds} from '../common';

class TickerBook {
  private _dataLength = 1000;
  private _timeSpan: ITimeSpanUnion = TimeSpanUnion._1s;
  private _limit = 50;
  private _tickers: {[currency: string]: ITickerData} = {};
  private _trades: {
    [currency: string]: ISortedTrade;
  } = {};
  private _candlesticks: {[currency: string]: ICandlestickData[]} = {};
  private _tickerHistories: {[currency: string]: ITickerHistoryData[]} = {};

  constructor() {
    this._tickers = {};
    this._candlesticks = {};
    this._trades = {};
    this._tickerHistories = {};
    for (const tradingData of TRADING_CRYPTO_DATA) {
      if (!this._candlesticks[tradingData.currency]) this._candlesticks[tradingData.currency] = [];
      if (!this._tickerHistories[tradingData.currency])
        this._tickerHistories[tradingData.currency] = [];
    }
  }

  formatTrades(ticker: string, trades: ITBETrade[]) {
    const newTrades = [...trades].sort((a, b) => +a.ts - +b.ts);
    const timeSpan = getTime(TimeSpanUnion._1s),
      begin =
        this._trades[ticker] && Object.keys(this._trades[ticker]).length > 0
          ? Math.min(millesecondsToSeconds(+newTrades[0].ts), +Object.keys(this._trades[ticker])[0])
          : millesecondsToSeconds(+newTrades[0].ts);
    let formattedTrades: ISortedTrade = {};
    formattedTrades = trades.reduce((prev, curr, index) => {
      const timestamp = begin + index * timeSpan;
      const second = millesecondsToSeconds(timestamp);
      const nextSecond = millesecondsToSeconds(timestamp + timeSpan);
      if (+curr.ts <= timestamp) {
        prev[second].trades.close = curr;
        if (+curr.price > +prev[second].trades.high.price) prev[second].trades.high = curr;
        if (+curr.price < +prev[second].trades.low.price) prev[second].trades.low = curr;
      } else {
        prev[nextSecond] = {
          second: nextSecond,
          trades: {
            open: curr,
            high: curr,
            low: curr,
            close: curr,
          },
        };
      }
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
    const _timeSpan = options.timeSpan || this.timeSpan;
    let trades = Object.values(this._trades[ticker]).filter(
      trade =>
        (options.begin && trade.second >= options.begin) ||
        (options.end && trade.second <= options.end)
    );
    let sortedTrades: ISortedTrade = {};
    if (_timeSpan !== TimeSpanUnion._1s) {
      const timeSpan = getTime(_timeSpan);
      sortedTrades = trades.reduce((prev, curr, index) => {
        const timestamp = (trades[0].second + index) * timeSpan;
        const span = millesecondsToSeconds(timestamp);
        const nextSpan = millesecondsToSeconds(timestamp + timeSpan);
        if (+curr.second <= timestamp) {
          prev[span].trades.close = curr.trades.close;
          if (+curr.trades.high.price > +prev[span].trades.high.price)
            prev[span].trades.high = curr.trades.high;
          if (+curr.trades.low.price < +prev[span].trades.low.price)
            prev[span].trades.low = curr.trades.low;
        } else {
          prev[nextSpan] = curr;
        }
        return prev;
      }, sortedTrades);
    } else {
      sortedTrades = trades.reduce((prev, curr) => {
        prev[curr.second] = curr;
        return prev;
      }, sortedTrades);
    }
    if (options.limit) trades = trades.slice(trades.length - options.limit, trades.length);
    return sortedTrades;
  }

  listTickerPositions(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ) {
    const sortedTrades = this.sortTrades(ticker, options);
    return Object.values(sortedTrades).map(t => +t.trades.open.price);
  }

  listCandlestickData(
    ticker: string,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ): ICandlestickData[] {
    const sortedTrades = this.sortTrades(ticker, options);
    return Object.values(sortedTrades).map(t => ({
      x: new Date(t.second),
      y: {
        open: +t.trades.open.price,
        high: +t.trades.high.price,
        low: +t.trades.low.price,
        close: +t.trades.open.price,
      },
    }));
  }

  updateTrades(ticker: string, trades: ITBETrade[]) {
    const updatedTrades = this.combineTrades(
      {...this._trades[ticker]},
      this.formatTrades(ticker, trades)
    );
    if (this._tickers[ticker])
      this._tickers[ticker].lineGraphProps.dataArray = this.listTickerPositions(ticker, {});
    return updatedTrades;
  }

  updateCandlestickByTrade(ticker: string, trades: ITBETrade[]) {
    const lastestBarTime =
      this.candlesticks[ticker].length > 0
        ? this.candlesticks[ticker][this.candlesticks[ticker].length - 1].x.getTime()
        : 0;
    const filterTrades = trades.filter(trade => trade.at * 1000 >= lastestBarTime);
    const candlestickChartData: ICandlestickData[] = convertTradesToCandlestickData(
      filterTrades,
      this.timeSpan,
      lastestBarTime
    );
    if (candlestickChartData.length > 0) {
      this._candlesticks[ticker] = this._candlesticks[ticker].concat(candlestickChartData);

      if (this._candlesticks[ticker].length > this._dataLength) {
        try {
          this._candlesticks[ticker] = this._candlesticks[ticker].slice(
            this._candlesticks[ticker].length - this._dataLength,
            this._candlesticks[ticker].length
          );
        } catch (error) {
          // TODO: error handle (20230321 - tzuhan)
          // eslint-disable-next-line no-console
          console.error(`this._candlesticks[ticker].slice error`, error);
        }
      }
      if (!this._tickers[ticker].lineGraphProps.dataArray)
        this._tickers[ticker].lineGraphProps.dataArray = [];
      this._tickers[ticker].lineGraphProps.dataArray = this._tickers[
        ticker
      ].lineGraphProps.dataArray?.concat(
        candlestickChartData.filter(d => !!d.y.open).map(d => d.y.open!)
      );
      if (this._tickers[ticker].lineGraphProps.dataArray?.length || 0 > this._dataLength) {
        try {
          let array: number[] = [...this._tickers[ticker].lineGraphProps.dataArray!];
          array = array.slice(array.length - this._dataLength, array.length);
          this._tickers[ticker].lineGraphProps.dataArray = array;
        } catch (error) {
          // TODO: error handle (20230321 - tzuhan)
          // eslint-disable-next-line no-console
          console.error(`this._tickers[ticker].lineGraphProps.slice error`, error);
        }
      }
    }
  }

  updateTickerHistory(ticker: string, value: ICandlestickData[]) {
    this._tickerHistories[ticker] = value.map(v => ({date: v.x, open: v.y.open}));
  }

  updateCandlestick(ticker: string, value: ICandlestickData[]) {
    this._candlesticks[ticker] = value;
  }

  updateTicker(value: ITickerMarket) {
    const tickers: {[currency: string]: ITickerData} = {...this.tickers};
    tickers[value.currency] = {
      ...tickers[value.currency],
      price: value.price,
      upOrDown: value.upOrDown,
      priceChange: value.priceChange,
      fluctuating: value.fluctuating,
      tradingVolume: value.tradingVolume,
    };
    this.tickers = tickers;
    return tickers;
  }

  updateTickers(value: ITickerData[]) {
    let tickers: {[currency: string]: ITickerData} = {};
    tickers = [...value].reduce((prev, curr) => {
      if (!prev[curr.currency]) prev[curr.currency] = curr;
      return prev;
    }, tickers);
    this.tickers = tickers;
    return tickers;
  }

  get candlesticks(): {[currency: string]: ICandlestickData[]} {
    return this._candlesticks;
  }

  set candlesticks(value: {[currency: string]: ICandlestickData[]}) {
    this._candlesticks = value;
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

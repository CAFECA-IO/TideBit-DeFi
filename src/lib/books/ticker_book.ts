import {
  getDummyCandlestickChartData,
  ICandlestickData,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import {
  dummyTickers,
  ITBETrade,
  ITickerData,
  ITickerMarket,
} from '../../interfaces/tidebit_defi_background/ticker_data';
import {
  ITimeSpanUnion,
  TimeSpanUnion,
} from '../../interfaces/tidebit_defi_background/time_span_union';
import {convertTradesToCandlestickData} from '../common';

class TickerBook {
  private _timeSpan: ITimeSpanUnion = TimeSpanUnion._1s;
  private _limit = 50;
  private _tickers: {[currency: string]: ITickerData} = {};
  private _candlesticks: {[currency: string]: ICandlestickData[]} = {};

  constructor() {
    this._tickers = {};
    this._candlesticks = {};
    this._tickers = dummyTickers.reduce((prev, curr) => {
      if (!prev[curr.currency]) prev[curr.currency] = curr;
      return prev;
    }, this._tickers);
    this._candlesticks = dummyTickers.reduce((prev, curr) => {
      if (!prev[curr.currency])
        prev[curr.currency] = getDummyCandlestickChartData(80, this.timeSpan);
      return prev;
    }, this._candlesticks);
  }

  updateCandlestickByTrade(market: string, trades: ITBETrade[]) {
    const ticker = market.replace(`usdt`, ``).toUpperCase();
    const lastestBarTime =
      this.candlesticks[ticker][this.candlesticks[ticker].length - 1].x.getTime();
    const filterTrades = trades.filter(trade => trade.at * 1000 >= lastestBarTime);
    const candlestickChartData: ICandlestickData[] = convertTradesToCandlestickData(
      filterTrades,
      this.timeSpan,
      lastestBarTime
    );
    if (candlestickChartData.length > 0) {
      this._candlesticks[ticker] = this._candlesticks[ticker].concat(candlestickChartData);
      /*
      //  TODO: trim data (20230321 - tzuhan)
      this._candlesticks[ticker] = this._candlesticks[ticker].slice(
        this._candlesticks[ticker].length - 500,
        this._candlesticks[ticker].length
      );
      */
      this._tickers[ticker].lineGraphProps.dataArray = this._tickers[
        ticker
      ].lineGraphProps.dataArray?.concat(
        candlestickChartData.filter(d => !!d.open).map(d => d.open!)
      );
    }
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

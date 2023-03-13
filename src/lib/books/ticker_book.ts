import {
  getDummyCandlestickChartData,
  getTime,
  ICandlestickData,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import {
  dummyTickers,
  ITBETrade,
  ITickerData,
} from '../../interfaces/tidebit_defi_background/ticker_data';
import {
  ITimeSpanUnion,
  TimeSpanUnion,
} from '../../interfaces/tidebit_defi_background/time_span_union';

class TickerBook {
  count = 1;
  private _timeSpan: ITimeSpanUnion = TimeSpanUnion._1m;
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
    if (this.count > 0) {
      const ticker = market.replace(`usdt`, ``).toUpperCase();
      const lastestBarTime =
        this.candlesticks[ticker][this.candlesticks[ticker].length - 1].x.getTime();
      const filterTrades = trades
        .filter(trade => trade.at * 1000 >= lastestBarTime)
        .sort((a, b) => a.at - b.at);
      const timeSpan = getTime(this.timeSpan);
      let sortTrades: number[][] = [];
      sortTrades = filterTrades.reduce((prev, curr, index) => {
        if (+curr.ts - lastestBarTime > (index + 1) * timeSpan) {
          prev = [...prev, [+curr.price]];
        } else {
          let tmp: number[] = prev.pop() || [];
          tmp = [...tmp, +curr.price];
          prev = [...prev, tmp];
        }
        return prev;
      }, sortTrades);
      if (sortTrades.length > 0) {
        // Till: test log (20230407 - Tzuhan)
        // // eslint-disable-next-line no-console
        // console.log(`updateCandlestick this.timeSpan${this.timeSpan}:timeSpan[${timeSpan}]`);
        // // eslint-disable-next-line no-console
        // console.log(`updateCandlestick this.candlesticks[${ticker}]: `, this.candlesticks[ticker]);
        // // eslint-disable-next-line no-console
        // console.log(
        //   `updateCandlestick filterTrades[${filterTrades.length}]: ${ticker}`,
        //   filterTrades.map(trade => ({...trade, date: new Date(+trade.date)}))
        // );
        // // eslint-disable-next-line no-console
        // console.log(
        //   `updateCandlestick +filterTrades[0].ts${+filterTrades[0]
        //     .ts} - lastestBarTime[${lastestBarTime}]: `,
        //   +filterTrades[0].ts - lastestBarTime
        // );
        // // eslint-disable-next-line no-console
        // console.log(
        //   `updateCandlestick +filterTrades[filterTrades.length-1].ts${+filterTrades[
        //     filterTrades.length - 1
        //   ].ts} - lastestBarTime[${lastestBarTime}]: `,
        //   +filterTrades[0].ts - lastestBarTime
        // );
        // // eslint-disable-next-line no-console

        // // eslint-disable-next-line no-console
        // console.log(`updateCandlestick sortTrades[${sortTrades.length}]: ${ticker}`, sortTrades);
        for (const sortTrade of sortTrades) {
          const open = sortTrade[0];
          const high = Math.max(...sortTrade);
          const low = Math.min(...sortTrade);
          const close = sortTrade[sortTrade.length - 1];
          this._candlesticks[ticker] = this._candlesticks[ticker].concat({
            x: new Date(lastestBarTime + timeSpan),
            y: [open, high, low, close],
          });
          this._tickers[ticker].lineGraphProps.dataArray =
            this._tickers[ticker].lineGraphProps.dataArray?.concat(open);
        }
      }
    }
  }

  updateCandlestick(ticker: string, value: ICandlestickData[]) {
    this._candlesticks[ticker] = value;
  }

  updateTicker(value: ITickerData) {
    const tickers: {[currency: string]: ITickerData} = {...this.tickers};
    tickers[value.currency] = {...value};
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

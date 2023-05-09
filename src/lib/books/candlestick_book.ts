import {
  ICandlestick,
  ICandlestickData,
  ISortedCandlestick,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import {getTime, ITimeSpanUnion, TimeSpanUnion} from '../../constants/time_span_union';
import {millesecondsToSeconds} from '../common';
import {IPusherAction} from '../../interfaces/tidebit_defi_background/pusher_data';

class CandlestickBook {
  private _dataLength = 1000;
  private _timeSpan: ITimeSpanUnion = TimeSpanUnion._1s;
  private _limit = 50;
  private _candlesticks: {[instId: string]: ICandlestickData[]} = {};

  constructor() {
    this._candlesticks = {};
  }

  sortCandlesticks(
    instId: string,
    options: {begin?: Date; end?: Date; limit?: number; timeSpan?: ITimeSpanUnion}
  ) {
    if (!this._candlesticks[instId]) this._candlesticks[instId] = [];
    const _timeSpan = options.timeSpan || this.timeSpan;
    let candlesticks: ICandlestickData[] = this._candlesticks[instId].filter(
      candlestick =>
        (!options.begin ||
          (options.begin.getTime() &&
            new Date(candlestick.x).getTime() >= options.begin.getTime())) &&
        (!options.end ||
          (options.end.getTime() && new Date(candlestick.x).getTime() <= options.end.getTime()))
    );
    candlesticks.sort((a, b) => a.x.getTime() - b.x.getTime());
    if (options.limit)
      candlesticks = candlesticks.slice(candlesticks.length - options.limit, candlesticks.length);
    let sortedCandlesticks: ISortedCandlestick = {};
    if (candlesticks.length > 0 && _timeSpan !== TimeSpanUnion._1s) {
      const begin = millesecondsToSeconds(candlesticks[0].x.getTime());
      const end = millesecondsToSeconds(candlesticks[candlesticks.length - 1].x.getTime());
      const timeSpan = millesecondsToSeconds(getTime(_timeSpan));
      for (let i = begin; i <= end; i += timeSpan) {
        const datas = candlesticks.filter(
          c =>
            millesecondsToSeconds(c.x.getTime()) >= i &&
            millesecondsToSeconds(c.x.getTime()) < i + timeSpan
        );
        datas.sort((a, b) => a.x.getTime() - b.x.getTime());
        if (datas.length > 0) {
          const open = datas[0].y.open;
          const close = datas[datas.length - 1].y.close;
          const high = Math.max(...datas.map(d => d.y.high || 0));
          const low = Math.min(...datas.map(d => d.y.low || 0));
          sortedCandlesticks[i] = {
            x: new Date(i * 1000),
            y: {
              open,
              close,
              high: high === 0 ? null : high,
              low: low === 0 ? null : low,
            },
          };
        } else if (sortedCandlesticks[i - timeSpan]) {
          sortedCandlesticks[i] = {...sortedCandlesticks[i - timeSpan]};
        }
      }
    } else {
      sortedCandlesticks = candlesticks.reduce((prev, curr) => {
        const second = millesecondsToSeconds(curr.x.getTime());
        prev[second] = {...curr};
        return prev;
      }, sortedCandlesticks);
    }
    return sortedCandlesticks;
  }

  listCandlestickData(
    instId: string,
    options: {begin?: Date; end?: Date; limit?: number; timeSpan?: ITimeSpanUnion}
  ): ICandlestickData[] {
    const sortedCandlesticks = this.sortCandlesticks(instId, options);
    const candlestickData: ICandlestickData[] = Object.values(sortedCandlesticks);
    return candlestickData;
  }

  updateCandlesticksDatas(instId: string, data: ICandlestickData[]) {
    if (!this._candlesticks[instId]) this._candlesticks[instId] = [];
    this._candlesticks[instId] = [...data];
  }

  updateCandlesticksData(action: IPusherAction, data: ICandlestick) {
    const {instId, candlesticks} = data;
    if (!this._candlesticks[instId]) this._candlesticks[instId] = [];
    const sortedCandlesticks: ISortedCandlestick = this._candlesticks[instId].reduce(
      (prev, curr) => {
        const second: number = millesecondsToSeconds(curr.x.getTime());
        prev[second] = {...curr};
        return prev;
      },
      {} as ISortedCandlestick
    );
    for (const candlestick of candlesticks) {
      const second = millesecondsToSeconds(new Date(candlestick.x).getTime());
      if (!sortedCandlesticks[second])
        sortedCandlesticks[second] = {x: new Date(second * 1000), y: {...candlestick.y}};
      else {
        const curr: ICandlestickData = sortedCandlesticks[second];
        if (candlestick.y.high && curr.y.high && +candlestick.y.high > curr.y.high)
          sortedCandlesticks[second].y.high = candlestick.y.high;
        if (candlestick.y.low && curr.y.low && +candlestick.y.low < curr.y.low)
          sortedCandlesticks[second].y.low = candlestick.y.low;
        sortedCandlesticks[second].y.close = candlestick.y.close;
      }
    }
    const updateCandlestickData: ICandlestickData[] = Object.values(sortedCandlesticks);
    updateCandlestickData.sort((a, b) => a.x.getTime() - b.x.getTime());
    this._candlesticks[instId] = updateCandlestickData;
  }

  get candlesticks(): {[instId: string]: ICandlestickData[]} {
    return this._candlesticks;
  }

  set candlesticks(value: {[instId: string]: ICandlestickData[]}) {
    this._candlesticks = value;
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

const CandlestickBookInstance = new CandlestickBook();
export default CandlestickBookInstance;

import {
  ICandle,
  ICandlestick,
  ICandlestickData,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import {getTime, ITimeSpanUnion, TimeSpanUnion} from '../../constants/time_span_union';
import {millesecondsToSeconds} from '../common';
import {IPusherAction} from '../../interfaces/tidebit_defi_background/pusher_data';

export interface ISortedCandlestick {
  [second: string]: {
    second: number;
    candlestick: ICandle;
  };
}

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
    if (options.limit)
      candlesticks = candlesticks.slice(candlesticks.length - options.limit, candlesticks.length);
    let sortedCandlesticks: ISortedCandlestick = {};
    if (candlesticks.length > 0 && _timeSpan !== TimeSpanUnion._1s) {
      const begin = millesecondsToSeconds(candlesticks[0].x.getTime());
      const timeSpan = millesecondsToSeconds(getTime(_timeSpan));
      let nextSpan = begin + timeSpan;
      for (const candlestick of candlesticks) {
        if (!sortedCandlesticks[nextSpan])
          sortedCandlesticks[nextSpan] = {
            second: nextSpan,
            candlestick: sortedCandlesticks[nextSpan - timeSpan].candlestick
              ? {...sortedCandlesticks[nextSpan - timeSpan].candlestick}
              : {...candlestick.y},
          };
        const curr: {
          second: number;
          candlestick: ICandle;
        } = sortedCandlesticks[nextSpan];
        const timestamp = millesecondsToSeconds(candlesticks[0].x.getTime());

        if (timestamp <= nextSpan) {
          if (
            candlestick.y.high &&
            curr.candlestick.high &&
            +candlestick.y.high > +curr.candlestick.high
          )
            sortedCandlesticks[nextSpan].candlestick.high = candlestick.y.high;
          if (
            candlestick.y.low &&
            curr.candlestick.low &&
            +candlestick.y.low < +curr.candlestick.low
          )
            sortedCandlesticks[nextSpan].candlestick.low = candlestick.y.low;
        } else {
          nextSpan += timeSpan;
          sortedCandlesticks[nextSpan] = {
            second: nextSpan,
            candlestick: {
              ...candlestick.y,
            },
          };
        }
      }
    } else {
      sortedCandlesticks = candlesticks.reduce((prev, curr) => {
        const second = millesecondsToSeconds(curr.x.getTime());
        prev[second] = {second, candlestick: {...curr.y}};
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
    const candlestickData: ICandlestickData[] = Object.values(sortedCandlesticks).map(t => ({
      x: new Date(t.second * 1000),
      y: {...t.candlestick},
    }));
    return candlestickData;
  }

  updateCandlestickData(action: IPusherAction, data: ICandlestick) {
    const {instId, candlesticks} = data;
    if (!this._candlesticks[instId]) this._candlesticks[instId] = [];
    const _candlesticks: {
      [second: number]: {
        second: number;
        candlestick: ICandle;
      };
    } = this._candlesticks[instId].reduce(
      (prev, curr) => {
        const second: number = millesecondsToSeconds(curr.x.getTime());
        prev[second] = {second, candlestick: {...curr.y}};
        return prev;
      },
      {} as {
        [second: number]: {
          second: number;
          candlestick: ICandle;
        };
      }
    );
    for (const candlestick of candlesticks) {
      const second = millesecondsToSeconds(new Date(candlestick.x).getTime());
      if (!_candlesticks[second]) _candlesticks[second] = {second, candlestick: {...candlestick.y}};
      else {
        const curr: {
          second: number;
          candlestick: ICandle;
        } = _candlesticks[second];
        if (
          candlestick.y.high &&
          curr.candlestick.high &&
          +candlestick.y.high > curr.candlestick.high
        )
          _candlesticks[second].candlestick.high = candlestick.y.high;
        if (candlestick.y.low && curr.candlestick.low && +candlestick.y.low < curr.candlestick.low)
          _candlesticks[second].candlestick.low = candlestick.y.low;
      }
    }
    const _candlestickData = Object.values(_candlesticks).sort((a, b) => a.second - b.second);
    const updateCandlestickData = _candlestickData.map(t => ({
      x: new Date(t.second * 1000),
      y: {...t.candlestick},
    }));
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

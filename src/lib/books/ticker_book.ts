import {ITickerData, toDummyTickers} from '../../interfaces/tidebit_defi_background/ticker_data';
import {ITimeSpanUnion, TimeSpanUnion} from '../../constants/time_span_union';
import {Currency, ICurrency} from '../../constants/currency';
import {unitAsset} from '../../constants/config';

class TickerBook {
  private _dataLength = 1000;
  private _timeSpan: ITimeSpanUnion = TimeSpanUnion._1s;
  private _limit = 50;
  private _tickers: {[currency in ICurrency]: ITickerData};

  constructor() {
    this._tickers = {...toDummyTickers};
  }

  listTickerPositions(
    ticker: ICurrency,
    options: {begin?: number; end?: number; limit?: number; timeSpan?: ITimeSpanUnion}
  ): number[] {
    // TODO: temporary need further discussion on how to calculate the position (20230424 - tzuhan)
    return this.tickers[ticker]?.lineGraphProps.dataArray || ([] as number[]);
  }

  listTickers(): {[currency in ICurrency]: ITickerData} {
    return this.tickers;
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
    const tickers = [...value].reduce((prev, curr) => {
      if (!prev[curr.currency])
        prev[curr.currency] = {
          ...curr,
          lineGraphProps: {
            dataArray: curr.lineGraphProps.dataArray ? [...curr.lineGraphProps.dataArray] : [],
          },
        };
      return prev;
    }, {} as {[currency in ICurrency]: ITickerData});
    this.tickers = tickers;
    return tickers;
  }

  getCurrencyRate(currency: string): number {
    return currency === unitAsset
      ? 1
      : Object.values(Currency).includes(currency as ICurrency)
      ? this._tickers[currency as ICurrency]?.price || 0
      : 0;
  }

  get tickers(): {[currency in ICurrency]: ITickerData} {
    return this._tickers;
  }

  set tickers(value: {[currency in ICurrency]: ITickerData}) {
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

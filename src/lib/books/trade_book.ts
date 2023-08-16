/** TODO: (20230815 - Shirley)
 * Data:
 * 1. trades: 用來存放所有的交易資料
 * 2. predictedTrades: 用來存放預測的交易資料
 * **3. candlestickChart: 依照時間間隔存放蠟燭圖資料**
 * 4. isPredicting: 用來判斷是否正在預測
 * 5. predictionTimers: 用來存放預測的 timer
 * 6. config: 用來存放設定
 * 7. model: 用來存放預測模型
 * Time span:
 * Live: 用 trades 形成 predictedTrades 再用 predictedTrades 形成蠟燭圖資料後，再存到 candlestickChart；定期檢查trades跟predictedTrades的資料需小於100筆，只保留最新的100筆
 * 5m, 15m, 30m, 1h, 4h, 12h, 1d: 直接 call API 拿到蠟燭圖的資料
 * 1.
 */

import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import {Code} from '../../constants/code';
import {Model} from '../../constants/model';
import {CustomError} from '../custom_error';
import {ITimeSpanUnion, TimeSpanUnion} from '../../constants/time_span_union';

interface ITrade {
  tradeId: string;
  targetAsset: string;
  unitAsset: string;
  direct: string;
  price: number;
  timestampMs: number;
  quantity: number;
}

type ILine = {
  average: number;
  volume: number;
  timestamp: number;
};

type ICandlestickDataWithTimeSpan = {
  [key in ITimeSpanUnion]: ICandlestickData[];
};

interface ITradeBookConfig {
  model?: string;
  initialTrades?: ITrade[];
  intervalMs: number;
  minMsForLinearRegression: number; // Info: 拿幾秒內的資料做預測 (20230522 - Shirley)
  minLengthForLinearRegression: number; // Info: 規定幾秒內至少要有幾筆資料 (20230522 - Shirley)
  holdingTradesMs: number; // Info: 持有多久的資料 (20230601 - Tzuhans)
}

function ensureTickerExistsDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: any, instId: string, ...args: any[]) {
    this.ensureTickerExists(instId);
    return originalMethod.apply(this, [instId, ...args]);
  };
  return descriptor;
}

class TradeBook {
  private trades: Map<string, ITrade[]>;
  private predictedTrades: Map<string, ITrade[]>;
  private candlestickChart: Map<string, ICandlestickDataWithTimeSpan>;
  private convertedTradeIds: Set<string> = new Set();
  private isPredicting: Map<string, boolean>;
  private predictionTimers: Map<string, NodeJS.Timeout>;
  private config: ITradeBookConfig;
  private model: string;

  constructor(config: ITradeBookConfig) {
    this.config = config;
    this.trades = new Map();
    this.predictedTrades = new Map();
    this.candlestickChart = new Map();
    this.isPredicting = new Map();
    this.predictionTimers = new Map();
    this.model = Model.LINEAR_REGRESSION;
  }

  @ensureTickerExistsDecorator
  addTrades(instId: string, trades: ITrade[]) {
    const vaildTrades = trades.filter(trade => this.isValidTrade(trade));

    this.resetPrediction(instId);

    for (const trade of vaildTrades) {
      if (this.trades.get(instId)!.length >= this.config.minLengthForLinearRegression) {
        const lastTrade = this.getLastTrade(instId);
        const timestampDifference = trade.timestampMs - lastTrade.timestampMs;

        if (timestampDifference > this.config.intervalMs) {
          this.fillPredictedData(instId, trades, trade.timestampMs);
        }
      }

      this._add(instId, trade);
    }

    this.startPredictionLoop(instId);
  }

  @ensureTickerExistsDecorator
  add(instId: string, trade: ITrade): void {
    const trades = this.trades.get(instId)!;

    if (!this.isValidTrade(trade)) {
      throw new Error('Invalid trade');
    }

    this.resetPrediction(instId);

    if (trades.length >= this.config.minLengthForLinearRegression) {
      const lastTrade = this.getLastTrade(instId);
      const timestampDifference = trade.timestampMs - lastTrade.timestampMs;

      if (timestampDifference > this.config.intervalMs) {
        this.fillPredictedData(instId, trades, trade.timestampMs);
      }
    }

    this._add(instId, trade);

    // FIXME: temporarily comment out (20230816 - Shirley)
    // this.startPredictionLoop(instId);
  }

  @ensureTickerExistsDecorator
  private resetPrediction(instId: string): void {
    if (this.predictionTimers.has(instId)) {
      clearTimeout(this.predictionTimers.get(instId)!);
      this.predictionTimers.delete(instId);
    }
  }

  @ensureTickerExistsDecorator
  private _add(instId: string, trade: ITrade): void {
    let newTrade: ITrade = {...trade};

    const isPredictedData = newTrade.tradeId.includes('-');

    const trades = this.trades.get(instId)!;
    const predictedTrades = this.predictedTrades.get(instId)!;

    // Info: 檢查這筆trade是預測的還是真實的，然後存進不同變數裡 (20230816 - Shirley)
    if (!isPredictedData) {
      trades.push(newTrade);
      predictedTrades.push(newTrade);
    } else {
      if (predictedTrades.length < 1) throw new Error('Invalid predicted trade');

      const lastTradeId = this.getLastPredictedTrade(instId).tradeId.split('-');

      const tradeId = `${
        lastTradeId.length > 1
          ? `${lastTradeId[0]}-${Number(lastTradeId[1]) + 1}`
          : `${lastTradeId[0]}-1`
      }`;

      newTrade = {...trade, tradeId};

      this.predictedTrades.get(instId)!.push(newTrade);
    }

    // Info: 檢查這筆trade有沒有被轉換成candlestickChart過 (20230816 - Shirley)
    if (!this.isTradeConvertedToCandlestick(newTrade.tradeId)) {
      this.ensureCandlestickDataExists(instId);
      this.convertTradesToCandlestickData(instId, [trade], TimeSpanUnion._1s);
      this.convertedTradeIds.add(newTrade.tradeId);
    }

    // TODO: dev (20230816 - Shirley)
    // eslint-disable-next-line no-console
    console.log('this.candlestickChart in _add', this.candlestickChart);
    // console.log('this.convertedTradeIds in _add', this.convertedTradeIds);

    // TODO: dev
    // console.log('trades in _add', trades);
    // console.log('predictedTrades in _add', predictedTrades);
    // console.log('new trade to be added', trade);
  }

  /* Deprecated: replaced by _trim() (20230703 - Shirley)
  private _trim(): void {
    const now = Date.now();
    const cutoffTime = now - this.config.holdingTradesMs;
    if (
      this.trades[0].timestampMs < cutoffTime ||
      this.predictedTrades[0].timestampMs < cutoffTime
    ) {
      this.trades = Object.values(
        this.trades
          .filter(trade => trade.timestampMs >= cutoffTime) // Info: 保留 15 分鐘內的資料 (20230601 - Tzuhan)
          .reduce((acc, cur) => {
            // Info: remove duplicate tradeId (20230601 - Tzuhan)
            acc[cur.tradeId] = cur;
            return acc;
          }, {} as {[key: string]: ITrade})
      ).sort((a, b) => +a.tradeId - +b.tradeId); // Info: sort by tradeId (20230601 - Tzuhan)
      this.predictedTrades = Object.values(
        this.predictedTrades
          .filter(trade => trade.timestampMs >= cutoffTime)
          .reduce((acc, cur) => {
            acc[cur.tradeId] = cur;
            return acc;
          }, {} as {[key: string]: ITrade})
      ).sort((a, b) => +a.tradeId - +b.tradeId);
    }
  }
  */

  @ensureTickerExistsDecorator
  private _trim(instId: string): void {
    const trades = this.trades.get(instId)!;
    const predictedTrades = this.predictedTrades.get(instId)!;

    const now = Date.now();
    const cutoffTime = now - this.config.holdingTradesMs;

    if (trades[0]?.timestampMs < cutoffTime || predictedTrades[0]?.timestampMs < cutoffTime) {
      const trimmedTrades = Object.values(
        trades
          .filter(trade => {
            return trade.timestampMs >= cutoffTime;
          })
          .reduce(
            (acc, cur) => {
              acc[cur.tradeId] = cur;
              return acc;
            },
            {} as {[key: string]: ITrade}
          )
      ).sort((a, b) => +a.tradeId - +b.tradeId);

      this.trades.set(instId, trimmedTrades);

      const trimmedPredictedTrades = Object.values(
        predictedTrades
          .filter(trade => trade.timestampMs >= cutoffTime)
          .reduce(
            (acc, cur) => {
              acc[cur.tradeId] = cur;
              return acc;
            },
            {} as {[key: string]: ITrade}
          )
      ).sort((a, b) => +a.tradeId - +b.tradeId);

      this.predictedTrades.set(instId, trimmedPredictedTrades);
    }
  }

  @ensureTickerExistsDecorator
  private startPredictionLoop(instId: string) {
    this.resetPrediction(instId);
    this.togglePredicting(instId, true);

    // Info: setTimeout + 遞迴 (20230522 - Shirley)
    this.predictionTimers.set(
      instId,
      setTimeout(() => {
        if (this.isPredicting.get(instId)) {
          this.predictNextTrade(
            instId,
            this.predictedTrades.get(instId)!,
            this.config.intervalMs,
            1
          );
          this._trim(instId);
          this.startPredictionLoop(instId);
        }
      }, this.config.intervalMs)
    );
  }

  predictNextTrade(instId: string, trades: ITrade[], periodMs: number, length: number) {
    let prediction: ITrade[] | undefined;

    switch (this.model) {
      case Model.LINEAR_REGRESSION:
        prediction = this.linearRegression(trades, periodMs, length);
        break;

      default:
        break;
    }

    if (prediction !== undefined) {
      for (let i = 0; i < length; i++) {
        this._add(instId, prediction[i]);
      }
    }
  }

  @ensureTickerExistsDecorator
  fillPredictedData(instId: string, trades: ITrade[], targetTimestampMs: number) {
    const lastTradeTimestamp = trades[trades.length - 1]?.timestampMs;

    if (!!lastTradeTimestamp && !!targetTimestampMs) {
      const timestampDifference = targetTimestampMs - lastTradeTimestamp;

      if (timestampDifference > this.config.intervalMs) {
        const counts = Math.floor(timestampDifference / 100) - 1;

        const predictedTrades = this.predictNextTrade(
          instId,
          trades,
          this.config.intervalMs,
          counts
        );

        if (predictedTrades !== undefined) this.predictedTrades.set(instId, predictedTrades);
      }
    }
  }

  private convertTradesToCandlestickData(
    instId: string,
    trades: ITrade[],
    timeSpan: keyof ICandlestickDataWithTimeSpan // TODO: use time_span_union instead (20230815 - Shirley)
  ) {
    const candlestickData = this.toCandlestick(instId, 0.1, 100, trades);

    for (let i = 0; i < candlestickData.length; i++) {
      this.candlestickChart.get(instId)![timeSpan].push(candlestickData[i]);
    }

    // TODO: dev (20230815 - Shirley)
    // eslint-disable-next-line no-console
    console.log('candlestickData in convertTradesToCandlestickData', candlestickData);
    // eslint-disable-next-line no-console
    console.log('this.candlestickChart in convertTradesToCandlestickData', this.candlestickChart);
  }

  linearRegression(trades: ITrade[], periodMs: number, length: number): ITrade[] | undefined {
    if (trades.length < this.config.minLengthForLinearRegression) return;

    const newTrades: ITrade[] = [...trades];

    const cutoffTimeMs = Date.now() - this.config.minMsForLinearRegression;
    const recentTrades = trades.filter(
      t => t.timestampMs > cutoffTimeMs && !t.tradeId.includes('-')
    );

    // Info: Average prices with same timestamp (20230522 - Shirley)
    const timestampMap = new Map();
    recentTrades.forEach(trade => {
      if (timestampMap.has(trade.timestampMs)) {
        const prev = timestampMap.get(trade.timestampMs);
        const totalQuantity = prev.quantity + trade.quantity;
        timestampMap.set(trade.timestampMs, {
          ...prev,
          price: (prev.price * prev.quantity + trade.price * trade.quantity) / totalQuantity,
        });
      } else {
        timestampMap.set(trade.timestampMs, trade);
      }
    });

    const averagedTrades = Array.from(timestampMap.values());
    if (averagedTrades.length < this.config.minLengthForLinearRegression) return;

    // Info: (20230522 - Shirley) Step 2: Prepare data for regression
    const {m, b} = this.getLinearRegressionVariables(averagedTrades);

    for (let i = 0; i < length; i++) {
      // Info: (20230522 - Shirley) Step 3: Predict price for the next period
      const lastTrade = trades[trades.length - 1];
      const nextTime = lastTrade.timestampMs + periodMs * (i + 1);
      const nextPrice = Number((m * nextTime + b).toFixed(2));
      const newTradeId = `-`;

      const newTrade = {
        tradeId: newTradeId,
        targetAsset: lastTrade.targetAsset,
        unitAsset: lastTrade.unitAsset,
        direct: lastTrade.direct,
        price: nextPrice,
        timestampMs: nextTime,
        quantity: 0,
      };

      newTrades.push(newTrade);
    }

    const prediction = newTrades.slice(-length);

    return prediction;
  }

  private getLinearRegressionVariables(trades: ITrade[]): {m: number; b: number} {
    // Info: (20230522 - Shirley) Step 2: Prepare data for regression
    const totalQuantity = trades.reduce((total, trade) => total + trade.quantity, 0);
    const weightedPrices = trades.map(trade => trade.price * (trade.quantity / totalQuantity));
    const weightedTimestamp = trades.map(
      trade => trade.timestampMs * (trade.quantity / totalQuantity)
    );
    const wTimestampSum = weightedTimestamp.reduce((a, b) => a + b, 0);
    const wPriceSum = weightedPrices.reduce((a, b) => a + b, 0);

    const x = trades.map((t, i) => t.timestampMs);
    const y = trades.map(t => t.price);

    // Info: (20230522 - Shirley) Step 3: Calculate means
    const meanX = x.reduce((a, b, i) => a + weightedTimestamp[i] * b, 0) / wTimestampSum;
    const meanY = y.reduce((a, b, i) => a + weightedPrices[i] * b, 0) / wPriceSum;

    // Info: (20230522 - Shirley) Step 4: Calculate slope for the formula: y = mx + b
    const subtractX = x.map(val => val - meanX);
    const subtractY = y.map(val => val - meanY);

    const multiplySubtract = subtractX.map((val, i) => val * subtractY[i]);
    const squareSubtractX = subtractX.map(val => val * val);

    const sumMultiplySubtract = multiplySubtract.reduce((a, b) => a + b, 0);
    const sumSquareSubtractX = squareSubtractX.reduce((a, b) => a + b, 0);

    const m = sumMultiplySubtract / sumSquareSubtractX;
    const b = meanY - m * meanX;

    return {m, b};
  }

  togglePredicting = (instId: string, value?: boolean) => {
    if (!this.isPredicting.has(instId)) {
      this.isPredicting.set(instId, false);
    }

    if (value === undefined) {
      this.isPredicting.set(instId, !this.isPredicting.get(instId));
    } else {
      this.isPredicting.set(instId, value);
    }
  };

  get predicting() {
    return this.isPredicting;
  }

  get predictionModel() {
    return this.model;
  }

  setModel(model: string) {
    switch (model) {
      case Model.LINEAR_REGRESSION:
        this.model = Model.LINEAR_REGRESSION;
        break;

      default:
        this.model = Model.LINEAR_REGRESSION;
    }
  }

  setConfig(config: ITradeBookConfig) {
    this.config = config;
  }

  get allTrades() {
    return this.predictedTrades;
  }

  @ensureTickerExistsDecorator
  listTrades(instId: string) {
    return this.predictedTrades.get(instId);
  }

  @ensureTickerExistsDecorator
  toLineChart(instId: string, interval: number, length: number): ILine[] {
    const trades = this.predictedTrades.get(instId)!;

    if (trades.length === 0) return [];

    const lines: ILine[] = [];
    const intervalMs = interval * 1000;

    let lastTimestamp = trades[trades.length - 1].timestampMs;
    const remainderLastTimestamp = lastTimestamp % intervalMs;
    if (remainderLastTimestamp !== 0) {
      lastTimestamp = intervalMs - remainderLastTimestamp + lastTimestamp;
    }
    const firstTimestamp = lastTimestamp - length * intervalMs;

    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const tradesInInterval = trades.filter(
        t => t.timestampMs >= i && t.timestampMs < i + intervalMs
      );
      if (tradesInInterval.length > 0) {
        const average =
          tradesInInterval.reduce((sum, t) => sum + t.price, 0) / tradesInInterval.length;
        const volume = tradesInInterval.reduce((sum, t) => sum + t.quantity, 0);
        lines.push({average, volume, timestamp: i});
      }
    }
    return lines;
  }

  @ensureTickerExistsDecorator
  toCandlestick(
    instId: string,
    interval: number,
    length: number,
    tradesArray?: ITrade[]
  ): ICandlestickData[] {
    const trades =
      !tradesArray || tradesArray.length === 0 ? this.predictedTrades.get(instId)! : tradesArray;

    if (trades.length === 0) return [];

    const candleSticks: ICandlestickData[] = [];
    const intervalMs = interval * 1000;

    let lastTimestamp = trades[trades.length - 1].timestampMs;

    const remainderLastTimestamp = lastTimestamp % intervalMs;
    if (remainderLastTimestamp !== 0) {
      lastTimestamp = intervalMs - remainderLastTimestamp + lastTimestamp;
    }
    const firstTimestamp = lastTimestamp - length * intervalMs;

    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const tradesInInterval = trades.filter(
        t => t.timestampMs >= i && t.timestampMs < i + intervalMs
      );

      if (tradesInInterval.length > 0) {
        const open = tradesInInterval[0].price;
        const close = tradesInInterval[tradesInInterval.length - 1].price;
        const high = Math.max(...tradesInInterval.map(t => t.price));
        const low = Math.min(...tradesInInterval.map(t => t.price));
        const volume = tradesInInterval.reduce((sum, t) => sum + t.quantity, 0);
        const value = tradesInInterval.reduce((sum, t) => sum + t.quantity * t.price, 0);
        candleSticks.push({
          x: new Date(i),
          y: {
            open,
            high,
            low,
            close,
            volume,
            value,
          },
        });
      }
    }

    return candleSticks;
  }

  isValidTrade(trade: any): trade is ITrade {
    return (
      'tradeId' in trade &&
      'targetAsset' in trade &&
      'unitAsset' in trade &&
      'direct' in trade &&
      'price' in trade &&
      'timestampMs' in trade &&
      'quantity' in trade
    );
  }

  getCandlestickData(instId: string): ICandlestickDataWithTimeSpan | undefined {
    this.ensureCandlestickDataExists(instId);

    return this.candlestickChart.get(instId);
  }

  addCandlestickData(instId: string, timeSpan: ITimeSpanUnion, data: ICandlestickData[]): void {
    this.ensureCandlestickDataExists(instId);

    // 獲取該instId的candlestick資料
    const instData = this.candlestickChart.get(instId);

    if (instData) {
      // 將新的candlestick資料寫入指定的時間跨度
      instData[timeSpan] = data;
    }
  }

  private ensureTickerExists(instId: string) {
    if (!this.trades.has(instId)) {
      this.trades.set(instId, []);
    }

    if (!this.predictedTrades.has(instId)) {
      this.predictedTrades.set(instId, []);
    }
  }

  @ensureTickerExistsDecorator
  private getLastTrade(instId: string) {
    const trades = this.trades.get(instId);
    return trades![trades!.length - 1];
  }

  @ensureTickerExistsDecorator
  private getLastPredictedTrade(instId: string) {
    const predictedTrades = this.predictedTrades.get(instId);
    return predictedTrades![predictedTrades!.length - 1];
  }

  private ensureCandlestickDataExists(instId: string) {
    if (!this.candlestickChart.has(instId)) {
      const initialData: ICandlestickDataWithTimeSpan = {
        '1s': [],
        '5m': [],
        '15m': [],
        '30m': [],
        '1h': [],
        '4h': [],
        '12h': [],
        '1d': [],
      };
      this.candlestickChart.set(instId, initialData);
    }
  }

  private isTradeConvertedToCandlestick(tradeId: string): boolean {
    return this.convertedTradeIds.has(tradeId);
  }
}

const TradeBookInstance = new TradeBook({
  intervalMs: 100,
  model: Model.LINEAR_REGRESSION,
  minLengthForLinearRegression: 2,
  minMsForLinearRegression: 1000 * 30,
  holdingTradesMs: 1000 * 60 * 15, // Info: 15 minutes in milliseconds (ms) (20230601 - Tzuhan)
});

export default TradeBookInstance;

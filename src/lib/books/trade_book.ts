import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import {Code} from '../../constants/code';
import {Model} from '../../constants/model';
import {CustomError} from '../custom_error';

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

type ICandlestick = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
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
  // Deprecated: Test decorator (20230704 - Shirley)
  // eslint-disable-next-line no-console
  console.log('descriptor: ', descriptor);
  const originalMethod = descriptor.value;
  descriptor.value = function (this: any, ticker: string, ...args: any[]) {
    this.ensureTickerExists(ticker);
    return originalMethod.apply(this, [ticker, ...args]);
  };
  return descriptor;
}

class TradeBook {
  private trades: Map<string, ITrade[]>;
  private predictedTrades: Map<string, ITrade[]>;
  private isPredicting: Map<string, boolean>;
  private predictionTimers: Map<string, NodeJS.Timeout>;
  private config: ITradeBookConfig;
  private model: string;

  constructor(config: ITradeBookConfig) {
    this.config = config;
    this.trades = new Map();
    this.predictedTrades = new Map();
    this.isPredicting = new Map();
    this.predictionTimers = new Map();
    this.model = Model.LINEAR_REGRESSION;
  }

  // @ensureTickerExistsDecorator
  addTrades(ticker: string, trades: ITrade[]) {
    const vaildTrades = trades.filter(trade => this.isValidTrade(trade));

    this.resetPrediction(ticker);

    for (const trade of vaildTrades) {
      if (this.trades.get(ticker)!.length >= this.config.minLengthForLinearRegression) {
        const lastTrade = this.getLastTrade(ticker);
        const timestampDifference = trade.timestampMs - lastTrade.timestampMs;

        if (timestampDifference > this.config.intervalMs) {
          this.fillPredictedData(ticker, trades, trade.timestampMs);
        }
      }

      this._add(ticker, trade);
    }

    this.startPredictionLoop(ticker);
  }

  // @ensureTickerExistsDecorator
  add(ticker: string, trade: ITrade): void {
    const trades = this.trades.get(ticker)!;

    if (!this.isValidTrade(trade)) {
      throw new Error('Invalid trade');
    }

    this.resetPrediction(ticker);

    if (trades.length >= this.config.minLengthForLinearRegression) {
      const lastTrade = this.getLastTrade(ticker);
      const timestampDifference = trade.timestampMs - lastTrade.timestampMs;

      if (timestampDifference > this.config.intervalMs) {
        this.fillPredictedData(ticker, trades, trade.timestampMs);
      }
    }

    this._add(ticker, trade);

    this.startPredictionLoop(ticker);
  }

  private resetPrediction(ticker: string): void {
    if (this.predictionTimers.has(ticker)) {
      clearTimeout(this.predictionTimers.get(ticker)!);
      this.predictionTimers.delete(ticker);
    }
  }

  // @ensureTickerExistsDecorator
  private _add(ticker: string, trade: ITrade): void {
    const isPredictedData = trade.tradeId.includes('-');
    const trades = this.trades.get(ticker)!;
    const predictedTrades = this.predictedTrades.get(ticker)!;

    if (!isPredictedData) {
      trades.push(trade);
      predictedTrades.push(trade);
    } else {
      if (predictedTrades.length < 1) throw new Error('Invalid predicted trade');

      const lastTradeId = this.getLastPredictedTrade(ticker).tradeId.split('-');

      const tradeId = `${
        lastTradeId.length > 1
          ? `${lastTradeId[0]}-${Number(lastTradeId[1]) + 1}`
          : `${lastTradeId[0]}-1`
      }`;

      this.predictedTrades.get(ticker)!.push({...trade, tradeId});
    }
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

  // @ensureTickerExistsDecorator
  private _trim(ticker: string): void {
    const trades = this.trades.get(ticker)!;
    const predictedTrades = this.predictedTrades.get(ticker)!;

    const now = Date.now();
    const cutoffTime = now - this.config.holdingTradesMs;

    const trimmedTrades = Object.values(
      trades
        .filter(trade => trade.timestampMs >= cutoffTime)
        .reduce((acc, cur) => {
          // Info: remove duplicate tradeId (20230601 - Tzuhan)
          acc[cur.tradeId] = cur;
          return acc;
        }, {} as {[key: string]: ITrade})
    ).sort((a, b) => +a.tradeId - +b.tradeId);

    // Deprecated: Test decorator (20230704 - Shirley)
    // eslint-disable-next-line no-console
    console.log('trimmedTrades', trimmedTrades);

    this.trades.set(ticker, trimmedTrades);

    const trimmedPredictedTrades = Object.values(
      predictedTrades
        .filter(trade => trade.timestampMs >= cutoffTime)
        .reduce((acc, cur) => {
          acc[cur.tradeId] = cur;
          return acc;
        }, {} as {[key: string]: ITrade})
    ).sort((a, b) => +a.tradeId - +b.tradeId);

    // Deprecated: Test decorator (20230704 - Shirley)
    // eslint-disable-next-line no-console
    console.log('trimmedPredictedTrades', trimmedPredictedTrades);

    this.predictedTrades.set(ticker, trimmedPredictedTrades);
  }

  // @ensureTickerExistsDecorator
  private startPredictionLoop(ticker: string) {
    this.resetPrediction(ticker);
    this.togglePredicting(ticker, true);

    // Info: setTimeout + 遞迴 (20230522 - Shirley)
    this.predictionTimers.set(
      ticker,
      setTimeout(() => {
        if (this.isPredicting.get(ticker)) {
          this.predictNextTrade(
            ticker,
            this.predictedTrades.get(ticker)!,
            this.config.intervalMs,
            1
          );
          this._trim(ticker);
          this.startPredictionLoop(ticker);
        }
      }, this.config.intervalMs)
    );
  }

  predictNextTrade(ticker: string, trades: ITrade[], periodMs: number, length: number) {
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
        this._add(ticker, prediction[i]);
      }
    }
  }

  // @ensureTickerExistsDecorator
  fillPredictedData(ticker: string, trades: ITrade[], targetTimestampMs: number) {
    const lastTradeTimestamp = trades[trades.length - 1]?.timestampMs;

    if (!!lastTradeTimestamp && !!targetTimestampMs) {
      const timestampDifference = targetTimestampMs - lastTradeTimestamp;

      if (timestampDifference > this.config.intervalMs) {
        const counts = Math.floor(timestampDifference / 100) - 1;

        const predictedTrades = this.predictNextTrade(
          ticker,
          trades,
          this.config.intervalMs,
          counts
        );

        if (predictedTrades !== undefined) this.predictedTrades.set(ticker, predictedTrades);
      }
    }
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

  togglePredicting = (ticker: string, value?: boolean) => {
    if (!this.isPredicting.has(ticker)) {
      this.isPredicting.set(ticker, false);
    }

    if (value === undefined) {
      this.isPredicting.set(ticker, !this.isPredicting.get(ticker));
    } else {
      this.isPredicting.set(ticker, value);
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

  // @ensureTickerExistsDecorator
  listTrades(ticker: string) {
    return this.predictedTrades.get(ticker);
  }

  // @ensureTickerExistsDecorator
  toLineChart(ticker: string, interval: number, length: number): ILine[] {
    const trades = this.predictedTrades.get(ticker)!;

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

  // @ensureTickerExistsDecorator
  toCandlestick(ticker: string, interval: number, length: number): ICandlestickData[] {
    const trades = this.predictedTrades.get(ticker)!;

    if (trades?.length === 0) return [];

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
      /** Deprecated: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`toCandlestick trades`, trades);
      */
      if (tradesInInterval.length > 0) {
        const open = tradesInInterval[0].price;
        const close = tradesInInterval[tradesInInterval.length - 1].price;
        const high = Math.max(...tradesInInterval.map(t => t.price));
        const low = Math.min(...tradesInInterval.map(t => t.price));
        const volume = tradesInInterval.reduce((sum, t) => sum + t.quantity, 0);
        candleSticks.push({
          x: new Date(i),
          y: {
            open,
            high,
            low,
            close,
            volume,
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

  private ensureTickerExists(ticker: string) {
    if (!this.trades.has(ticker)) {
      this.trades.set(ticker, []);
    }

    if (!this.predictedTrades.has(ticker)) {
      this.predictedTrades.set(ticker, []);
    }
  }

  // @ensureTickerExistsDecorator
  private getLastTrade(ticker: string) {
    const trades = this.trades.get(ticker);
    return trades![trades!.length - 1];
  }

  // @ensureTickerExistsDecorator
  private getLastPredictedTrade(ticker: string) {
    const predictedTrades = this.predictedTrades.get(ticker);
    return predictedTrades![predictedTrades!.length - 1];
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

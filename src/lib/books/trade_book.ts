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
}

class TradeBook {
  private trades: ITrade[];
  private predictedTrades: ITrade[];
  private isPredicting: boolean;
  private predictionTimer: any;
  private config: ITradeBookConfig;
  private model: string;

  constructor(config: ITradeBookConfig) {
    this.config = config;
    this.trades = config.initialTrades || [];
    this.predictedTrades = config.initialTrades || [];
    this.isPredicting = false;
    this.model = Model.LINEAR_REGRESSION;
  }

  add(trade: ITrade): void {
    if (!this.isValidTrade(trade)) {
      throw new CustomError(Code.INVALID_TRADE);
    }

    this.resetPrediction();

    if (this.trades.length >= this.config.minLengthForLinearRegression) {
      const lastTrade = this.trades[this.trades.length - 1];
      const timestampDifference = trade.timestampMs - lastTrade.timestampMs;

      if (timestampDifference > this.config.intervalMs) {
        this.fillPredictedData(this.trades, trade.timestampMs);
      }
    }

    this._add(trade);

    this.startPredictionLoop();
  }

  private resetPrediction() {
    clearTimeout(this.predictionTimer);
  }

  private _add(trade: ITrade): void {
    const isPredictedData = trade.tradeId.includes('-');

    if (!isPredictedData) {
      this.trades.push(trade);

      this.predictedTrades.push(trade);
    } else {
      if (this.predictedTrades.length < 1)
        throw new CustomError(Code.INSUFFICIENT_PREDICTED_TRADES);

      const lastTradeId = this.predictedTrades[this.predictedTrades.length - 1].tradeId.split('-');

      const tradeId = `${
        lastTradeId.length > 1
          ? `${lastTradeId[0]}-${Number(lastTradeId[1]) + 1}`
          : `${lastTradeId[0]}-1`
      }`;

      this.predictedTrades.push({...trade, tradeId});
    }
  }

  private startPredictionLoop = () => {
    this.resetPrediction();

    // Info: setTimeout + 遞迴 (20230522 - Shirley)
    this.predictionTimer = setTimeout(() => {
      if (this.isPredicting) {
        this.predictNextTrade(this.predictedTrades, this.config.intervalMs, 1);
        this.startPredictionLoop();
      }
    }, this.config.intervalMs);
  };

  predictNextTrade(trades: ITrade[], periodMs: number, length: number) {
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
        this._add(prediction[i]);
      }
    }
  }

  fillPredictedData(trades: ITrade[], targetTimestampMs: number) {
    const lastTradeTimestamp = trades[trades.length - 1]?.timestampMs;

    if (!!lastTradeTimestamp && !!targetTimestampMs) {
      const timestampDifference = targetTimestampMs - lastTradeTimestamp;

      if (timestampDifference > this.config.intervalMs) {
        const counts = Math.floor(timestampDifference / 100) - 1;

        this.predictNextTrade(trades, this.config.intervalMs, counts);
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

  togglePredicting = (value?: boolean) => {
    if (value === undefined) {
      this.isPredicting = !this.isPredicting;
    } else {
      this.isPredicting = value;
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

      // Info: default is linear regression (20230522 - Shirley)
      default:
        this.model = Model.LINEAR_REGRESSION;
    }
  }

  setConfig(config: ITradeBookConfig) {
    this.config = config;
  }

  listTrades() {
    return this.predictedTrades;
  }

  toLineChart(interval: number, length: number): ILine[] {
    if (this.predictedTrades.length === 0) return [];

    const lines: ILine[] = [];
    const intervalMs = interval * 1000;

    let lastTimestamp = this.predictedTrades[this.predictedTrades.length - 1].timestampMs;
    const remainderLastTimestamp = lastTimestamp % intervalMs;
    if (remainderLastTimestamp !== 0) {
      lastTimestamp = intervalMs - remainderLastTimestamp + lastTimestamp;
    }
    const firstTimestamp = lastTimestamp - length * intervalMs;

    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.trades.filter(t => t.timestampMs >= i && t.timestampMs < i + intervalMs);
      if (trades.length > 0) {
        const average = trades.reduce((sum, t) => sum + t.price, 0) / trades.length;
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        lines.push({average, volume, timestamp: i});
      }
    }
    return lines;
  }

  toCandlestick(interval: number, length: number): ICandlestickData[] {
    if (this.predictedTrades.length === 0) return [];

    const candleSticks: ICandlestickData[] = [];
    const intervalMs = interval * 1000;

    let lastTimestamp = this.predictedTrades[this.predictedTrades.length - 1].timestampMs;
    const remainderLastTimestamp = lastTimestamp % intervalMs;
    if (remainderLastTimestamp !== 0) {
      lastTimestamp = intervalMs - remainderLastTimestamp + lastTimestamp;
    }
    const firstTimestamp = lastTimestamp - length * intervalMs;

    let candlestick: ICandlestick | undefined;
    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.predictedTrades.filter(
        t => t.timestampMs >= i && t.timestampMs < i + intervalMs
      );
      /** Deprecated: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`toCandlestick trades`, trades);
      */
      if (trades.length > 0) {
        const open = trades[0].price;
        const close = trades[trades.length - 1].price;
        const high = Math.max(...trades.map(t => t.price));
        const low = Math.min(...trades.map(t => t.price));
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        candlestick = {open, high, low, close, volume, timestamp: i};
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
}

const TradeBookInstance = new TradeBook({
  intervalMs: 100,
  model: Model.LINEAR_REGRESSION,
  minLengthForLinearRegression: 2,
  minMsForLinearRegression: 1000 * 30,
});

export default TradeBookInstance;

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
import {Model} from '../../constants/model';
import {ITimeSpanUnion, getTime} from '../../constants/time_span_union';
import {millisecondsToSeconds} from '../common';

interface ITradeInTradeBook {
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

export type ICandlestickDataWithTimeSpan = {
  [key in ITimeSpanUnion]: ICandlestickData[];
};

interface ITradeBookConfig {
  model?: string;
  initialTrades?: ITradeInTradeBook[];
  intervalMs: number;
  minMsForLinearRegression: number; // Info: 拿幾秒內的資料做預測 (20230522 - Shirley)
  minLengthForLinearRegression: number; // Info: 規定幾秒內至少要有幾筆資料 (20230522 - Shirley)
  holdingTradesMs: number; // Info: 持有多久的資料 (20230601 - Tzuhans)
}

// function ensureTickerExistsDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;
//   descriptor.value = function (this: any, instId: string, ...args: any[]) {
//     this.ensureTickerExists(instId);
//     return originalMethod.apply(this, [instId, ...args]);
//   };
//   return descriptor;
// }

type TradeBookLike = {
  ensureTickerExists: (instId: string) => void;
  // Include any other methods or properties expected to be used within the decorator
};

function ensureTickerExistsDecorator<T extends TradeBookLike>(
  target: T,
  key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: T, instId: string, ...args: unknown[]) {
    this.ensureTickerExists(instId);
    return originalMethod.apply(this, [instId, ...args]);
  };
  return descriptor;
}

/**
 * Info: (20250428 - Shirley) Throttle decorator to limit how often a function can be called
 * This prevents excessive CPU usage by ensuring methods are not called too frequently
 * @param delay Minimum time between executions in milliseconds
 */
function throttleDecorator(delay: number) {
  return function <T extends TradeBookLike>(
    target: T,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const lastExecutionTime = new Map<string, number>();

    /**
     * Info: (20250428 - Shirley) Add execution count tracking to further limit high-frequency operations
     * This adds another layer of protection against excessive CPU usage
     */
    const executionCount = new Map<string, number>();
    const lastCountResetTime = new Map<string, number>();
    const MAX_EXECUTIONS_PER_SECOND = 20;

    descriptor.value = function (this: T, instId: string, ...args: unknown[]) {
      const now = Date.now();
      const lastTime = lastExecutionTime.get(instId) || 0;

      // 限制執行頻率
      if (now - lastTime < delay) {
        return undefined; // Skip execution if called too frequently
      }

      // 檢查每秒執行次數限制
      const lastReset = lastCountResetTime.get(instId) || 0;
      const currentCount = executionCount.get(instId) || 0;

      // 重置計數器（如果已經過了1秒）
      if (now - lastReset >= 1000) {
        lastCountResetTime.set(instId, now);
        executionCount.set(instId, 1);
      } else if (currentCount >= MAX_EXECUTIONS_PER_SECOND) {
        // 如果執行次數已達到上限，跳過本次執行
        return undefined;
      } else {
        // 增加執行次數計數
        executionCount.set(instId, currentCount + 1);
      }

      lastExecutionTime.set(instId, now);
      return originalMethod.apply(this, [instId, ...args]);
    };

    return descriptor;
  };
}

class TradeBook {
  private trades: Map<string, ITradeInTradeBook[]>;
  private predictedTrades: Map<string, ITradeInTradeBook[]>;
  private candlestickChart: Map<string, ICandlestickDataWithTimeSpan>;
  private isPredicting: Map<string, boolean>;
  private predictionTimers: Map<string, NodeJS.Timeout>;
  private config: ITradeBookConfig;
  private model: string;
  private lastPredictionTime: Map<string, number>; // To track last prediction time for each instId

  constructor(config: ITradeBookConfig) {
    this.config = config;
    this.trades = new Map();
    this.predictedTrades = new Map();
    this.candlestickChart = new Map();
    this.isPredicting = new Map();
    this.predictionTimers = new Map();
    this.model = Model.LINEAR_REGRESSION;
    this.lastPredictionTime = new Map();
  }

  /**
   * Info: (20250428 - Shirley) Add throttling to addTrades method to prevent excessive calls
   * This helps reduce CPU usage by limiting how often trades are processed
   */
  @ensureTickerExistsDecorator
  @throttleDecorator(100) // 調整為100ms限制，配合每秒10次的更新頻率
  addTrades(instId: string, trades: ITradeInTradeBook[]) {
    const validTrades = trades.filter(trade => this.isValidTrade(trade));

    this.resetPrediction(instId);

    for (const trade of validTrades) {
      const trades = this.getTrades(instId);
      if (trades.length >= this.config.minLengthForLinearRegression) {
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
  add(instId: string, trade: ITradeInTradeBook): void {
    const trades = this.getTrades(instId);

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

    this.startPredictionLoop(instId);
  }

  @ensureTickerExistsDecorator
  private resetPrediction(instId: string): void {
    if (this.predictionTimers.has(instId)) {
      clearTimeout(this.predictionTimers.get(instId));
      this.predictionTimers.delete(instId);
    }
  }

  @ensureTickerExistsDecorator
  private _add(instId: string, trade: ITradeInTradeBook): void {
    let newTrade: ITradeInTradeBook = {...trade};

    /**
     * Info: (20250428 - Shirley) Add null check for tradeId to prevent runtime errors
     * Using optional chaining operator to safely check if tradeId includes '-'
     */
    const isPredictedData = newTrade.tradeId?.includes('-') || false;
    const trades = this.getTrades(instId);
    const predictedTrades = this.getPredictedTrades(instId);

    // Info: 檢查這筆trade是預測的還是真實的，然後存進不同變數裡 (20230816 - Shirley)
    if (!isPredictedData) {
      trades.push(newTrade);
      predictedTrades.push(newTrade);
    } else {
      if (predictedTrades.length < 1) throw new Error('Invalid predicted trade');

      const lastTradeId = this.getLastPredictedTrade(instId).tradeId?.split('-') || [];

      const tradeId = `${
        lastTradeId.length > 1
          ? `${lastTradeId[0]}-${Number(lastTradeId[1]) + 1}`
          : `${lastTradeId[0] || ''}-1`
      }`;

      newTrade = {...trade, tradeId};
      predictedTrades.push({...trade, tradeId});
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

  @ensureTickerExistsDecorator
  private _trim(instId: string): void {
    const trades = this.getTrades(instId);
    const predictedTrades = this.getPredictedTrades(instId);

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
            {} as {[key: string]: ITradeInTradeBook}
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
            {} as {[key: string]: ITradeInTradeBook}
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
    const predictedTrades = this.getPredictedTrades(instId);

    /**
     * Info: (20250428 - Shirley) Increase the interval between predictions
     * This reduces CPU load by making predictions less frequently
     * Original interval was config.intervalMs, now use at least 200ms
     */
    const predictionInterval = Math.max(this.config.intervalMs, 200);

    this.predictionTimers.set(
      instId,
      setTimeout(() => {
        if (this.isPredicting.get(instId)) {
          // Check if enough time has passed since last prediction to reduce CPU load
          const now = Date.now();
          const lastTime = this.lastPredictionTime.get(instId) || 0;

          if (now - lastTime >= 500) {
            // Only predict at most once every 500ms
            this.predictNextTrade(instId, predictedTrades, this.config.intervalMs, 1);
            this.lastPredictionTime.set(instId, now);
          }

          this._trim(instId);
          this.startPredictionLoop(instId);
        }
      }, predictionInterval)
    );
  }

  /**
   * Info: (20250428 - Shirley) Optimize prediction to reduce computational load
   * Added check to avoid unnecessary predictions when there's not enough data
   */
  @throttleDecorator(300) // 調整為300ms限制，減少預測頻率以降低CPU負載
  predictNextTrade(instId: string, trades: ITradeInTradeBook[], periodMs: number, length: number) {
    if (trades.length < this.config.minLengthForLinearRegression) {
      return; // Skip prediction if not enough data
    }

    let prediction: ITradeInTradeBook[] | undefined;

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

  getAlignedTimeForCandlestick(currentTime: Date, timeSpan: ITimeSpanUnion): Date {
    const minutes = currentTime.getMinutes();
    let roundedMinutes = 0;

    switch (timeSpan) {
      case '5m':
        roundedMinutes = Math.floor(minutes / 5) * 5;
        break;
      case '15m':
        roundedMinutes = Math.floor(minutes / 15) * 15;
        break;
      case '30m':
        roundedMinutes = Math.floor(minutes / 30) * 30;
        break;
      case '1h':
      case '4h':
      case '12h':
        roundedMinutes = 0;
        break;
      case '1d':
        return new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          0,
          0,
          0
        );
    }

    return new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      currentTime.getHours(),
      roundedMinutes,
      0
    );
  }

  trimCandlestickData(length: number, instData?: Map<string, ICandlestickDataWithTimeSpan>) {
    if (!instData) {
      // Info: If instData doesn't exist, directly trim this.candlestickChart (20231019 - Shirley)
      this.candlestickChart.forEach(dataWithTimeSpan => {
        (Object.keys(dataWithTimeSpan) as ITimeSpanUnion[]).forEach((timeSpan: ITimeSpanUnion) => {
          dataWithTimeSpan[timeSpan] = dataWithTimeSpan[timeSpan].slice(-length);
        });
      });
    } else {
      // Info: If instData exists, trim it and update this.candlestickChart  (20231019 - Shirley)
      instData.forEach((dataWithTimeSpan, instId) => {
        (Object.keys(dataWithTimeSpan) as ITimeSpanUnion[]).forEach((timeSpan: ITimeSpanUnion) => {
          dataWithTimeSpan[timeSpan] = dataWithTimeSpan[timeSpan].slice(-length);
        });
        this.candlestickChart.set(instId, dataWithTimeSpan);
      });
    }
  }

  // Info: 找最後一根蠟燭的時間 (20231018 - Shirley)
  getLatestTimestampMs(candlesticks: ICandlestickData[], timeSpan: ITimeSpanUnion) {
    if (candlesticks.length < 2) {
      return;
    }

    const copy = [...candlesticks];
    const now = new Date().getTime();

    let timeForLatestCandle = 0;

    for (let i = 1; i < copy.length; i++) {
      const diff = copy[i].x.getTime() - copy[i - 1].x.getTime();
      const tsMs = getTime(timeSpan);

      if (
        i === copy.length - 1 &&
        (now - copy[i].x.getTime() > tsMs || now - copy[i].x.getTime() === tsMs)
      ) {
        timeForLatestCandle = copy[i].x.getTime() + tsMs;
      } else if (diff > tsMs || diff === tsMs) {
        timeForLatestCandle = copy[i - 1].x.getTime() + tsMs;
      } else if (diff < tsMs) {
        timeForLatestCandle = copy[i - 1].x.getTime();
      }
    }

    return timeForLatestCandle;
  }

  // Info: (20231018 - Shirley)
  alignCandlesticks(instId: string, candlesticks: ICandlestickData[], timeSpan: ITimeSpanUnion) {
    if (!Array.isArray(candlesticks) || candlesticks.length < 2) {
      // Deprecated: dev (20231118 - Shirley)
      // eslint-disable-next-line no-console
      console.error('candlesticks is either undefined or not an array in alignCandlesticks.');
      return [];
    }

    const tsMs = getTime(timeSpan);
    const interval = millisecondsToSeconds(tsMs);
    const result: ICandlestickData[] = [];

    // Info: (20231018 - Shirley) Start with the first candlestick
    result.push(candlesticks[0]);

    for (let i = 1; i < candlesticks.length; i++) {
      const diff = candlesticks[i].x.getTime() - candlesticks[i - 1].x.getTime();

      // Info: (20231018 - Shirley) If the difference between two timestamps is greater than the timeSpan
      if (diff > tsMs) {
        const missingCount = diff / tsMs - 1;
        for (let j = 0; j < missingCount; j++) {
          const alignedTime = candlesticks[i - 1].x.getTime() + (j + 1) * tsMs;
          const newCandlestick = this.toCandlestick(instId, interval, 1, alignedTime);

          result.push(...newCandlestick);
        }
      }

      // Info: (20231018 - Shirley) If the difference between two timestamps is less than the timeSpan
      else if (diff < tsMs) {
        const alignedTime = candlesticks[i - 1].x.getTime();
        const readyForMerge = [candlesticks[i - 1], candlesticks[i]];
        const merged = this.mergeCandlesticks(readyForMerge, new Date(alignedTime));

        if (!merged) return;
        result[result.length - 1] = merged; // Info: (20231018 - Shirley) Replace the last candlestick with the merged one
        continue; // Info: (20231018 - Shirley) Skip pushing the current candlestick as it's already merged
      }

      // Info: (20231018 - Shirley) Push the current candlestick
      result.push(candlesticks[i]);
    }

    // Info: (20231018 - Shirley) Handle the case where the last timestamp is not up to the current time
    const now = new Date().getTime();
    let lastTimestamp = result[result.length - 1].x.getTime();

    while (now - lastTimestamp > tsMs) {
      const alignedTime = lastTimestamp + tsMs;
      const newCandlestick = this.toCandlestick(instId, interval, 1, alignedTime);

      result.push(...newCandlestick);

      // Info: Update the lastTimestamp to the timestamp of the new candlestick (20231019 - Shirley)
      lastTimestamp = newCandlestick[newCandlestick.length - 1].x.getTime();
    }

    return result;
  }

  // Info: (20231018 - Shirley)
  mergeCandlesticks(
    candlesticks: ICandlestickData[],
    tunedTime: Date
  ): ICandlestickData | undefined {
    if (!Array.isArray(candlesticks) || candlesticks.length < 2) {
      // Deprecated: dev (20231118 - Shirley)
      // eslint-disable-next-line no-console
      console.error('candlesticks is either undefined or not an array in mergeCandlesticks.');
      return;
    }

    const copy = [...candlesticks];

    const open = copy[0]?.y?.open ?? 0;
    const close = copy[copy.length - 1]?.y?.close ?? 0;
    const high = Math.max(...copy.map(c => c?.y?.high ?? 0));
    const low = Math.min(...copy.map(c => c?.y?.low ?? 0));

    const volume = copy.reduce((sum, c) => sum + (c?.y?.volume ?? 0), 0);
    const value = copy.reduce((sum, c) => sum + (c?.y?.value ?? 0), 0);

    const newCandlestick: ICandlestickData = {
      x: new Date(tunedTime),
      y: {
        open,
        close,
        high,
        low,
        volume,
        value,
      },
    };

    return newCandlestick;
  }

  @ensureTickerExistsDecorator
  @throttleDecorator(300) // 調整為300ms限制，減少預測數據填充頻率
  fillPredictedData(instId: string, trades: ITradeInTradeBook[], targetTimestampMs: number) {
    const lastTradeTimestamp = trades[trades.length - 1]?.timestampMs;

    if (!!lastTradeTimestamp && !!targetTimestampMs) {
      const timestampDifference = targetTimestampMs - lastTradeTimestamp;

      if (timestampDifference > this.config.intervalMs) {
        /**
         * Info: (20250428 - Shirley) Limit the amount of predicted data points
         * The original calculation could create too many prediction points in some cases
         */
        const counts = Math.min(
          Math.floor(timestampDifference / 100) - 1,
          10 // Cap at maximum 10 predictions at once
        );

        if (counts > 0) {
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
  }

  /**
   * Info: (20250428 - Shirley) Optimize linear regression algorithm
   * Added early returns and optimized calculations to reduce CPU usage
   */
  linearRegression(
    trades: ITradeInTradeBook[],
    periodMs: number,
    length: number
  ): ITradeInTradeBook[] | undefined {
    if (trades.length < this.config.minLengthForLinearRegression) return;

    const newTrades: ITradeInTradeBook[] = [...trades];

    const cutoffTimeMs = Date.now() - this.config.minMsForLinearRegression;
    const recentTrades = trades.filter(
      t => t.timestampMs > cutoffTimeMs && !t.tradeId.includes('-')
    );

    // Early return if not enough recent trades
    if (recentTrades.length < this.config.minLengthForLinearRegression) return;

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

    // Cap the length of predictions to prevent excessive calculations
    const predictionLength = Math.min(length, 5);

    for (let i = 0; i < predictionLength; i++) {
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

    const prediction = newTrades.slice(-predictionLength);

    return prediction;
  }

  private getLinearRegressionVariables(trades: ITradeInTradeBook[]): {m: number; b: number} {
    // Info: (20230522 - Shirley) Step 2: Prepare data for regression
    const totalQuantity = trades.reduce((total, trade) => total + trade.quantity, 0);
    const weightedPrices = trades.map(trade => trade.price * (trade.quantity / totalQuantity));
    const weightedTimestamp = trades.map(
      trade => trade.timestampMs * (trade.quantity / totalQuantity)
    );
    const wTimestampSum = weightedTimestamp.reduce((a, b) => a + b, 0);
    const wPriceSum = weightedPrices.reduce((a, b) => a + b, 0);

    const x = trades.map(t => t.timestampMs);
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
    const trades = this.getPredictedTrades(instId);

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

  /**
   *
   * @param instId
   * @param interval in seconds
   * @param length
   * @param singleTimestampMs in milliseconds
   * @param tradesArray
   * @returns
   */
  @ensureTickerExistsDecorator
  toCandlestick(
    instId: string,
    interval: number,
    length: number,
    singleTimestampMs?: number,
    tradesArray?: ITradeInTradeBook[]
  ): ICandlestickData[] {
    const predictedTrades = this.getPredictedTrades(instId);
    const trades = !tradesArray || tradesArray.length === 0 ? predictedTrades : tradesArray;

    if (trades.length === 0) return [];

    const candleSticks: ICandlestickData[] = [];

    // Info: generate one candlestick (20231018 - Shirley)
    if (singleTimestampMs) {
      const firstTimestamp = singleTimestampMs;
      const lastTimestamp = singleTimestampMs + interval * 1000;
      const tradesInInterval = trades.filter(
        t => t.timestampMs >= firstTimestamp && t.timestampMs < lastTimestamp
      );

      const time = new Date(singleTimestampMs);

      if (tradesInInterval.length > 0) {
        const open = tradesInInterval[0].price;
        const close = tradesInInterval[tradesInInterval.length - 1].price;
        const high = Math.max(...tradesInInterval.map(t => t.price));
        const low = Math.min(...tradesInInterval.map(t => t.price));
        const volume = tradesInInterval.reduce((sum, t) => sum + t.quantity, 0);
        const value = tradesInInterval.reduce((sum, t) => sum + t.quantity * t.price, 0);
        candleSticks.push({
          x: time,
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
      return candleSticks;
    }

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

      const time = new Date(i);

      if (tradesInInterval.length > 0) {
        const open = tradesInInterval[0].price;
        const close = tradesInInterval[tradesInInterval.length - 1].price;
        const high = Math.max(...tradesInInterval.map(t => t.price));
        const low = Math.min(...tradesInInterval.map(t => t.price));
        const volume = tradesInInterval.reduce((sum, t) => sum + t.quantity, 0);
        const value = tradesInInterval.reduce((sum, t) => sum + t.quantity * t.price, 0);
        candleSticks.push({
          x: time,
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

  getCandlestickData(instId: string): ICandlestickDataWithTimeSpan | undefined {
    this.ensureCandlestickDataExists(instId);

    return this.candlestickChart.get(instId);
  }

  addCandlestickData(instId: string, timeSpan: ITimeSpanUnion, data: ICandlestickData[]): void {
    this.ensureCandlestickDataExists(instId);

    const instData = this.getCandlestickData(instId);

    if (instData) {
      instData[timeSpan] = data;
    }
  }

  isValidTrade(trade: unknown): trade is ITradeInTradeBook {
    return (
      typeof trade === 'object' &&
      trade !== null &&
      'tradeId' in trade &&
      'targetAsset' in trade &&
      'unitAsset' in trade &&
      'direct' in trade &&
      'price' in trade &&
      'timestampMs' in trade &&
      'quantity' in trade
    );
  }

  ensureTickerExists(instId: string) {
    if (!this.trades.has(instId)) {
      this.trades.set(instId, []);
    }

    if (!this.predictedTrades.has(instId)) {
      this.predictedTrades.set(instId, []);
    }

    this.ensureCandlestickDataExists(instId);
  }

  getTrades(instId: string) {
    this.ensureTickerExists(instId);
    const trades = this.trades.get(instId) ?? [];
    return trades;
  }

  getPredictedTrades(instId: string) {
    this.ensureTickerExists(instId);
    const predictedTrades = this.predictedTrades.get(instId) ?? [];
    return predictedTrades;
  }

  @ensureTickerExistsDecorator
  private getLastTrade(instId: string) {
    const trades = this.getTrades(instId);
    return trades[trades.length - 1];
  }

  @ensureTickerExistsDecorator
  private getLastPredictedTrade(instId: string) {
    const predictedTrades = this.getPredictedTrades(instId);
    return predictedTrades[predictedTrades.length - 1];
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
}

const TradeBookInstance = new TradeBook({
  intervalMs: 100,
  model: Model.LINEAR_REGRESSION,
  minLengthForLinearRegression: 2,
  minMsForLinearRegression: 1000 * 30,
  holdingTradesMs: 1000 * 60 * 1, // Info: 1 minutes in milliseconds (ms) (20231019 - Shirley)
});

export default TradeBookInstance;

// import * as math from 'mathjs';
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

type IAveragedTrade = {
  timestampMs: number;
  averagePrice: number;
};

class TradeBook {
  private trades: ITrade[];
  private predictionCounter: number;
  private isPredicting: boolean;
  private predictionTimer: any;

  private model: (x: number) => ITrade | undefined;

  // INFO: 決定要用哪個預測的模型，模型名字是 constant [later]

  // Info: new object 時執行的 code
  constructor() {
    this.trades = [];
    this.isPredicting = false;
    this.predictionCounter = 0;
    this.model = this.linearRegression.bind(this);
  }

  // Info: 真的 trade
  add(trade: ITrade): void {
    this.resetPrediction();

    if (this.trades.length > 0) {
      const lastTrade = this.trades[this.trades.length - 1];
      const timestampDifference = trade.timestampMs - lastTrade.timestampMs;

      if (timestampDifference > 100) {
        this.fillPredictedData(trade.timestampMs);
      }
    }

    this._add(trade);
    this.startPredictionLoop();
  }

  private resetPrediction() {
    clearTimeout(this.predictionTimer);
    this.predictionCounter = 0;
  }

  private _add(trade: ITrade): void {
    this.trades.push(trade);
  }

  private startPredictionLoop = () => {
    const periodMs = 100;

    clearTimeout(this.predictionTimer);

    // INFO: setTimeout + 遞迴
    this.predictionTimer = setTimeout(() => {
      if (this.isPredicting) {
        this.predictNextTrade(periodMs, this.model);
        this.startPredictionLoop();
      }
    }, periodMs);
  };

  predictNextTrade(periodMs: number, model: (x: number) => ITrade | undefined) {
    const trade = model(periodMs);
    if (trade !== undefined) {
      this._add(trade);
    }
  }

  fillPredictedData(targetTimestampMs: number) {
    const lastTradeTimestamp = this.trades[this.trades.length - 1]?.timestampMs;

    if (!!lastTradeTimestamp && !!targetTimestampMs) {
      const timestampDifference = targetTimestampMs - lastTradeTimestamp;

      if (timestampDifference > 100) {
        const counts = Math.floor(timestampDifference / 100) - 1;

        for (let i = 0; i < counts; i++) {
          this.predictNextTrade(100, this.model);
        }
      }
    }
  }

  linearRegression(periodMs: number): ITrade | undefined {
    // Step 1: Validate trades data
    // TODO: < 30 不預測
    if (this.trades.length < 2) return;

    // TODO: 拿掉 99999999999
    const cutoffTimeMs = Date.now() - 30 * 1000 * 99999999999;
    const recentTrades = this.trades.filter(t => t.timestampMs > cutoffTimeMs);

    // Step 2: Prepare data for regression
    const x = recentTrades.map((t, i) => i + 1); // Assume trade sequence as x
    const y = recentTrades.map(t => t.price); // Trade price as y

    // Step 3: Calculate means
    const meanX = x.reduce((a, b) => a + b, 0) / x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / y.length;

    // Step 4: Calculate slope for the formula: y = mx + b
    const subtractX = x.map(val => val - meanX);
    const subtractY = y.map(val => val - meanY);

    const multiplySubtract = subtractX.map((val, i) => val * subtractY[i]);
    const squareSubtractX = subtractX.map(val => val * val);

    const sumMultiplySubtract = multiplySubtract.reduce((a, b) => a + b, 0);
    const sumSquareSubtractX = squareSubtractX.reduce((a, b) => a + b, 0);

    const m = sumMultiplySubtract / sumSquareSubtractX;
    const b = meanY - m * meanX;

    // Step 5: Predict price for the next period
    const nextPrice = m * (x.length + 1) + b; // x.length + 1 is the x for the next trade

    // Step 6: Construct new trade
    // Increase prediction counter
    if (this.predictionCounter === 0) {
      this.predictionCounter = 1;
    } else {
      this.predictionCounter++;
    }

    const lastTrade = this.trades[this.trades.length - 1];
    const newTradeId = `${
      lastTrade.tradeId.includes('-')
        ? `${lastTrade.tradeId.split('-')[0]}-${this.predictionCounter}`
        : `${lastTrade.tradeId}-${this.predictionCounter}`
    }`;

    // TODO: limit price to two decimal places [later]
    const newTrade = {
      tradeId: newTradeId,
      targetAsset: lastTrade.targetAsset,
      unitAsset: lastTrade.unitAsset,
      direct: lastTrade.direct,
      price: nextPrice,
      timestampMs: lastTrade.timestampMs + periodMs,
      quantity: 0,
    };

    return newTrade;
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

  get tradeData() {
    return this.trades;
  }

  // TODO: set prediction model
  setPredictionModel(model: (x: number) => ITrade | undefined) {
    this.model = model;
  }

  toLineChart(interval: number, length: number): ILine[] {
    const lines: ILine[] = [];
    const intervalMs = interval * 1000;
    const lastTimestamp = this.trades[this.trades.length - 1].timestampMs;
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

  toCandlestick(interval: number, length: number): ICandlestick[] {
    const candleSticks: ICandlestick[] = [];
    const intervalMs = interval * 1000;
    const lastTimestamp = this.trades[this.trades.length - 1].timestampMs;
    const firstTimestamp = lastTimestamp - length * intervalMs;

    let candlestick: ICandlestick | undefined;
    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.trades.filter(t => t.timestampMs >= i && t.timestampMs < i + intervalMs);
      if (trades.length > 0) {
        const open = trades[0].price;
        const close = trades[trades.length - 1].price;
        const high = Math.max(...trades.map(t => t.price));
        const low = Math.min(...trades.map(t => t.price));
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        candlestick = {open, high, low, close, volume, timestamp: i};
        candleSticks.push(candlestick);
      }
    }

    return candleSticks;
  }
}

const TradeBookInstance = new TradeBook();

// Info: Price priority ------------------------------

const tradeObj1: ITrade = {
  tradeId: '1',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'buy',
  price: 4.412,
  quantity: 17,
  timestampMs: 1683775038000,
};

const tradeObj2: ITrade = {
  tradeId: '2',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'sell',
  price: 8.929,
  quantity: 575,
  timestampMs: 1683775039000,
};

const tradeObj3: ITrade = {
  tradeId: '3',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 9.143,
  quantity: 7,
  timestampMs: 1683775045000,
};

const tradeObj4: ITrade = {
  tradeId: '4',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 11.833,
  quantity: 18,
  timestampMs: 1683775045000,
};

const tradeObj5: ITrade = {
  tradeId: '5',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 11.833,
  quantity: 33,
  timestampMs: 1683775054000,
};

const tradeObj6: ITrade = {
  tradeId: '6',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 11.833,
  quantity: 9,
  timestampMs: 1683775072000,
};

const tradeObj7: ITrade = {
  tradeId: '7',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 17.927,
  quantity: 12,
  timestampMs: 1683775072000,
};
TradeBookInstance.togglePredicting();

TradeBookInstance.add(tradeObj1);

TradeBookInstance.add(tradeObj2);

TradeBookInstance.add(tradeObj3);
TradeBookInstance.add(tradeObj4);

TradeBookInstance.add(tradeObj5);

TradeBookInstance.add(tradeObj6);
TradeBookInstance.add(tradeObj7);

setTimeout(() => {
  TradeBookInstance.togglePredicting(false);
  const data = TradeBookInstance.tradeData;
  const pick = data.filter(d => {
    if (
      d.tradeId === '1' ||
      d.tradeId === '2' ||
      d.tradeId === '2-1' ||
      d.tradeId === '2-59' ||
      d.tradeId === '3' ||
      d.tradeId === '4' ||
      d.tradeId === '4-1' ||
      d.tradeId === '4-89' ||
      d.tradeId === '5' ||
      d.tradeId === '5-1' ||
      d.tradeId === '5-179' ||
      d.tradeId === '6' ||
      d.tradeId === '7'
    ) {
      return true;
    }
    return false;
  });
  // Deprecated: (20230519 - Shirley)
  // console.log('[price priority] last data', data[data.length - 1]);
  // console.log('[price priority] pick', pick);
  // console.log('[price priority] all trades', data);
}, 100);

export default TradeBookInstance;

/**
 * @dev timestamp in ms
 */
interface ITrade {
  tradeId: string;
  targetAsset: string;
  unitAsset: string;
  direct: string;
  price: number;
  // quantity: number;
  timestampMs: number;
  quantity: number;
  // predictionCounter?: number;
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

    // Info: `_` 為了避免無窮迴圈，所以區分對外的接口跟實際的功能
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

    // INFO: setTimeout + 遞迴
    // 有新資料時，重置 predictionCounter
    const predictionLoop = () => {
      if (this.isPredicting) {
        this.predictNextTrade(periodMs, this.model);
        this.predictionTimer = setTimeout(predictionLoop, periodMs);
      }
    };
    predictionLoop();

    // INFO: setInterval [trial]
    // const intervalId = setInterval(() => {
    //   if (this.isPredicting) {
    //     this.predictNextTrade(periodMs, this.model);
    //   } else {
    //     clearInterval(intervalId);
    //   }
    // }, periodMs);
  };

  // TODO: Create a function to accept prediction modal as parameter and return the predicted price
  predictNextTrade(periodMs: number, model: (x: number) => ITrade | undefined) {
    const trade = model(periodMs);
    if (trade !== undefined) {
      this._add(trade);
    }
  }

  linearRegression(periodMs: number): ITrade | undefined {
    const groupedTrades: {[key: number]: ITrade[]} = {};

    // console.log('trades', this.trades);

    this.trades.forEach(trade => {
      if (!groupedTrades[trade.timestampMs]) {
        groupedTrades[trade.timestampMs] = [];
      }
      groupedTrades[trade.timestampMs].push(trade);
    });

    if (Object.keys(groupedTrades).length < 2) return;

    const averagedTrades: IAveragedTrade[] = Object.entries(groupedTrades).map(
      ([timestamp, trades]) => {
        const sumPrice = trades.reduce((sum, trade) => sum + trade.price, 0);
        const averagePrice = sumPrice / trades.length; // TODO: check if this is correct
        return {
          timestampMs: Number(timestamp),
          averagePrice,
        };
      }
    );

    // Info: Ensure there are at least two trades with different timestamps
    if (averagedTrades.length < 2) {
      return;
    }

    const t2 = averagedTrades[averagedTrades.length - 2]; // Info: 倒數第二個
    const t1 = averagedTrades[averagedTrades.length - 1]; // Info: 倒數第一個

    const priceDifference = t1.averagePrice - t2.averagePrice;
    const timeDifference = t1.timestampMs - t2.timestampMs;

    const lastTrade = this.trades[this.trades.length - 1];
    // const secondLastTrade = this.trades[this.trades.length - 2];

    if (this.predictionCounter === 0) {
      this.predictionCounter = 1;
    } else {
      this.predictionCounter++;
    }

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
      price: t1.averagePrice + (priceDifference / timeDifference) * periodMs,
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
  // quantity: 17,
  price: 4.412,
  quantity: 17,
  timestampMs: 1683775038000,
};

const tradeObj2: ITrade = {
  tradeId: '2',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'sell',
  // quantity: 575,
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

// TradeBookInstance.togglePredicting();

// TradeBookInstance.add(tradeObj5);

// TradeBookInstance.add(tradeObj6);
// TradeBookInstance.add(tradeObj7);

// setTimeout(() => {
// 	TradeBookInstance.add(tradeObj3);
// 	TradeBookInstance.add(tradeObj4);
// 	// TradeBookInstance.tradeData;
// }, 1000);

setTimeout(() => {
  TradeBookInstance.togglePredicting(false);
}, 10000);

// Info: Time priority ------------------------------

export default TradeBookInstance;

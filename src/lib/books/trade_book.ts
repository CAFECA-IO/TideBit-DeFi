interface Order {
  id: string;
  from: number;
  to: number;
  timestamp: number;
}

/**
 * @dev timestamp in ms
 */
interface Trade {
  tradeId: string;
  targetAsset: string;
  unitAsset: string;
  direct: string;
  price: number;
  // quantity: number;
  timestamp: number;
  quantity: number;
}

type line = {
  average: number;
  volume: number;
  timestamp: number;
};

type candleStick = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
};

class OrderBook {
  private orders: Order[];

  constructor() {
    this.orders = [];
  }

  add(order: Order): void {
    this.orders.push(order);
  }

  update(id: string, order: Order): void {
    let index = -1;
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === id) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      this.orders[index] = order;
    }
  }

  remove(id: string): void {
    this.orders = this.orders.filter(o => o.id !== id);
  }
}

class TradeBook {
  private trades: Trade[];

  constructor() {
    this.trades = [];
  }

  add(trade: Trade): void {
    this.trades.push(trade);
  }

  // TODO: Create a function to accept prediction modal as parameter and return the predicted price
  public predictNextTradePrice(period: number, predictionModel: (x: number) => number): number {
    const predictedPrice = predictionModel(period);
    return predictedPrice;
  }

  public linearRegression(period: number): number {
    if (this.trades.length < 2) throw new Error('Not enough trades to make a prediction');

    // Info: linear regression
    const t2 = this.trades[this.trades.length - 2]; // 倒數第二
    const t1 = this.trades[this.trades.length - 1]; // 倒數第一

    if (t2.timestamp === t1.timestamp) {
      const t3 = this.trades[this.trades.length - 3]; // 倒數第三
      // TODO: Decimal places
      const avgPrice = (t2.price + t1.price) / 2;
      const priceDifference = avgPrice - t3.price;
      const timeDifference = t1.timestamp - t3.timestamp;
      return t1.price + (priceDifference / timeDifference) * period;
    }

    const priceDifference = t1.price - t2.price;
    const timeDifference = t1.timestamp - t2.timestamp;
    return t1.price + (priceDifference / timeDifference) * period;
  }

  toLineChart(interval: number, length: number): line[] {
    const lines: line[] = [];
    const intervalMs = interval * 1000;
    const lastTimestamp = this.trades[this.trades.length - 1].timestamp;
    const firstTimestamp = lastTimestamp - length * intervalMs;
    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.trades.filter(t => t.timestamp >= i && t.timestamp < i + intervalMs);
      if (trades.length > 0) {
        const average = trades.reduce((sum, t) => sum + t.price, 0) / trades.length;
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        lines.push({average, volume, timestamp: i});
      }
    }
    return lines;
  }

  toCandleStick(interval: number, length: number): candleStick[] {
    const candleSticks: candleStick[] = [];
    const intervalMs = interval * 1000;
    const lastTimestamp = this.trades[this.trades.length - 1].timestamp;
    const firstTimestamp = lastTimestamp - length * intervalMs;

    let candleStick: candleStick | undefined;
    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.trades.filter(t => t.timestamp >= i && t.timestamp < i + intervalMs);
      if (trades.length > 0) {
        const open = trades[0].price;
        const close = trades[trades.length - 1].price;
        const high = Math.max(...trades.map(t => t.price));
        const low = Math.min(...trades.map(t => t.price));
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        candleStick = {open, high, low, close, volume, timestamp: i};
        candleSticks.push(candleStick);
      }
    }

    return candleSticks;
  }
}

const tradeBook = new TradeBook();

// Info: Price priority ------------------------------
const tradeObj1: Trade = {
  tradeId: '1',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'buy',
  // quantity: 17,
  price: 4.412,
  quantity: 17,
  timestamp: 1683775038000,
};

const tradeObj2: Trade = {
  tradeId: '2',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'sell',
  // quantity: 575,
  price: 8.929,
  quantity: 575,
  timestamp: 1683775045000,
};

const tradeObj3: Trade = {
  tradeId: '3',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 9.143,
  quantity: 7,
  timestamp: 1683775045000,
};

const tradeObj4: Trade = {
  tradeId: '4',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 11.833,
  quantity: 18,
  timestamp: 1683775045000,
};

const tradeObj5: Trade = {
  tradeId: '5',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 11.833,
  quantity: 33,
  timestamp: 1683775054000,
};

const tradeObj6: Trade = {
  tradeId: '6',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 11.833,
  quantity: 9,
  timestamp: 1683775072000,
};

const tradeObj7: Trade = {
  tradeId: '7',
  targetAsset: 'ETH',
  unitAsset: 'USDT',
  direct: 'BUY',
  price: 17.927,
  quantity: 12,
  timestamp: 1683775072000,
};

/* Info: Time priority ------------------------------
// const tradeObj1: Trade = {
// 	tradeId: '1',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'buy',
// 	// quantity: 17,
// 	price: 4.412,
// 	quantity: 17,
// 	timestamp: 1683775038000,
// };

// const tradeObj2: Trade = {
// 	tradeId: '2',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'sell',
// 	// quantity: 575,
// 	price: 8.929,
// 	quantity: 575,
// 	timestamp: 1683775045000,
// };

// const tradeObj3: Trade = {
// 	tradeId: '3',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'BUY',
// 	price: 11.833,
// 	quantity: 25,
// 	timestamp: 1683775045000,
// };

// const tradeObj4: Trade = {
// 	tradeId: '4',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'BUY',
// 	price: 11.849,
// 	quantity: 33,
// 	timestamp: 1683775045000,
// };

// const tradeObj5: Trade = {
// 	tradeId: '5',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'BUY',
// 	price: 11.849,
// 	quantity: 2,
// 	timestamp: 1683775054000,
// };

// const tradeObj6: Trade = {
// 	tradeId: '6',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'BUY',
// 	price: 9.143,
// 	quantity: 7,
// 	timestamp: 1683775072000,
// };

// const tradeObj7: Trade = {
// 	tradeId: '7',
// 	targetAsset: 'ETH',
// 	unitAsset: 'USDT',
// 	direct: 'BUY',
// 	price: 17.927,
// 	quantity: 12,
// 	timestamp: 1683775072000,
// };
------------------------------*/

tradeBook.add(tradeObj1);

tradeBook.add(tradeObj2);

tradeBook.add(tradeObj3);

tradeBook.add(tradeObj4);
tradeBook.add(tradeObj5);
tradeBook.add(tradeObj6);
tradeBook.add(tradeObj7);

export default tradeBook;

export interface ICandlestick {
  timestamp: number;
  OHLC: number[];
  average: number;
  nowPrice: number; // location of lottie and horizontal line

  // latestOHLC: number[];
  // volume: number;
}

const chartBlank = 1.68;
const dummyDataSize = 80;
const unitOfLive = 1000;

export interface ICandlestickData {
  x: Date;
  y: [...(number | null)[]];
}

export const getDummyCandlestickChartData = (n = dummyDataSize) => {
  const now = new Date().getTime();
  const nowSecond = now - (now % unitOfLive);
  let point = 1288.4;
  let lastPrice = 0;
  const data = new Array(n).fill(0).map((v, i) => {
    const y: [...(number | null)[]] = new Array(4).fill(0).map(v => {
      const rnd = Math.random() / 1.2;
      const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
      const price = point * ts;

      const prettyPrice = Math.trunc(price * 100) / 100;
      lastPrice = price;
      return prettyPrice;
    });
    point = lastPrice;

    const result: ICandlestickData = {
      x: new Date(nowSecond - (n - i) * unitOfLive),
      y,
    };
    return result;
  });
  const addition = n / chartBlank;

  // null data
  data.push({
    x: new Date(nowSecond + addition * unitOfLive),
    y: [null, null, null, null],
  });

  return data;
};

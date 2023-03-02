export interface IApplyUpdateCFDOrderData {
  orderId: string;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyApplyUpdateCFDOrderData = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyUpdateCFDOrderData: IApplyUpdateCFDOrderData = {
    orderId: id
      ? id
      : `TB${date.getFullYear()}${
          date.getMonth() + 1
        }${date.getDate()}${date.getSeconds()}${currency}`,
    takeProfit: randomIntFromInterval(7000, 70000),
    stopLoss: randomIntFromInterval(100, 1000),
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
  };
  return dummyApplyUpdateCFDOrderData;
};

export interface IWebsiteReserve {
  [currency: string]: {
    currency: string;
    reserveRatio: number;
    usersHolding: string;
    tidebitReserve: string;
  };
}

export const dummyWebsiteReserve: IWebsiteReserve = {
  'USDT': {
    currency: 'USDT',
    reserveRatio: 0,
    usersHolding: 'N/A',
    tidebitReserve: 'N/A',
  },
  'ETH': {
    currency: 'ETH',
    reserveRatio: 0,
    usersHolding: 'N/A',
    tidebitReserve: 'N/A',
  },
  'BTC': {
    currency: 'BTC',
    reserveRatio: 0,
    usersHolding: 'N/A',
    tidebitReserve: 'N/A',
  },
};

// Deprecated: remove this function after SafeMath isNumber is fixed (20230930 - Shirley)
const isNumber = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(+str);
};

// TODO: 要檢查 string 中的資料是不是 number 樣子的資料 (用 SafeMath isNumber) (20230914 - Shirley)
export const isIWebsiteReserve = (data: any): data is IWebsiteReserve => {
  // Check if each currency property in data conforms to IWebsiteReserve format
  for (const key in data) {
    if (
      typeof data[key].currency !== 'string' ||
      typeof data[key].reserveRatio !== 'number' ||
      typeof data[key].usersHolding !== 'string' ||
      !isNumber(data[key].usersHolding) ||
      typeof data[key].tidebitReserve !== 'string' ||
      !isNumber(data[key].tidebitReserve)
    ) {
      return false;
    }
  }
  return true;
};

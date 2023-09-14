export interface IWebsiteReserve {
  usersHolding: string;
  tidebitReserve: string;
}

export const dummyWebsiteReserve: IWebsiteReserve = {
  usersHolding: 'N/A',
  tidebitReserve: 'N/A',
};

// TODO: 要檢查 string 中的資料是不是 number 樣子的資料 (用 isNumber) (20230914 - Shirley)
export const isIWebsiteReserve = (data: any): data is IWebsiteReserve => {
  return (
    typeof data.usersHolding === 'string' &&
    data.usersHolding !== 'NaN' &&
    typeof data.tidebitReserve === 'string' &&
    data.tidebitReserve !== 'NaN'
  );
};

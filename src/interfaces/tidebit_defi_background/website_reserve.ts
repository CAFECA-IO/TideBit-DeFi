export interface IWebsiteReserve {
  usersHolding: string;
  tidebitReserve: string;
}

export const dummyWebsiteReserve: IWebsiteReserve = {
  usersHolding: 'N/A',
  tidebitReserve: 'N/A',
};

export const isIWebsiteReserve = (data: any): data is IWebsiteReserve => {
  return typeof data.usersHolding === 'string' && typeof data.tidebitReserve === 'string';
};

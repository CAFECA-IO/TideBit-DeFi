export interface ICryptocurrency {
  id: string;
  name: string; // Tether
  symbol: string; // USDT
  decimals: number; // decimal places
  icon: string; // svg src
  fee: number;
}

export const dummyTransferCurrency: ICryptocurrency = {
  id: 'USDT',
  name: 'Tether',
  symbol: 'USDT',
  decimals: 6,
  icon: '/elements/group_2371.svg',
  fee: 0,
};

export interface ICryptocurrency {
  id: string;
  icon: string; // svg src
  symbol: string; // USDT
  name: string; // Tether
  decimals: number; // decimal places
  fee: number;
}

export const dummyTransferCurrency: ICryptocurrency = {
  id: 'USDT',
  icon: '/elements/group_2371.svg',
  symbol: 'USDT',
  name: 'Tether',
  decimals: 6,
  fee: 0,
};

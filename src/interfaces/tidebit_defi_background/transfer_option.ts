export interface ITransferOption {
  label: string; // USDT
  content: string; // Tether
  // icon: string; // svg
  fee: number;
}

// TODO: [Discussion] and rename `transfer_currency` afterward
export interface ITransferCurrency {
  id: string;
  name: string; // Tether
  symbol: string; // USDT
  decimals: number; // decimal places
  icon: string; // svg src
  fee: number;
}

export const dummyTransferCurrency: ITransferCurrency = {
  id: 'USDT',
  name: 'Tether',
  symbol: 'USDT',
  decimals: 6,
  icon: '/elements/group_2371.svg',
  fee: 0,
};

export interface ICryptocurrency {
  id: string;
  icon: string; // svg src
  symbol: string; // USDT
  name: string; // Tether
  decimals: number; // decimal places
  contract: string;
  fee: number;
}

export const dummyCryptocurrency: ICryptocurrency = {
  id: 'USDT',
  icon: '/asset_icon/usdt.svg',
  symbol: 'USDT',
  name: 'Tether',
  contract: '0x',
  decimals: 6,
  fee: 0,
};

export const dummyCryptocurrencies = [
  {
    id: 'USDT',
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    icon: '/asset_icon/usdt.svg',
    fee: 0,
    contract: '0x',
  },
  {
    id: 'ETH',
    symbol: 'ETH',
    name: 'ETH',
    decimals: 18,
    icon: '/asset_icon/eth.svg',
    fee: 0,
    contract: '0x',
  },
  {
    id: 'BTC',
    symbol: 'BTC',
    name: 'BTC',
    decimals: 18,
    icon: '/asset_icon/btc.svg',
    fee: 0,
    contract: '0x',
  },
  {id: 'USDC', symbol: 'USDC', name: 'USD Coin', decimals: 18, icon: '', fee: 0, contract: '0x'},
  {
    id: 'DAI',
    symbol: 'DAI',
    name: 'DAI',
    decimals: 18,
    icon: '/asset_icon/dai.svg',
    fee: 0,
    contract: '0x',
  },
  {
    id: 'BNB',
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    icon: '/asset_icon/bnb.svg',
    fee: 0,
    contract: '0x',
  },
  {id: 'BCH', symbol: 'BCH', name: 'BCH', decimals: 18, icon: '', fee: 0, contract: '0x'},
  {
    id: 'LTC',
    symbol: 'LTC',
    name: 'LTC',
    decimals: 18,
    icon: '/asset_icon/ltc.svg',
    fee: 0,
    contract: '0x',
  },
  {id: 'ETC', symbol: 'ETC', name: 'ETC', decimals: 18, icon: '', fee: 0, contract: '0x'},
  {id: 'USX', symbol: 'USX', name: 'USX', decimals: 18, icon: '', fee: 0, contract: '0x'},
  {id: 'NEO', symbol: 'NEO', name: 'NEO', decimals: 18, icon: '', fee: 0, contract: '0x'},
  {id: 'EOS', symbol: 'EOS', name: 'EOS', decimals: 18, icon: '', fee: 0, contract: '0x'},
];

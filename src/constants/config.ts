// `const` which can be changed later

export const POSITION_PRICE_RENEWAL_INTERVAL_SECONDS = 3;

// 10 ** 9 - 0.01
export const TARGET_LIMIT_DIGITS = 10 ** 9 - 0.01;

export const WALLET_CONNECT_BRIDGE_URL = 'https://bridge.walletconnect.org';

export const SUPPORTED_NETWORKS = [
  {
    name: 'ETH Mainnet',
    short_name: 'ETH',
    chain: 'Mainnet',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    rpc_url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    native_currency: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
];

export const unitAsset = 'USDT';

export const WS_URL = 'wss://staging-001.tidebit.network/ws';

// Deprecated: dummy url settings (20230407 - Tzuhan)
export const BASE_URL = 'https://staging-001.tidebit.network';
// Deprecated: dummy url settings (20230407 - Tzuhan)
export const API_VERSION = '/api/v1';
// Deprecated: dummy url settings (20230407 - Tzuhan)
export const AVAILABLE_TICKERS = ['ETH', 'BTC'];

export const MAX_PRICE_TRADING_CHART_ONE_SEC = 1.005; // 1.005

export const MIN_PRICE_TRADING_CHART_ONE_SEC = 0.995; // 0.995

export const TRADING_CHART_PRICE_LIMIT_ONE_SEC = 0.1;

export const TRADING_CRYPTO_DATA = [
  {
    currency: 'ETH',
    chain: 'Ethereum',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2371.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'BTC',
    chain: 'Bitcoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2372.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'BNB',
    chain: 'BNB',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2374.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'SOL',
    chain: 'Solana',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2378.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'SHIB',
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2381.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'DOT',
    chain: 'Polkadot',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2385.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'ADA',
    chain: 'Cardano',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2388.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'AVAX',
    chain: 'Avalanche',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2391.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_x0020_1.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_2.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'XRP',
    chain: 'XRP',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2406.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'DOGE',
    chain: 'Dogecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_2-1.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'UNI',
    chain: 'Uniswap',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/uniswap-uni-logo.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'Flow',
    chain: 'Flow',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_2_1_.svg',
    tradingVolume: '217,268,645',
  },
];

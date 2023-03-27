// `const` which can be changed later

export const POSITION_PRICE_RENEWAL_INTERVAL_SECONDS = 15;

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

export const SUGGEST_TP = 0.2;
export const SUGGEST_SL = 0.1;

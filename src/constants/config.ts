// `const` which can be changed later

export const QUOTATION_RENEWAL_INTERVAL_SECONDS = 60;
export const WAITING_TIME_FOR_USER_SIGNING = 45;
export const DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS =
  QUOTATION_RENEWAL_INTERVAL_SECONDS - WAITING_TIME_FOR_USER_SIGNING;

export const POSITION_CLOSE_COUNTDOWN_SECONDS = 60;

export const COPYRIGHT = 'TideBit © 2022';

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

export const LIQUIDATION_FIVE_LEVERAGE = 0.2;

export const TRADING_CRYPTO_DATA = [
  {
    currency: 'ETH',
    chain: 'Ethereum',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/eth.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'BTC',
    chain: 'Bitcoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/btc.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/ltc.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/matic.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'BNB',
    chain: 'BNB',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/bnb.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'SOL',
    chain: 'Solana',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/sol.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'SHIB',
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/shib.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'DOT',
    chain: 'Polkadot',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/dot.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'ADA',
    chain: 'Cardano',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/ada.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'AVAX',
    chain: 'Avalanche',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/avax.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/dai.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/mkr.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'XRP',
    chain: 'XRP',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/xrp.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'DOGE',
    chain: 'Dogecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/doge.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'UNI',
    chain: 'Uniswap',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/uni.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'Flow',
    chain: 'Flow',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/flow.svg',
    tradingVolume: '217,268,645',
  },
];
export const SERVICE_TERM_TITLE = 'ServiceTerm';
export const DOMAIN = 'https://www.tidebit-defi.com';
export const TERM_OF_SERVICE = 'https://www.tidebit-defi.com/term_of_service/{hash}';
export const PRIVATE_POLICY = 'https://www.tidebit-defi.com/private_policy/{hash}';
export const DeWT_VALIDITY_PERIOD = 60 * 60; // seconds

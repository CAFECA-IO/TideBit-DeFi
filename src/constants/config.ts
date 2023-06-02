// `const` which can be changed later

import {Currency} from './currency';

export const QUOTATION_RENEWAL_INTERVAL_SECONDS = 60;
export const WAITING_TIME_FOR_USER_SIGNING = 45;
export const DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS =
  QUOTATION_RENEWAL_INTERVAL_SECONDS - WAITING_TIME_FOR_USER_SIGNING;

export const POSITION_CLOSE_COUNTDOWN_SECONDS = 60;

export const COPYRIGHT = 'TideBit © 2016 - 2023';

export const CONTACT_EMAIL = 'contact@tidebit-defi.com';

// 10 ** 9 - 0.01
export const TARGET_MAX_DIGITS = 10 ** 9 - 0.01;
export const TARGET_MIN_DIGITS = 0.01;

export const MONTH_FULL_NAME_LIST = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEK_LIST = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const FRACTION_DIGITS = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

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

export const API_URL = 'https://api.tidebit-defi.com'; //'http://localhost:80';
// export const API_URL = 'http://localhost:80'; //'https://api.tidebit-defi.com';

export const MAX_PRICE_TRADING_CHART_ONE_SEC = 1.005; // 1.005

export const MIN_PRICE_TRADING_CHART_ONE_SEC = 0.995; // 0.995

export const TRADING_CHART_PRICE_LIMIT_ONE_SEC = 0.1;

export const SUGGEST_TP = 0.2;
export const SUGGEST_SL = 0.1;

export const LIQUIDATION_FIVE_LEVERAGE = 0.2;

export const tickerIds = [
  'ethusdt',
  'btcusdt',
  'ltcusdt',
  'maticusdt',
  'bnbusdt',
  'solusdt',
  'shibusdt',
  'dotusdt',
  'adausdt',
  'avaxusdt',
  'daiusdt',
  'mkrusdt',
  'xrpusdt',
  'dogeusdt',
  'uniusdt',
  'flowusdt',
];

export const TRADING_CRYPTO_DATA = [
  {
    instId: `${Currency.ETH}-${unitAsset}`,
    currency: Currency.ETH,
    chain: 'Ethereum',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/eth.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.BTC}-${unitAsset}`,
    currency: Currency.BTC,
    chain: 'Bitcoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/btc.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.LTC}-${unitAsset}`,
    currency: Currency.LTC,
    chain: 'Litecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/ltc.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.MATIC}-${unitAsset}`,
    currency: Currency.MATIC,
    chain: 'Polygon',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/matic.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.BNB}-${unitAsset}`,
    currency: Currency.BNB,
    chain: 'BNB',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/bnb.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.SOL}-${unitAsset}`,
    currency: Currency.SOL,
    chain: 'Solana',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/sol.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.SHIB}-${unitAsset}`,
    currency: Currency.SHIB,
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/shib.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.DOT}-${unitAsset}`,
    currency: Currency.DOT,
    chain: 'Polkadot',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/dot.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.ADA}-${unitAsset}`,
    currency: Currency.ADA,
    chain: 'Cardano',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/ada.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.AVAX}-${unitAsset}`,
    currency: Currency.AVAX,
    chain: 'Avalanche',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/avax.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.DAI}-${unitAsset}`,
    currency: Currency.DAI,
    chain: 'Dai',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/dai.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.MKR}-${unitAsset}`,
    currency: Currency.MKR,
    chain: 'Maker',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/mkr.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.XRP}-${unitAsset}`,
    currency: Currency.XRP,
    chain: 'XRP',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/xrp.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.DOGE}-${unitAsset}`,
    currency: Currency.DOGE,
    chain: 'Dogecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/doge.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.UNI}-${unitAsset}`,
    currency: Currency.UNI,
    chain: 'Uniswap',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/asset_icon/uni.svg',
    tradingVolume: '217,268,645',
  },
  {
    instId: `${Currency.FLOW}-${unitAsset}`,
    currency: Currency.FLOW,
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
export const TERM_OF_SERVICE = DOMAIN + '{hash}';
export const PRIVATE_POLICY = DOMAIN + '{hash}';
export const DeWT_VALIDITY_PERIOD = 60 * 60; // seconds
export const CFD_LIQUIDATION_TIME = 86400;
export const TP_SL_LIMIT_PERCENT = 0.01;
export const DEFAULT_TICKER = 'ETH';
export const SHARING_BG_IMG_THRESHOLD_PNL_PERCENT = 5;
export const MIN_FEE_RATE = 0;
export const MAX_FEE_RATE = 0.2;
export const INITIAL_TRADES_INTERVAL = 1000 * 60 * 15; // Info: 15 minutes in milliseconds (ms) (20230601 - Tzuhan)
export const INITIAL_TRADES_BUFFER = 5 * 1000; // Info: 5 seconds in milliseconds (ms) (20230530 - tzuhhan)

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

export const WS_URL = 'wss://new.tidebit.com/ws';

export type IWalletExtension =
  | 'MetaMask'
  | 'WalletConnect'
  | 'iSunOne'
  | 'imToken'
  | 'Coinbase'
  | 'Trust'
  | 'Rainbow'
  | 'Houbi'
  | 'Coin98'
  | 'TokenPocket'
  | 'BitKeep'
  | 'Others';

export interface IWalletExtensionConstant {
  META_MASK: IWalletExtension;
  WALLET_CONNECT: IWalletExtension;
  I_SUN_ONE: IWalletExtension;
  IM_TOKEN: IWalletExtension;
  COINBASE: IWalletExtension;
  TRUST: IWalletExtension;
  RAINBOW: IWalletExtension;
  HOUBI: IWalletExtension;
  COIN_98: IWalletExtension;
  TOKEN_POCKET: IWalletExtension;
  BIT_KEEP: IWalletExtension;
  OTHERS: IWalletExtension;
}

export const WalletExtension: IWalletExtensionConstant = {
  META_MASK: 'MetaMask',
  WALLET_CONNECT: 'WalletConnect',
  I_SUN_ONE: 'iSunOne',
  IM_TOKEN: 'imToken',
  COINBASE: 'Coinbase',
  TRUST: 'Trust',
  RAINBOW: 'Rainbow',
  HOUBI: 'Houbi',
  COIN_98: 'Coin98',
  TOKEN_POCKET: 'TokenPocket',
  BIT_KEEP: 'BitKeep',
  OTHERS: 'Others',
};

export const WalletExtensionData = {
  [WalletExtension.META_MASK]: {
    name: WalletExtension.META_MASK,
    img: '/elements/74263ff26820cd0d895968e3b55e8902.svg',
  },
  [WalletExtension.I_SUN_ONE]: {
    name: WalletExtension.I_SUN_ONE,
    img: '/elements/i_sun_one.svg',
  },
  [WalletExtension.IM_TOKEN]: {
    name: WalletExtension.IM_TOKEN,
    img: '/elements/path_25918.svg',
  },
  [WalletExtension.COINBASE]: {
    name: WalletExtension.COINBASE,
    img: '/elements/18060234@2x.png',
  },
  [WalletExtension.TRUST]: {
    name: WalletExtension.TRUST,
    img: '/elements/twt@2x.png',
  },
  [WalletExtension.RAINBOW]: {
    name: WalletExtension.RAINBOW,
    img: '/elements/unnamed@2x.png',
  },
  [WalletExtension.HOUBI]: {
    name: WalletExtension.HOUBI,
    img: '/elements/logo@2x.png',
  },
  [WalletExtension.COIN_98]: {
    name: WalletExtension.COIN_98,
    img: '/elements/coin98_c98_logo@2x.png',
  },
  [WalletExtension.TOKEN_POCKET]: {
    name: WalletExtension.TOKEN_POCKET,
    img: '/elements/tokenpocket_wallet_logo@2x.png',
  },
  [WalletExtension.WALLET_CONNECT]: {
    name: WalletExtension.WALLET_CONNECT,
    img: '/elements/walletconnect@2x.png',
  },
  [WalletExtension.BIT_KEEP]: {
    name: WalletExtension.BIT_KEEP,
    img: '/elements/path_25917.svg',
  },
  [WalletExtension.OTHERS]: {
    name: WalletExtension.OTHERS,
    img: '/elements/wallet@2x.png',
  },
};

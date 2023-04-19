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

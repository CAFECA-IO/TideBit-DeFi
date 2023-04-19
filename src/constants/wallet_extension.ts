export type IWalletExtension = 'MetaMask' | 'WalletConnect';
export interface IWalletExtensionConstant {
  META_MASK: IWalletExtension;
  WALLET_CONNECT: IWalletExtension;
}
export const WalletExtension: IWalletExtensionConstant = {
  META_MASK: 'MetaMask',
  WALLET_CONNECT: 'WalletConnect',
};

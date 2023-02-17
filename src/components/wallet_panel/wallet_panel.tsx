import {useEffect, useRef, useContext, useState} from 'react';
import {ImCross, ImUpload2} from 'react-icons/im';
import WalletOption from '../wallet_option/wallet_option';
import useOuterClick from '../../lib/hooks/use_outer_click';
import TideButton from '../tide_button/tide_button';
import {ethers, providers} from 'ethers';
import DevToast from '../dev_toast/dev_toast';
import ConnectingModal from '../connecting_modal/connecting_modal';
import SignatureProcessModal from '../signature_process_modal/signature_process_modal';
import QrcodeModal from '../qrcode_modal/qrcode_modal';
import HelloModal from '../hello_modal/hello_modal';
// import {projectId} from '/src/constants/walletconnect';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import SignClient from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import {SUPPORTED_NETWORKS, WALLET_CONNECT_BRIDGE_URL} from '../../constants/config';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
// import {IWalletConnectOptions, IPushServerOptions} from '@walletconnect/types';
// import IConnector from '@walletconnect/types';
import {IConnector} from '../../interfaces/wallet_connect';
import {useTranslation} from 'next-i18next';
import {BiWallet} from 'react-icons/bi';
import {HiOutlineSave} from 'react-icons/hi';
import {CiSaveDown2} from 'react-icons/ci';
import {FaDownload, FaUpload} from 'react-icons/fa';
import {VscAccount} from 'react-icons/vsc';
// import {IoExitOutline} from 'react-icons/io';
// import {RxExit} from 'react-icons/rx';
import {ImExit} from 'react-icons/im';
// import TransferProcessModal from '../transfer_process_modal/transfer_process_modal';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';
import User from '../user/user';

// import Connector from '@walletconnect/core';

// import {ExternalProvider} from '@ethersproject/providers';
// import {MetaMaskInpageProvider} from '@metamask/providers';
// const {

//   Provider,
//   BaseProvider,

//   JsonRpcProvider,
//   StaticJsonRpcProvider,
//   UrlJsonRpcProvider,

//   FallbackProvider,

//   AlchemyProvider,
//   CloudflareProvider,
//   EtherscanProvider,
//   InfuraProvider,
//   NodesmithProvider,

//   IpcProvider,

//   Web3Provider,

//   WebSocketProvider,

//   JsonRpcSigner,

//   getDefaultProvider,

//   getNetwork,

//   Formatter,

//   // Types

//   TransactionReceipt,
//   TransactionRequest,
//   TransactionResponse,

//   Listener,

//   ExternalProvider,

//   Block,
//   BlockTag,
//   EventType,
//   Filter,
//   Log,

//   JsonRpcFetchFunc,

//   Network,
//   Networkish

// } = require("@ethersproject/providers");
// as { on: (e: string, l: () => void }

// type ExtensionForProvider = {
//   on: (event: string, callback: (...params: any) => void) => void;
// };

// type EthersProvider = ExternalProvider & ExtensionForProvider;
// console.log('IConnector:', IConnector);
type ExternalProvider = {
  isMetaMask?: boolean | undefined;
  isStatus?: boolean | undefined;
  host?: string | undefined;
  path?: string | undefined;
  sendAsync?:
    | ((
        request: {
          method: string;
          params?: Array<any>;
        },
        callback: (error: any, response: any) => void
      ) => void)
    | undefined;
  send?:
    | ((
        request: {
          method: string;
          params?: Array<any>;
        },
        callback: (error: any, response: any) => void
      ) => void)
    | undefined;
  request?: ((request: {method: string; params?: Array<any>}) => Promise<any>) | undefined;
};

declare global {
  interface Window {
    ethereum?: ExternalProvider | any;
  }
}
// type IWalletConnectProps = {
//   connected?: boolean;
//   createSession?: () => Promise<void>;
// };

interface WalletType {
  event: string;
  params: Param[];
}

interface Param {
  peerId: string;
  peerMeta: PeerMeta;
  chainId: number;
  accounts: string[];
}

interface PeerMeta {
  description: string;
  icons: string[];
  name: string;
  url: string;
}

const ICON_SIZE = 50;
const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID;

// TODO: salt is optional, but if not provided, the signature will be different each time(?)
type TranslateFunction = (s: string) => string;

interface IWalletPanelProps {
  className?: string;
  getUserLoginState?: (props: boolean) => void;
  // getUserLoginState: (props: boolean) => Promise<void>;
  // getUserInfo: (address: string) => Promise<void>;
  // getUserSignatureWithSaltAndMessage: (
  //   address: string,
  //   salt: string,
  //   message: string
  // ) => Promise<void>;
  panelVisible: boolean;
  panelClickHandler: () => void;
}

export default function WalletPanel({
  className,
  getUserLoginState,
  panelVisible,
  panelClickHandler,
}: IWalletPanelProps) {
  const globalCtx = useGlobal();
  const {availableTransferOptions} = useContext(MarketContext);

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  interface IConnectingProps {
    provider: providers.Web3Provider;
  }
  interface IConnectorProps {
    provider: providers.Web3Provider;
  }

  const [connecting, setConnecting] = useState(false);

  const [errorMessages, setErrorMessages] = useState('');
  const [signature, setSignature] = useState('');
  const [userBalance, setUserBalance] = useState('');

  const [chainId, setChainId] = useState(0);

  const [showToast, setShowToast] = useState(false);
  // IConnector
  const [connector, setConnector] = useState<IConnector>();
  const [fetching, setFetching] = useState(false);
  const [supported, setSupported] = useState(false);
  const [symbol, setSymbol] = useState(null);
  const [chooseWalletConnect, setChooseWalletConnect] = useState(false);
  const [walletConnectSuccessful, setWalletConnectSuccessful] = useState(false);
  const [signInStore, setSignInStore] = useState(false);

  const [chooseMetamask, setChooseMetamask] = useState(false);

  // First time connect to metamask, make accountsChanged event listener NOT send signature request
  const [metamaskConnectFirstTimeSuccessful, setMetamaskConnectFirstTimeSuccessful] =
    useState(false);

  const [signaturePending, setSignaturePending] = useState(false);

  const passUserLoginState = async (props: boolean) => {
    getUserLoginState && getUserLoginState(props);
  };

  const clearStateForMetamaskAccountChange = () => {
    setConnecting(false);
    // setChooseMetamask(false);

    userCtx.disconnect();
    passUserLoginState(false);

    setErrorMessages('');
    setSignature('');
    setUserBalance('');

    setChainId(0);
    setShowToast(false);
    setSignInStore(false);

    setConnector(undefined);

    setWalletConnectSuccessful(false);
    setChooseWalletConnect(false);
    setChooseMetamask(false);
    setSupported(false);
    setSymbol(null);

    // setConnector(null);
    setFetching(false);
  };

  const resetApp = () => {
    // killSession();

    // waitingWalletConnect = false;

    setMetamaskConnectFirstTimeSuccessful(false);
    setSignaturePending(false);

    setConnecting(false);
    // setChooseMetamask(false);

    userCtx.disconnect();
    passUserLoginState(false);

    setErrorMessages('');
    setSignature('');
    setUserBalance('');

    setChainId(0);
    setShowToast(false);
    setSignInStore(false);
    setConnector(undefined);
    setWalletConnectSuccessful(false);
    setChooseWalletConnect(false);
    setChooseMetamask(false);
    setSupported(false);
    setSymbol(null);

    // setConnector(null);
    setFetching(false);
  };

  const toastHandler = () => {
    setShowToast(!showToast);
  };

  // const requestSendingHandler = () => {
  //   funcSignTypedData();
  // };

  const disconnect = async () => {
    // resetApp();
    // if (connector) {
    //   connector.killSession();
    //   resetApp();
    // }
    userCtx.disconnect();
    resetApp();

    if (walletConnectSuccessful) {
      killSession();
      return;
    }

    const {ethereum} = window;
    if (ethereum) {
      try {
        const account = await ethereum.request({
          method: 'eth_requestAccounts',
          params: [{eth_accounts: {}}],
        });
        // console.log('Wallet Disconnected');
        userCtx.disconnect();
        passUserLoginState(false);

        setUserBalance('');
      } catch (error) {
        // console.error('Not connected to wallet', error);
      }
    }
  };

  // Initialize WalletConnect
  const connect = async () => {
    setFetching(true);

    // TODO: Notes for global / local constants
    // 1. Create connector
    const walletConnector = new WalletConnect({
      bridge: WALLET_CONNECT_BRIDGE_URL,
      qrcodeModal: QRCodeModal,
    });

    // 2. Update the connector state
    setConnector(walletConnector);

    // 3. If not connected, create a new session
    if (!walletConnector.connected) {
      // setConnectingModalVisible(true);
      // console.log('connecting visible...');
      // console.log('QR code opened...');
      setShowToast(true);

      try {
        const result = await walletConnector.createSession();
      } catch (error) {
        // console.error('error', error);
      }
    }

    // TODO: trial for split the function from useEffect
    // await walletConnecting();

    // if (walletConnector.connected) {
    // }

    // setProcessModalVisible(true)
    // setPanelVisible(false);
    // setProcessModalVisible(true);

    // await _walletConnectSignEIP712();

    // // TODO: wallet connect combo
    // if (walletConnector.connected && defaultAccount) {
    //   // console.log('connected...');

    //   // console.log('QR code closed...');
    //   setProcessModalVisible(true);
    //   _walletConnectSignEIP712();
    //   setFirstStepSuccess(true);
    // }

    // 4. Sign typed data
    // _walletConnectSignEIP712();
  };

  // Data collected when connected
  let isSignaturePending = false;
  async function onConnect(chainId: number, connectedAccount: string) {
    // handle connect event
    userCtx.connect();
    passUserLoginState(true);

    setChainId(chainId);
    setChooseWalletConnect(true);

    // get chain data
    const networkData = SUPPORTED_NETWORKS.filter(chain => chain.chain_id === chainId)[0];

    if (!networkData) {
      setSupported(false);
    } else {
      setSupported(true);
      // setNetwork(networkData.name);
      // setSymbol(networkData.native_currency.symbol);
      setChainId(chainId);

      try {
        // 1. Create an Ethers provider
        const provider = new ethers.providers.StaticJsonRpcProvider(networkData.rpc_url, {
          chainId,
          name: networkData.name,
        });
        // 2. Get the account balance
        const balance = await provider.getBalance(connectedAccount);
        // 3. Format the balance
        const formattedBalance = ethers.utils.formatEther(balance);
        // 4. Save the balance to state
        setUserBalance(formattedBalance);
      } catch (error: any) {
        // console.log(error.message);
        setErrorMessages(error.message);
      }
    }

    const defaulltAccountForCheck = userCtx.wallet?.toLowerCase();
    const connectedAccountForCheck = connectedAccount?.toLowerCase();

    if (!walletConnectSuccessful && !isSignaturePending) {
      setWalletConnectSuccessful(true);
      isSignaturePending = true;

      await _walletConnectSignEIP712({connectedAccount: connectedAccountForCheck});
    }
  }

  async function walletConnecting() {
    // console.log('start connecting');
    // console.log('connector: ', connector);

    if (connector) {
      connector.on('connect', async (error, payload) => {
        if (error) {
          // console.error(error);
          return;
        }

        const {chainId, accounts} = payload.params[0];

        // console.log('connect: ', payload.params[0]);

        await onConnect(chainId, accounts[0]);
        setFetching(false);
      });

      connector.on('session_update', async (error, payload) => {
        // waitingWalletConnect = false;
        setWalletConnectSuccessful(false);
        setSignInStore(false);
        setSignature('');

        const {chainId, accounts} = payload.params[0];

        // console.log('session_update: ', payload.params[0]);

        await onConnect(chainId, accounts[0]);
        setFetching(false);
      });

      connector.on('disconnect', async (error, payload) => {
        if (error) {
          // console.error(error);
        }
        // setWalletConnectSuccessful(false);

        // handle disconnect event
        // TODO: Couldn't be killed session when detected connector for the asynchronization?
        // disconnect();
        resetApp();

        // // reset state variables here
        //   setConnector(null);
        //   setFetching(false);
      });

      // check state variables here & if needed refresh the app
      // If any of these variables do not exist and the connector is connected, refresh the data
      if ((!chainId || !userCtx.wallet || !userBalance) && connector.connected) {
        refreshData();
      }
    }

    async function refreshData() {
      if (connector) {
        const {chainId, accounts} = connector;
        await onConnect(chainId, accounts[0]);
        setFetching(false);
      }
    }
  }

  useEffect(() => {
    if (!connector) return;
    walletConnecting();
  }, [connector, chainId, userCtx.wallet, userBalance]);

  useEffect(() => {
    if (!chooseMetamask) return;

    // injectedDetecting();
    if (walletConnectSuccessful) return;

    if (window?.ethereum) {
      // console.log('in window?.ethereum');

      // // FIXME: 拔掉電話線
      // ethereum?.removeListener('accountsChanged', async accounts => {
      //   setDefaultAccount(accounts[0]);
      // });

      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        // console.log('accountsChanged', accounts);
        // console.log(
        //   'in accountsChanged, metamaskConnectFirstTimeSuccessful state: ',
        //   metamaskConnectFirstTimeSuccessful
        // );
        // ---Detect User Diconnect the website from Metamask---
        if (!accounts[0]) {
          // console.log('injectedDetecting !accounts[0]');
          userCtx.disconnect();
          resetApp();
          // clearStateForMetamaskAccountChange();
          return;
        } else {
          userCtx.connect();
        }

        // ---Account Detecetion---
        setErrorMessages('');
        passUserLoginState(true);

        // ---Send Sign Request when wallet changed---
        // console.log('in injectedDetecting accounts[0]: ', accounts[0]);
        // console.log('in injectedDetecting defaultAccount: ', defaultAccount);
        // console.log('in injectedDetecting signInStore: ', signInStore);
        // console.log('in injectedDetecting signature: ', signature);

        // console.log(
        //   'metamaskConnectFirstTimeSuccessful state in account change: ',
        //   metamaskConnectFirstTimeSuccessful
        // );

        // No signature request sent when first time connected
        if (metamaskConnectFirstTimeSuccessful) return;
        // FIXME: send twice sign request
        // Avoid first time connected, send twice sign request `!accounts[0] && accounts[0] !== defaultAccount`
        // if (!defaultAccount && signInStore) return;
        // if (loading) return;

        // When accounts changed, it sends a request to sign typed data `accounts[0] !== defaultAccount`
        // if (accounts[0] !== defaultAccount) {
        //   funcSignTypedData();
        // }

        // funcSignTypedData();

        //   console.log('before setSignInStore');
        setSignInStore(false);
        // setFirstStepSuccess(false);
        setSignature('');
      });
    }

    // ethereum?.on('chainChanged', async chainId => {
    //   setChainId(chainId);
    // });

    // ethereum?.on('disconnect', () => {
    //   disconnect();
    //   console.log('ethereum disconnect');
    // });

    return () => {
      // console.log('Remove event listener, useEffect for injectedDetecting()');
      // FIXME: 拔掉電話線
      window?.ethereum?.removeListener('accountsChanged', async (accounts: string[]) => {
        passUserLoginState(true);
        userCtx.disconnect();
        resetApp();
      });
      // console.log('After Removing event listener, useEffect for injectedDetecting()');
    };
  }, [chooseMetamask]);

  async function _walletConnectSignEIP712(props: {connectedAccount: string}) {
    // if (loading) return;

    // console.log('props in _walletConnectSignEIP712: ', props);
    const typedData = {
      types: {
        EIP712Domain: [
          {name: 'name', type: 'string'},
          {name: 'version', type: 'string'},
          {name: 'chainId', type: 'uint256'},
          {name: 'verifyingContract', type: 'address'},
        ],
        Person: [
          {name: 'name', type: 'string'},
          {name: 'account', type: 'address'},
        ],
        Mail: [
          {name: 'from', type: 'Person'},
          {name: 'to', type: 'Person'},
          {name: 'contents', type: 'string'},
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'TideBit DeFi',
        version: '1.0',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      message: {
        from: {
          name: 'User',
          account: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        to: {
          name: 'TideBit DeFi',
          account: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      },
    };

    //  props?.connectedAccount ?? defaultAccount, // Required
    // console.log('in EIP712 sign func, props?.connectedAccount: ', props?.connectedAccount);

    // const accountControl = props?.connectedAccount?.toLowerCase() ?? defaultAccount?.toLowerCase();

    const accountControl = props?.connectedAccount?.toLowerCase();

    const msgParams = [
      accountControl, // Required
      JSON.stringify(typedData), // Required
    ];

    const typedDataForVerifying = {
      types: {
        Person: [
          {name: 'name', type: 'string'},
          {name: 'account', type: 'address'},
        ],
        Mail: [
          {name: 'from', type: 'Person'},
          {name: 'to', type: 'Person'},
          {name: 'contents', type: 'string'},
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'TideBit DeFi',
        version: '1.0',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      message: {
        from: {
          name: 'User',
          account: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        to: {
          name: 'TideBit DeFi',
          account: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      },
    };

    // if (defaultAccount) {
    //   setFirstStepSuccess(true);
    // }

    // FIXME: Should check if signature is pending
    // loading ||
    if (signInStore) {
      return;
    }

    // waitingWalletConnect = true;

    try {
      // setFirstStepSuccess(true);
      // setLoading(true);
      // setSecondStepSuccess(false);
      // setSecondStepError(false);
      setErrorMessages('');
      setSignature('');

      if (connector) {
        const signature = await connector.signTypedData(msgParams);
      }

      if (/^(0x|0X)?[a-fA-F0-9]+$/.test(signature)) {
        const testVerification = ethers.utils.verifyTypedData(
          typedDataForVerifying.domain,
          typedDataForVerifying.types,
          typedDataForVerifying.message,
          signature
        );

        const testVerificationLowerCase = testVerification?.toLowerCase();

        if (accountControl === testVerificationLowerCase) {
          setSignature(signature);
          // setSecondStepSuccess(true);
          userCtx.signServiceTerm();

          // setTimeout(() => setProcessModalVisible(false), DELAYED_HIDDEN_SECONDS);

          setErrorMessages('');
          // setPanelVisible(false);
          panelClickHandler();
          setShowToast(true);
          setSignInStore(true);
        }
      }
    } catch (error: any) {
      setSignature('');
      setErrorMessages(error.message);

      // setSecondStepError(true);
      // setLoading(false);

      setShowToast(true);
    }
  }

  const killSession = () => {
    // add logic to ensure the mobile wallet connection has been killed
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
    }
  };

  // const resetApp = () => {
  //   // reset state variables here
  //   setConnector(null);
  //   setFetching(false);
  // };

  async function funcSignTypedData() {
    if (connector && walletConnectSuccessful && userCtx.wallet) {
      _walletConnectSignEIP712({connectedAccount: userCtx.wallet});
      return;
    }

    if (signInStore) {
      return;
    }

    if (signaturePending) {
      return;
    }

    setMetamaskConnectFirstTimeSuccessful(false);
    // console.log(
    //   'after sign, metamask connect first time successful',
    //   metamaskConnectFirstTimeSuccessful
    // );

    const DOMAIN = {
      name: 'TideBit DeFi',
      version: '0.8.15',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      salt: '0x' + '0000000000000000000000000000000000000000000000000000000000000002',
    };

    // The named list of all type definitions
    const TYPES = {
      Person: [
        {name: 'name', type: 'string'},
        {name: 'wallet', type: 'address'},
      ],
      Mail: [
        {name: 'from', type: 'Person'},
        {name: 'to', type: 'Person'},
        {name: 'contents', type: 'string'},
      ],
    };

    // The data to sign
    // '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    const VALUE = {
      from: {
        name: 'User',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      to: {
        name: 'TideBit DeFi',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Agree to the terms and conditions',
    };

    try {
      setSignaturePending(true);

      setErrorMessages('');
      setSignature('');
      // setLoading(false);
      // setFirstStepError(false);
      // setSecondStepError(false);

      // console.log('projectId', projectId);

      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();
      const balance = await signer.getBalance();
      userCtx.connect();
      passUserLoginState(true);

      setChainId(chainId);

      if (chainId !== 1) {
        setShowToast(true);
      }

      // let balance = await provider.getBalance(address);
      const userBalance = ethers.utils.formatEther(balance);
      setUserBalance(userBalance);

      // setUserBalance(ethers.utils.formatEther(balance));

      // Connect to the wallet => first step success
      // Clear other state of the process modal
      // setFirstStepSuccess(true);
      // setSecondStepSuccess(false);
      // setSecondStepError(false);

      // setLoading(true);
      const signature = await signer._signTypedData(DOMAIN, TYPES, VALUE);

      // TODO: Notes why defaultAccount is '' here
      const isVerifyedSignature =
        address.toString() ===
        ethers.utils.verifyTypedData(DOMAIN, TYPES, VALUE, signature).toString();

      // console.log(
      //   `Sign by ${ethers.utils
      //     .verifyTypedData(DOMAIN, TYPES, VALUE, signature)
      //     .toString()}, Expected ${address}`
      // );

      if (/^(0x|0X)?[a-fA-F0-9]+$/.test(signature) && isVerifyedSignature) {
        userCtx.signServiceTerm();
        setSignature(signature);
        // setSecondStepSuccess(true);
        // console.log(verifyedSignature, defaultAccount, signature);
        // console.log(typeof ethers.utils.verifyTypedData(domain, types, value, signature));

        // setTimeout(() => setProcessModalVisible(false), DELAYED_HIDDEN_SECONDS);

        globalCtx.visibleHelloModalHandler();
        globalCtx.visibleWalletPanelHandler();
        // setHelloModalVisible(true);
        // setPanelVisible(false);
        // panelClickHandler();
        setErrorMessages('');
        setShowToast(true);
        setSignInStore(true);
        // console.log('sign in store, ', signInStore);
      }

      setSignaturePending(false);
    } catch (error: any) {
      // console.error(error);
      setSignaturePending(false);

      setMetamaskConnectFirstTimeSuccessful(false);
      // console.log('metamask connect first time successful', metamaskConnectFirstTimeSuccessful);

      setSignature('');
      setErrorMessages(error.message);
      // setSecondStepError(true);
      // setLoading(false);
    }
  }

  // TODO: 1. connect 2. sign
  // make sure connected, and then pop up the sign modal to continue signing
  async function walletConnectClient() {
    try {
      await connect();
      // FIXME: Need to check execution order // put all into one function? or check in one function?
      // setSecondStepSuccess(false);
      // setSecondStepError(false);
      // setProcessModalVisible(false);
      // await _walletConnectSignEIP712();
    } catch (error) {
      // console.log(error);
    }
  }

  // TODO: Ongoing connecting process (loading modal->signature process modal)
  async function metamaskConnect() {
    globalCtx.visibleWalletPanelHandler();

    // // -----WII-----
    // globalCtx.dataLoadingModalHandler({
    //   modalTitle: 'Wallet Connect',
    //   modalContent: 'Connecting...',
    // });
    // globalCtx.visibleLoadingModalHandler();

    // try {
    //   const connectWalletResult = await userCtx.connect();
    //   globalCtx.eliminateAllModals();
    //   // globalCtx.visibleLoadingModalHandler();

    //   if (connectWalletResult) {
    //     // globalCtx.visibleLoadingModalHandler();

    //     globalCtx.visibleSignatureProcessModalHandler();
    //   } else {
    //     // globalCtx.visibleLoadingModalHandler();

    //     globalCtx.visibleWalletPanelHandler();
    //   }
    // } catch (error) {
    //   globalCtx.visibleWalletPanelHandler();
    //   // console.error(error);
    // }
    // // -----WII-----

    if (!userCtx.isConnected) {
      try {
        // globalCtx.dataSuccessfulModalHandler({
        //   modalTitle: 'Wallet Connect',
        //   modalContent: 'Welcome!',
        // });
        // globalCtx.visibleSuccessfulModalHandler();

        globalCtx.dataLoadingModalHandler({
          modalTitle: 'Wallet Connect',
          modalContent: 'Connecting...',
        });
        globalCtx.visibleLoadingModalHandler();

        const connectWalletResult = await userCtx.connect();

        // TODO: [Zoom out the loading modal should be still in the connecting process and popup the afterward modals when it's proceeded to the next step]
        globalCtx.eliminateAllModals();

        // console.log('connect wallet result', connectWalletResult);
        // globalCtx.visibleLoadingModalHandler();
        // globalCtx.visibleSuccessfulModalHandler();

        if (connectWalletResult) {
          globalCtx.visibleSignatureProcessModalHandler();
        } else {
          globalCtx.visibleWalletPanelHandler();
        }
      } catch (error) {
        // console.error(error);
        globalCtx.visibleWalletPanelHandler();
      }
    } else {
      globalCtx.visibleSignatureProcessModalHandler();
    }

    // if (userCtx.isConnected) {
    //   globalCtx.visibleSignatureProcessModalHandler();
    // } else {
    //   globalCtx.visibleWalletPanelHandler();
    // }

    //   try {
    //     if (!userCtx.isConnected) {
    //       globalCtx.dataLoadingModalHandler({
    //         modalTitle: 'Wallet Connect',
    //         modalContent: 'Connecting...',
    //       });
    //       globalCtx.visibleLoadingModalHandler();

    //       const connectWalletResult = await userCtx.connect();
    //       globalCtx.visibleLoadingModalHandler();

    //     }

    //     if (userCtx.isConnected) {
    //       globalCtx.visibleSignatureProcessModalHandler();
    //     } else {
    //       globalCtx.visibleWalletPanelHandler();
    //     }

    //     globalCtx.visibleLoadingModalHandler();
    //   } catch (error) {
    //     console.error(error);
    //   }
  }

  const walletconnectOptionClickHandler = async () => {
    // walletConnectSignClient();
    setChooseWalletConnect(true);
    setChooseMetamask(false);

    setErrorMessages('');
    // setChooseMetamask(false);
    await walletConnectClient();
    // await walletConnectProgram();
  };

  const metamaskOptionClickHandler = async () => {
    setErrorMessages('');

    if (typeof window?.ethereum === 'undefined') {
      // walletConnectSignClient();
      // TODO: what about sign
      walletconnectOptionClickHandler();
      // console.log('Metemask is uninstalled');
      return;
    }

    setChooseWalletConnect(false);
    setChooseMetamask(true);
    metamaskConnect();
  };

  // {!!chooseWalletConnect ? (
  //   connector ? (
  //     <div>
  //       <TideButton onClick={killSession} className="bg-cuteBlue2 hover:bg-cuteBlue2/80">
  //         Kill session of wallet connect
  //       </TideButton>
  //     </div>
  //   ) : (
  //     <div className="text-cuteBlue4">Session closed successfully</div>
  //   )
  // ) : null}
  const toastNotify = (
    <DevToast
      title="Dev Receipt"
      content={
        <>
          {!!chooseWalletConnect && connector ? (
            <div>
              <TideButton
                onClick={killSession}
                className="rounded bg-cuteBlue2 px-5 py-2 text-base text-white transition-all hover:bg-cuteBlue2/80"
              >
                Kill session of wallet connect
              </TideButton>
            </div>
          ) : !!chooseWalletConnect && !connector ? (
            <div className="text-cuteBlue4">Session closed successfully</div>
          ) : null}

          <div>
            Chain Id: <span className="text-cuteBlue3">{chainId}</span>
            {!!(chainId !== 1) && (
              <div className="text-lightRed2">Please switch to ETH Mainnet</div>
            )}
          </div>
          <div>
            Your Address: <span className="text-cuteBlue3">{userCtx.wallet}</span>
          </div>
          {/* <div>{pairingSignature.account}</div>
          <div>{pairingSignature.signature}</div> */}
          <div>
            EIP 712 Signature: <span className="text-cuteBlue3">{signature}</span>
          </div>
          <div>{/* <span className="text-lightRed">{errorMessages}</span> */}</div>
        </>
      }
      toastHandler={toastHandler}
      showToast={showToast}
    />
  );

  const isDisplayedWalletPanel = panelVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            className="relative flex w-full flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mx-auto mt-2 pl-1/8 text-4xl font-semibold text-lightWhite">
                Wallet Connect
              </h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
                onClick={panelClickHandler}
              >
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative mx-10 flex-auto px-4 pb-4 pt-1">
              <div className="my-4 text-lg leading-relaxed text-white">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      onClick={metamaskOptionClickHandler}
                      name={`Metamask`}
                      img={`/elements/74263ff26820cd0d895968e3b55e8902.svg`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`iSunOne`} img={`/elements/i_sun_one.svg`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`imToken`} img={`/elements/path_25918.svg`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`Coinbase`}
                      img={`/elements/18060234@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Trust`} img={`/elements/twt@2x.png`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Rainbow`} img={`/elements/unnamed@2x.png`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Houbi`} img={`/elements/logo@2x.png`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`Coin98`}
                      img={`/elements/coin98_c98_logo@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`TokenPocket`}
                      img={`/elements/tokenpocket_wallet_logo@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      onClick={walletconnectOptionClickHandler}
                      name={`WalletConnect`}
                      img={`/elements/walletconnect@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`BitKeep`} img={`/elements/path_25917.svg`} iconSize={45} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Others`} img={`/elements/wallet@2x.png`} iconSize={50} />
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-30 bg-black opacity-25"></div>
    </>
  ) : null;

  return (
    <>
      {isDisplayedWalletPanel}

      {/* <SignatureProcessModal
        requestSendingHandler={requestSendingHandler}
        firstStepSuccess={firstStepSuccess}
        firstStepError={firstStepError}
        secondStepSuccess={secondStepSuccess}
        secondStepError={secondStepError}
        loading={loading}
        processModalVisible={processModalVisible}
        processClickHandler={processClickHandler}
      /> */}

      {toastNotify}
    </>
  );
}

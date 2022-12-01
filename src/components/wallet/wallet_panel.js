import {useEffect, useRef, useState} from 'react';
import {ImCross} from 'react-icons/im';
import WalletOption from './wallet_option';
import useOuterClick from '/src/hooks/lib/use_outer_click';
import TideButton from '../tide_button/tide_button';
import {ethers, providers} from 'ethers';
import Toast from '../toast/toast';
import ConnectingModal from './connecting_modal';
import SignatureProcessModal from './signature_process_modal';
import QrcodeModal from './qrcode_modal';
import HelloModal from './hello_modal';
// import {projectId} from '/src/constants/walletconnect';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import SignClient from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import {SUPPORTED_NETWORKS, WALLET_CONNECT_BRIDGE_URL} from '../../constants/config';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';

const ICON_SIZE = 50;
const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID;

// TODO: salt is optional, but if not provided, the signature will be different each time(?)
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

export default function WalletPanel(props) {
  const {
    ref: panelRef,
    componentVisible: panelVisible,
    setComponentVisible: setPanelVisible,
  } = useOuterClick(false);

  const {
    ref: connectingModalRef,
    componentVisible: connectingModalVisible,
    setComponentVisible: setConnectingModalVisible,
  } = useOuterClick(false);

  const {
    ref: processModalRef,
    componentVisible: processModalVisible,
    setComponentVisible: setProcessModalVisible,
  } = useOuterClick(false);

  const {
    ref: qrcodeModalRef,
    componentVisible: qrcodeModalVisible,
    setComponentVisible: setQrcodeModalVisible,
  } = useOuterClick(false);

  const {
    ref: helloModalRef,
    componentVisible: helloModalVisible,
    setComponentVisible: setHelloModalVisible,
  } = useOuterClick(false);

  const {
    ref: avatarMenuRef,
    componentVisible: avatarMenuVisible,
    setComponentVisible: setAvatarMenuVisible,
  } = useOuterClick(false);

  const [connecting, setConnecting] = useState(false);

  const [defaultAccount, setDefaultAccount] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [signature, setSignature] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const [loading, setLoading] = useState(false);
  const [firstStepSuccess, setFirstStepSuccess] = useState(false);
  const [firstStepError, setFirstStepError] = useState(false);
  const [secondStepSuccess, setSecondStepSuccess] = useState(false);
  const [secondStepError, setSecondStepError] = useState(false);

  const [chainId, setChainId] = useState(null);

  const [showToast, setShowToast] = useState(false);

  const [connector, setConnector] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [supported, setSupported] = useState(false);
  const [symbol, setSymbol] = useState(null);
  const [chooseWalletConnect, setChooseWalletConnect] = useState(false);

  const clearState = () => {
    setConnector(null);
    setConnecting(false);
    setDefaultAccount('');
    setErrorMessages('');
    setSignature(null);
    setUserBalance(null);
    setLoading(false);
    setFirstStepSuccess(false);
    setFirstStepError(false);
    setSecondStepSuccess(false);
    setSecondStepError(false);
    setChainId(null);
    setShowToast(false);
  };

  const toastHandler = () => {
    setShowToast(!showToast);
  };

  const clickHandler = () => {
    setPanelVisible(!panelVisible);

    // TODO: wallet connect kill session part 1
    // if (connector) {
    //   killSession();
    // }
  };

  const connectingClickHandler = () => {
    setConnectingModalVisible(!connectingModalVisible);
  };

  const qrcodeClickHandler = () => {
    // TODO: temparary solution, need to be fixed
    setPanelVisible(false);

    setQrcodeModalVisible(!qrcodeModalVisible);
    // console.log('wallet connect option clicked');
  };

  const helloClickHandler = () => {
    // TODO: temparary solution, need to be fixed
    // setPanelVisible(false);

    setHelloModalVisible(!helloModalVisible);
  };

  const processClickHandler = () => {
    setProcessModalVisible(!processModalVisible);
  };

  const avatarClickHandler = () => {
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const requestSendingHandler = () => {
    funcSignTypedData();
  };

  // Initialize WalletConnect
  const connect = async () => {
    setFetching(true);

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

      await walletConnector.createSession();

      // console.log('connecting Invisible...');
      // setConnectingModalVisible(false);
    }

    // 4. Sign typed data
    // _walletConnectSignEIP712();
  };

  // Data collected when connected
  async function onConnect(chainId, connectedAccount) {
    // handle connect event
    setDefaultAccount(connectedAccount);
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

      await _walletConnectSignEIP712((connectedAccount = connectedAccount));
    }
  }

  // Once connector, chainId, account, or balance chages, update the state
  useEffect(() => {
    if (connector) {
      connector.on('connect', async (error, payload) => {
        if (error) {
          // console.error(error);
          return;
        }

        const {chainId, accounts} = payload.params[0];
        await onConnect(chainId, accounts[0]);
        setFetching(false);

        // if (accounts[0]) await _walletConnectSignEIP712();
        // console.log('useEffect connector listener accounts[0]: ', accounts[0]);

        // console.log('connecting Invisible...');
        // setConnectingModalVisible(false);
      });

      connector.on('session_update', async (error, payload) => {
        // _walletConnectSignEIP712();
      });

      connector.on('disconnect', async (error, payload) => {
        if (error) {
          // console.error(error);
        }

        // handle disconnect event
        resetApp();
      });

      // check state variables here & if needed refresh the app
      // If any of these variables do not exist and the connector is connected, refresh the data
      if ((!chainId || !defaultAccount || !userBalance) && connector.connected) {
        refreshData();
      }
    }

    async function refreshData() {
      const {chainId, accounts} = connector;
      await onConnect(chainId, accounts[0]);
      setFetching(false);
    }
  }, [connector, chainId, defaultAccount, userBalance]);

  // TODO: Notes why it works with `[]`
  useEffect(() => {
    // console.log('ethereum side effect');
    if (window?.ethereum) {
      ethereum?.on('accountsChanged', async accounts => {
        setDefaultAccount(accounts[0]);
      });

      return () => {
        ethereum?.removeListener('accountsChanged', async accounts => {
          setDefaultAccount(accounts[0]);
        });
      };
    }
  }, []);

  async function _walletConnectSignEIP712(props) {
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
          account: `${defaultAccount}`,
        },
        to: {
          name: 'TideBit DeFi',
          account: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      },
    };

    const msgParams = [
      defaultAccount ?? props.connectedAccount, // Required
      JSON.stringify(typedData), // Required
    ];

    // if (defaultAccount) {
    //   setFirstStepSuccess(true);
    // }

    try {
      setFirstStepSuccess(true);
      setLoading(true);
      setProcessModalVisible(true);
      setSecondStepSuccess(false);
      setSecondStepError(false);
      setErrorMessages('');
      setSignature(null);

      const signature = await connector.signTypedData(msgParams);
      setSignature(signature);

      setSecondStepSuccess(true);

      setTimeout(() => setProcessModalVisible(false), DELAYED_HIDDEN_SECONDS);

      setHelloModalVisible(true);
      setPanelVisible(false);
      setShowToast(true);
    } catch (error) {
      // console.error('sign 712 ERROR', error);

      setSignature(null);
      setErrorMessages(error.message);

      setSecondStepError(true);
      setLoading(false);

      setShowToast(true);
    }
  }

  const killSession = () => {
    // add logic to ensure the mobile wallet connection has been killed
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
      clearState();
    }
    clearState();
  };

  const resetApp = () => {
    // reset state variables here
    setConnector(null);
    setFetching(false);
  };

  // TODO: 1. connect 2. sign
  // make sure connected, and then pop up the sign modal to continue signing
  async function walletConnectClient() {
    await connect();

    if (defaultAccount && chooseWalletConnect) {
      await _walletConnectSignEIP712();
    }

    // console.log('wallet connect client: ', connector, defaultAccount, chooseWalletConnect);
    // if (connector && defaultAccount && chooseWalletConnect) {
    //   setPanelVisible(false);
    //   setSecondStepError(false);
    //   setSecondStepSuccess(false);
    //   await _walletConnectSignEIP712();
    //   setLoading(false);
    // }
    // await funcSignTypedData();
  }

  async function funcSignTypedData() {
    if (defaultAccount && chooseWalletConnect) {
      await _walletConnectSignEIP712();
      return;
    }

    try {
      setErrorMessages('');
      setSignature(null);
      setLoading(false);
      setSecondStepError(false);

      // console.log('projectId', projectId);

      let provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      let signer = provider.getSigner();
      let address = await signer.getAddress();
      let chainId = await signer.getChainId();
      let balance = await signer.getBalance();
      setDefaultAccount(address);
      setChainId(chainId);

      if (chainId !== 1) {
        setShowToast(true);
      }

      // Connect to the wallet => first step success
      // Clear other state of the process modal
      setFirstStepSuccess(true);
      // setFirstStepError(false);
      setSecondStepSuccess(false);
      setSecondStepError(false);

      setUserBalance(ethers.utils.formatEther(balance));

      // The data to sign
      // '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
      const value = {
        from: {
          name: 'User',
          wallet: `${address}`,
        },
        to: {
          name: 'TideBit DeFi',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      };

      setLoading(true);
      let signature = await signer._signTypedData(DOMAIN, TYPES, value);
      setErrorMessages('');

      setSignature(signature);

      setSecondStepSuccess(true);

      setTimeout(() => setProcessModalVisible(false), DELAYED_HIDDEN_SECONDS);

      setHelloModalVisible(true);

      setShowToast(true);

      // console.log('[EIP712] Sign typed signature: ', signature);
    } catch (error) {
      // console.error(error);
      setSignature(null);
      setErrorMessages(error.message);
      setSecondStepError(true);
      setLoading(false);
    }
  }

  // FIXME: nothing but taking notes
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
  let toastNotify = (
    <Toast
      title="Your signature"
      content={
        <>
          {!!chooseWalletConnect && connector ? (
            <div>
              <TideButton onClick={killSession} className="bg-cuteBlue2 hover:bg-cuteBlue2/80">
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
            Your Address: <span className="text-cuteBlue3">{defaultAccount}</span>
          </div>
          <div>
            EIP 712 Signature: <span className="text-cuteBlue3">{signature}</span>
          </div>
          <div>
            <span className="text-lightRed">{errorMessages}</span>
          </div>
        </>
      }
      toastHandler={toastHandler}
      showToast={showToast}
    />
  );

  async function metamaskConnect() {
    // console.log('metamask connect func called');
    try {
      setPanelVisible(!panelVisible);
      setConnecting(true);
      setConnectingModalVisible(true);

      let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      // pop up the metamask window
      await provider.send('eth_requestAccounts', []);
      let signer = provider.getSigner();
      let address = await signer.getAddress();
      setDefaultAccount(address);
      let chainId = await signer.getChainId();
      setChainId(chainId);

      if (chainId !== 1) {
        // console.log('Please switch to ETH mainnet');
        setShowToast(true);
      }

      let balance = await provider.getBalance(address);
      balance = ethers.utils.formatEther(balance);
      setUserBalance(balance);
      // console.log('user balance: ', balance);
      // console.log('connect to Metamask clicked, Account: ', address);

      // TODO: NNNNNNNotes
      // console.log('connecting modal should be invisible: ', connectingModalVisible);
      setConnectingModalVisible(false);
      setConnecting(false);

      setProcessModalVisible(true);

      // let signature = await signer.signMessage('TideBit DeFi test');
      // console.log('Sign the message, get the signature is: ', signature);
      funcSignTypedData();
    } catch (error) {
      // console.log(error);
      setErrorMessages(error);
      setFirstStepError(true);
      setProcessModalVisible(true);

      setConnectingModalVisible(false);
      setConnecting(false);
    }
    // if (window.ethereum) {
    //   window.ethereum
    //     .request({method: 'eth_requestAccounts'})
    //     .then((accounts) => {
    //       setDefaultAccount(accounts[0]);
    //       setFirstStepSuccess(true);
    //       setFirstStepError(false);
    //     })
    //     .catch((error) => {
    //       if (error.code === 4001) {
    //         // EIP-1193 userRejectedRequest error
    //         // If this happens, the user rejected the connection request.
    //         // console.log('Please connect to MetaMask.');
    //         setErrorMessages('Please connect to MetaMask.');
    //         setFirstStepError(true);
    //       } else {
    //         console.error(error);
    //       }
    //     });
    // } else {
    //   console.log('Please install MetaMask!');
    //   setErrorMessages('Please install MetaMask!');
    //   setFirstStepError(true);
    // }
  }

  const walletconnectOptionClickHandler = async () => {
    // walletConnectSignClient();
    setChooseWalletConnect(true);
    await walletConnectClient();
  };

  const metamaskOptionClickHandler = async () => {
    // TODO: NNNNNNNotes
    // console.log('connecting modal should be visible: ', connectingModalVisible);

    if (typeof window.ethereum === 'undefined') {
      // walletConnectSignClient();
      // TODO: what about sign
      walletconnectOptionClickHandler();
      // console.log('Metemask is uninstalled');
      return;
    }

    setChooseWalletConnect(false);
    metamaskConnect();
  };

  const isDisplayedWalletPanel = panelVisible ? (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
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
                onClick={clickHandler}
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

  // TODO: wallet connect kill session part 2

  function accountTruncate(text) {
    return text?.substring(0, 6) + '...' + text?.substring(text.length - 5);
  }

  let username = defaultAccount?.slice(-1).toUpperCase();

  const disconnect = async () => {
    killSession();
    setDefaultAccount(null);
    setChooseWalletConnect(null);

    const {ethereum} = window;
    if (ethereum) {
      try {
        await ethereum.request({
          method: 'eth_requestAccounts',
          params: [{eth_accounts: {}}],
        });
        // console.log('Wallet Disconnected');
        setDefaultAccount(null);
        setUserBalance(null);
      } catch (error) {
        // console.error('Not connected to wallet', error);
      }
    }
    setAvatarMenuVisible(false);
  };

  const isDisplayedAvatarMenu =
    defaultAccount && avatarMenuVisible ? (
      // Background
      <div
        id="userDropdown"
        className="absolute top-16 right-8 z-10 w-285px divide-y divide-lightGray rounded-none bg-darkGray shadow"
      >
        {/* Avatar Section */}
        <div className="mx-3 items-center py-3 px-4 text-center text-sm text-lightGray">
          {/* Avatar */}
          <div className="relative ml-3 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
            <span className="text-5xl font-bold text-lightWhite">{username}</span>
          </div>
          {/* Account */}
          <div className="ml-4 mt-2 truncate text-sm">{accountTruncate(defaultAccount)}</div>
        </div>

        <ul
          className="mx-3 py-1 pb-3 text-base text-gray-700 dark:text-gray-200"
          aria-labelledby="avatarButton"
        >
          <li>
            <a href="#" className="block py-2 pr-4 pl-6 hover:bg-darkGray5">
              My Wallet
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 pr-4 pl-6 hover:bg-darkGray5">
              Deposit
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 pr-4 pl-6 hover:bg-darkGray5">
              Withdraw
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 pr-4 pl-6 hover:bg-darkGray5">
              My account
            </a>
          </li>
          <li>
            <a onClick={disconnect} href="#" className="block py-2 pr-4 pl-6 hover:bg-darkGray5">
              Disconnect
            </a>
          </li>
        </ul>
      </div>
    ) : null;

  const isDisplayedUserAvatar = defaultAccount ? (
    <>
      <button
        onClick={avatarClickHandler}
        className="relative ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme"
      >
        <span className="text-2xl font-bold text-lightWhite">{username}</span>
      </button>
      {isDisplayedAvatarMenu}
    </>
  ) : (
    <TideButton
      onClick={clickHandler}
      className={`${props?.className} mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white hover:bg-cyan-600 focus:outline-none md:mt-0`}
    >
      Wallet Connect
    </TideButton>
  );

  return (
    <>
      {isDisplayedUserAvatar}

      {isDisplayedWalletPanel}

      <ConnectingModal
        connectingModalVisible={connectingModalVisible}
        connectingClickHandler={connectingClickHandler}
      />

      <QrcodeModal
        qrcodeModalVisible={qrcodeModalVisible}
        qrcodeClickHandler={qrcodeClickHandler}
      />

      <HelloModal helloModalVisible={helloModalVisible} helloClickHandler={helloClickHandler} />

      <SignatureProcessModal
        requestSendingHandler={requestSendingHandler}
        firstStepSuccess={firstStepSuccess}
        firstStepError={firstStepError}
        secondStepSuccess={secondStepSuccess}
        secondStepError={secondStepError}
        loading={loading}
        processModalVisible={processModalVisible}
        processClickHandler={processClickHandler}
      />

      {/* TODO: Notes- the below is the same but `{toastNotify}` is easier to be changed and managed  */}
      {toastNotify}
    </>
  );
}

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
import {SUPPORTED_NETWORKS} from '../../constants/network';

const ICON_SIZE = 50;
const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID;

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

  // TODO: wallet connect kill session part 2
  // const walletConnectBtnTextHandler = connector ? 'Disconnect' : 'Wallet Connect';

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

  const requestSendingHandler = () => {
    funcSignTypedData();
  };

  // Initialize WalletConnect
  const connect = async () => {
    setFetching(true);

    // 1. Create connector
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: QRCodeModal,
    });

    // 2. Update the connector state
    setConnector(connector);

    // 3. If not connected, create a new session
    if (!connector.connected) {
      // setConnectingModalVisible(true);
      // console.log('connecting visible...');
      // console.log('QR code opened...');
      setShowToast(true);

      await connector.createSession();
      setPanelVisible(false);
      setSecondStepError(false);
      setSecondStepSuccess(false);
      setLoading(false);
      setFirstStepSuccess(true);
      setErrorMessages('');
      setSignature(null);

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

        setPanelVisible(false);
        setProcessModalVisible(true);
        setFirstStepSuccess(true);

        // console.log('connecting Invisible...');
        // setConnectingModalVisible(false);
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

  async function _walletConnectSignEIP712() {
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
      defaultAccount, // Required
      JSON.stringify(typedData), // Required
    ];

    try {
      setLoading(true);
      setProcessModalVisible(true);
      setFirstStepSuccess(true);
      setSecondStepSuccess(false);
      setErrorMessages('');
      setSignature(null);

      const signature = await connector.signTypedData(msgParams);
      setSignature(signature);

      setSecondStepSuccess(true);
      setTimeout(() => setProcessModalVisible(false), 1000);

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
    resetApp();
  };

  const resetApp = () => {
    // reset state variables here
    setConnector(null);
    setFetching(false);
  };

  // TODO: 1. connect 2. sign
  // make sure connected, and then pop up the sign modal to continue signing
  async function walletConnectClient() {
    connect();

    if (connector) {
      setSecondStepError(false);
      setSecondStepSuccess(false);
      await _walletConnectSignEIP712();
      setLoading(false);
    }
    // DOC: Sign Typed Data
    // connector
    //   .signTypedData(msgParams)
    //   .then(result => {
    //     // Returns signature.
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     // Error returned when rejected
    //     console.error(error);
    //   });
    //   try {
    //     const client = new SignClient({
    //       bridge: 'https://bridge.walletconnect.org',
    //       qrcodeModal: QRCodeModal,
    //     });
    //     client.on('connect', (error, payload) => {
    //       if (error) {
    //         throw error;
    //       }
    //       // Get provided accounts and chainId
    //       const {accounts, chainId} = payload.params[0];
    //       console.log('accounts: ', accounts);
    //       console.log('chainId: ', chainId);
    //     });
    //     client.on('session_update', (error, payload) => {
    //       if (error) {
    //         throw error;
    //       }
    //       // Get updated accounts and chainId
    //       const {accounts, chainId} = payload.params[0];
    //       console.log('accounts: ', accounts);
    //       console.log('chainId: ', chainId);
    //     });
    //     client.on('disconnect', (error, payload) => {
    //       if (error) {
    //         throw error;
    //       }
    //       // Delete connector
    //     });
    //     // create new session
    //     client
    //       .createSession({
    //         permissions: {
    //           blockchain: {
    // }}})
  }

  // async function walletConnectQrcodeModalApp({signClient}) {
  //   try {
  //     const {uri, approval} = await signClient.connect({
  //       // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
  //       pairingTopic: pairing?.topic,
  //       // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
  //       requiredNamespaces: {
  //         eip155: {
  //           methods: [
  //             'eth_sendTransaction',
  //             'eth_signTransaction',
  //             'eth_sign',
  //             'personal_sign',
  //             'eth_signTypedData',
  //           ],
  //           chains: ['eip155:1'],
  //           events: ['chainChanged', 'accountsChanged'],
  //         },
  //       },
  //     });

  //     // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
  //     if (uri) {
  //       QRCodeModal.open(uri, () => {
  //         console.log('EVENT', 'QR Code Modal closed');
  //       });
  //     }

  //     // Await session approval from the wallet.
  //     const session = await approval();
  //     // Handle the returned session (e.g. update UI to "connected" state).
  //     await onSessionConnected(session);
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     // Close the QRCode modal in case it was open.
  //     QRCodeModal.close();
  //   }
  //   // const provider = new providers.Web3Provider(window.ethereum);
  //   // const signer = provider.getSigner();
  //   // const address = await signer.getAddress();
  //   // const client = new SignClient({
  //   //   bridge: 'https://bridge.walletconnect.org',
  //   //   qrcodeModal: QRCodeModal,
  //   // });
  //   // client.on('connect', (error, payload) => {
  //   //   if (error) {
  //   //     throw error;
  //   //   }
  //   //   // Get provided accounts and chainId
  //   //   const {accounts, chainId} = payload.params[0];
  //   //   console.log('accounts: ', accounts);
  //   //   console.log('chainId: ', chainId);
  //   // });
  //   // client.on('session_update', (error, payload) => {
  //   //   if (error) {
  //   //     throw error;
  //   //   }
  //   //   // Get updated accounts and chainId
  //   //   const {accounts, chainId} = payload.params[0];
  //   //   console.log('accounts: ', accounts);
  //   //   console.log('chainId: ', chainId);
  //   // });
  //   // client.on('disconnect', (error, payload) => {
  //   //   if (error) {
  //   //     throw error;
  //   //   }
  //   //   // Delete connector
  //   // });
  //   // // create new session
  //   // client
  //   //   .createSession({
  //   //     permissions: {
  //   //       blockchain: {
  //   //         chains
  // }

  // async function walletConnectSignClient() {
  //   // console.log('projectid: ', WALLET_CONNECT_PROJECT_ID);

  //   // 1. Initiate your WalletConnect client with the relay server
  //   const signClient = await SignClient.init({
  //     projectId: WALLET_CONNECT_PROJECT_ID,
  //     metadata: {
  //       name: 'TideBit DeFi',
  //       description: 'TideBit DeFi WalletConnect Sign Client',
  //       url: '#',
  //       icons: ['https://walletconnect.com/_next/static/media/logo_mark.84dd8525.svg'],
  //     },
  //   });

  //   // console.log('signClient: ', signClient);

  //   // 2. Add listeners for desired SignClient events.
  //   signClient.on('session_event', ({events}) => {
  //     // events.forEach((event) => {
  //     //   if (event.type === "session_request") {}
  //     // console.log('session_event', events);
  //   });

  //   signClient.on('session_update', ({topic, params}) => {
  //     const {namespaces} = params;
  //     const _session = signClient.session.get(topic);
  //     // Overwrite the `namespaces` of the existing session with the incoming one.
  //     const updatedSession = {..._session, namespaces};
  //     // Integrate the updated session state into your dapp state.
  //     onSessionUpdate(updatedSession);
  //     // console.log('session_update', updatedSession);
  //   });

  //   signClient.on('session_delete', () => {
  //     // Session was deleted -> reset the dapp state, clean up from user session, etc.
  //     clearState();
  //     // console.log('session_delete');
  //   });

  //   // 3. Connect the application and specify session permissions.
  //   // walletConnectQrcodeModalApp;
  //   try {
  //     const {uri, approval} = await signClient.connect({
  //       // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
  //       pairingTopic: pairing?.topic,
  //       // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
  //       requiredNamespaces: {
  //         eip155: {
  //           methods: [
  //             'eth_sendTransaction',
  //             'eth_signTransaction',
  //             'eth_sign',
  //             'personal_sign',
  //             'eth_signTypedData',
  //           ],
  //           chains: ['eip155:1'],
  //           events: ['chainChanged', 'accountsChanged'],
  //         },
  //       },
  //     });

  //     // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
  //     if (uri) {
  //       QRCodeModal.open(uri, () => {
  //         // console.log('EVENT', 'QR Code Modal closed, but the property is `open`');
  //       });
  //     }

  //     // Await session approval from the wallet.
  //     const session = await approval();
  //     // Handle the returned session (e.g. update UI to "connected" state).
  //     await onSessionConnected(session);
  //   } catch (e) {
  //     // console.error(e);
  //     setErrorMessages(error.message);
  //   } finally {
  //     // Close the QRCode modal in case it was open.
  //     QRCodeModal.close();
  //   }

  //   const result = await signClient.request({
  //     topic: session.topic,
  //     chainId: 'eip155:1',
  //     request: {
  //       id: 1,
  //       jsonrpc: '2.0',
  //       method: 'personal_sign',
  //       params: [
  //         '0x1d85568eEAbad713fBB5293B45ea066e552A90De',
  //         '0x7468697320697320612074657374206d65737361676520746f206265207369676e6564',
  //       ],
  //     },
  //   });
  // }

  async function funcSignTypedData() {
    if (connector) {
      await _walletConnectSignEIP712();
      return;
      // // console.log('detect connector');
      // try {
      //   // console.log('start try signTypedData');
      //   // setLoading(true);
      //   await _walletConnectSignEIP712();
      //   // setLoading(false);
      //   // console.log('signTypedData success');
      //   return;
      // } catch (error) {
      //   // console.log('wallet connect signTypedData error: ', error);
      //   setErrorMessages(error.message);
      //   setShowToast(true);
      //   setLoading(false);
      //   return;
      // }
    }

    try {
      setErrorMessages('');
      setSignature(null);
      setLoading(true);
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

      // All properties on a domain are optional(?)
      // TODO: salt is optional, but if not provided, the signature will be different each time(?)
      const domain = {
        name: 'TideBit Ex',
        version: '0.8.15',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        salt: '0x' + '0000000000000000000000000000000000000000000000000000000000000002',
      };

      // The named list of all type definitions
      const types = {
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
      let signature = await signer._signTypedData(domain, types, value);
      setErrorMessages('');

      setSignature(signature);

      setSecondStepSuccess(true);

      setTimeout(() => setProcessModalVisible(false), 1000);

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
    walletConnectClient();
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

  return (
    <>
      <TideButton
        onClick={clickHandler}
        className={`${props?.className} mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white hover:bg-cyan-600 focus:outline-none md:mt-0`}
      >
        Wallet Connect
      </TideButton>

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
      {/* <Toast
        title="Your signature"
        content={
          <>
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
      /> */}
    </>
  );
}

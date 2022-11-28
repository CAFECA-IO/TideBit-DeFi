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
import {projectId} from '/src/constants/walletconnect';
// import WalletConnectProvider from '@walletconnect/web3-provider';
import SignClient from '@walletconnect/sign-client';
// import QRCodeModal from '@walletconnect/qrcode-modal';

const ICON_SIZE = 50;

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

  const toastHandler = () => {
    setShowToast(!showToast);
  };

  const clickHandler = () => {
    setPanelVisible(!panelVisible);
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

  const requestSendingHandler = () => {
    funcSignTypedData();
  };

  async function walletConnectSignClient() {
    // 1. Initiate your WalletConnect client with the relay server
    const signClient = await SignClient.init({
      projectId: projectId,
      metadata: {
        name: 'TideBit DeFi',
        description: 'TideBit DeFi WalletConnect Sign Client',
        url: 'https://defi.tidebit.com/app',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
    });
    // console.log('in wallet connect sign client, projectid: ', projectId);

    // 2. Add listeners for desired SignClient events.
    signClient.on('session_event', ({events}) => {
      // events.forEach((event) => {
      //   if (event.type === "session_request") {}
      // console.log('session_event', events);
    });

    signClient.on('session_update', ({topic, params}) => {
      const {namespaces} = params;
      const _session = signClient.session.get(topic);
      const updatedSession = {..._session, namespaces};
      onSessionUpdate(updatedSession);
    });

    signClient.on('session_delete', () => {
      // Session was deleted -> reset the dapp state, clean up from user session, etc.
    });

    // 3. Connect the application and specify session permissions.
    try {
    } catch (error) {
      // console.log(error)
      setErrorMessages(error.message);
    }
  }

  async function funcSignTypedData() {
    try {
      setErrorMessages('');
      setSignature(null);
      setLoading(true);
      // console.log('projectId', projectId);

      let provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      let signer = provider.getSigner();
      let address = await signer.getAddress();
      let chainId = await signer.getChainId();
      let balance = await signer.getBalance();
      setDefaultAccount(address);

      // Connect to the wallet => first step success
      // Clear other state of the process modal
      setFirstStepSuccess(true);
      // setFirstStepError(false);
      setSecondStepSuccess(false);
      setSecondStepError(false);

      // setChainId(chainId);
      setUserBalance(ethers.utils.formatEther(balance));

      // console.log('chain id: ', chainId);
      // // console.log('set chain id: ', chainId);
      // console.log('address: ', address);
      // console.log('default account: ', defaultAccount);
      // console.log('setUserBalance: ', userBalance);
      // console.log('balance: ', balance);

      // All properties on a domain are optional
      // TODO: salt is optional, but if not provided, the signature will be different each time
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
          name: 'TideBit Ex',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      };

      // signNotify({value: value});

      // console.log(value);
      setLoading(true);
      let signature = await signer._signTypedData(domain, types, value);

      setSignature(signature);
      // setLoading(false);
      setSecondStepSuccess(true);

      setTimeout(() => setProcessModalVisible(false), 1000);

      // setProcessModalVisible(false);
      setHelloModalVisible(true);

      setShowToast(true);
      // setLoading(false);

      // setLoading(false);

      // console.log('[EIP712] Sign typed signature: ', signature);
    } catch (error) {
      // console.error(error);
      setErrorMessages(error.message);
      setSecondStepError(true);
      setLoading(false);
    }
  }

  // FIXME: nothing but taking notes
  let toastNotify = (
    <Toast
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
    />
  );

  const walletOptionClickHandler = async () => {
    // TODO: NNNNNNNotes
    // console.log('connecting modal should be visible: ', connectingModalVisible);

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
  };

  // FIXME: To be improved
  const clearState = () => {
    if (!panelVisible) {
      setConnecting(false);
      // setDefaultAccount(null);
      setErrorMessages('');
      setSignature(null);
      setUserBalance(null);
    }
    // setConnecting(false);
    // setDefaultAccount(null);
    // setErrorMessages('');
    // setSignature(null);
    // setUserBalance(null);
  };

  const isDisplayedWalletPanel = panelVisible ? (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            ref={panelRef}
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
                      onClick={walletOptionClickHandler}
                      name={`Metamask`}
                      img={`/elements/74263ff26820cd0d895968e3b55e8902.svg`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      onClick={helloClickHandler}
                      name={`iSunOne`}
                      img={`/elements/i_sun_one.svg`}
                      iconSize={50}
                    />
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
                      onClick={qrcodeClickHandler}
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
        content={`Wallet Connect`}
      >
        {`Wallet Connect`}
      </TideButton>

      {isDisplayedWalletPanel}

      <ConnectingModal
        connectingModalRef={connectingModalRef}
        connectingModalVisible={connectingModalVisible}
        connectingClickHandler={connectingClickHandler}
      />

      <QrcodeModal
        qrcodeModalRef={qrcodeModalRef}
        qrcodeModalVisible={qrcodeModalVisible}
        qrcodeClickHandler={qrcodeClickHandler}
      />

      <HelloModal
        helloModalRef={helloModalRef}
        helloModalVisible={helloModalVisible}
        helloClickHandler={helloClickHandler}
      />

      <SignatureProcessModal
        requestSendingHandler={requestSendingHandler}
        firstStepSuccess={firstStepSuccess}
        firstStepError={firstStepError}
        secondStepSuccess={secondStepSuccess}
        secondStepError={secondStepError}
        loading={loading}
        processModalRef={processModalRef}
        processModalVisible={processModalVisible}
        processClickHandler={processClickHandler}
      />

      {toastNotify}
    </>
  );
}

import {useEffect, useRef, useState} from 'react';
// import { createPortal } from 'react-dom';
import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import WalletOption from './wallet_option';
import useOuterClick from '/src/hooks/lib/use_outer_click';
import TideButton from '../tide_button/tide_button';
import ConnectingModal from '../connecting_modal/connecting_modal';
import {ethers, providers} from 'ethers';
import Link from 'next/link';
import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';

const ICON_SIZE = 50;

export default function WalletPanel(props) {
  const {ref, componentVisible, setComponentVisible} = useOuterClick(false);
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

  const [loading, setLoading] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [errorMessages, setErrorMessages] = useState('');
  const [signature, setSignature] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const clickHandler = () => {
    setComponentVisible(!componentVisible);
  };

  const connectingClickHandler = () => {
    setConnectingModalVisible(!connectingModalVisible);
  };

  const qrcodeClickHandler = () => {
    setQrcodeModalVisible(!qrcodeModalVisible);
    // console.log('wallet connect option clicked');
  };

  // const isDisplayedQrcodeModal =

  function QrcodeModal() {
    return qrcodeModalVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={qrcodeModalRef}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="ml-1/8 mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={qrcodeClickHandler} />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative flex-auto pt-1">
                <div className="text-lg leading-relaxed text-lightWhite">
                  <div className="flex-col justify-center text-center">
                    <Image
                      className="mx-auto mt-16 rounded object-cover object-center"
                      alt="QR Code"
                      src="/elements/tidebit_qrcode.png"
                      width={340}
                      height={340}
                    />{' '}
                    <div className="mt-10 text-lg">
                      Please open your{' '}
                      <span className="text-tidebitTheme">
                        <Link href="#">wallet</Link>
                      </span>{' '}
                      to scan the QR code.
                    </div>
                  </div>
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end rounded-b p-2"></div>
            </div>
          </div>
        </div>
        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
      </>
    ) : null;
  }

  function DisplayedConnecting() {
    // console.log('in displayed connecting modal, componentVisible: ', componentVisible);
    return connectingModalVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={connectingModalRef}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="mx-auto mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={connectingClickHandler} />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative flex-auto pt-1">
                <div className="text-lg leading-relaxed text-lightWhite">
                  <div className="flex-col justify-center text-center">
                    <Lottie className="ml-7 w-full pt-12" animationData={bigConnectingAnimation} />
                    <div className="mt-10 text-xl">Connecting...</div>
                  </div>
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end rounded-b p-2"></div>
            </div>
          </div>
        </div>
        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
      </>
    ) : null;
  }

  const isLoading = loading ? <DisplayedConnecting /> : null;

  // const isWalletConnectOpen =

  const walletOptionClickHandler = async () => {
    setComponentVisible(!componentVisible);
    setLoading(true);
    setConnectingModalVisible(true);

    // TODO: NNNNNNNotes
    // console.log('connecting modal should be visible: ', connectingModalVisible);

    try {
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

      let signature = await signer.signMessage('TideBit DeFi test');
      // console.log('Sign the message, get the signature is: ', signature);
    } catch (error) {
      // console.log(error);
      setErrorMessages(error);
    }

    // TODO: NNNNNNNotes
    // console.log('connecting modal should be invisible: ', connectingModalVisible);
    setConnectingModalVisible(false);
    setLoading(false);
  };

  // click metamask => connect to metamask & show connecting modal
  // connected => show signature modal
  // click wallet connect => show QR code modal
  // click
  const modalHandler = async () => {};

  const connectStateHandler = () => {
    setConnecting(true);
    setComponentVisible(!componentVisible);

    // <ConnectingModal showConnectingModal="true" />;
  };

  const isDisplayedConnectingModal = connecting ? <ConnectingModal /> : null;

  // const connectingLoading = loadingVisible ? ( <ConnectingLoading /> ) : null;

  // FIXME: To be improved
  const clearState = () => {
    if (!componentVisible) {
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

  const isDisplayedWalletPanel = componentVisible ? (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            ref={ref}
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

      {isDisplayedConnectingModal}
      {isLoading}
      <QrcodeModal />
      {/* {isDisplayedQrcodeModal} */}
      {/* <ConnectingModal /> */}
    </>
  );
}

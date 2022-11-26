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
import Toast from '../toast/toast';

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

  const [showToast, setShowToast] = useState(false);

  const toastHandler = () => {
    setShowToast(!showToast);
  };

  const clickHandler = () => {
    setComponentVisible(!componentVisible);
  };

  const connectingClickHandler = () => {
    setConnectingModalVisible(!connectingModalVisible);
  };

  const qrcodeClickHandler = () => {
    // TODO: temparary solution, need to be fixed
    setComponentVisible(false);

    setQrcodeModalVisible(!qrcodeModalVisible);
    // console.log('wallet connect option clicked');
  };

  const helloClickHandler = () => {
    // TODO: temparary solution, need to be fixed
    setComponentVisible(false);

    setHelloModalVisible(!helloModalVisible);
  };

  const processClickHandler = () => {
    setProcessModalVisible(!processModalVisible);
  };

  // TODO: Process Modal Controllerrrrrrrrr
  // SignatureProcess
  const processModalController = ({
    loading = true,
    firstStepSuccess = false,
    firstStepError = false,
    secondStepSuccess = false,
    secondStepError = false,
  }) => (
    <SignatureProcess
      loading={loading}
      firstStepSuccess={firstStepSuccess}
      firstStepError={firstStepError}
      secondStepSuccess={secondStepSuccess}
      secondStepError={secondStepError}
    />
  );

  // const isDisplayedQrcodeModal =

  function SignatureProcess({
    loading = false,
    firstStepSuccess = false,
    firstStepError = false,
    secondStepSuccess = false,
    secondStepError = false,
  }) {
    const controlSpace = firstStepError || secondStepError ? 'space-y-12' : 'space-y-16';

    const firstStepIcon = (
      <Image src="/elements/group_2415.svg" width={32} height={32} alt="step 1 icon" />
    );

    const successIcon = (
      <Image src="/elements/group_2415_check.svg" width={32} height={32} alt="successful icon" />
    );

    const errorIcon = (
      <Image src="/elements/group_2418_error.svg" width={32} height={32} alt="error icon" />
    );

    const secondStepDefaultIcon = (
      <Image src="/elements/group_2418.svg" width={32} height={32} alt="step 2 icon" />
    );

    const secondStepActivatedIcon = (
      <Image src="/elements/group_2418(1).svg" width={32} height={32} alt="step 2 icon" />
    );

    const requestButtonHandler = loading ? (
      <Lottie className="w-40px" animationData={smallConnectingAnimation} />
    ) : (
      <TideButton className="px-5" content={`Send Requests`} />
    );

    const firstStepDefaultView = (
      <>
        <div>{firstStepIcon}</div>
        <div className="w-271px space-y-1 text-lightWhite">
          <div className="text-lg">Verify ownership</div>
          <div className="text-sm">Confirm you are the owner of this wallet</div>
        </div>
      </>
    );

    const firstStepSuccessView = (
      <>
        <div>{successIcon}</div>
        <div className="w-271px space-y-1 text-lightWhite">
          <div className="text-lg">Verify ownership</div>
          <div className="text-sm">Confirm you are the owner of this wallet</div>
        </div>
      </>
    );

    const firstStepErrorView = (
      <>
        <div>{errorIcon}</div>
        <div className="w-271px space-y-1 text-lightWhite">
          <div className="text-lg">Verify ownership</div>
          <div className="text-sm">Confirm you are the owner of this wallet</div>
          <div className="text-sm text-lightRed3">Something went wrong, please try again</div>
        </div>
      </>
    );

    const firstStepSectionHandler = (
      // {firstStepSuccess ? 'success section' : firstStepError ? 'error section' : 'default section'}
      <>
        {firstStepSuccess
          ? firstStepSuccessView
          : firstStepError
          ? firstStepErrorView
          : firstStepDefaultView}
      </>
    );

    const secondStepDefaultView = (
      <>
        <div>{secondStepDefaultIcon}</div>
        <div className="w-271px space-y-1 text-lightGray">
          <div className="text-lg">Enable trading</div>
          <div className="text-sm">
            Enable secure access to our API for lightning quick trading.
          </div>
        </div>
      </>
    );
    const secondStepActiveView = (
      <>
        <div>
          {' '}
          {secondStepActivatedIcon}
          {/* <Image src="/elements/group_2418(1).svg" width={32} height={32} alt="step 2 icon" /> */}
        </div>
        <div className="w-271px space-y-1 text-lightWhite">
          <div className="text-lg">Enable trading</div>
          <div className="text-sm">
            Enable secure access to our API for lightning quick trading.
          </div>
        </div>
      </>
    );

    const secondStepSuccessView = (
      <>
        <div>
          {successIcon}{' '}
          {/* <Image src="/elements/group_2418(1).svg" width={32} height={32} alt="step 2 icon" /> */}
        </div>
        <div className="w-271px space-y-1 text-lightWhite">
          <div className="text-lg">Enable trading</div>
          <div className="text-sm">
            Enable secure access to our API for lightning quick trading.
          </div>
        </div>
      </>
    );

    const secondStepErrorView = (
      <>
        <div>
          {' '}
          {errorIcon}
          {/* <Image src="/elements/group_2418(1).svg" width={32} height={32} alt="step 2 icon" /> */}
        </div>
        <div className="w-271px space-y-1 text-lightWhite">
          <div className="text-lg">Enable trading</div>
          <div className="text-sm">
            Enable secure access to our API for lightning quick trading.
          </div>
          <div className="text-sm text-lightRed3">Something went wrong, please try again</div>
        </div>
      </>
    );

    // TODO: Notes- object GOOD
    const secondStepSectionHandler = (
      <>
        {secondStepSuccess
          ? secondStepSuccessView
          : secondStepError
          ? secondStepErrorView
          : firstStepSuccess
          ? secondStepActiveView
          : secondStepDefaultView}
      </>
    );

    // if (true) console.log('test')

    //  TODO: Notes- function BAD
    //   const secondStepSectionTestHandler = () =>
    //     processModalVisible ? (
    //       <>
    //         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
    //           <div className="relative my-6 mx-auto w-auto max-w-xl">
    //             {/*content & panel*/}
    //             <div
    //               id="connectModal"
    //               ref={processModalRef}
    //               className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
    //             >
    //               {/*header*/}
    //               <div className="flex items-start justify-between rounded-t pt-6">
    //                 <h3 className="ml-1/8 mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
    //                   Wallet Connect
    //                 </h3>
    //                 <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
    //                   <span className="absolute top-5 right-5 block outline-none focus:outline-none">
    //                     <ImCross onClick={processClickHandler} />
    //                   </span>
    //                 </button>
    //               </div>
    //               {/*body*/}

    //               <div className="flex flex-auto flex-col items-center pt-5">
    //                 <div className="text-lg leading-relaxed text-lightWhite">
    //                   <div className="mx-auto flex flex-col items-center">
    //                     <div className="mt-8 text-center text-lg text-lightGray">
    //                       <div>You will receive two signature requests.</div>
    //                       <div>
    //                         {' '}
    //                         Signing is{' '}
    //                         <span className="text-tidebitTheme">
    //                           <Link href="#">free</Link>
    //                         </span>{' '}
    //                         and will not send a transaction.
    //                       </div>
    //                     </div>

    //                     {/* Activate First Step */}
    //                     <div className={`${controlSpace} flex flex-col pt-16`}>
    //                       <div className="flex items-center justify-center space-x-3">
    //                         {firstStepSectionHandler}
    //                       </div>

    //                       {/* Second Step */}
    //                       <div className="flex items-center justify-center space-x-3">
    //                         {secondStepSectionHandler}
    //                       </div>
    //                     </div>

    //                     <div className="mt-16">{requestButtonHandler}</div>
    //                   </div>
    //                 </div>
    //               </div>
    //               {/*footer*/}
    //               <div className="flex items-center justify-end rounded-b p-2"></div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    //       </>
    //     ) : null;

    //   return <secondStepSectionTestHandler />;

    return processModalVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={processModalRef}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="ml-1/8 mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={processClickHandler} />
                  </span>
                </button>
              </div>
              {/*body*/}

              <div className="flex flex-auto flex-col items-center pt-5">
                <div className="text-lg leading-relaxed text-lightWhite">
                  <div className="mx-auto flex flex-col items-center">
                    <div className="mt-8 text-center text-lg text-lightGray">
                      <div>You will receive two signature requests.</div>
                      <div>
                        {' '}
                        Signing is{' '}
                        <span className="text-tidebitTheme">
                          <Link href="#">free</Link>
                        </span>{' '}
                        and will not send a transaction.
                      </div>
                    </div>

                    {/* Activate First Step */}
                    <div className={`${controlSpace} flex flex-col pt-16`}>
                      <div className="flex items-center justify-center space-x-3">
                        {firstStepSectionHandler}
                      </div>

                      {/* Second Step */}
                      <div className="flex items-center justify-center space-x-3">
                        {secondStepSectionHandler}
                      </div>
                    </div>

                    <div className="mt-16">{requestButtonHandler}</div>
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

  function HelloModal() {
    return helloModalVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={helloModalRef}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={helloClickHandler} />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="flex flex-auto flex-col items-center pt-32">
                <div className="text-lg leading-relaxed text-lightWhite">
                  <div className="mx-auto flex flex-col items-center">
                    <Image
                      className="mt-10 w-100px"
                      src="/elements/path_25939.svg"
                      width={200}
                      height={200}
                      alt="Hello"
                    />
                    <div className="mt-8 mb-40 text-xl text-lightGray">
                      You can start using TideBit now.
                    </div>

                    <TideButton className="px-12" content={`Done`} onClick={helloClickHandler} />
                    <Link
                      className="mt-3 text-base text-tidebitTheme underline underline-offset-4"
                      href="#"
                    >
                      Connect my TideBit HK
                    </Link>
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

  // const DisplayedConnecting = () =>
  //   connectingModalVisible ? (
  //     <>
  //       <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
  //         <div className="relative my-6 mx-auto w-auto max-w-xl">
  //           {/*content & panel*/}
  //           <div
  //             id="connectModal"
  //             ref={connectingModalRef}
  //             className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
  //           >
  //             {/*header*/}
  //             <div className="flex items-start justify-between rounded-t pt-6">
  //               <h3 className="mx-auto mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
  //                 Wallet Connect
  //               </h3>
  //               <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
  //                 <span className="absolute top-5 right-5 block outline-none focus:outline-none">
  //                   <ImCross onClick={connectingClickHandler} />
  //                 </span>
  //               </button>
  //             </div>
  //             {/*body*/}
  //             <div className="relative flex-auto pt-1">
  //               <div className="text-lg leading-relaxed text-lightWhite">
  //                 <div className="flex-col justify-center text-center">
  //                   <Lottie className="ml-7 w-full pt-12" animationData={bigConnectingAnimation} />
  //                   <div className="mt-10 text-xl">Connecting...</div>
  //                 </div>
  //               </div>
  //             </div>
  //             {/*footer*/}
  //             <div className="flex items-center justify-end rounded-b p-2"></div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
  //     </>
  //   ) : null;

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

  const isConnecting = connecting ? <DisplayedConnecting /> : null;

  // const isWalletConnectOpen =

  async function funcSignTypedData() {
    try {
      setErrorMessages('');
      setSignature(null);
      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();
      const balance = await signer.getBalance();
      setDefaultAccount(address);
      setUserBalance(ethers.utils.formatEther(balance));

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
      const value = {
        from: {
          name: 'User',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'TideBit Ex',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      };

      let signature = await signer._signTypedData(domain, types, value);

      setSignature(signature);

      setShowToast(true);

      // console.log('[EIP712] Sign typed signature: ', signature);
    } catch (error) {
      // console.error(error);
      setErrorMessages(error.message);
    }
  }

  let toastNotify = (
    <Toast
      title="Your signature "
      content="blah blah blah"
      toastHandler={toastHandler}
      showToast={showToast}
    />
  );

  const walletOptionClickHandler = async () => {
    // TODO: NNNNNNNotes
    // console.log('connecting modal should be visible: ', connectingModalVisible);

    try {
      setComponentVisible(!componentVisible);
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
      // processModalController({loading: true});
      <SignatureProcess loading={true} />;

      // let signature = await signer.signMessage('TideBit DeFi test');
      // console.log('Sign the message, get the signature is: ', signature);
      funcSignTypedData();
    } catch (error) {
      // console.log(error);
      setErrorMessages(error);

      setConnectingModalVisible(false);
      setConnecting(false);
    }
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
      {/* {isDisplayedConnectingModal} */}
      {isConnecting}
      <QrcodeModal />
      {/* <processModalController loading={true} /> */}
      <SignatureProcess loading={true} />
      {toastNotify}

      <HelloModal />
      {/* {isDisplayedQrcodeModal} */}
      {/* <ConnectingModal /> */}
    </>
  );
}

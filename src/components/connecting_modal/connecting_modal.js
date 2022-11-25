import {useState, useEffect} from 'react';
import {ImCross} from 'react-icons/im';
import TideButton from '../tide_button/tide_button';
import TideLink from '../tide_link/tide_link';
import {ethers, providers} from 'ethers';
import useOuterClick from '../../hooks/lib/use_outer_click';
import Link from 'next/link';

import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import Image from 'next/image';

// TODO: Loading component
// TODO: Procedure component
// TODO: Signature success or not

/**
  connecting = false,
  connected = false,
  error = false,
  signing = false,
  signature = false,
  ...otherProps
 */

export default function ConnectingModal(props) {
  // console.log('connecting modal component triggered');

  // let showConnectingModalProps = false;

  const {ref, componentVisible, setComponentVisible} = useOuterClick(true);

  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [errorMessages, setErrorMessages] = useState('');
  const [signature, setSignature] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  async function connectFunc() {
    // console.log('asyn func called');
    try {
      setLoading(true);
      let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      // pop up the metamask window
      await provider.send('eth_requestAccounts', []);
      let signer = provider.getSigner();
      let address = await signer.getAddress();
      setDefaultAccount(address);

      // let balance = await provider.getBalance(address);
      // setUserBalance(ethers.utils.formatEther(balance));
      // console.log('connect to Metamask clicked, Account: ', address);
      // let signature = await signer.signMessage('Have a nice day!');
      // console.log('Sign the message, get the signature is: ', signature);

      // const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});

      // setDefaultAccount(accounts[0]);
      setLoading(false);
      // console.log('connectFun try');
    } catch (error) {
      // console.log(error);
      // setErrorMessages(error.message);
      setLoading(false);
    }
  }

  async function connect() {
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setDefaultAccount(accounts[0]);
      setLoading(false);
    } catch (error) {
      setErrorMessages(error.message);
      setLoading(false);
    }
  }

  function disconnect() {
    setDefaultAccount(null);
  }

  function loadingHandler() {}

  function clickModalHandler() {
    setComponentVisible(!componentVisible);
  }

  //**************************************Divider**************************************//

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

    const secondStepSectionHandler = (
      // {/* {secondStepSuccess ? 'success section' : secondStepError ? 'error section' : firstStepSuccess ? 'active section' :  'default section'} */}
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

    // const secondStepSection = () => {
    //   return (
    //     <>
    //       <div>
    //         <Image src="/elements/group_2418.svg" width={32} height={32} alt="step 2 icon" />
    //       </div>
    //       <div className="w-271px space-y-1 text-lightGray">
    //         <div className="text-lg">Enable trading</div>
    //         <div className="text-sm">
    //           Enable secure access to our API for lightning quick trading.
    //         </div>
    //       </div>
    //     </>
    //   );
    // };

    return componentVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={ref}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="ml-1/8 mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={clickModalHandler} />
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

  function QrcodeModal() {
    return componentVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={ref}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="ml-1/8 mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={clickModalHandler} />
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

  function HelloModal() {
    return componentVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={ref}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={clickModalHandler} />
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
                    <div className="mt-8 text-xl text-lightGray">
                      You can start using TideBit now.
                    </div>

                    <TideButton className="mt-40 px-12" content={`Done`} />
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

  function DisplayedConnecting() {
    // console.log('in displayed connecting modal, componentVisible: ', componentVisible);
    return componentVisible ? (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {/*content & panel*/}
            <div
              id="connectModal"
              ref={ref}
              className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
            >
              {/*header*/}
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="mx-auto mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={clickModalHandler} />
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

  return (
    <>
      {/* <DisplayedConnecting /> */}
      {/* <HelloModal /> */}
      {/* <QrcodeModal /> */}
      <SignatureProcess />
    </>
  );
}

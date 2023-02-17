import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import Link from 'next/link';
import TideButton from '../../components/tide_button/tide_button';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import activeIconPulse from '../../../public/animation/lf30_editor_cyvxlluo.json';
import Lottie from 'lottie-react';
import {UserContext} from '../../contexts/user_context';
import {useContext, useState} from 'react';
import {toast} from 'react-toastify';
import {useGlobal} from '../../contexts/global_context';

interface ISignatureProcessModal {
  loading?: boolean;
  firstStepSuccess?: boolean;
  firstStepError?: boolean;
  secondStepSuccess?: boolean;
  secondStepError?: boolean;
  processModalRef?: React.RefObject<HTMLDivElement>;
  processModalVisible: boolean;
  processClickHandler: () => void;
  requestSendingHandler?: () => void;
}

const SignatureProcessModal = ({
  // loading = false,
  // firstStepSuccess = false,
  // firstStepError = false,
  // secondStepSuccess = false,
  // secondStepError = false,
  // requestSendingHandler,
  processModalRef,
  processModalVisible = false,
  processClickHandler,
  ...otherProps
}: ISignatureProcessModal) => {
  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  // TODO: 從 UserContext 拿字串狀態來判斷，取代`connectingProcess`跟`setConnectingProcess`，用來判斷第二步應顯示'打勾、打叉、數字'哪一種圖示
  type IConnectingProcessType = 'EMPTY' | 'CONNECTING' | 'CONNECTED' | 'REJECTED';
  interface IConnectingProcessObject {
    EMPTY: IConnectingProcessType;
    CONNECTING: IConnectingProcessType;
    CONNECTED: IConnectingProcessType;
    REJECTED: IConnectingProcessType;
  }

  const ConnectingProcess: IConnectingProcessObject = {
    EMPTY: 'EMPTY',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    REJECTED: 'REJECTED',
  };

  const [connectingProcess, setConnectingProcess] = useState<IConnectingProcessType>(
    ConnectingProcess.EMPTY
  );

  // const secondStopResult: ISignInResult = userCtx.connectingProcess
  // const connectingProcess =

  // const firstStepSuccess = userCtx.isConnected;
  // const firstStepError = !userCtx.isConnected;
  // const secondStepSuccess = userCtx.enableServiceTerm;
  // const secondStepError = !userCtx.enableServiceTerm;

  // -----------------------------------
  // const [firstStepSuccess, setFirstStepSuccess] = useState(userCtx.isConnected);
  // const [firstStepError, setFirstStepError] = useState(!userCtx.isConnected);
  // const [secondStepSuccess, setSecondStepSuccess] = useState(userCtx.enableServiceTerm);
  // const [secondStepError, setSecondStepError] = useState(!userCtx.enableServiceTerm);
  // -----------------------------------

  // const requestSendingHandler = async () => {
  //   try {
  //     setLoading(true);
  //     const signResult = await userCtx.signServiceTerm();
  //     globalCtx.toast({type: 'success', message: `Success:  ${signResult}`});
  //     console.log(signResult);
  //   } catch (error) {
  //     console.log(error);
  //     globalCtx.toast({type: 'error', message: `Error:  ${error}`});
  //   }

  //   setLoading(false);
  // };

  const controlSpace =
    !userCtx.isConnected || connectingProcess === ConnectingProcess.REJECTED
      ? 'space-y-12'
      : 'space-y-12';
  const btnSpace =
    userCtx.isConnected && connectingProcess !== ConnectingProcess.REJECTED ? 'mt-10' : 'mt-16';

  // if (firstStepError && secondStepError) return
  // if (firstStepError && secondStepSuccess) return

  const firstStepIcon = (
    <div className="relative flex items-center justify-center">
      <Lottie className="relative w-32" animationData={activeIconPulse} />
      {/* <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span> */}

      {/* absolute top-48px left-46px */}
      <Image
        className="absolute mr-1 mb-1px"
        src="/elements/group_2415.svg"
        width={33}
        height={33}
        alt="step 1 icon"
      />
    </div>
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
    <div className="relative flex items-center justify-center">
      <Lottie className="relative w-32" animationData={activeIconPulse} />
      {/* <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span> */}

      {/* absolute top-48px left-46px */}
      <Image
        className="absolute mr-1 mb-1px"
        src="/elements/group_2418(1).svg"
        width={33}
        height={33}
        alt="step 2 icon"
      />
    </div>
  );

  const requestSendingHandler = async () => {
    setConnectingProcess(ConnectingProcess.CONNECTING);

    if (!userCtx.isConnected) {
      // It's a cycle
      const connectWalletResult = await userCtx.connect();
      setConnectingProcess(ConnectingProcess.CONNECTED);
    } else {
      const signResult = await userCtx.signServiceTerm();

      if (signResult) {
        setConnectingProcess(ConnectingProcess.CONNECTED);

        setTimeout(() => {
          globalCtx.visibleSignatureProcessModalHandler();
          setConnectingProcess(ConnectingProcess.EMPTY);
        }, 1000);
      } else {
        setTimeout(() => {
          // globalCtx.visibleSignatureProcessModalHandler();
          setConnectingProcess(ConnectingProcess.REJECTED);
        }, 1000);

        // setConnectingProcess(ConnectingProcess.REJECTED);
      }
    }
  };

  // TODO: Replace with `userCtx.connectingProcess === 'CONNECTING'` Else if `userCtx.connectingProcess === 'EMPTY'`
  const requestButtonHandler =
    connectingProcess === 'CONNECTING' || connectingProcess === 'CONNECTED' ? (
      <Lottie className="w-40px" animationData={smallConnectingAnimation} />
    ) : connectingProcess === 'EMPTY' || connectingProcess === 'REJECTED' ? (
      <TideButton
        onClick={requestSendingHandler}
        className="rounded bg-tidebitTheme px-5 py-2 text-base transition-all hover:opacity-90"
      >
        Send Requests
      </TideButton>
    ) : null;

  const firstStepDefaultView = (
    <>
      <div className="-mt-6 -mb-5 inline-flex">
        <div className="relative -ml-11 -mt-2">
          {' '}
          {firstStepIcon}
          {/* <Image src="/elements/group_2418(1).svg" width={32} height={32} alt="step 2 icon" /> */}
        </div>
        <div className="-ml-7 w-271px space-y-1 pt-7 text-lightWhite">
          <div className="text-lg">Verify ownership</div>
          <div className="text-sm">Confirm you are the owner of this wallet</div>
        </div>
      </div>
    </>
  );

  const firstStepSuccessView = (
    <>
      <div className="mr-6 mt-1">{successIcon}</div>
      <div className="mt-1 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">Verify ownership</div>
        <div className="text-sm">Confirm you are the owner of this wallet</div>
      </div>
    </>
  );

  const firstStepErrorView = (
    <>
      <div className="mr-6 mt-0">{errorIcon}</div>
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
      {userCtx.isConnected ? firstStepSuccessView : firstStepDefaultView}
      {/* TODO: [in storage] Stale solution */}
      {/* {firstStepSuccess
        ? firstStepSuccessView
        : firstStepError
        ? firstStepErrorView
        : firstStepDefaultView} */}
    </>
  );

  const secondStepDefaultView = (
    <>
      <div className="mt-2 mb-1 flex items-center justify-center">
        <div className="mr-6">{secondStepDefaultIcon}</div>
        <div className="w-271px space-y-1 text-lightGray">
          <div className="text-lg">Enable trading</div>
          <div className="text-sm">
            Enable secure access to our API for lightning quick trading.
          </div>
        </div>
      </div>
    </>
  );
  const secondStepActiveView = (
    <>
      <div className="inline-flex">
        <div className="relative -ml-11">
          {' '}
          {secondStepActivatedIcon}
          {/* <Image src="/elements/group_2418(1).svg" width={32} height={32} alt="step 2 icon" /> */}
        </div>
        <div className="-ml-7 w-271px space-y-1 pt-7 text-lightWhite">
          <div className="text-lg">Enable trading</div>
          <div className="text-sm">
            Enable secure access to our API for lightning quick trading.
          </div>
        </div>
      </div>
    </>
  );

  const secondStepSuccessView = (
    <>
      <div className="mr-6 mt-7 mb-1">{successIcon}</div>
      <div className="mt-7 mb-1 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">Enable trading</div>
        <div className="text-sm">Enable secure access to our API for lightning quick trading.</div>
      </div>
    </>
  );

  const secondStepErrorView = (
    <>
      <div className="mr-6 mt-7 -mb-5">{errorIcon}</div>
      <div className="mt-7 -mb-5 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">Enable trading</div>
        <div className="text-sm">Enable secure access to our API for lightning quick trading.</div>
        <div className="text-sm text-lightRed3">Something went wrong, please try again</div>
      </div>
    </>
  );

  const secondStepSectionHandler = (
    <>
      {/* Temporary solution for no connecting process attribute */}
      {/* {userCtx.enableServiceTerm
        ? secondStepSuccessView
        : userCtx.isConnected
        ? secondStepActiveView
        : secondStepDefaultView} */}

      {/* TODO: Solution with connecting process attribute */}
      {!userCtx.isConnected
        ? secondStepDefaultView
        : connectingProcess === ConnectingProcess.CONNECTED
        ? secondStepSuccessView
        : connectingProcess === ConnectingProcess.REJECTED
        ? secondStepErrorView
        : secondStepActiveView}

      {/* {userCtx.isConnected && userCtx.connectingProcess === 'connected' && secondStepSuccessView}
      {userCtx.isConnected && userCtx.connectingProcess === 'rejected' && secondStepErrorView}
      {userCtx.isConnected && userCtx.connectingProcess === 'connecting' && secondStepActiveView} //
      btn
      {userCtx.isConnected && userCtx.connectingProcess === 'empty' && secondStepDefaultView} // btn */}

      {/* -----TODO: [in storage] Stale solution----- */}
      {/* {secondStepSuccess
        ? secondStepSuccessView
        : secondStepError
        ? secondStepErrorView
        : firstStepSuccess
        ? secondStepActiveView
        : secondStepDefaultView} */}
    </>
  );

  const isDisplayedProcessModal = processModalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
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
                    <div className="flex items-center justify-center">
                      {firstStepSectionHandler}
                    </div>

                    {/* Second Step */}
                    <div className="flex items-center justify-center">
                      {secondStepSectionHandler}
                    </div>
                  </div>

                  <div className={`${btnSpace}`}>{requestButtonHandler}</div>
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

  return <div>{isDisplayedProcessModal}</div>;
};

export default SignatureProcessModal;

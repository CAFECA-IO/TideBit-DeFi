import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import Link from 'next/link';
import TideButton from '../../components/tide_button/tide_button';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import activeIconPulse from '../../../public/animation/lf30_editor_cyvxlluo.json';
import searching from '../../../public/animation/searching.json';
import Lottie from 'lottie-react';
import {UserContext} from '../../contexts/user_context';
import {useContext} from 'react';
import {useGlobal} from '../../contexts/global_context';
import {locker, wait} from '../../lib/common';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {Code, ICode} from '../../constants/code';
import useStateRef from 'react-usestateref';

type TranslateFunction = (s: string) => string;
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
  const {t}: {t: TranslateFunction} = useTranslation('common');

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

  const [connectingProcess, setConnectingProcess, connectingProcessRef] =
    useStateRef<IConnectingProcessType>(ConnectingProcess.EMPTY);
  const [errorCode, setErrorCode, errorCodeRef] = useStateRef<ICode>(Code.SERVICE_TERM_DISABLE);

  const controlSpace =
    !userCtx.isConnected || connectingProcess === ConnectingProcess.REJECTED
      ? 'space-y-12'
      : 'space-y-12';
  const btnSpace =
    userCtx.isConnected && connectingProcess !== ConnectingProcess.REJECTED ? 'mt-10' : 'mt-16';

  const firstStepIcon = (
    <div className="relative flex items-center justify-center">
      <Lottie className="relative w-32" animationData={activeIconPulse} />
      <Image
        className="absolute mb-1px mr-1"
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

      <Image
        className="absolute mb-1px mr-1"
        src="/elements/group_2418(1).svg"
        width={33}
        height={33}
        alt="step 2 icon"
      />
    </div>
  );

  const searchingSection = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-32 w-32">
        <Lottie animationData={searching} />
      </div>
      <p className="text-center text-2xl font-bold text-white">
        {t('signature_process_modal.searching')}
      </p>
    </div>
  );

  const requestSendingHandler = async () => {
    const [lock, unlock] = locker('signature_process_modal.RequestSendingHandler');

    if (!lock()) return; // 沒有成功上鎖，所以不執行接下來的程式碼

    if (!userCtx.isConnected) {
      // It's a cycle
      try {
        setConnectingProcess(ConnectingProcess.CONNECTING);

        const connectResult = await userCtx.connect();
      } catch (e) {
        // Info: 用戶拒絕連線，不會造成錯誤，如果有錯誤就是 component 跟 context 之間的錯誤
        // ToDo: Report the error which user rejected the signature in UserContext (20230411 - Shirley)
      } finally {
        unlock();
        setConnectingProcess(ConnectingProcess.EMPTY);
      }
    } else {
      try {
        setConnectingProcess(ConnectingProcess.CONNECTING);

        const signResult = await userCtx.signServiceTerm();

        unlock();

        if (signResult.success) {
          setConnectingProcess(ConnectingProcess.CONNECTED);

          await wait(DELAYED_HIDDEN_SECONDS / 5);
          setConnectingProcess(ConnectingProcess.EMPTY);

          globalCtx.visibleSignatureProcessModalHandler();
          globalCtx.visibleHelloModalHandler();
        } else {
          switch (signResult.code) {
            case Code.SERVICE_TERM_DISABLE:
              setErrorCode(Code.SERVICE_TERM_DISABLE);
              break;
            case Code.UNKNOWN_ERROR:
              setErrorCode(Code.UNKNOWN_ERROR);
              break;

            default:
              setErrorCode(signResult.code);
              break;
          }

          await wait(DELAYED_HIDDEN_SECONDS / 5);
          setConnectingProcess(ConnectingProcess.REJECTED);
        }
      } catch (error: any) {
        unlock();

        // ToDo: report error to backend (20230413 - Shirley)
        setErrorCode(Code.UNKNOWN_ERROR_IN_COMPONENT);
        setConnectingProcess(ConnectingProcess.REJECTED);
      }
    }
  };

  const requestButtonHandler =
    connectingProcessRef.current === ConnectingProcess.CONNECTING ||
    connectingProcessRef.current === ConnectingProcess.CONNECTED ? (
      <Lottie className="w-40px" animationData={smallConnectingAnimation} />
    ) : connectingProcessRef.current === ConnectingProcess.EMPTY ||
      connectingProcessRef.current === ConnectingProcess.REJECTED ? (
      <TideButton
        onClick={requestSendingHandler}
        className="rounded bg-tidebitTheme px-5 py-2 text-base transition-all hover:opacity-90"
      >
        {t('WALLET_PANEL.SEND_REQUESTS_BUTTON')}
      </TideButton>
    ) : null;

  const firstStepDefaultView = (
    <>
      <div className="-mb-5 -mt-6 inline-flex">
        <div className="relative -ml-11 -mt-2"> {firstStepIcon}</div>
        <div className="-ml-7 w-271px space-y-1 pt-7 text-lightWhite">
          <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP1_TITLE')}</div>
          <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP1_DESCRIPTION')}</div>
        </div>
      </div>
    </>
  );

  const firstStepSuccessView = (
    <>
      <div className="mr-6 mt-1">{successIcon}</div>
      <div className="mt-1 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP1_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP1_DESCRIPTION')}</div>
      </div>
    </>
  );

  const firstStepErrorView = (
    <>
      <div className="mr-6 mt-0">{errorIcon}</div>
      <div className="w-271px space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP1_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP1_DESCRIPTION')}</div>
        <div className="text-sm text-lightRed3">{t('WALLET_PANEL.ERROR_MESSAGE')}</div>
      </div>
    </>
  );

  const firstStepSectionHandler = (
    <>{userCtx.isConnected ? firstStepSuccessView : firstStepDefaultView}</>
  );

  const secondStepDefaultView = (
    <>
      <div className="mb-1 mt-2 flex items-center justify-center">
        <div className="mr-6">{secondStepDefaultIcon}</div>
        <div className="w-271px space-y-1 text-lightGray">
          <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
          <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
        </div>
      </div>
    </>
  );
  const secondStepActiveView = (
    <>
      <div className="inline-flex">
        <div className="relative -ml-11"> {secondStepActivatedIcon}</div>
        <div className="-ml-7 w-271px space-y-1 pt-7 text-lightWhite">
          <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
          <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
        </div>
      </div>
    </>
  );

  const secondStepSuccessView = (
    <>
      <div className="mb-1 mr-6 mt-7">{successIcon}</div>
      <div className="mb-1 mt-7 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
      </div>
    </>
  );

  const secondStepErrorView = (
    <>
      <div className="-mb-5 mr-6 mt-7">{errorIcon}</div>
      <div className="-mb-5 mt-7 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
        <div className="text-sm text-lightRed3">
          {t('WALLET_PANEL.ERROR_MESSAGE')} ({errorCodeRef.current})
        </div>
      </div>
    </>
  );

  const secondStepDisableServiceTermErrorView = (
    <>
      <div className="-mb-5 mr-6 mt-7">{errorIcon}</div>
      <div className="-mb-5 mt-7 w-271px space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
        <div className="text-sm text-lightRed3">
          {t('WALLET_PANEL.DISABLE_SERVICE_TERM_ERROR_MESSAGE')} ({errorCodeRef.current})
        </div>
      </div>
    </>
  );

  const secondStopErrorHandler = (errorType?: string) => {
    switch (errorType) {
      case Code.SERVICE_TERM_DISABLE:
        return secondStepDisableServiceTermErrorView;

      default:
        return secondStepErrorView;
    }
  };

  const secondStepSectionHandler = (
    <>
      {!userCtx.isConnected
        ? secondStepDefaultView
        : connectingProcess === ConnectingProcess.CONNECTED
        ? secondStepSuccessView
        : connectingProcess === ConnectingProcess.REJECTED
        ? secondStopErrorHandler(errorCodeRef.current)
        : secondStepActiveView}
    </>
  );

  const displayedSection = (
    <div className={`${controlSpace} flex flex-col px-4 pt-16`}>
      <div className="flex items-center justify-center">{firstStepSectionHandler}</div>

      {/* Second Step */}
      <div className="flex items-center justify-center">{secondStepSectionHandler}</div>
    </div>
  );

  const isDisplayedProcessModal = processModalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div
            id="connectModal"
            ref={processModalRef}
            className="relative flex h-auto w-full flex-col items-center rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none md:w-450px"
          >
            <div className="mx-auto flex items-start justify-between rounded-t pt-6">
              <h3 className="mx-auto mt-2 text-xl font-semibold text-lightWhite md:text-4xl">
                {t('WALLET_PANEL.TITLE')}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
                  <ImCross onClick={processClickHandler} />
                </span>
              </button>
            </div>

            <div className="flex flex-auto flex-col items-center py-5">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <div className="text-center text-sm text-lightGray md:mt-4 md:text-lg">
                    <div>{t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE1')}</div>
                    <div>
                      {' '}
                      {t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE2_PART1')}{' '}
                      <span className="text-tidebitTheme">
                        <Link href="#">
                          {t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE2_HIGHLIGHT')}
                        </Link>
                      </span>{' '}
                      {t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE2_PART2')}
                    </div>
                  </div>

                  {displayedSection}

                  <div className={`${btnSpace}`}>{requestButtonHandler}</div>
                </div>
              </div>
            </div>

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

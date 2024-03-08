import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import Link from 'next/link';
import TideButton from '../../components/tide_button/tide_button';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import activeIconPulse from '../../../public/animation/lf30_editor_cyvxlluo.json';
import Lottie from 'lottie-react';
import {UserContext} from '../../contexts/user_context';
import React, {useContext} from 'react';
import {useGlobal} from '../../contexts/global_context';
import {locker, wait} from '../../lib/common';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {Code, ICode} from '../../constants/code';
import useStateRef from 'react-usestateref';
import {NotificationContext} from '../../contexts/notification_context';

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
  processModalRef,
  processModalVisible = false,
  processClickHandler,
}: ISignatureProcessModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();
  const notificationCtx = useContext(NotificationContext);

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
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorCode, setErrorCode, errorCodeRef] = useStateRef<ICode>(Code.SERVICE_TERM_DISABLE);

  const firstStepIcon = (
    <div className="relative flex items-center justify-center">
      <Lottie className="absolute w-32 ml-3px mt-2px" animationData={activeIconPulse} />

      <Image
        className="relative"
        src="/elements/group_2415.svg"
        width={32}
        height={32}
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
    <div className="relative w-32px flex items-center justify-center">
      <Lottie className="absolute w-32 ml-1 mt-2px" animationData={activeIconPulse} />

      <Image
        className="relative"
        src="/elements/group_2418(1).svg"
        width={32}
        height={32}
        alt="step 2 icon"
      />
    </div>
  );

  const requestSendingHandler = async () => {
    const [lock, unlock] = locker('signature_process_modal.RequestSendingHandler');

    if (!lock()) return; // 沒有成功上鎖，所以不執行接下來的程式碼

    if (!userCtx.isConnected) {
      // It's a cycle
      try {
        setConnectingProcess(ConnectingProcess.CONNECTING);

        await userCtx.connect();
      } catch (e) {
        // Info: 用戶拒絕連線，不會造成錯誤，如果有錯誤就是 component 跟 context 之間的錯誤 (20231110 - Shirley)
        notificationCtx.addException(
          'requestSendingHandler[connect] signature_process_modal',
          e as Error,
          Code.UNKNOWN_ERROR
        );
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
      } catch (error) {
        unlock();
        notificationCtx.addException(
          'requestSendingHandler[sign] signature_process_modal',
          error as Error,
          Code.UNKNOWN_ERROR
        );
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
        id="SendRequestButton"
        onClick={requestSendingHandler}
        className="rounded bg-tidebitTheme px-5 py-2 text-base transition-all hover:opacity-90"
      >
        {t('WALLET_PANEL.SEND_REQUESTS_BUTTON')}
      </TideButton>
    ) : null;

  const firstStepDefaultView = (
    <>
      <div className="relative mr-4">{firstStepIcon}</div>
      <div className="space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP1_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP1_DESCRIPTION')}</div>
      </div>
    </>
  );

  const firstStepSuccessView = (
    <>
      <div className="mr-4">{successIcon}</div>
      <div className="space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP1_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP1_DESCRIPTION')}</div>
      </div>
    </>
  );

  const firstStepSectionHandler = (
    <>{userCtx.isConnected ? firstStepSuccessView : firstStepDefaultView}</>
  );

  const secondStepDefaultView = (
    <>
      <div className="mr-4 w-32px relative">{secondStepDefaultIcon}</div>
      <div className="space-y-1 text-lightGray w-240px lg:w-auto">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
      </div>
    </>
  );
  const secondStepActiveView = (
    <>
      <div className="relative mr-4">{secondStepActivatedIcon}</div>
      <div className="space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
      </div>
    </>
  );

  const secondStepSuccessView = (
    <>
      <div className="mr-4">{successIcon}</div>
      <div className="space-y-1 text-lightWhite">
        <div className="text-lg">{t('WALLET_PANEL.SIGNATURE_STEP2_TITLE')}</div>
        <div className="text-sm">{t('WALLET_PANEL.SIGNATURE_STEP2_DESCRIPTION')}</div>
      </div>
    </>
  );

  const secondStepErrorView = (
    <>
      <div className="mr-4">{errorIcon}</div>
      <div className="space-y-1 text-lightWhite">
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
      <div className="mr-4">{errorIcon}</div>
      <div className="space-y-1 text-lightWhite">
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
    <div className={`space-y-12 flex flex-col pt-16 pb-4 items-start`}>
      <div className="flex items-center justify-center">{firstStepSectionHandler}</div>

      {/* Info: Second Step (20231106 - Shirley) */}
      <div className="flex items-center justify-center">{secondStepSectionHandler}</div>
    </div>
  );

  const isDisplayedProcessModal = processModalVisible ? (
    /* Info: (20231129 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="SignatureProcessModal"
        ref={processModalRef}
        className="relative space-y-4 flex h-auto w-9/10 flex-col items-center rounded-xl bg-darkGray1 shadow-lg shadow-black/80 md:w-450px py-8 px-6 lg:p-10"
      >
        {/* Info: (20231129 - Julian) Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-lightWhite md:text-4xl">
            {t('WALLET_PANEL.TITLE')}
          </h3>
          {/* Info: (20231004 - Julian) Close Button */}
          <button
            id="SignatureCloseButton"
            onClick={processClickHandler}
            className="absolute right-3 top-3 p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none lg:right-5 lg:top-5"
          >
            <ImCross />
          </button>
        </div>

        <div className="flex flex-col items-center text-lg leading-relaxed text-lightWhite">
          <div className="text-center text-sm text-lightGray md:text-lg">
            <div>{t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE1')}</div>
            <div>
              {' '}
              {t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE2_PART1')}{' '}
              <span className="text-tidebitTheme">
                <Link href="#">{t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE2_HIGHLIGHT')}</Link>
              </span>{' '}
              {t('WALLET_PANEL.SIGNATURE_DESCRIPTION_LINE2_PART2')}
            </div>
          </div>

          {displayedSection}

          <div className={`mt-10`}>{requestButtonHandler}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <div>{isDisplayedProcessModal}</div>;
};

export default SignatureProcessModal;

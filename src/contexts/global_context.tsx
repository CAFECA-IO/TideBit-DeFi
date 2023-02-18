import {createContext, useState, useEffect, useContext, Dispatch, SetStateAction} from 'react';
import useWindowSize from '../lib/hooks/use_window_size';
import {LAYOUT_BREAKPOINT} from '../constants/display';
import {ToastContainer, toast as toastify} from 'react-toastify';
import PositionDetailsModal from '../components/position_details_modal/position_details_modal';
import {MarketContext} from './market_context';
import Toast from '../components/toast/toast';
import LoadingModal from '../components/loading_modal/loading_modal';
import FailedModal from '../components/failed_modal/failed_modal';
import CanceledModal from '../components/canceled_modal/canceled_modal';
import SuccessfulModal from '../components/successful_modal/successful_modal';
import DepositModal from '../components/deposit_modal/deposit_modal';
import WithdrawalModal from '../components/withdrawal_modal/withdrawal_modal';
import {
  IOpenCFDDetails,
  dummyOpenCFDDetails,
} from '../interfaces/tidebit_defi_background/open_cfd_details';
import WalletPanel from '../components/wallet_panel/wallet_panel';
import QrcodeModal from '../components/qrcode_modal/qrcode_modal';
import HelloModal from '../components/hello_modal/hello_modal';
import SignatureProcessModal from '../components/signature_process_modal/signature_process_modal';
import {UserContext} from './user_context';

export interface IToastify {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  toastId?: string | number; // Prevent duplicate toast
}

export interface IDataPositionDetailsModal {
  openCfdDetails: IOpenCFDDetails;
}

export interface IDataTransferProcessModal {
  transferType: 'deposit' | 'withdraw';
}

export interface IDataSuccessfulModal {
  modalTitle: string;
  modalContent?: string;
  btnMsg?: string;
  btnUrl?: string;
}

export interface IProcessDataModal {
  modalTitle: string;
  modalContent: string;
  btnMsg?: string;
  btnUrl?: string;
}

export interface IDataFailedModal {
  modalTitle: string;
  btnMsg?: string;
  btnUrl?: string;
  failedTitle: string;
  failedMsg: string;
}

export interface IDataSignatrueProcessModal {
  requestSendingHandler: () => void;
  firstStepSuccess: boolean;
  firstStepError: boolean;
  secondStepSuccess: boolean;
  secondStepError: boolean;
  loading: boolean;
}

const toastHandler = ({type, message, toastId}: IToastify) => {
  // return {
  //   [TOAST_CLASSES_TYPE.error]: toastify.error(message),
  //   [TOAST_CLASSES_TYPE.warning]: toastify.warning(message),
  //   [TOAST_CLASSES_TYPE.info]: toastify.info(message),
  // }[type];

  // const present = Date.now(); // Make sure toastId is unique (no worries about the same content of toast) but produce duplicate toast
  switch (type) {
    case 'error':
      toastify.error(message, {toastId: type + message + toastId});
      break;
    case 'warning':
      toastify.warning(message, {toastId: type + message + toastId});
      break;
    case 'info':
      toastify.info(message, {toastId: type + message + toastId});
      break;
    case 'success':
      toastify.success(message, {toastId: type + message + toastId});
      break;
    default:
      return;
  }
};

export interface IGlobalProvider {
  children: React.ReactNode;
}

export type LayoutAssertionUnion = 'mobile' | 'desktop';
export type ColorModeUnion = 'light' | 'dark';

export interface IGlobalContext {
  width: number;
  height: number;
  layoutAssertion: LayoutAssertionUnion;
  initialColorMode: ColorModeUnion;
  colorMode: ColorModeUnion;
  toggleColorMode: () => void;
  toast: (props: IToastify) => void;

  eliminateAllModals: () => void;

  visiblePositionDetailsModal: boolean;
  visiblePositionDetailsModalHandler: () => void;
  dataPositionDetailsModal: IDataPositionDetailsModal | null;
  dataPositionDetailsModalHandler: (data: IDataPositionDetailsModal) => void;

  visibleDepositModal: boolean;
  visibleDepositModalHandler: () => void;

  visibleWithdrawalModal: boolean;
  visibleWithdrawalModalHandler: () => void;

  visibleLoadingModal: boolean;
  visibleLoadingModalHandler: () => void;
  zoomOutLoadingModal: () => void;
  dataLoadingModal: IProcessDataModal | null;
  dataLoadingModalHandler: (data: IProcessDataModal) => void;

  visibleFailedModal: boolean;
  visibleFailedModalHandler: () => void;
  dataFailedModal: IDataFailedModal | null;
  dataFailedModalHandler: (data: IDataFailedModal) => void;

  visibleCanceledModal: boolean;
  visibleCanceledModalHandler: () => void;
  dataCanceledModal: IProcessDataModal | null;
  dataCanceledModalHandler: (data: IProcessDataModal) => void;

  visibleSuccessfulModal: boolean;
  visibleSuccessfulModalHandler: () => void;
  dataSuccessfulModal: IDataSuccessfulModal | null;
  dataSuccessfulModalHandler: (data: IDataSuccessfulModal) => void;

  visibleWalletPanel: boolean;
  visibleWalletPanelHandler: () => void;

  visibleSignatureProcessModal: boolean;
  visibleSignatureProcessModalHandler: () => void;

  visibleHelloModal: boolean;
  visibleHelloModalHandler: () => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  width: 0,
  height: 0,
  layoutAssertion: '' as LayoutAssertionUnion,
  initialColorMode: '' as ColorModeUnion,
  colorMode: '' as ColorModeUnion,
  toggleColorMode: () => null,
  toast: () => null,

  eliminateAllModals: () => null,

  visiblePositionDetailsModal: false,
  visiblePositionDetailsModalHandler: () => null,
  dataPositionDetailsModal: null,
  dataPositionDetailsModalHandler: () => null,

  visibleDepositModal: false,
  visibleDepositModalHandler: () => null,

  visibleWithdrawalModal: false,
  visibleWithdrawalModalHandler: () => null,

  visibleLoadingModal: false,
  visibleLoadingModalHandler: () => null,
  zoomOutLoadingModal: () => null,
  dataLoadingModal: null,
  dataLoadingModalHandler: () => null,

  visibleFailedModal: false,
  visibleFailedModalHandler: () => null,
  dataFailedModal: null,
  dataFailedModalHandler: () => null,

  visibleCanceledModal: false,
  visibleCanceledModalHandler: () => null,
  dataCanceledModal: null,
  dataCanceledModalHandler: () => null,

  visibleSuccessfulModal: false,
  visibleSuccessfulModalHandler: () => null,
  dataSuccessfulModal: null,
  dataSuccessfulModalHandler: () => null,

  visibleWalletPanel: false,
  visibleWalletPanelHandler: () => null,

  visibleSignatureProcessModal: false,
  visibleSignatureProcessModalHandler: () => null,

  visibleHelloModal: false,
  visibleHelloModalHandler: () => null,
});

const initialColorMode: ColorModeUnion = 'dark';

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const userCtx = useContext(UserContext);
  const [colorMode, setColorMode] = useState<ColorModeUnion>(initialColorMode);

  const [visiblePositionDetailsModal, setVisiblePositionDetailsModal] = useState(false);
  const [dataPositionDetailsModal, setDataPositionDetailsModal] =
    useState<IDataPositionDetailsModal>({openCfdDetails: dummyOpenCFDDetails});

  const [visibleWithdrawalModal, setVisibleWithdrawalModal] = useState(false);

  const [visibleDepositModal, setVisibleDepositModal] = useState(false);

  const [visibleLoadingModal, setVisibleLoadingModal] = useState(false);
  const [dataLoadingModal, setDataLoadingModal] = useState<IProcessDataModal>({
    modalTitle: '',
    modalContent: '',
  });

  const [visibleFailedModal, setVisibleFailedModal] = useState(false);
  const [dataFailedModal, setDataFailedModal] = useState<IDataFailedModal>({
    modalTitle: '',
    // modalContent: '',
    failedTitle: 'Failed',
    failedMsg:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et',
  });

  const [visibleSuccessfulModal, setVisibleSuccessfulModal] = useState(false);
  const [dataSuccessfulModal, setDataSuccessfulModal] = useState<IDataSuccessfulModal>({
    modalTitle: '',
    modalContent: '',
  });

  const [visibleCanceledModal, setVisibleCanceledModal] = useState(false);
  const [dataCanceledModal, setDataCanceledModal] = useState<IProcessDataModal>({
    modalTitle: '',
    modalContent: '',
  });

  const [visibleWalletPanel, setVisibleWalletPanel] = useState(false);
  const [visibleHelloModal, setVisibleHelloModal] = useState(false);

  const [visibleSignatureProcessModal, setVisibleSignatureProcessModal] = useState(false);
  const [dataSignatureProcessModal, setDataSignatureProcessModal] =
    useState<IDataSignatrueProcessModal | null>();

  // ---------------TODO: To get the withdrawal / deposit result------------------
  const [depositProcess, setDepositProcess] = useState<
    'form' | 'loading' | 'success' | 'cancellation' | 'fail'
  >('form');
  const [withdrawProcess, setWithdrawProcess] = useState<
    'form' | 'loading' | 'success' | 'cancellation' | 'fail'
  >('form');

  const [withdrawData, setWithdrawData] = useState<{asset: string; amount: number}>();
  const [depositData, setDepositData] = useState<{asset: string; amount: number}>();
  // ---------------TODO: To get the withdrawal / deposit result------------------

  const windowSize = useWindowSize();
  const {width, height} = windowSize;

  const layoutAssertion: LayoutAssertionUnion = width < LAYOUT_BREAKPOINT ? 'mobile' : 'desktop';

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  const toast = ({type, message, toastId}: IToastify) => {
    toastHandler({type: type, message: message, toastId: toastId});
  };

  const eliminateAllModals = () => {
    // console.log('eliminateAllModals');
    setVisiblePositionDetailsModal(false);
    setVisibleDepositModal(false);
    setVisibleWithdrawalModal(false);
    setVisibleLoadingModal(false);
    setVisibleFailedModal(false);
    setVisibleCanceledModal(false);
    setVisibleSuccessfulModal(false);
    setVisibleWalletPanel(false);
    setVisibleHelloModal(false);
    setVisibleSignatureProcessModal(false);
  };

  const visiblePositionDetailsModalHandler = () => {
    setVisiblePositionDetailsModal(!visiblePositionDetailsModal);
  };
  const dataPositionDetailsModalHandler = (data: IDataPositionDetailsModal) => {
    setDataPositionDetailsModal(data);
  };

  const visibleDepositModalHandler = () => {
    setVisibleDepositModal(!visibleDepositModal);
  };

  const visibleWithdrawalModalHandler = () => {
    setVisibleWithdrawalModal(!visibleWithdrawalModal);
  };

  const zoomOutLoadingModal = () => {
    visibleLoadingModalHandler();

    if (visibleLoadingModal) {
      toast({
        type: 'info',
        message:
          '[TODO] Pending toast which cannot be closed manually and automatically unless the process is finished',
        toastId: 'loadingModalClosed',
      });
    }
  };

  const visibleLoadingModalHandler = () => {
    // if (bool) {
    //   console.log('in global context, visibileLoadingModalHandler: ', bool);
    //   setVisibleLoadingModal(bool);
    //   return;
    // }

    setVisibleLoadingModal(!visibleLoadingModal);
  };

  const dataLoadingModalHandler = (data: IProcessDataModal) => {
    setDataLoadingModal(data);
  };

  const visibleFailedModalHandler = () => {
    setVisibleFailedModal(!visibleFailedModal);
  };

  const dataFailedModalHandler = (data: IDataFailedModal) => {
    setDataFailedModal(data);
  };

  const visibleSuccessfulModalHandler = () => {
    setVisibleSuccessfulModal(!visibleSuccessfulModal);
  };

  const dataSuccessfulModalHandler = (data: IDataSuccessfulModal) => {
    setDataSuccessfulModal(data);
  };

  const visibleCanceledModalHandler = () => {
    setVisibleCanceledModal(!visibleCanceledModal);
  };

  const dataCanceledModalHandler = (data: IProcessDataModal) => {
    setDataCanceledModal(data);
  };

  const visibleWalletPanelHandler = () => {
    setVisibleWalletPanel(!visibleWalletPanel);
  };

  const visibleSignatureProcessModalHandler = () => {
    setVisibleSignatureProcessModal(!visibleSignatureProcessModal);
  };

  // const dataSignatureProcessModalHandler = (data?: IDataSignatrueProcessModal) => {
  //   if (data) {
  //     setDataSignatureProcessModal(data);
  //   } else {
  //     setDataSignatureProcessModal({
  //       requestSendingHandler,
  //       firstStepSuccess: userCtx.isConnected,
  // firstStepError: !userCtx.isConnected,
  // secondStepSuccess: userCtx.enableServiceTerm,
  // secondStepError: !userCtx.enableServiceTerm,
  // loading: userCtx.signServiceTerm,
  //     });
  //   }
  // };

  const visibleHelloModalHandler = () => {
    setVisibleHelloModal(!visibleHelloModal);
  };

  const getWithdrawSubmissionState = (state: 'success' | 'cancellation' | 'fail') => {
    setWithdrawProcess(state);
  };

  const getDepositData = (props: {asset: string; amount: number}) => {
    setDepositData(props);
  };

  const getWithdrawData = (props: {asset: string; amount: number}) => {
    setWithdrawData(props);
  };

  const getDepositSubmissionState = (state: 'success' | 'cancellation' | 'fail') => {
    setDepositProcess(state);
  };

  const depositSubmitHandler = (props: {asset: string; amount: number}) => {
    setDepositProcess('loading');
  };

  const withdrawSubmitHandler = (props: {asset: string; amount: number}) => {
    setWithdrawProcess('loading');

    // setTimeout(() => {
    //   setWithdrawProcess('success');

    //   setTimeout(() => {
    //     setWithdrawProcess('cancellation');

    //     setTimeout(() => {
    //       setWithdrawProcess('fail');
    //     }, 5000);
    //   }, 5000);
    // }, 3000);
  };

  const defaultValue = {
    width,
    height,
    layoutAssertion,
    initialColorMode,
    colorMode,
    toggleColorMode,
    toast,

    eliminateAllModals,

    visiblePositionDetailsModal,
    visiblePositionDetailsModalHandler,
    dataPositionDetailsModal,
    dataPositionDetailsModalHandler,

    visibleDepositModal,
    visibleDepositModalHandler,

    visibleWithdrawalModal,
    visibleWithdrawalModalHandler,

    visibleLoadingModal,
    visibleLoadingModalHandler,
    zoomOutLoadingModal,
    dataLoadingModal,
    dataLoadingModalHandler,

    visibleFailedModal,
    visibleFailedModalHandler,
    dataFailedModal,
    dataFailedModalHandler,

    visibleSuccessfulModal,
    visibleSuccessfulModalHandler,
    dataSuccessfulModal,
    dataSuccessfulModalHandler,

    visibleCanceledModal,
    visibleCanceledModalHandler,
    dataCanceledModal,
    dataCanceledModalHandler,

    visibleWalletPanel,
    visibleWalletPanelHandler,

    visibleSignatureProcessModal,
    visibleSignatureProcessModalHandler,

    visibleHelloModal,
    visibleHelloModalHandler,
  };
  return (
    <GlobalContext.Provider value={defaultValue}>
      <LoadingModal
        modalVisible={visibleLoadingModal}
        // zoomOutLoadingModal
        modalClickHandler={visibleLoadingModalHandler}
        modalTitle={dataLoadingModal.modalTitle}
        modalContent={dataLoadingModal.modalContent}
        btnMsg={dataLoadingModal?.btnMsg}
        btnUrl={dataLoadingModal?.btnUrl}
      />
      <FailedModal
        modalTitle={dataFailedModal.modalTitle}
        // modalContent={dataFailedModal.modalContent}
        modalVisible={visibleFailedModal}
        modalClickHandler={visibleFailedModalHandler}
        btnMsg={dataFailedModal?.btnMsg}
        btnUrl={dataFailedModal?.btnUrl}
        failedTitle={dataFailedModal.failedTitle}
        failedMsg={dataFailedModal?.failedMsg}
      />
      <CanceledModal
        modalTitle={dataCanceledModal.modalTitle}
        modalContent={dataCanceledModal.modalContent}
        modalVisible={visibleCanceledModal}
        modalClickHandler={visibleCanceledModalHandler}
        btnMsg={dataCanceledModal?.btnMsg}
        btnUrl={dataCanceledModal?.btnUrl}
      />
      <SuccessfulModal
        modalTitle={dataSuccessfulModal.modalTitle}
        modalContent={dataSuccessfulModal.modalContent}
        modalVisible={visibleSuccessfulModal}
        modalClickHandler={visibleSuccessfulModalHandler}
        btnMsg={dataSuccessfulModal?.btnMsg}
        btnUrl={dataSuccessfulModal?.btnUrl}
      />
      <DepositModal
        getTransferData={getDepositData}
        submitHandler={depositSubmitHandler}
        getSubmissionState={getDepositSubmissionState}
        modalVisible={visibleDepositModal}
        modalClickHandler={visibleDepositModalHandler}
      />
      <WithdrawalModal
        getTransferData={getWithdrawData}
        submitHandler={withdrawSubmitHandler}
        getSubmissionState={getWithdrawSubmissionState}
        modalVisible={visibleWithdrawalModal}
        modalClickHandler={visibleWithdrawalModalHandler}
      />
      <PositionDetailsModal
        openCfdDetails={dataPositionDetailsModal.openCfdDetails}
        modalVisible={visiblePositionDetailsModal}
        modalClickHandler={visiblePositionDetailsModalHandler}
      />
      <WalletPanel
        panelVisible={visibleWalletPanel}
        panelClickHandler={visibleWalletPanelHandler}
      />
      <SignatureProcessModal
        // requestSendingHandler={requestSendingHandler}
        // firstStepSuccess={firstStepSuccess}
        // firstStepError={firstStepError}
        // secondStepSuccess={secondStepSuccess}
        // secondStepError={secondStepError}
        // loading={loading}
        processModalVisible={visibleSignatureProcessModal}
        processClickHandler={visibleSignatureProcessModalHandler}
      />
      <HelloModal
        helloModalVisible={visibleHelloModal}
        helloClickHandler={visibleHelloModalHandler}
      />

      {/* One toast container avoids duplicate toast overlaying */}
      <Toast />
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  // If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.
  // if (context === undefined) {
  //   throw new Error('useGlobal must be used within a GlobalProvider');
  // }

  // TODO: Debug tool
  const g: any =
    typeof globalThis === 'object'
      ? globalThis
      : typeof window === 'object'
      ? window
      : typeof global === 'object'
      ? global
      : null; // Causes an error on the next line

  g.globalContext = context;

  return context;
};

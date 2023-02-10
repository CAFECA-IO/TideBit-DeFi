import {createContext, useState, useEffect, useContext, Dispatch, SetStateAction} from 'react';
import useWindowSize from '../lib/hooks/use_window_size';
import {LAYOUT_BREAKPOINT} from '../constants/display';
import {ToastContainer, toast as toastify} from 'react-toastify';
import PositionDetailsModal from '../components/position_details_modal/position_details_modal';
import TransferProcessModal from '../components/transfer_process_modal/transfer_process_modal';
import {MarketContext} from './market_context';
import Toast from '../components/toast/toast';
import LoadingModal from '../components/loading_modal/loading_modal';

export interface IToastify {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  toastId?: string | number; // Prevent duplicate toast
}

export interface IDataPositionDetailsModal {
  orderIdPositionDetailsModal: string;
}

export interface IDataTransferProcessModal {
  transferType: 'deposit' | 'withdraw';
}

export interface IDataLoadingModal {
  modalTitle: string;
  modalContent: string;
  btnMsg?: string;
  btnUrl?: string;
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
  visiblePositionDetailsModal: boolean;
  visiblePositionDetailsModalHandler: (visible: boolean) => void;
  dataPositionDetailsModal: IDataPositionDetailsModal | null;
  dataPositionDetailsModalHandler: (data: IDataPositionDetailsModal) => void;

  visibleTransferProcessModal: boolean;
  visibleTransferProcessModalHandler: () => void;
  dataTransferProcessModal: IDataTransferProcessModal | null;
  dataTransferProcessModalHandler: (data: IDataTransferProcessModal) => void;

  visibleLoadingModal: boolean;
  visibleLoadingModalHandler: () => void;
  dataLoadingModal: IDataLoadingModal | null;
  dataLoadingModalHandler: (data: IDataLoadingModal) => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  width: 0,
  height: 0,
  layoutAssertion: '' as LayoutAssertionUnion,
  initialColorMode: '' as ColorModeUnion,
  colorMode: '' as ColorModeUnion,
  toggleColorMode: () => null,
  toast: () => null,
  visiblePositionDetailsModal: false,
  visiblePositionDetailsModalHandler: () => null,
  dataPositionDetailsModal: null,
  dataPositionDetailsModalHandler: () => null,

  visibleTransferProcessModal: false,
  visibleTransferProcessModalHandler: () => null,
  dataTransferProcessModal: null,
  dataTransferProcessModalHandler: () => null,

  visibleLoadingModal: false,
  visibleLoadingModalHandler: () => null,
  dataLoadingModal: null,
  dataLoadingModalHandler: () => null,
});

const initialColorMode: ColorModeUnion = 'dark';

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const [colorMode, setColorMode] = useState<ColorModeUnion>(initialColorMode);

  const [visiblePositionDetailsModal, setVisiblePositionDetailsModal] = useState(false);
  const [dataPositionDetailsModal, setDataPositionDetailsModal] =
    useState<IDataPositionDetailsModal>({orderIdPositionDetailsModal: ''});

  const [visibleTransferProcessModal, setVisibleTransferProcessModal] = useState(false);
  const [dataTransferProcessModal, setDataTransferProcessModal] =
    useState<IDataTransferProcessModal>({transferType: 'deposit'});

  const [visibleLoadingModal, setVisibleLoadingModal] = useState(false);
  const [dataLoadingModal, setDataLoadingModal] = useState<IDataLoadingModal>({
    modalTitle: '',
    modalContent: '',
  });

  const [depositProcess, setDepositProcess] = useState<
    'form' | 'loading' | 'success' | 'cancellation' | 'fail'
  >('form');
  const [withdrawProcess, setWithdrawProcess] = useState<
    'form' | 'loading' | 'success' | 'cancellation' | 'fail'
  >('form');
  const [withdrawData, setWithdrawData] = useState<{asset: string; amount: number}>();
  const [depositData, setDepositData] = useState<{asset: string; amount: number}>();

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

  const visiblePositionDetailsModalHandler = (visible: boolean) => {
    setVisiblePositionDetailsModal(visible);
  };
  const dataPositionDetailsModalHandler = (data: IDataPositionDetailsModal) => {
    setDataPositionDetailsModal(data);
  };

  const visibleTransferProcessModalHandler = () => {
    setVisibleTransferProcessModal(!visibleTransferProcessModal);
  };
  const dataTransferProcessModalHandler = (data: IDataTransferProcessModal) => {
    setDataTransferProcessModal(data);
  };

  const visibleLoadingModalHandler = () => {
    setVisibleLoadingModal(!visibleLoadingModal);
  };
  const dataLoadingModalHandler = (data: IDataLoadingModal) => {
    setDataLoadingModal(data);
  };

  const getWithdrawSubmissionState = (state: 'success' | 'cancellation' | 'fail') => {
    setWithdrawProcess(state);
  };

  const getWithdrawData = (props: {asset: string; amount: number}) => {
    setWithdrawData(props);
  };

  const withdrawSubmitHandler = (props: {asset: string; amount: number}) => {
    setWithdrawProcess('loading');

    setTimeout(() => {
      setWithdrawProcess('success');

      setTimeout(() => {
        setWithdrawProcess('cancellation');

        setTimeout(() => {
          setWithdrawProcess('fail');
        }, 5000);
      }, 5000);
    }, 3000);
  };

  // const positionDetailedModal = (
  //   <PositionDetailsModal
  //     openCfdDetails={openCfdDetails}
  //     modalVisible={visiblePositionDetailsModal}
  //     modalClickHandler={visiblePositionDetailsModalHandler}
  //   />
  // );

  const defaultValue = {
    width,
    height,
    layoutAssertion,
    initialColorMode,
    colorMode,
    toggleColorMode,
    toast,

    visiblePositionDetailsModal,
    visiblePositionDetailsModalHandler,
    dataPositionDetailsModal,
    dataPositionDetailsModalHandler,

    visibleTransferProcessModal,
    visibleTransferProcessModalHandler,
    dataTransferProcessModal,
    dataTransferProcessModalHandler,

    visibleLoadingModal,
    visibleLoadingModalHandler,
    dataLoadingModal,
    dataLoadingModalHandler,
  };
  return (
    <GlobalContext.Provider value={defaultValue}>
      <TransferProcessModal
        getTransferData={getWithdrawData}
        // initialAmountInput={undefined}
        submitHandler={withdrawSubmitHandler}
        // transferOptions={availableTransferOptions}
        getSubmissionState={getWithdrawSubmissionState}
        transferType={dataTransferProcessModal.transferType}
        transferStep={withdrawProcess}
        // userAvailableBalance={123}
        modalVisible={visibleTransferProcessModal}
        modalClickHandler={visibleTransferProcessModalHandler}
      />
      <LoadingModal
        modalVisible={visibleLoadingModal}
        modalClickHandler={visibleLoadingModalHandler}
        modalTitle={dataLoadingModal.modalTitle}
        modalContent={dataLoadingModal.modalContent}
        btnMsg={dataLoadingModal?.btnMsg}
        btnUrl={dataLoadingModal?.btnUrl}
      />
      {/* One toast container avoids duplicating toast overlaying */}
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
  return context;
};

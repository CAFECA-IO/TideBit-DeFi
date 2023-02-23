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
import PositionOpenModal from '../components/position_open_modal/position_open_modal';
import PositionClosedModal from '../components/position_closed_modal/position_closed_modal';
import PositionUpdatedModal from '../components/position_updated_modal/position_updated_modal';
import {
  IClosedCFDDetails,
  dummyCloseCFDDetails,
} from '../interfaces/tidebit_defi_background/closed_cfd_details';
import HistoryPositionModal from '../components/history_position_modal/history_position_modal';

export interface IToastify {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  toastId?: string | number; // Prevent duplicate toast
}

// export interface IDataPositionDetailsModal {
//   openCfdDetails: IOpenCFDDetails;
// }

// export interface IDataHistoryPositionModal {
//   closedCfdDetails: IClosedCFDDetails;
// }

// export interface ITransferProcessModal {
//   transferType: 'deposit' | 'withdraw';
// }

export interface ISuccessfulModal {
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

export interface IFailedModal {
  modalTitle: string;
  btnMsg?: string;
  btnUrl?: string;
  failedTitle: string;
  failedMsg: string;
}

// TODO: to be continued
export interface IRecordSharingModal {
  orderIdRecordSharing: number;
}

export const dummyRecordSharingModal: IRecordSharingModal = {
  orderIdRecordSharing: 0,
};

// TODO: to be continued
export interface IWarningModal {
  title: string;
  content: string;
  numberOfButton: number;
  reactionOfButton: string;
  styleOfButton: 'style1' | 'style2';
}

export const dummyWarningModal: IWarningModal = {
  title: '',
  content: '',
  numberOfButton: 0,
  reactionOfButton: '',
  styleOfButton: 'style1',
};

// TODO: to be continued
export interface IAnnouncementModal {
  title: string;
  content: string;
  numberOfButton: number;
  reactionOfButton: string;
  styleOfButton: 'style1' | 'style2';
  messageType: 'announcement' | 'notification';
}

export const dummyAnnouncementModal: IAnnouncementModal = {
  title: '',
  content: '',
  numberOfButton: 0,
  reactionOfButton: '',
  styleOfButton: 'style1',
  messageType: 'announcement',
};

// TODO: to be continued
export interface IAchievementSharingModal {
  userId: string;
  period: string;
}

export const dummyAchievementSharingModal: IAchievementSharingModal = {
  userId: '202302220001234',
  period: '002',
};

// TODO: to be continued
export interface IBadgeModal {
  badgeId: string;
}

export const dummyBadgeModal: IBadgeModal = {
  badgeId: 'TBDFUTURES2023FEB05',
};

// TODO: to be continued
export interface IBadgeSharingModal {
  badgeId: string;
}

export const dummyBadgeSharingModal: IBadgeSharingModal = {
  badgeId: 'TBDFUTURES2023FEB05',
};

// export interface ISignatrueProcessModal {
//   requestSendingHandler: () => void;
//   firstStepSuccess: boolean;
//   firstStepError: boolean;
//   secondStepSuccess: boolean;
//   secondStepError: boolean;
//   loading: boolean;
// }

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
  dataPositionDetailsModal: IOpenCFDDetails | null;
  dataPositionDetailsModalHandler: (data: IOpenCFDDetails) => void;

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
  dataFailedModal: IFailedModal | null;
  dataFailedModalHandler: (data: IFailedModal) => void;

  visibleCanceledModal: boolean;
  visibleCanceledModalHandler: () => void;
  dataCanceledModal: IProcessDataModal | null;
  dataCanceledModalHandler: (data: IProcessDataModal) => void;

  visibleSuccessfulModal: boolean;
  visibleSuccessfulModalHandler: () => void;
  dataSuccessfulModal: ISuccessfulModal | null;
  dataSuccessfulModalHandler: (data: ISuccessfulModal) => void;

  visibleWalletPanel: boolean;
  visibleWalletPanelHandler: () => void;

  visibleSignatureProcessModal: boolean;
  visibleSignatureProcessModalHandler: () => void;

  visibleHelloModal: boolean;
  visibleHelloModalHandler: () => void;

  visibleHistoryPositionModal: boolean;
  visibleHistoryPositionModalHandler: () => void;
  dataHistoryPositionModal: IClosedCFDDetails | null;
  dataHistoryPositionModalHandler: (data: IClosedCFDDetails) => void;

  visiblePositionClosedModal: boolean;
  visiblePositionClosedModalHandler: () => void;
  dataPositionClosedModal: IOpenCFDDetails | null;
  dataPositionClosedModalHandler: (data: IOpenCFDDetails) => void;

  visiblePositionOpenModal: boolean;
  visiblePositionOpenModalHandler: () => void;
  dataPositionOpenModal: IOpenCFDDetails | null;
  dataPositionOpenModalHandler: (data: IOpenCFDDetails) => void;

  visiblePositionUpdatedModal: boolean;
  visiblePositionUpdatedModalHandler: () => void;
  dataPositionUpdatedModal: IOpenCFDDetails | null;
  dataPositionUpdatedModalHandler: (data: IOpenCFDDetails) => void;

  visibleMyAccountModal: boolean;
  visibleMyAccountModalHandler: () => void;

  visibleEmailConnectingModal: boolean;
  visibleEmailConnectingModalHandler: () => void;

  visibleTideBitConnectingModal: boolean;
  visibleTideBitConnectingModalHandler: () => void;

  visibleBravoModal: boolean;
  visibleBravoModalHandler: () => void;

  visibleProfileSettingModal: boolean;
  visibleProfileSettingModalHandler: () => void;

  visibleRecordSharingModal: boolean;
  visibleRecordSharingModalHandler: () => void;

  visibleWarningModal: boolean;
  visibleWarningModalHandler: () => void;
  dataWarningModal: IWarningModal | null;
  dataWarningModalHandler: (data: IWarningModal) => void;

  visibleAnnouncementModal: boolean;
  visibleAnnouncementModalHandler: () => void;
  dataAnnouncementModal: IAnnouncementModal | null;
  dataAnnouncementModalHandler: (data: IAnnouncementModal) => void;

  visiblePersonalAchievementModal: boolean;
  visiblePersonalAchievementModalHandler: () => void;
  // dataPersonalAchievementModal: IPersonalAchievementModal | null;
  // dataPersonalAchievementModalHandler: (data: IPersonalAchievementModal) => void;

  visibleAchievementSharingModal: boolean;
  visibleAchievementSharingModalHandler: () => void;
  dataAchievementSharingModal: IAchievementSharingModal | null;
  dataAchievementSharingModalHandler: (data: IAchievementSharingModal) => void;

  visibleBadgeModal: boolean;
  visibleBadgeModalHandler: () => void;
  dataBadgeModal: IBadgeModal | null;
  dataBadgeModalHandler: (data: IBadgeModal) => void;

  visibleBadgeSharingModal: boolean;
  visibleBadgeSharingModalHandler: () => void;
  dataBadgeSharingModal: IBadgeSharingModal | null;
  dataBadgeSharingModalHandler: (data: IBadgeSharingModal) => void;
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

  visibleHistoryPositionModal: false,
  visibleHistoryPositionModalHandler: () => null,
  dataHistoryPositionModal: null,
  dataHistoryPositionModalHandler: () => null,

  visiblePositionClosedModal: false,
  visiblePositionClosedModalHandler: () => null,
  dataPositionClosedModal: null,
  dataPositionClosedModalHandler: () => null,

  visiblePositionOpenModal: false,
  visiblePositionOpenModalHandler: () => null,
  dataPositionOpenModal: null,
  dataPositionOpenModalHandler: () => null,

  visiblePositionUpdatedModal: false,
  visiblePositionUpdatedModalHandler: () => null,
  dataPositionUpdatedModal: null,
  dataPositionUpdatedModalHandler: () => null,

  visibleMyAccountModal: false,
  visibleMyAccountModalHandler: () => null,

  visibleEmailConnectingModal: false,
  visibleEmailConnectingModalHandler: () => null,

  visibleTideBitConnectingModal: false,
  visibleTideBitConnectingModalHandler: () => null,

  visibleBravoModal: false,
  visibleBravoModalHandler: () => null,

  visibleProfileSettingModal: false,
  visibleProfileSettingModalHandler: () => null,

  visibleRecordSharingModal: false,
  visibleRecordSharingModalHandler: () => null,

  visibleWarningModal: false,
  visibleWarningModalHandler: () => null,
  dataWarningModal: null,
  dataWarningModalHandler: () => null,

  visibleAnnouncementModal: false,
  visibleAnnouncementModalHandler: () => null,
  dataAnnouncementModal: null,
  dataAnnouncementModalHandler: () => null,

  visiblePersonalAchievementModal: false,
  visiblePersonalAchievementModalHandler: () => null,

  visibleAchievementSharingModal: false,
  visibleAchievementSharingModalHandler: () => null,
  dataAchievementSharingModal: null,
  dataAchievementSharingModalHandler: () => null,

  visibleBadgeModal: false,
  visibleBadgeModalHandler: () => null,
  dataBadgeModal: null,
  dataBadgeModalHandler: () => null,

  visibleBadgeSharingModal: false,
  visibleBadgeSharingModalHandler: () => null,
  dataBadgeSharingModal: null,
  dataBadgeSharingModalHandler: () => null,
});

const initialColorMode: ColorModeUnion = 'dark';

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const userCtx = useContext(UserContext);
  const [colorMode, setColorMode] = useState<ColorModeUnion>(initialColorMode);

  const [visiblePositionDetailsModal, setVisiblePositionDetailsModal] = useState(false);
  // TODO: replace dummy data with standard example data
  const [dataPositionDetailsModal, setDataPositionDetailsModal] =
    useState<IOpenCFDDetails>(dummyOpenCFDDetails);

  const [visibleWithdrawalModal, setVisibleWithdrawalModal] = useState(false);

  const [visibleDepositModal, setVisibleDepositModal] = useState(false);

  const [visibleLoadingModal, setVisibleLoadingModal] = useState(false);
  const [dataLoadingModal, setDataLoadingModal] = useState<IProcessDataModal>({
    modalTitle: '',
    modalContent: '',
  });

  const [visibleFailedModal, setVisibleFailedModal] = useState(false);
  const [dataFailedModal, setDataFailedModal] = useState<IFailedModal>({
    modalTitle: '',
    // modalContent: '',
    failedTitle: 'Failed',
    failedMsg:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et',
  });

  const [visibleSuccessfulModal, setVisibleSuccessfulModal] = useState(false);
  const [dataSuccessfulModal, setDataSuccessfulModal] = useState<ISuccessfulModal>({
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
  // const [dataSignatureProcessModal, setDataSignatureProcessModal] =
  //   useState<IDataSignatrueProcessModal | null>();

  const [visibleHistoryPositionModal, setVisibleHistoryPositionModal] = useState(false);
  const [dataHistoryPositionModal, setDataHistoryPositionModal] =
    useState<IClosedCFDDetails>(dummyCloseCFDDetails);

  const [visiblePositionClosedModal, setVisiblePositionClosedModal] = useState(false);
  const [dataPositionClosedModal, setDataPositionClosedModal] =
    useState<IOpenCFDDetails>(dummyOpenCFDDetails);

  const [visiblePositionOpenModal, setVisiblePositionOpenModal] = useState(false);
  const [dataPositionOpenModal, setDataPositionOpenModal] =
    useState<IOpenCFDDetails>(dummyOpenCFDDetails); // TODO: Open position parameter

  const [visiblePositionUpdatedModal, setVisiblePositionUpdatedModal] = useState(false);
  const [dataPositionUpdatedModal, setDataPositionUpdatedModal] =
    useState<IOpenCFDDetails>(dummyOpenCFDDetails); // TODO: Update position parameter

  const [visibleMyAccountModal, setVisibleMyAccountModal] = useState(false);

  const [visibleEmailConnectingModal, setVisibleEmailConnectingModal] = useState(false);

  const [visibleTideBitConnectingModal, setVisibleTideBitConnectingModal] = useState(false);

  const [visibleBravoModal, setVisibleBravoModal] = useState(false);

  const [visibleProfileSettingModal, setVisibleProfileSettingModal] = useState(false);

  const [visibleRecordSharingModal, setVisibleRecordSharingModal] = useState(false);
  const [dataRecordSharingModal, setDataRecordSharingModal] =
    useState<IRecordSharingModal>(dummyRecordSharingModal);

  const [visibleWarningModal, setVisibleWarningModal] = useState(false);
  const [dataWarningModal, setDataWarningModal] = useState<IWarningModal>(dummyWarningModal);

  const [visibleAnnouncementModal, setVisibleAnnouncementModal] = useState(false);
  const [dataAnnouncementModal, setDataAnnouncementModal] =
    useState<IAnnouncementModal>(dummyAnnouncementModal);

  const [visiblePersonalAchievementModal, setVisiblePersonalAchievementModal] = useState(false);

  const [visibleAchievementSharingModal, setVisibleAchievementSharingModal] = useState(false);
  const [dataAchievementSharingModal, setDataAchievementSharingModal] =
    useState<IAchievementSharingModal>(dummyAchievementSharingModal);

  const [visibleBadgeModal, setVisibleBadgeModal] = useState(false);
  const [dataBadgeModal, setDataBadgeModal] = useState<IBadgeModal>(dummyBadgeModal);

  const [visibleBadgeSharingModal, setVisibleBadgeSharingModal] = useState(false);
  const [dataBadgeSharingModal, setDataBadgeSharingModal] =
    useState<IBadgeSharingModal>(dummyBadgeSharingModal);

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
    setVisibleDepositModal(false);
    setVisibleWithdrawalModal(false);

    setVisibleLoadingModal(false);
    setVisibleFailedModal(false);
    setVisibleCanceledModal(false);
    setVisibleSuccessfulModal(false);

    setVisibleWalletPanel(false);
    setVisibleHelloModal(false);
    setVisibleSignatureProcessModal(false);

    setVisiblePositionDetailsModal(false);
    setVisibleHistoryPositionModal(false);

    setVisiblePositionClosedModal(false);
  };

  const visiblePositionDetailsModalHandler = () => {
    setVisiblePositionDetailsModal(!visiblePositionDetailsModal);
  };
  const dataPositionDetailsModalHandler = (data: IOpenCFDDetails) => {
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

  const dataFailedModalHandler = (data: IFailedModal) => {
    setDataFailedModal(data);
  };

  const visibleSuccessfulModalHandler = () => {
    setVisibleSuccessfulModal(!visibleSuccessfulModal);
  };

  const dataSuccessfulModalHandler = (data: ISuccessfulModal) => {
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

  const visibleHelloModalHandler = () => {
    setVisibleHelloModal(!visibleHelloModal);
  };

  const visibleHistoryPositionModalHandler = () => {
    setVisibleHistoryPositionModal(!visibleHistoryPositionModal);
  };

  const dataHistoryPositionModalHandler = (data: IClosedCFDDetails) => {
    setDataHistoryPositionModal(data);
  };

  const visiblePositionClosedModalHandler = () => {
    setVisiblePositionClosedModal(!visiblePositionClosedModal);
  };

  const dataPositionClosedModalHandler = (data: IOpenCFDDetails) => {
    setDataPositionClosedModal(data);
  };

  const visiblePositionOpenModalHandler = () => {
    setVisiblePositionOpenModal(!visiblePositionOpenModal);
  };

  // TODO: Open position parameter
  const dataPositionOpenModalHandler = (data: IOpenCFDDetails) => {
    setDataPositionOpenModal(data);
  };

  const visiblePositionUpdatedModalHandler = () => {
    setVisiblePositionUpdatedModal(!visiblePositionUpdatedModal);
  };

  const dataPositionUpdatedModalHandler = (data: IOpenCFDDetails) => {
    setDataPositionUpdatedModal(data);
  };

  const visibleMyAccountModalHandler = () => {
    setVisibleMyAccountModal(!visibleMyAccountModal);
  };

  const visibleTideBitConnectingModalHandler = () => {
    setVisibleTideBitConnectingModal(!visibleTideBitConnectingModal);
  };

  const visibleEmailConnectingModalHandler = () => {
    setVisibleEmailConnectingModal(!visibleEmailConnectingModal);
  };

  const visibleBravoModalHandler = () => {
    setVisibleBravoModal(!visibleBravoModal);
  };

  const visibleProfileSettingModalHandler = () => {
    setVisibleProfileSettingModal(!visibleProfileSettingModal);
  };

  const visibleRecordSharingModalHandler = () => {
    setVisibleRecordSharingModal(!visibleRecordSharingModal);
  };

  const dataRecordSharingModalHandler = (data: IRecordSharingModal) => {
    setDataRecordSharingModal(data);
  };

  const visibleWarningModalHandler = () => {
    setVisibleWarningModal(!visibleWarningModal);
  };

  const dataWarningModalHandler = (data: IWarningModal) => {
    setDataWarningModal(data);
  };

  const visibleAnnouncementModalHandler = () => {
    setVisibleAnnouncementModal(!visibleAnnouncementModal);
  };

  const dataAnnouncementModalHandler = (data: IAnnouncementModal) => {
    setDataAnnouncementModal(data);
  };

  const visiblePersonalAchievementModalHandler = () => {
    setVisiblePersonalAchievementModal(!visiblePersonalAchievementModal);
  };

  const visibleAchievementSharingModalHandler = () => {
    setVisibleAchievementSharingModal(!visibleAchievementSharingModal);
  };

  const dataAchievementSharingModalHandler = (data: IAchievementSharingModal) => {
    setDataAchievementSharingModal(data);
  };

  const visibleBadgeModalHandler = () => {
    setVisibleBadgeModal(!visibleBadgeModal);
  };

  const dataBadgeModalHandler = (data: IBadgeModal) => {
    setDataBadgeModal(data);
  };

  const visibleBadgeSharingModalHandler = () => {
    setVisibleBadgeSharingModal(!visibleBadgeSharingModal);
  };

  const dataBadgeSharingModalHandler = (data: IBadgeSharingModal) => {
    setDataBadgeSharingModal(data);
  };

  // ------------------------------------------ //
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
  // ------------------------------------------ //

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

    visibleHistoryPositionModal,
    visibleHistoryPositionModalHandler,
    dataHistoryPositionModal,
    dataHistoryPositionModalHandler,

    visiblePositionClosedModal,
    visiblePositionClosedModalHandler,
    dataPositionClosedModal,
    dataPositionClosedModalHandler,

    visiblePositionOpenModal,
    visiblePositionOpenModalHandler,
    dataPositionOpenModal,
    dataPositionOpenModalHandler,

    visiblePositionUpdatedModal,
    visiblePositionUpdatedModalHandler,
    dataPositionUpdatedModal,
    dataPositionUpdatedModalHandler,

    visibleMyAccountModal,
    visibleMyAccountModalHandler,

    visibleTideBitConnectingModal,
    visibleTideBitConnectingModalHandler,

    visibleEmailConnectingModal,
    visibleEmailConnectingModalHandler,

    visibleBravoModal,
    visibleBravoModalHandler,

    visibleProfileSettingModal,
    visibleProfileSettingModalHandler,

    visibleRecordSharingModal,
    visibleRecordSharingModalHandler,

    dataRecordSharingModal,
    dataRecordSharingModalHandler,

    visibleWarningModal,
    visibleWarningModalHandler,
    dataWarningModal,
    dataWarningModalHandler,

    visibleAnnouncementModal,
    visibleAnnouncementModalHandler,
    dataAnnouncementModal,
    dataAnnouncementModalHandler,

    visiblePersonalAchievementModal,
    visiblePersonalAchievementModalHandler,

    visibleAchievementSharingModal,
    visibleAchievementSharingModalHandler,
    dataAchievementSharingModal,
    dataAchievementSharingModalHandler,

    visibleBadgeModal,
    visibleBadgeModalHandler,
    dataBadgeModal,
    dataBadgeModalHandler,

    visibleBadgeSharingModal,
    visibleBadgeSharingModalHandler,
    dataBadgeSharingModal,
    dataBadgeSharingModalHandler,
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

      <WalletPanel
        panelVisible={visibleWalletPanel}
        panelClickHandler={visibleWalletPanelHandler}
      />
      <SignatureProcessModal
        processModalVisible={visibleSignatureProcessModal}
        processClickHandler={visibleSignatureProcessModalHandler}
      />
      <HelloModal
        helloModalVisible={visibleHelloModal}
        helloClickHandler={visibleHelloModalHandler}
      />

      <PositionDetailsModal
        modalVisible={visiblePositionDetailsModal}
        modalClickHandler={visiblePositionDetailsModalHandler}
        openCfdDetails={dataPositionDetailsModal}
      />
      <HistoryPositionModal
        modalVisible={visibleHistoryPositionModal}
        modalClickHandler={visibleHistoryPositionModalHandler}
        closedCfdDetails={dataHistoryPositionModal}
      />
      <PositionClosedModal
        modalVisible={visiblePositionClosedModal}
        modalClickHandler={visiblePositionClosedModalHandler}
        closedCfdDetails={dataPositionClosedModal}
      />
      {/* <PositionUpdatedModal
        modalVisible={visiblePositionUpdatedModal}
        modalClickHandler={visiblePositionUpdatedModalHandler}
        updatedCfdDetails={dataPositionUpdatedModal}
      />
      <PositionOpenModal
        modalVisible={visiblePositionOpenModal}
        modalClickHandler={visiblePositionOpenModalHandler}
        openCfdDetails={dataPositionOpenModal}
      /> */}

      {/* <PositionOpenModal />
      <PositionClosedModal />
      <PositionUpdatedModal /> */}

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

  // TODO: Debug tool [to be removed]
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

import React, {createContext, useState, useContext} from 'react';
import useWindowSize from '../lib/hooks/use_window_size';
import {DELAYED_HIDDEN_SECONDS, LAYOUT_BREAKPOINT} from '../constants/display';
import {toast as toastify} from 'react-toastify';
import UpdateFormModal from '../components/update_form_modal/update_form_modal';
import {MarketContext} from './market_context';
import Toast from '../components/toast/toast';
import LoadingModal from '../components/loading_modal/loading_modal';
import FailedModal from '../components/failed_modal/failed_modal';
import CanceledModal from '../components/canceled_modal/canceled_modal';
import SuccessfulModal from '../components/successful_modal/successful_modal';
import DepositModal from '../components/deposit_modal/deposit_modal';
import WithdrawalModal from '../components/withdrawal_modal/withdrawal_modal';
import DepositHistoryModal from '../components/deposit_history_modal/deposit_history_modal';
import WalletPanel from '../components/wallet_panel/wallet_panel';
import QrcodeModal from '../components/qrcode_modal/qrcode_modal';
import HelloModal from '../components/hello_modal/hello_modal';
import SignatureProcessModal from '../components/signature_process_modal/signature_process_modal';
import {UserContext} from './user_context';
import PositionOpenModal from '../components/position_open_modal/position_open_modal';
import PositionClosedModal from '../components/position_closed_modal/position_closed_modal';
import PositionUpdatedModal from '../components/position_updated_modal/position_updated_modal';
import HistoryPositionModal from '../components/history_position_modal/history_position_modal';
import WarningModal from '../components/warning_modal/warning_modal';
import {ProfitState} from '../constants/profit_state';
import {OrderType} from '../constants/order_type';
import {OrderStatusUnion} from '../constants/order_status_union';
import {TypeOfPosition} from '../constants/type_of_position';
import {ICryptocurrency} from '../interfaces/tidebit_defi_background/cryptocurrency';
import {getDeadline, getTimestamp, locker, wait} from '../lib/common';
import {
  IDisplayCFDOrder,
  getDummyDisplayCFDOrder,
} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCreateCFDOrder,
} from '../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {
  getDummyApplyCreateCFDOrder,
  IApplyCreateCFDOrder,
  // getDummyApplyCreateCFDOrderData,
} from '../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {OrderState} from '../constants/order_state';
import {IApplyUpdateCFDOrder} from '../interfaces/tidebit_defi_background/apply_update_cfd_order';
import useStateRef from 'react-usestateref';
import {QUOTATION_RENEWAL_INTERVAL_SECONDS} from '../constants/config';
import {CFDOperation} from '../constants/cfd_order_type';
import {
  getDummyAcceptedDepositOrder,
  IAcceptedDepositOrder,
} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
import {
  // IDisplayAcceptedDepositOrder,
  getDummyDisplayAcceptedDepositOrder,
} from '../interfaces/tidebit_defi_background/display_accepted_deposit_order';
import {
  IAcceptedWithdrawOrder,
  getDummyAcceptedWithdrawOrder,
} from '../interfaces/tidebit_defi_background/accepted_withdraw_order';
import WithdrawalHistoryModal from '../components/withdrawal_history_modal/withdrawal_history_modal';
import {ImInfo, ImWarning} from 'react-icons/im';
import {FaRegCheckCircle, FaRegTimesCircle} from 'react-icons/fa';
import SearchingModal from '../components/searching_modal/searching_modal';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../public/animation/lf30_editor_cnkxmhy3.json';
import {IToastType, ToastType} from '../constants/toast_type';
export interface IToastify {
  type: IToastType;
  message: string;
  toastId?: string | number; // Prevent duplicate toast
  autoClose?: number | false;
  isLoading?: boolean;
  typeText: string;
  modalReOpenData?: IProcessDataModal;
}
export interface IUpdatedCFDInputProps {
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStopLoss?: boolean;
}

export interface IDataPositionUpdatedModal {
  openCfdDetails: IDisplayCFDOrder;
  updatedProps: IApplyUpdateCFDOrder;
}

export interface IClosedCFDInfoProps {
  renewalDeadline: number;
  latestClosedPrice: number;
}

export interface IDataPositionClosedModal {
  openCfdDetails: IDisplayCFDOrder;
}

export interface IDataPositionOpenModal {
  openCfdRequest: IApplyCreateCFDOrder;
}

export const dummyDataPositionOpenModal: IDataPositionOpenModal = {
  openCfdRequest: getDummyApplyCreateCFDOrder('ETH'),
};

const acceptedCFDOrders: IDisplayCFDOrder[] = Array.from({length: 10}, () => {
  return getDummyDisplayCFDOrder('ETH');
});

const dummyOpenCFD = acceptedCFDOrders.filter(order => order.state === OrderState.OPENING)[0];

export const dummyDataPositionClosedModal: IDataPositionClosedModal = {
  openCfdDetails: acceptedCFDOrders[0],
};

export const dummyDataPositionUpdatedModal: IDataPositionUpdatedModal = {
  openCfdDetails: acceptedCFDOrders[0],
  updatedProps: {
    orderType: OrderType.CFD,
    operation: CFDOperation.UPDATE,
    referenceId: 'DUMMY_DATA_GLOBAL_CTX_20230314_1',
    takeProfit: 0,
    stopLoss: 0,
    guaranteedStop: false,
  },
};

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
  isShowZoomOutBtn?: boolean;
}

export interface IFailedModal {
  modalTitle: string;
  modalContent?: string;
  btnMsg?: string;
  btnUrl?: string;
  failedTitle?: string;
  failedMsg?: string;
}

// TODO:(20230317 - Shirley) to be continued
export interface IRecordSharingModal {
  orderIdRecordSharing: number;
}

export const dummyRecordSharingModal: IRecordSharingModal = {
  orderIdRecordSharing: 0,
};

/* Info (20230419 - Julian) 目前只有能帶路徑 (string) 的參數，如果需要處理 function 就要另外再加參數 */
export interface IWarningModal {
  title: string;
  content: string;
  numberOfButton: number;
  reactionOfButton: string;
  pathOfButton?: string;
}

export const dummyWarningModal: IWarningModal = {
  title: '',
  content: '',
  numberOfButton: 0,
  reactionOfButton: '',
  pathOfButton: '/',
};

// TODO:(20230317 - Shirley) to be continued
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

// TODO:(20230317 - Shirley) to be continued
export interface IAchievementSharingModal {
  userId: string;
  period: string;
}

export const dummyAchievementSharingModal: IAchievementSharingModal = {
  userId: '202302220001234',
  period: '002',
};

// TODO:(20230317 - Shirley) to be continued
export interface IBadgeModal {
  badgeId: string;
}

export const dummyBadgeModal: IBadgeModal = {
  badgeId: 'TBDFUTURES2023FEB05',
};

// TODO:(20230317 - Shirley) to be continued
export interface IBadgeSharingModal {
  badgeId: string;
}

export const dummyBadgeSharingModal: IBadgeSharingModal = {
  badgeId: 'TBDFUTURES2023FEB05',
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
  eliminateToasts: (id: string) => void;

  visibleUpdateFormModal: boolean;
  visibleUpdateFormModalHandler: () => void;
  dataUpdateFormModal: IDisplayCFDOrder | null;
  dataUpdateFormModalHandler: (data: IDisplayCFDOrder) => void;

  visibleDepositModal: boolean;
  visibleDepositModalHandler: () => void;

  visibleWithdrawalModal: boolean;
  visibleWithdrawalModalHandler: () => void;

  visibleDepositHistoryModal: boolean;
  visibleDepositHistoryModalHandler: () => void;
  dataDepositHistoryModal: IAcceptedDepositOrder | null;
  dataDepositHistoryModalHandler: (data: IAcceptedDepositOrder) => void;

  visibleWithdrawalHistoryModal: boolean;
  visibleWithdrawalHistoryModalHandler: () => void;
  dataWithdrawalHistoryModal: IAcceptedWithdrawOrder | null;
  dataWithdrawalHistoryModalHandler: (data: IAcceptedWithdrawOrder) => void;

  visibleLoadingModal: boolean;
  visibleLoadingModalHandler: () => void;
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
  dataHistoryPositionModal: IDisplayCFDOrder | null;
  dataHistoryPositionModalHandler: (data: IDisplayCFDOrder) => void;

  visiblePositionClosedModal: boolean;
  // TODO: (20230317 - Shirley) countdown // visiblePositionClosedModalRef: React.MutableRefObject<boolean>;
  visiblePositionClosedModalHandler: () => void;
  dataPositionClosedModal: IDisplayCFDOrder | null;
  dataPositionClosedModalHandler: (data: IDisplayCFDOrder) => void;

  visiblePositionOpenModal: boolean;
  visiblePositionOpenModalHandler: () => void;
  dataPositionOpenModal: IDataPositionOpenModal | null;
  dataPositionOpenModalHandler: (data: IDataPositionOpenModal) => void;

  visiblePositionUpdatedModal: boolean;
  visiblePositionUpdatedModalHandler: () => void;
  dataPositionUpdatedModal: IDataPositionUpdatedModal | null;
  dataPositionUpdatedModalHandler: (data: IDataPositionUpdatedModal) => void;

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

  visibleSearchingModal: boolean;
  visibleSearchingModalHandler: () => void;
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
  eliminateToasts: () => null,

  visibleUpdateFormModal: false,
  visibleUpdateFormModalHandler: () => null,
  dataUpdateFormModal: null,
  dataUpdateFormModalHandler: () => null,

  visibleDepositModal: false,
  visibleDepositModalHandler: () => null,

  visibleWithdrawalModal: false,
  visibleWithdrawalModalHandler: () => null,

  visibleDepositHistoryModal: false,
  visibleDepositHistoryModalHandler: () => null,
  dataDepositHistoryModal: null,
  dataDepositHistoryModalHandler: () => null,

  visibleWithdrawalHistoryModal: false,
  visibleWithdrawalHistoryModalHandler: () => null,
  dataWithdrawalHistoryModal: null,
  dataWithdrawalHistoryModalHandler: () => null,

  visibleLoadingModal: false,
  visibleLoadingModalHandler: () => null,
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
  // TODO: (20230317 - Shirley) countdown // visiblePositionClosedModalRef: React.createRef<boolean>(),
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

  visibleSearchingModal: false,
  visibleSearchingModalHandler: () => null,
});

const initialColorMode: ColorModeUnion = 'dark';

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  const [colorMode, setColorMode] = useState<ColorModeUnion>(initialColorMode);

  const [visibleUpdateFormModal, setVisibleUpdateFormModal] = useState(false);
  // TODO: (20230316 - Shirley) replace dummy data with standard example data
  const [dataUpdateFormModal, setDataUpdateFormModal] = useState<IDisplayCFDOrder>(dummyOpenCFD);

  const [visibleWithdrawalModal, setVisibleWithdrawalModal] = useState(false);

  const [visibleDepositModal, setVisibleDepositModal] = useState(false);

  const [visibleDepositHistoryModal, setVisibleDepositHistoryModal] = useState(false);
  const [dataDepositHistoryModal, setDataDepositHistoryModal] = useState<IAcceptedDepositOrder>(
    getDummyAcceptedDepositOrder('USDT')
  );

  const [visibleWithdrawalHistoryModal, setVisibleWithdrawalHistoryModal] = useState(false);
  const [dataWithdrawalHistoryModal, setDataWithdrawalHistoryModal] =
    useState<IAcceptedWithdrawOrder>(getDummyAcceptedWithdrawOrder());

  const [visibleLoadingModal, setVisibleLoadingModal] = useState(false);
  const [dataLoadingModal, setDataLoadingModal] = useState<IProcessDataModal>({
    modalTitle: '',
    modalContent: '',
    isShowZoomOutBtn: false,
  });

  const [visibleFailedModal, setVisibleFailedModal] = useState(false);
  const [dataFailedModal, setDataFailedModal] = useState<IFailedModal>({
    modalTitle: '',
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
  const [dataHistoryPositionModal, setDataHistoryPositionModal] = useState<IDisplayCFDOrder>(
    getDummyDisplayCFDOrder('BTC')
  );

  const [visiblePositionClosedModal, setVisiblePositionClosedModal, visiblePositionClosedModalRef] =
    useStateRef<boolean>(false);
  const [dataPositionClosedModal, setDataPositionClosedModal] =
    useState<IDisplayCFDOrder>(dummyOpenCFD);

  const [visiblePositionOpenModal, setVisiblePositionOpenModal] = useState(false);
  const [dataPositionOpenModal, setDataPositionOpenModal] = useState<IDataPositionOpenModal>(
    dummyDataPositionOpenModal
  );

  const [visiblePositionUpdatedModal, setVisiblePositionUpdatedModal] = useState(false);
  const [dataPositionUpdatedModal, setDataPositionUpdatedModal] =
    useState<IDataPositionUpdatedModal>(dummyDataPositionUpdatedModal);

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

  const [visibleSearchingModal, setVisibleSearchingModal] = useState(false);

  // TODO: (20230316 - Shirley) To get the withdrawal / deposit result
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

  const toastHandler = ({
    type,
    message,
    toastId,
    autoClose,
    isLoading,
    typeText,
    modalReOpenData,
  }: IToastify) => {
    const toastBodyStyle =
      'text-lightWhite text-sm lg:whitespace-nowrap px-4 before:block before:absolute before:-left-1 before:w-2 before:h-50px';

    const isToastId = toastId ?? type + message;

    const isLoadingMessage = isLoading ? (
      <div className="inline-flex">
        {message}
        <Lottie className="ml-2 w-20px" animationData={smallConnectingAnimation} />
      </div>
    ) : (
      <>{message}</>
    );

    const modalReOpenHandler = modalReOpenData
      ? () => {
          setDataLoadingModal(modalReOpenData),
            setVisibleLoadingModal(true),
            toastify.dismiss(isToastId);
        }
      : () => {
          toastify.dismiss(isToastId);
        };

    switch (type) {
      case ToastType.ERROR:
        toastify.error(isLoadingMessage, {
          toastId: isToastId,
          icon: (
            <div className="-ml-12 inline-flex items-center justify-center text-lightRed">
              <FaRegTimesCircle className="h-15px w-15px" />
              <span className="ml-2">{typeText}</span>
            </div>
          ),
          bodyClassName: `${toastBodyStyle} before:bg-lightRed`,
          autoClose: autoClose ?? 3000,
          closeOnClick: modalReOpenData ? false : true,
          onClick: modalReOpenHandler,
        });
        break;
      case ToastType.WARNING:
        toastify.warning(isLoadingMessage, {
          toastId: isToastId,
          icon: (
            <div className="-ml-12 inline-flex items-center justify-center text-lightYellow2">
              <ImWarning className="h-15px w-15px " />
              <span className="ml-2">{typeText}</span>
            </div>
          ),
          bodyClassName: `${toastBodyStyle} before:bg-lightYellow2`,
          autoClose: autoClose ?? 3000,
          closeOnClick: modalReOpenData ? false : true,
          onClick: modalReOpenHandler,
        });
        break;
      case ToastType.INFO:
        toastify.info(isLoadingMessage, {
          toastId: isToastId,
          icon: (
            <div className="-ml-12 inline-flex items-center justify-center text-tidebitTheme">
              <ImInfo className="h-15px w-15px" />
              <span className="ml-2">{typeText}</span>
            </div>
          ),
          bodyClassName: `${toastBodyStyle} before:bg-tidebitTheme`,
          autoClose: autoClose ?? 3000,
          closeOnClick: modalReOpenData ? false : true,
          onClick: modalReOpenHandler,
        });
        break;
      case ToastType.SUCCESS:
        toastify.success(isLoadingMessage, {
          toastId: isToastId,
          icon: (
            <div className="-ml-12 inline-flex items-center justify-center text-lightGreen5">
              <FaRegCheckCircle className="h-15px w-15px" />
              <span className="ml-2">{typeText}</span>
            </div>
          ),
          bodyClassName: `${toastBodyStyle} before:bg-lightGreen5`,
          autoClose: autoClose ?? 3000,
          closeOnClick: modalReOpenData ? false : true,
          onClick: modalReOpenHandler,
        });
        break;
      default:
        return;
    }
  };

  const toast = ({
    type,
    message,
    toastId,
    autoClose,
    isLoading,
    typeText,
    modalReOpenData,
  }: IToastify) => {
    toastHandler({
      type: type,
      message: message,
      toastId: toastId,
      autoClose: autoClose,
      isLoading: isLoading,
      typeText: typeText,
      modalReOpenData: modalReOpenData,
    });
  };

  const eliminateAllModals = () => {
    setVisibleDepositModal(false);
    setVisibleWithdrawalModal(false);

    setVisibleDepositHistoryModal(false);

    setVisibleLoadingModal(false);
    setVisibleFailedModal(false);
    setVisibleCanceledModal(false);
    setVisibleSuccessfulModal(false);

    setVisibleWalletPanel(false);
    setVisibleHelloModal(false);
    setVisibleSignatureProcessModal(false);

    setVisibleUpdateFormModal(false);
    setVisibleHistoryPositionModal(false);

    setVisiblePositionClosedModal(false);

    setVisibleSearchingModal(false);
  };

  const eliminateToasts = (id: string) => {
    /* Info: (20230426 - Julian) remove toasts by toastId, or 'all' for remove all  */
    if (id === 'all') {
      toastify?.dismiss();
    } else {
      toastify?.dismiss(id);
    }
  };

  const visibleUpdateFormModalHandler = () => {
    setVisibleUpdateFormModal(!visibleUpdateFormModal);
  };
  const dataUpdateFormModalHandler = (data: IDisplayCFDOrder) => {
    setDataUpdateFormModal(data);
  };

  const visibleDepositModalHandler = () => {
    setVisibleDepositModal(!visibleDepositModal);
  };

  const visibleWithdrawalModalHandler = () => {
    setVisibleWithdrawalModal(!visibleWithdrawalModal);
  };

  const visibleDepositHistoryModalHandler = () => {
    setVisibleDepositHistoryModal(!visibleDepositHistoryModal);
  };

  const dataDepositHistoryModalHandler = (data: IAcceptedDepositOrder) => {
    setDataDepositHistoryModal(data);
  };

  const visibleWithdrawalHistoryModalHandler = () => {
    setVisibleWithdrawalHistoryModal(!visibleWithdrawalHistoryModal);
  };

  const dataWithdrawalHistoryModalHandler = (data: IAcceptedWithdrawOrder) => {
    setDataWithdrawalHistoryModal(data);
  };
  /* Till: (20230503 - Julian) */
  // const zoomOutLoadingModal = () => {
  //   visibleLoadingModalHandler();

  //   if (visibleLoadingModal) {
  //     toast({
  //       type: ToastType.INFO,
  //       message:
  //         '[TODO] Pending toast which cannot be closed manually and automatically unless the process is finished',
  //       toastId: 'loadingModalClosed',
  //       autoClose: false,
  //       typeText: 'Pending',
  //     });
  //   }
  // };

  const visibleLoadingModalHandler = () => {
    // TODO: (20230317 - Shirley) loading toast
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

  const dataHistoryPositionModalHandler = (data: IDisplayCFDOrder) => {
    setDataHistoryPositionModal(data);
  };

  const visiblePositionClosedModalHandler = () => {
    setVisiblePositionClosedModal(!visiblePositionClosedModal);
  };

  const dataPositionClosedModalHandler = (data: IDisplayCFDOrder) => {
    setDataPositionClosedModal(data);
  };

  const visiblePositionOpenModalHandler = () => {
    setVisiblePositionOpenModal(!visiblePositionOpenModal);
  };

  const dataPositionOpenModalHandler = (data: IDataPositionOpenModal) => {
    setDataPositionOpenModal(data);
  };

  const visiblePositionUpdatedModalHandler = () => {
    setVisiblePositionUpdatedModal(!visiblePositionUpdatedModal);
  };

  const dataPositionUpdatedModalHandler = (data: IDataPositionUpdatedModal) => {
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

  const depositSubmitHandler = (props: {asset: ICryptocurrency; amount: number}) => {
    // INFO: Set the process in modal component. `eliminateAllModals` won't work here (20230413 - Shirley)
    /* Deprecated: (20230413 - Shirley)
    // userCtx
    //   .deposit({
    //     orderType: OrderType.DEPOSIT,
    //     createTimestamp: getTimestamp(),
    //     targetAsset: props.asset.symbol,
    //     decimals: props.asset.decimals,
    //     to: props.asset.contract,
    //     targetAmount: props.amount,
    //     remark: '',
    //     fee: 0,
    //   })
    //   .then(result => {
    //     // Deprecate: after Julian confirm result format (20230329 - tzuhan)
    //     // eslint-disable-next-line no-console
    //     console.log(`userCtx.deposit result:`, result);
    //     setDepositProcess('success');
    //   });
    */
  };

  const withdrawSubmitHandler = async (props: {asset: ICryptocurrency; amount: number}) => {
    /*
    // INFO: Set the process in modal component. `eliminateAllModals` won't work here (20230317 - Shirley)
    // setWithdrawProcess('loading');
    */
    /* Deprecated: (20230413 - Shirley)
    // userCtx
    //   .withdraw({
    //     orderType: OrderType.WITHDRAW,
    //     createTimestamp: getTimestamp(),
    //     targetAsset: props.asset.symbol,
    //     to: props.asset.contract,
    //     targetAmount: props.amount,
    //     remark: '',
    //     fee: 0,
    //   })
    //   .then(result => {
    //     // Deprecate: after Julian confirm result format (20230329 - tzuhan)
    //     // eslint-disable-next-line no-console
    //     console.log(`userCtx.deposit result:`, result);
    //     setDepositProcess('success');
    //   });
    */
  };

  const visibleSearchingModalHandler = () => {
    setVisibleSearchingModal(!visibleSearchingModal);
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
    eliminateToasts,

    visibleUpdateFormModal,
    visibleUpdateFormModalHandler,
    dataUpdateFormModal,
    dataUpdateFormModalHandler,

    visibleDepositModal,
    visibleDepositModalHandler,

    visibleWithdrawalModal,
    visibleWithdrawalModalHandler,

    visibleDepositHistoryModal,
    visibleDepositHistoryModalHandler,
    dataDepositHistoryModal,
    dataDepositHistoryModalHandler,

    visibleWithdrawalHistoryModal,
    visibleWithdrawalHistoryModalHandler,
    dataWithdrawalHistoryModal,
    dataWithdrawalHistoryModalHandler,

    visibleLoadingModal,
    visibleLoadingModalHandler,
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
    visiblePositionClosedModalRef,
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

    visibleSearchingModal,
    visibleSearchingModalHandler,
  };
  return (
    <GlobalContext.Provider value={defaultValue}>
      <LoadingModal
        modalVisible={visibleLoadingModal}
        modalClickHandler={visibleLoadingModalHandler}
        modalTitle={dataLoadingModal.modalTitle}
        modalContent={dataLoadingModal.modalContent}
        btnMsg={dataLoadingModal?.btnMsg}
        btnUrl={dataLoadingModal?.btnUrl}
        isShowZoomOutBtn={dataLoadingModal?.isShowZoomOutBtn}
      />
      <FailedModal
        modalTitle={dataFailedModal.modalTitle}
        modalContent={dataFailedModal.modalContent}
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

      <DepositHistoryModal
        modalVisible={visibleDepositHistoryModal}
        modalClickHandler={visibleDepositHistoryModalHandler}
        getDepositHistoryData={dataDepositHistoryModal}
      />
      <WithdrawalHistoryModal
        modalVisible={visibleWithdrawalHistoryModal}
        modalClickHandler={visibleWithdrawalHistoryModalHandler}
        getWithdrawalHistoryData={dataWithdrawalHistoryModal}
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

      <UpdateFormModal
        modalVisible={visibleUpdateFormModal}
        modalClickHandler={visibleUpdateFormModalHandler}
        openCfdDetails={dataUpdateFormModal}
      />
      <HistoryPositionModal
        modalVisible={visibleHistoryPositionModal}
        modalClickHandler={visibleHistoryPositionModalHandler}
        closedCfdDetails={dataHistoryPositionModal}
      />
      <PositionOpenModal
        modalVisible={visiblePositionOpenModal}
        modalClickHandler={visiblePositionOpenModalHandler}
        openCfdRequest={dataPositionOpenModal.openCfdRequest}
      />
      <PositionClosedModal
        modalVisible={visiblePositionClosedModal}
        modalClickHandler={visiblePositionClosedModalHandler}
        openCfdDetails={dataPositionClosedModal}
      />
      <PositionUpdatedModal
        modalVisible={visiblePositionUpdatedModal}
        modalClickHandler={visiblePositionUpdatedModalHandler}
        openCfdDetails={dataPositionUpdatedModal.openCfdDetails}
        updatedProps={dataPositionUpdatedModal.updatedProps}
      />
      <WarningModal
        modalVisible={visibleWarningModal}
        modalClickHandler={visibleWarningModalHandler}
        getWarningData={dataWarningModal}
      />
      <SearchingModal
        modalVisible={visibleSearchingModal}
        modalClickHandler={visibleSearchingModalHandler}
      />

      {/* Info: One toast container avoids duplicate toast overlaying */}
      <Toast />
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  // Info: If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.

  // Deprecated: Debug tool [to be removed](20230317 - Shirley)
  const g: any =
    typeof globalThis === 'object'
      ? globalThis
      : typeof window === 'object'
      ? window
      : typeof global === 'object'
      ? global
      : null; // Info: Causes an error on the next line

  g.globalContext = context;

  return context;
};

import React, {createContext, useState, useContext, useMemo, useCallback, useEffect} from 'react';
import useWindowSize from '../lib/hooks/use_window_size';
import {LAYOUT_BREAKPOINT, TOAST_DURATION_SECONDS} from '../constants/display';
import {toast as toastify} from 'react-toastify';
import UpdateFormModal from '../components/update_form_modal/update_form_modal';
import Toast from '../components/toast/toast';
import LoadingModal from '../components/loading_modal/loading_modal';
import FailedModal from '../components/failed_modal/failed_modal';
import CanceledModal from '../components/canceled_modal/canceled_modal';
import SuccessfulModal from '../components/successful_modal/successful_modal';
import DepositModal from '../components/deposit_modal/deposit_modal';
import WithdrawalModal from '../components/withdrawal_modal/withdrawal_modal';
import DepositHistoryModal from '../components/deposit_history_modal/deposit_history_modal';
import WalletPanel from '../components/wallet_panel/wallet_panel';
import HelloModal from '../components/hello_modal/hello_modal';
import SignatureProcessModal from '../components/signature_process_modal/signature_process_modal';
import PositionOpenModal from '../components/position_open_modal/position_open_modal';
import PositionClosedModal from '../components/position_closed_modal/position_closed_modal';
import PositionUpdatedModal from '../components/position_updated_modal/position_updated_modal';
import HistoryPositionModal from '../components/history_position_modal/history_position_modal';
import WarningModal from '../components/warning_modal/warning_modal';
import {OrderType} from '../constants/order_type';
import {
  IDisplayCFDOrder,
  getDummyDisplayCFDOrder,
} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  getDummyApplyCreateCFDOrder,
  IApplyCreateCFDOrder,
} from '../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {OrderState} from '../constants/order_state';
import {IApplyUpdateCFDOrder} from '../interfaces/tidebit_defi_background/apply_update_cfd_order';
import useStateRef from 'react-usestateref';
import {CFDOperation} from '../constants/cfd_order_type';
import {
  getDummyAcceptedDepositOrder,
  IAcceptedDepositOrder,
} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
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
import {Code, Reason} from '../constants/code';
import PersonalAchievementModal from '../components/personal_achievement_modal/personal_achievement_modal';
import BadgeModal from '../components/badge_modal/badge_modal';
import {IBadge} from '../interfaces/tidebit_defi_background/badge';
import AnnouncementModal from '../components/announcement_modal/announcement_modal';
import {MessageType, IMessageType} from '../constants/message_type';
import {ILayoutAssertion, LayoutAssertion} from '../constants/layout_assertion';
import Alert from '../components/alert/alert';
import {AlertState, IAlertData} from '../interfaces/alert';
import {NotificationContext} from './notification_context';
import {TideBitEvent} from '../constants/tidebit_event';
import {TranslateFunction} from '../interfaces/tidebit_defi_background/locale';
import {useTranslation} from 'next-i18next';
import {IException} from '../constants/exception';

export interface IToastify {
  type: IToastType;
  message: string;
  toastId?: string | number; // Prevent duplicate toast
  autoClose: number | false;
  isLoading: boolean;
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
  btnFunction?: () => void;
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

export interface IAnnouncementModal {
  id: string;
  title: string;
  content: string;
  numberOfButton: number;
  reactionOfButton: string;
  messageType: IMessageType;
}

export const dummyAnnouncementModal: IAnnouncementModal = {
  id: '',
  title: '',
  content: '',
  numberOfButton: 0,
  reactionOfButton: '',
  messageType: MessageType.ANNOUNCEMENT,
};

export const dummyAlertData: IAlertData = {
  type: AlertState.ERROR,
  message:
    'Hic sunt ea eos et. Iste vel et fuga. Unde aliquam omnis et temporibus voluptatum itaque.',
};

export interface IBadgeModal {
  badgeData: IBadge;
}

export const dummyBadgeModal: IBadgeModal = {
  badgeData: {
    badgeId: 'TBDBADGEDAILY20_2023FEB05',
    badgeName: 'DAILY TOP 20',
    userId: '202302220001234',
    receiveTime: 1614556800,
  },
};

export interface IGlobalProvider {
  children: React.ReactNode;
}

export type ColorModeUnion = 'light' | 'dark';

export interface IGlobalContext {
  width: number;
  height: number;
  layoutAssertion: ILayoutAssertion;
  initialColorMode: ColorModeUnion;
  colorMode: ColorModeUnion;
  toggleColorMode: () => void;
  toast: (props: IToastify) => void;

  eliminateAllModals: () => void;
  eliminateToasts: (id: string) => void;
  eliminateAllProcessModals: () => void;

  displayedToast: (id: string) => boolean;

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
  dataPersonalAchievementModal: string | null;
  dataPersonalAchievementModalHandler: (userId: string) => void;

  visibleBadgeModal: boolean;
  visibleBadgeModalHandler: () => void;
  dataBadgeModal: IBadgeModal | null;
  dataBadgeModalHandler: (data: IBadgeModal) => void;

  visibleSearchingModal: boolean;
  visibleSearchingModalHandler: () => void;

  visibleAlert: boolean;
  visibleAlertHandler: () => void;
  dataAlert: IAlertData | null;
  dataAlertHandler: (data: IAlertData) => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  width: 0,
  height: 0,
  layoutAssertion: '' as ILayoutAssertion,
  initialColorMode: '' as ColorModeUnion,
  colorMode: '' as ColorModeUnion,
  toggleColorMode: () => null,
  toast: () => null,

  eliminateAllModals: () => null,
  eliminateToasts: () => null,
  eliminateAllProcessModals: () => null,

  displayedToast: () => false,

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
  dataPersonalAchievementModal: null,
  dataPersonalAchievementModalHandler: () => null,

  visibleBadgeModal: false,
  visibleBadgeModalHandler: () => null,
  dataBadgeModal: null,
  dataBadgeModalHandler: () => null,

  visibleSearchingModal: false,
  visibleSearchingModalHandler: () => null,

  visibleAlert: false,
  visibleAlertHandler: () => null,
  dataAlert: null,
  dataAlertHandler: () => null,
});

const initialColorMode: ColorModeUnion = 'dark';

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const notificationCtx = useContext(NotificationContext);
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

  const [visibleHistoryPositionModal, setVisibleHistoryPositionModal] = useState(false);
  const [dataHistoryPositionModal, setDataHistoryPositionModal] = useState<IDisplayCFDOrder>(
    getDummyDisplayCFDOrder('BTC')
  );

  const [visiblePositionClosedModal, setVisiblePositionClosedModal, visiblePositionClosedModalRef] =
    useStateRef<boolean>(false);
  const [dataPositionClosedModal, setDataPositionClosedModal, dataPositionClosedModalRef] =
    useStateRef<IDisplayCFDOrder>(dummyOpenCFD);

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
  const [dataPersonalAchievementModal, setDataPersonalAchievementModal] = useState<string>('');

  const [visibleBadgeModal, setVisibleBadgeModal] = useState(false);
  const [dataBadgeModal, setDataBadgeModal] = useState<IBadgeModal>(dummyBadgeModal);

  const [visibleSearchingModal, setVisibleSearchingModal] = useState(false);

  const [visibleAlert, setVisibleAlert] = useState(false);
  const [dataAlert, setDataAlert] = useState<IAlertData>(dummyAlertData);

  // Deprecated:  (20231120 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [withdrawData, setWithdrawData] = useState<{asset: string; amount: number}>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [depositData, setDepositData] = useState<{asset: string; amount: number}>();

  const windowSize = useWindowSize();
  const {width, height} = windowSize;

  const layoutAssertion = useMemo(() => {
    return width < LAYOUT_BREAKPOINT ? LayoutAssertion.MOBILE : LayoutAssertion.DESKTOP;
  }, [width]);

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  }, []);

  const toast = useCallback(
    ({type, message, toastId, autoClose, isLoading, typeText, modalReOpenData}: IToastify) => {
      const toastBodyStyle =
        'text-lightWhite text-sm lg:whitespace-nowrap px-4 before:block before:absolute before:-left-1 before:w-2 before:h-50px';

      const isToastId = toastId ? toastId : type + message;

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
          try {
            toastify.error(isLoadingMessage, {
              toastId: isToastId,
              icon: (
                <div className="-ml-12 inline-flex items-center justify-center text-lightRed">
                  <FaRegTimesCircle className="h-15px w-15px" />
                  <span className="ml-2">{typeText}</span>
                </div>
              ),
              bodyClassName: `${toastBodyStyle} before:bg-lightRed`,
              autoClose: autoClose ?? TOAST_DURATION_SECONDS,
              closeOnClick: modalReOpenData ? false : true,
              onClick: modalReOpenHandler,
              delay: 150,
            });
            break;
          } catch (error) {
            /* Info: (20230510 - Julian) if toastify error */
            dataFailedModalHandler({
              modalTitle: 'Toastify Error',
              failedTitle: 'Toastify Error',
              failedMsg: `${Reason[Code.THIRD_PARTY_LIBRARY_ERROR]} (${
                Code.THIRD_PARTY_LIBRARY_ERROR
              })`,
              btnMsg: 'OK',
            });
            visibleFailedModalHandler();
          }
        case ToastType.WARNING:
          try {
            toastify.warning(isLoadingMessage, {
              toastId: isToastId,
              icon: (
                <div className="-ml-12 inline-flex items-center justify-center text-lightYellow2">
                  <ImWarning className="h-15px w-15px " />
                  <span className="ml-2">{typeText}</span>
                </div>
              ),
              bodyClassName: `${toastBodyStyle} before:bg-lightYellow2`,
              autoClose: autoClose ?? TOAST_DURATION_SECONDS,
              closeOnClick: modalReOpenData ? false : true,
              onClick: modalReOpenHandler,
              delay: 150,
            });
            break;
          } catch (error) {
            /* Info: (20230510 - Julian) if toastify error */
            dataFailedModalHandler({
              modalTitle: 'Toastify Error',
              failedTitle: 'Toastify Error',
              failedMsg: `${Reason[Code.THIRD_PARTY_LIBRARY_ERROR]} (${
                Code.THIRD_PARTY_LIBRARY_ERROR
              })`,
              btnMsg: 'OK',
            });
            visibleFailedModalHandler();
          }
        case ToastType.INFO:
          try {
            toastify.info(isLoadingMessage, {
              toastId: isToastId,
              icon: (
                <div className="-ml-12 inline-flex items-center justify-center text-tidebitTheme">
                  <ImInfo className="h-15px w-15px" />
                  <span className="ml-2">{typeText}</span>
                </div>
              ),
              bodyClassName: `${toastBodyStyle} before:bg-tidebitTheme`,
              autoClose: autoClose ?? TOAST_DURATION_SECONDS,
              closeOnClick: modalReOpenData ? false : true,
              onClick: modalReOpenHandler,
              delay: 150,
            });
            break;
          } catch (error) {
            /* Info: (20230510 - Julian) if toastify error */
            dataFailedModalHandler({
              modalTitle: 'Toastify Error',
              failedTitle: 'Toastify Error',
              failedMsg: `${Reason[Code.THIRD_PARTY_LIBRARY_ERROR]} (${
                Code.THIRD_PARTY_LIBRARY_ERROR
              })`,
              btnMsg: 'OK',
            });
            visibleFailedModalHandler();
          }
        case ToastType.SUCCESS:
          try {
            toastify.success(isLoadingMessage, {
              toastId: isToastId,
              icon: (
                <div className="-ml-12 inline-flex items-center justify-center text-lightGreen5">
                  <FaRegCheckCircle className="h-15px w-15px" />
                  <span className="ml-2">{typeText}</span>
                </div>
              ),
              bodyClassName: `${toastBodyStyle} before:bg-lightGreen5`,
              autoClose: autoClose ?? TOAST_DURATION_SECONDS,
              closeOnClick: modalReOpenData ? false : true,
              onClick: modalReOpenHandler,
              delay: 150,
            });
            break;
          } catch (error) {
            /* Info: (20230510 - Julian) if toastify error */
            dataFailedModalHandler({
              modalTitle: 'Error',
              failedTitle: 'Toastify Error',
              failedMsg: `${Reason[Code.THIRD_PARTY_LIBRARY_ERROR]} (${
                Code.THIRD_PARTY_LIBRARY_ERROR
              })`,
              btnMsg: 'OK',
            });
            visibleFailedModalHandler();
          }
        default:
          return;
      }
    },
    []
  );

  const eliminateAllProcessModals = useCallback(() => {
    setVisibleLoadingModal(false);
    setVisibleFailedModal(false);
    setVisibleCanceledModal(false);
    setVisibleSuccessfulModal(false);
  }, []);

  const eliminateAllModals = useCallback(() => {
    setVisibleDepositModal(false);
    setVisibleWithdrawalModal(false);

    setVisibleDepositHistoryModal(false);

    eliminateAllProcessModals();

    setVisibleWalletPanel(false);
    setVisibleHelloModal(false);
    setVisibleSignatureProcessModal(false);

    setVisibleUpdateFormModal(false);
    setVisibleHistoryPositionModal(false);

    setVisiblePositionClosedModal(false);

    setVisibleSearchingModal(false);
  }, []);

  const eliminateToasts = useCallback((id: string) => {
    /* Info: (20230426 - Julian) remove toasts by toastId, or 'all' for remove all  */
    if (id === 'all') {
      toastify.dismiss();
    } else {
      toastify.dismiss(id);
    }
  }, []);

  const displayedToast = useCallback((id: string) => {
    return toastify?.isActive(id);
  }, []);

  const visibleUpdateFormModalHandler = useCallback(() => {
    setVisibleUpdateFormModal(prev => !prev);
  }, []);

  const dataUpdateFormModalHandler = useCallback((data: IDisplayCFDOrder) => {
    setDataUpdateFormModal(data);
  }, []);

  const visibleDepositModalHandler = useCallback(() => {
    setVisibleDepositModal(prev => !prev);
  }, []);

  const visibleWithdrawalModalHandler = useCallback(() => {
    setVisibleWithdrawalModal(prev => !prev);
  }, []);

  const visibleDepositHistoryModalHandler = useCallback(() => {
    setVisibleDepositHistoryModal(prev => !prev);
  }, []);

  const dataDepositHistoryModalHandler = useCallback((data: IAcceptedDepositOrder) => {
    setDataDepositHistoryModal(data);
  }, []);

  const visibleWithdrawalHistoryModalHandler = useCallback(() => {
    setVisibleWithdrawalHistoryModal(prev => !prev);
  }, []);

  const dataWithdrawalHistoryModalHandler = useCallback((data: IAcceptedWithdrawOrder) => {
    setDataWithdrawalHistoryModal(data);
  }, []);

  const visibleLoadingModalHandler = useCallback(() => {
    setVisibleLoadingModal(prev => !prev);
  }, []);

  const dataLoadingModalHandler = useCallback((data: IProcessDataModal) => {
    setDataLoadingModal(data);
  }, []);

  const visibleFailedModalHandler = useCallback(() => {
    setVisibleFailedModal(prev => !prev);
  }, []);

  const dataFailedModalHandler = useCallback((data: IFailedModal) => {
    setDataFailedModal(data);
  }, []);

  const visibleSuccessfulModalHandler = useCallback(() => {
    setVisibleSuccessfulModal(prev => !prev);
  }, []);

  const dataSuccessfulModalHandler = useCallback((data: ISuccessfulModal) => {
    setDataSuccessfulModal(data);
  }, []);

  const visibleCanceledModalHandler = useCallback(() => {
    setVisibleCanceledModal(prev => !prev);
  }, []);

  const dataCanceledModalHandler = useCallback((data: IProcessDataModal) => {
    setDataCanceledModal(data);
  }, []);

  const visibleWalletPanelHandler = useCallback(() => {
    setVisibleWalletPanel(prev => !prev);
  }, []);

  const visibleSignatureProcessModalHandler = useCallback(() => {
    setVisibleSignatureProcessModal(prev => !prev);
  }, []);

  const visibleHelloModalHandler = useCallback(() => {
    setVisibleHelloModal(prev => !prev);
  }, []);

  const visibleHistoryPositionModalHandler = useCallback(() => {
    setVisibleHistoryPositionModal(prev => !prev);
  }, []);

  const dataHistoryPositionModalHandler = useCallback((data: IDisplayCFDOrder) => {
    setDataHistoryPositionModal(data);
  }, []);

  const visiblePositionClosedModalHandler = useCallback(() => {
    setVisiblePositionClosedModal(prev => !prev);
  }, []);

  const dataPositionClosedModalHandler = useCallback((data: IDisplayCFDOrder) => {
    setDataPositionClosedModal(data);
  }, []);

  const visiblePositionOpenModalHandler = useCallback(() => {
    setVisiblePositionOpenModal(prev => !prev);
  }, []);

  const dataPositionOpenModalHandler = useCallback((data: IDataPositionOpenModal) => {
    setDataPositionOpenModal(data);
  }, []);

  const visiblePositionUpdatedModalHandler = useCallback(() => {
    setVisiblePositionUpdatedModal(prev => !prev);
  }, []);

  const dataPositionUpdatedModalHandler = useCallback((data: IDataPositionUpdatedModal) => {
    setDataPositionUpdatedModal(data);
  }, []);

  const visibleMyAccountModalHandler = useCallback(() => {
    setVisibleMyAccountModal(prev => !prev);
  }, []);

  const visibleTideBitConnectingModalHandler = useCallback(() => {
    setVisibleTideBitConnectingModal(prev => !prev);
  }, []);

  const visibleEmailConnectingModalHandler = useCallback(() => {
    setVisibleEmailConnectingModal(prev => !prev);
  }, []);

  const visibleBravoModalHandler = useCallback(() => {
    setVisibleBravoModal(prev => !prev);
  }, []);

  const visibleProfileSettingModalHandler = useCallback(() => {
    setVisibleProfileSettingModal(prev => !prev);
  }, []);

  const visibleRecordSharingModalHandler = useCallback(() => {
    setVisibleRecordSharingModal(prev => !prev);
  }, []);

  const dataRecordSharingModalHandler = useCallback((data: IRecordSharingModal) => {
    setDataRecordSharingModal(data);
  }, []);

  const visibleWarningModalHandler = useCallback(() => {
    setVisibleWarningModal(prev => !prev);
  }, []);

  const dataWarningModalHandler = useCallback((data: IWarningModal) => {
    setDataWarningModal(data);
  }, []);

  const visibleAnnouncementModalHandler = useCallback(() => {
    setVisibleAnnouncementModal(prev => !prev);
  }, []);

  const dataAnnouncementModalHandler = useCallback((data: IAnnouncementModal) => {
    setDataAnnouncementModal(data);
  }, []);

  const visiblePersonalAchievementModalHandler = useCallback(() => {
    setVisiblePersonalAchievementModal(prev => !prev);
  }, []);

  const dataPersonalAchievementModalHandler = useCallback((userId: string) => {
    setDataPersonalAchievementModal(userId);
  }, []);

  const visibleBadgeModalHandler = useCallback(() => {
    setVisibleBadgeModal(prev => !prev);
  }, []);

  const dataBadgeModalHandler = useCallback((data: IBadgeModal) => {
    setDataBadgeModal(data);
  }, []);

  const getDepositData = useCallback((props: {asset: string; amount: number}) => {
    setDepositData(props);
  }, []);

  const getWithdrawData = useCallback((props: {asset: string; amount: number}) => {
    setWithdrawData(props);
  }, []);

  const visibleSearchingModalHandler = useCallback(() => {
    setVisibleSearchingModal(prev => !prev);
  }, []);

  const visibleAlertHandler = useCallback(() => {
    setVisibleAlert(prev => !prev);
  }, []);

  const dataAlertHandler = useCallback((data: IAlertData) => {
    setDataAlert(data);
  }, []);

  useEffect(() => {
    const handleExceptionThrown = () => {
      const severest = notificationCtx.getSeverestException();

      if (!severest || severest.length < 1) return;
      const severity = severest[0].level <= 1 ? AlertState.ERROR : AlertState.WARNING;
      const start =
        severity === AlertState.ERROR
          ? 'ERROR_MESSAGE.ERROR_ALERT_TITLE'
          : 'ERROR_MESSAGE.WARNING_ALERT_TITLE';

      dataAlertHandler({
        type: severity,
        message: `${t(start)}: ${t(severest[0].item.reason)} （${severest[0].item.code}） (${
          severest[0].level
        })`,
      });
      setVisibleAlert(true);
    };

    const handleExceptionCleared = () => {
      setVisibleAlert(false);
    };

    notificationCtx.emitter.on(TideBitEvent.EXCEPTION_UPDATE, handleExceptionThrown);
    notificationCtx.emitter.on(TideBitEvent.EXCEPTION_CLEARED, handleExceptionCleared);

    return () => {
      notificationCtx.emitter.off(TideBitEvent.EXCEPTION_UPDATE, handleExceptionThrown);
      notificationCtx.emitter.off(TideBitEvent.EXCEPTION_CLEARED, handleExceptionCleared);
    };
  }, []);

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
    eliminateAllProcessModals,

    displayedToast,

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
    dataPositionClosedModal: dataPositionClosedModalRef.current,
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
    dataPersonalAchievementModal,
    dataPersonalAchievementModalHandler,

    visibleBadgeModal,
    visibleBadgeModalHandler,
    dataBadgeModal,
    dataBadgeModalHandler,

    visibleSearchingModal,
    visibleSearchingModalHandler,

    visibleAlert,
    visibleAlertHandler,
    dataAlert,
    dataAlertHandler,
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
        btnFunction={dataFailedModal?.btnFunction}
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
        modalVisible={visibleDepositModal}
        modalClickHandler={visibleDepositModalHandler}
      />
      <WithdrawalModal
        getTransferData={getWithdrawData}
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
      <PersonalAchievementModal
        modalVisible={visiblePersonalAchievementModal}
        modalClickHandler={visiblePersonalAchievementModalHandler}
        personalAchievementUserId={dataPersonalAchievementModal}
      />
      <BadgeModal
        modalVisible={visibleBadgeModal}
        modalClickHandler={visibleBadgeModalHandler}
        badgeData={dataBadgeModal}
      />
      <AnnouncementModal
        modalVisible={visibleAnnouncementModal}
        modalClickHandler={visibleAnnouncementModalHandler}
        announcementData={dataAnnouncementModal}
      />

      {/* Info: One toast container avoids duplicate toast overlaying */}
      <Toast />

      <Alert modalVisible={visibleAlert} modalClickHandler={visibleAlertHandler} data={dataAlert} />

      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  // Info: If not in a provider, it still reveals `createContext<IGlobalContext>` data, meaning it'll never be falsy.

  // Deprecated: Debug tool [to be removed](20231120 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

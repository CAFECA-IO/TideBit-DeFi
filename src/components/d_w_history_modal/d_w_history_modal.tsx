import React from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import {useGlobal} from '../../contexts/global_context';
import {ImCross} from 'react-icons/im';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {numberFormatted, timestampToString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {IAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/accepted_deposit_order';
import {ToastId} from '../../constants/toast_id';
import {ToastTypeAndText} from '../../constants/toast_type';
import {IAcceptedWithdrawOrder} from '../../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {OrderType} from '../../constants/order_type';

type TranslateFunction = (s: string) => string;
interface IDWHistoryModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  historyData: IAcceptedDepositOrder | IAcceptedWithdrawOrder;
}

const DWHistoryModal = ({modalVisible, modalClickHandler, historyData}: IDWHistoryModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {receipt, createTimestamp, orderType} = historyData;
  const {orderSnapshot: order, balanceSnapshot} = receipt;
  const balance = balanceSnapshot.shift();
  const globalCtx = useGlobal();

  const displayedTime = timestampToString(createTimestamp);
  const displayedType =
    orderType === OrderType.DEPOSIT ? t('D_W_MODAL.DEPOSIT') : t('D_W_MODAL.WITHDRAW');
  const displayedAsset = order.targetAsset;
  const displayedAmount = numberFormatted(order.targetAmount);
  const displayedFee = order.fee === 0 ? '-' : numberFormatted(order.fee);

  const displayedHeaderAsset = (
    <>
      <Image
        alt={order.targetAsset}
        src={`/asset_icon/${order.targetAsset.toLocaleLowerCase()}.svg`}
        width={30}
        height={30}
      />
      <div className="ml-2 text-2xl text-lightWhite">{displayedAsset}</div>
    </>
  );

  const displayedAvailable =
    order.orderStatus === OrderStatusUnion.WAITING ? (
      <Lottie className="w-20px" animationData={smallConnectingAnimation} />
    ) : (
      <div>{numberFormatted(balance?.available)}</div>
    );

  const copyClickHandler = () => {
    navigator.clipboard.writeText(order.txhash);

    globalCtx.toast({
      type: ToastTypeAndText.INFO.type,
      message: t('TOAST.COPY_SUCCESS'),
      toastId: ToastId.COPY_SUCCESS,
      autoClose: 500,
      isLoading: false,
      typeText: t(ToastTypeAndText.INFO.text),
    });
  };

  const displayedDetail =
    order.orderStatus === OrderStatusUnion.WAITING ? (
      <div className="text-lightGreen5">{t('D_W_MODAL.STATUS_PROCESSING')}</div>
    ) : order.orderStatus === OrderStatusUnion.FAILED ? (
      <div className="text-lightRed">{t('D_W_MODAL.STATUS_FAILED')}</div>
    ) : (
      <div className="inline-flex text-tidebitTheme">
        <div className="mr-2">{order.txhash}</div>
        <button id="CopyButton" className="w-max" onClick={copyClickHandler}>
          <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
        </button>
      </div>
    );

  const formContent = (
    <div className="flex w-full flex-col space-y-4 p-8">
      <div className="flex h-40px justify-between">
        <div className="flex items-center">{displayedHeaderAsset}</div>
        <div className="flex flex-col items-end justify-between text-xs text-lightGray">
          <div>{displayedTime.date}</div>
          <div>{displayedTime.time}</div>
        </div>
      </div>
      {/* Info:(20230328 - Julian) Frame */}
      <div className="flex flex-col space-y-4 border border-lightWhite p-4 text-xs">
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.TYPE')}</div>
          <div>{displayedType}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.AMOUNT')}</div>
          <div>
            {displayedAmount} <span className="text-lightGray">{displayedAsset}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.FEE')}</div>
          <div>{displayedFee}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.AVAILABLE')}</div>
          <div>{displayedAvailable}</div>
        </div>
      </div>
      {/* Info:(20230328 - Julian) Detail */}
      <div className="flex flex-col">
        <div className="text-xs text-lightGray">{t('D_W_MODAL.DETAIL')}</div>
        <div className="mt-2 bg-darkGray2 px-4 py-2">
          <div className="no-scrollbar overflow-x-auto">{displayedDetail}</div>
        </div>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    /* Info: (20231019 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 bg-black/25 flex items-center justify-center overflow-hidden backdrop-blur-sm">
      <div
        id="DWHistoryModal"
        className="flex h-auto w-300px flex-col rounded-xl bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        {/* Info:(20230328 - Julian) Header */}
        <div className="relative mt-4">
          <button
            id="HistoryCloseButton"
            className="absolute right-5 top-0 p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
          >
            <ImCross onClick={modalClickHandler} />
          </button>
        </div>

        {/* Info:(20230328 - Julian) Body */}
        {formContent}
      </div>
    </div>
  ) : null;

  return <>{isDisplayedModal}</>;
};

export default DWHistoryModal;

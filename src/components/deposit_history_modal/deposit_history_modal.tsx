import React, {useContext} from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import {GlobalContext} from '../../contexts/global_context';
import {ImCross} from 'react-icons/im';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {numberFormatted, timestampToString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {IAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/accepted_deposit_order';
import {ToastId} from '../../constants/toast_id';
import {ToastTypeAndText} from '../../constants/toast_type';

type TranslateFunction = (s: string) => string;
interface IDepositHistoryModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getDepositHistoryData: IAcceptedDepositOrder;
}

const DepositHistoryModal = ({
  modalVisible,
  modalClickHandler,
  getDepositHistoryData,
}: IDepositHistoryModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {receipt, createTimestamp} = getDepositHistoryData;
  const {orderSnapshot: order, balanceSnapshot} = receipt;
  const balance = balanceSnapshot.shift();
  const globalCtx = useContext(GlobalContext);

  const displayedDepositTime = timestampToString(createTimestamp);
  const displayedDepositType = t('D_W_MODAL.DEPOSIT');
  const displayedDepositAsset = order.targetAsset;
  const displayedDepositAmount = numberFormatted(order.targetAmount);
  const displayedDepositFee = order.fee === 0 ? '-' : numberFormatted(order.fee);

  const displayedDepositHeaderAsset = (
    <>
      <Image
        alt={order.targetAsset}
        src={`/asset_icon/${order.targetAsset.toLocaleLowerCase()}.svg`}
        width={30}
        height={30}
      />
      <div className="ml-2 text-2xl text-lightWhite">{displayedDepositAsset}</div>
    </>
  );

  const displayedDepositAvailable =
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
      autoClose: 300,
      isLoading: false,
      typeText: t(ToastTypeAndText.INFO.text),
    });
  };

  const displayedDepositDetail =
    order.orderStatus === OrderStatusUnion.WAITING ? (
      <div className="text-lightGreen5">{t('D_W_MODAL.STATUS_PROCESSING')}</div>
    ) : order.orderStatus === OrderStatusUnion.FAILED ? (
      <div className="text-lightRed">{t('D_W_MODAL.STATUS_FAILED')}</div>
    ) : (
      <div className="inline-flex text-tidebitTheme">
        <div className="mr-2">{order.txhash}</div>
        <button className="w-max" onClick={copyClickHandler}>
          <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
        </button>
      </div>
    );

  const formContent = (
    <div className="flex w-full flex-col space-y-4 px-8 pt-4">
      <div className="flex h-40px justify-between">
        <div className="flex items-center">{displayedDepositHeaderAsset}</div>
        <div className="flex flex-col items-end justify-between text-xs text-lightGray">
          <div>{displayedDepositTime.date}</div>
          <div>{displayedDepositTime.time}</div>
        </div>
      </div>
      {/* Info:(20230328 - Julian) Frame */}
      <div className="flex flex-col space-y-4 border border-lightWhite p-4 text-xs">
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.TYPE')}</div>
          <div>{displayedDepositType}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.AMOUNT')}</div>
          <div>
            {displayedDepositAmount} <span className="text-lightGray">{displayedDepositAsset}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.FEE')}</div>
          <div>{displayedDepositFee}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">{t('D_W_MODAL.AVAILABLE')}</div>
          <div>{displayedDepositAvailable}</div>
        </div>
      </div>
      {/* Info:(20230328 - Julian) Detail */}
      <div className="flex flex-col">
        <div className="text-xs text-lightGray">{t('D_W_MODAL.DETAIL')}</div>
        <div className="mt-2 bg-darkGray2 px-4 py-2">
          <div className="no-scrollbar overflow-x-auto pr-6">{displayedDepositDetail}</div>
        </div>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div
            id="depositHistoryModal"
            className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/* Info:(20230328 - Julian) Header */}
            <div className="flex items-center justify-between rounded-t pt-9">
              <button className="float-right ml-auto bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>

            {/* Info:(20230328 - Julian) Body */}
            {formContent}

            {/* Info:(20230328 - Julian) Footer */}
            <div className="flex items-center justify-end rounded-b p-4"></div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default DepositHistoryModal;

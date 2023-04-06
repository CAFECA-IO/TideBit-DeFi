import React from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import {ImCross} from 'react-icons/im';
import {OrderStatusUnion} from '../../constants/order_status_union';
// import {IDisplayAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/display_accepted_deposit_order';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {timestampToString} from '../../lib/common';
import {useTranslation} from 'react-i18next';
import {IAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/accepted_deposit_order';

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
  const {orderSnapshot, createTimestamp, orderStatus, targetAsset, targetAmount, balanceSnapshot} =
    getDepositHistoryData;
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const displayedDepositTime = timestampToString(createTimestamp);
  const displayedDepositType = t('D_W_MODAL.DEPOSIT');
  const displayedDepositAsset = targetAsset;
  const displayedDepositAmount = targetAmount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
    minimumFractionDigits: 2,
  });
  const displayedDepositFee =
    orderSnapshot.fee === 0
      ? '-'
      : orderSnapshot.fee.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        });

  const displayedDepositHeaderAsset = (
    <>
      <Image
        alt={targetAsset}
        src={`/asset_icon/${targetAsset.toLocaleLowerCase()}.svg`}
        width={30}
        height={30}
      />
      <div className="ml-2 text-2xl text-lightWhite">{displayedDepositAsset}</div>
    </>
  );

  const displayedDepositAvailable =
    orderStatus === OrderStatusUnion.PROCESSING ? (
      <Lottie className="w-20px" animationData={smallConnectingAnimation} />
    ) : (
      <div>
        {balanceSnapshot.available.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        })}
      </div>
    );

  const displayedDepositDetail =
    orderStatus === OrderStatusUnion.PROCESSING ? (
      <div className="text-lightGreen5">{t('D_W_MODAL.STATUS_PROCESSING')}</div>
    ) : orderStatus === OrderStatusUnion.FAILED ? (
      <div className="text-lightRed">{t('D_W_MODAL.STATUS_FAILED')}</div>
    ) : (
      <div className="flex items-center text-tidebitTheme">
        {orderSnapshot.txid}
        <div className="ml-2">
          <Image src="/elements/detail_icon.svg" alt="" width={20} height={20} />
        </div>
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
        <div className="mt-2 bg-darkGray2 py-2 px-4">{displayedDepositDetail}</div>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          <div
            id="depositHistoryModal"
            className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/* Info:(20230328 - Julian) Header */}
            <div className="flex items-center justify-between rounded-t pt-9">
              <button className="float-right ml-auto bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
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

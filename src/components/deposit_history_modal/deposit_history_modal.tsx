import React from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import {ImCross} from 'react-icons/im';
import {IAcceptedDepositOrder} from '../../interfaces/tidebit_defi_background/accepted_deposit_order';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {timestampToString} from '../../lib/common';

interface IDepositHistoryModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getDepositHistoryData: IAcceptedDepositOrder;
}

/* Todo: (20230328 - Julian) i18n */
const DepositHistoryModal = ({
  modalVisible,
  modalClickHandler,
  getDepositHistoryData,
}: IDepositHistoryModal) => {
  const {orderSnapshot, createTimestamp, orderStatus, targetAsset, targetAmount, balanceSnapshot} =
    getDepositHistoryData;

  const displayedDepositTime = timestampToString(createTimestamp);
  const displayedDepositType = 'Deposit';
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

  const detailIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19.989"
      height="19.989"
      viewBox="0 0 19.989 19.989"
    >
      <g id="Group_785" data-name="Group 785" transform="translate(-896 -505)">
        <path
          id="Path_76"
          data-name="Path 76"
          d="M21.082,24.294H11.088a3.213,3.213,0,0,1-3.213-3.213V11.088a3.213,3.213,0,0,1,3.213-3.213h9.994a3.213,3.213,0,0,1,3.213,3.213v9.994a3.213,3.213,0,0,1-3.213,3.213Z"
          transform="translate(891.694 500.694)"
          fill="#f2f2f2"
        />
        <path
          id="Path_77"
          data-name="Path 77"
          d="M7.961,4.392H18.485A3.218,3.218,0,0,0,15.457,2.25H5.463A3.213,3.213,0,0,0,2.25,5.463v9.994a3.218,3.218,0,0,0,2.142,3.029V7.961A3.569,3.569,0,0,1,7.961,4.392Z"
          transform="translate(893.75 502.75)"
          fill="#f2f2f2"
        />
      </g>
    </svg>
  );

  const displayedDepositAvailable =
    orderStatus === 'PROCESSING' ? (
      <Lottie className="w-20px" animationData={smallConnectingAnimation} />
    ) : (
      <div>
        {balanceSnapshot.available.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        })}
      </div>
    );

  const displayedDepositDetail =
    orderStatus === 'PROCESSING' ? (
      <div className="text-lightGreen5">Processing</div>
    ) : orderStatus === 'FAILED' ? (
      <div className="text-lightRed">Failed</div>
    ) : (
      <div className="flex items-center text-tidebitTheme">
        {orderSnapshot.txid}
        <div className="ml-2">{detailIcon}</div>
      </div>
    );

  const formContent = (
    <div className="flex w-full flex-col space-y-4 px-8 pt-4">
      <div className="flex h-40px justify-between">
        <div className="flex items-center">
          <Image alt="" src="/elements/tether-seeklogo.com.svg" width={30} height={30} />
          <div className="ml-2 text-2xl text-lightWhite">{displayedDepositAsset}</div>
        </div>
        <div className="flex flex-col items-end justify-between text-xs text-lightGray">
          <div>{displayedDepositTime.date}</div>
          <div>{displayedDepositTime.time}</div>
        </div>
      </div>
      {/* Info:(20230328 - Julian) Frame */}
      <div className="flex flex-col space-y-4 border border-lightWhite p-4 text-xs">
        <div className="flex justify-between">
          <div className="text-lightGray">Type</div>
          <div>{displayedDepositType}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">Amount</div>
          <div>
            {displayedDepositAmount} <span className="text-lightGray">{displayedDepositAsset}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">Fee</div>
          <div>{displayedDepositFee}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lightGray">Available</div>
          <div>{displayedDepositAvailable}</div>
        </div>
      </div>
      {/* Info:(20230328 - Julian) Detail */}
      <div className="flex flex-col">
        <div className="text-xs text-lightGray">Detail</div>
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

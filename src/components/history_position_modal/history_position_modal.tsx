import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  BORDER_COLOR_TYPE,
  PNL_COLOR_TYPE,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {useRef, useState} from 'react';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {useGlobal} from '../../contexts/global_context';

interface IHistoryPositionModal {
  modalVisible: boolean;
  modalClickHandler: (bool?: boolean | any) => void;
  openCfdDetails: IOpenCFDDetails;
}

const timestampToString = (timestamp: number) => {
  if (timestamp === 0) return ['-', '-'];

  const date = new Date(timestamp * 1000);
  // const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  return [dateString, timeString];
};

// TODO: Replace hardcode data with variables
const HistoryPositionModal = ({
  // openCfdDetails,
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  ...otherProps
}: IHistoryPositionModal) => {
  // console.log('openCfdDetails in details modal: ', openCfdDetails.id);
  const globalContext = useGlobal();

  const displayedGuaranteedStopSetting = !!openCfdDetails.guaranteedStop ? 'Yes' : 'No';

  const displayedPositionColor =
    openCfdDetails.typeOfPosition === 'BUY' ? PNL_COLOR_TYPE.profit : PNL_COLOR_TYPE.loss;

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedPnLSymbol =
    openCfdDetails.pnl.type === 'PROFIT' ? '+' : openCfdDetails.pnl.type === 'LOSS' ? '-' : '';

  // TODO: i18n
  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === 'BUY' ? 'Up (Buy)' : 'Down (Sell)';

  const displayedPnLColor =
    openCfdDetails?.pnl.type === 'PROFIT'
      ? PNL_COLOR_TYPE.profit
      : openCfdDetails?.pnl.type === 'LOSS'
      ? PNL_COLOR_TYPE.loss
      : PNL_COLOR_TYPE.equal;

  const displayedBorderColor =
    openCfdDetails?.typeOfPosition === 'BUY' ? BORDER_COLOR_TYPE.long : BORDER_COLOR_TYPE.short;

  const formContent = (
    <div className="relative flex-auto pt-0">
      <div
        className={`${displayedBorderColor} mx-7 mt-3 border-1px text-base leading-relaxed text-lightWhite`}
      >
        <div className="flex-col justify-center text-center text-xs">
          {/* {displayedDataFormat()} */}

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Type</div>
            {/* TODO: i18n */}
            <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Amount</div>
            <div className="">
              {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">PNL</div>
            <div className={`${displayedPnLColor}`}>
              $ {displayedPnLSymbol}{' '}
              {openCfdDetails?.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Open Value</div>
            <div className="">
              $ {openCfdDetails?.openValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Close Value</div>
            <div className="">
              ${' '}
              {(openCfdDetails?.openValue + openCfdDetails.pnl.value)?.toLocaleString(
                UNIVERSAL_NUMBER_FORMAT_LOCALE
              ) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Open Price</div>
            <div className="">
              $ {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Close Price</div>
            <div className="">
              $ {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Open Time</div>
            <div className="">
              {timestampToString(openCfdDetails?.openTimestamp ?? 0)[0]}{' '}
              {timestampToString(openCfdDetails?.openTimestamp ?? 0)[1]}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Close Time</div>
            <div className="">
              {timestampToString(openCfdDetails?.openTimestamp ?? 0)[0]}{' '}
              {timestampToString(openCfdDetails?.openTimestamp ?? 0)[1]}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Limit/ Stop</div>
            <div className="">
              <span className={`text-lightWhite`}>
                {openCfdDetails?.takeProfit?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
              </span>{' '}
              /{' '}
              <span className={`text-lightWhite`}>
                {openCfdDetails?.stopLoss?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
              </span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Guaranteed Stop</div>
            <div className={``}>{displayedGuaranteedStopSetting}</div>
          </div>

          {/* <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Liquidation Price</div>
            <div className="">
              $ {openCfdDetails?.liquidationPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div> */}

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">State</div>
            <div className="">Closed</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Close Reason</div>
            <div className="">Take Profit</div>
          </div>
        </div>
      </div>
      <div
        className={`mx-7 mt-5 flex items-center justify-between text-base leading-relaxed text-lightGray`}
      >
        <div className={``}>Share:</div>

        <div className={` hover:cursor-pointer hover:opacity-90`}>
          {' '}
          <Image src="/elements/group_15237.svg" width={44} height={44} alt="Facebook" />
        </div>

        <div className={` hover:cursor-pointer hover:opacity-90`}>
          {' '}
          <Image src="/elements/group_15236.svg" width={44} height={44} alt="Instagram" />
        </div>

        <div className={` hover:cursor-pointer hover:opacity-90`}>
          {' '}
          <Image src="/elements/group_15235.svg" width={44} height={44} alt="Twitter" />
        </div>

        <div className={` hover:cursor-pointer hover:opacity-90`}>
          <Image src="/elements/group_15234.svg" width={44} height={44} alt="Reddit" />
        </div>
      </div>
    </div>
  );

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div className="relative flex h-620px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="-mb-1 flex items-start justify-between rounded-t pt-6">
              <div className="ml-7 mr-5 mt-5 flex w-450px justify-between">
                <div className="flex items-center space-x-3 text-center text-2xl text-lightWhite">
                  <Image src="/elements/group_2371.svg" width={30} height={30} alt="icon" />
                  <h3 className="">{openCfdDetails?.ticker} </h3>
                </div>

                <div className="flex-col space-y-2 text-end text-xs text-lightGray">
                  <p className="">{timestampToString(openCfdDetails?.openTimestamp ?? 0)[0]}</p>
                  <p className="">{timestampToString(openCfdDetails?.openTimestamp ?? 0)[1]}</p>
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-4 right-4 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            {formContent}
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </div>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default HistoryPositionModal;

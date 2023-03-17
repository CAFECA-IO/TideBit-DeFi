import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {useContext, useRef, useState} from 'react';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {useGlobal} from '../../contexts/global_context';
import {timestampToString} from '../../lib/common';
import {IClosedCFDDetails} from '../../interfaces/tidebit_defi_background/closed_cfd_details';
import {MarketContext} from '../../contexts/market_context';
import {CFDClosedType} from '../../constants/cfd_closed_type';
import {OrderState} from '../../constants/order_state';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

interface IHistoryPositionModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  closedCfdDetails: IDisplayAcceptedCFDOrder;
}

const HistoryPositionModal = ({
  modalVisible,
  modalClickHandler,
  closedCfdDetails: closedCfdDetails,
  ...otherProps
}: IHistoryPositionModal) => {
  const marketCtx = useContext(MarketContext);

  // TODO: (20230317 - Shirley) i18n
  const displayedClosedReason =
    closedCfdDetails.closedType === CFDClosedType.SCHEDULE
      ? 'Scheduled'
      : closedCfdDetails.closedType === CFDClosedType.FORCED_LIQUIDATION
      ? 'Forced Liquidation'
      : closedCfdDetails.closedType === CFDClosedType.BY_USER
      ? 'Manual'
      : closedCfdDetails.closedType === CFDClosedType.TAKE_PROFIT
      ? 'Take Profit'
      : closedCfdDetails.closedType === CFDClosedType.STOP_LOSS
      ? 'Stop Loss'
      : '';

  const displayedGuaranteedStopSetting = !!closedCfdDetails.guaranteedStop ? 'Yes' : 'No';

  const displayedPositionColor = 'text-tidebitTheme';

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedPnLSymbol =
    closedCfdDetails.pnl.type === 'PROFIT' ? '+' : closedCfdDetails.pnl.type === 'LOSS' ? '-' : '';

  // TODO: (20230317 - Shirley) i18n
  const displayedTypeOfPosition =
    closedCfdDetails?.typeOfPosition === 'BUY' ? 'Up (Buy)' : 'Down (Sell)';

  const displayedPnLColor =
    closedCfdDetails?.pnl.type === 'PROFIT'
      ? TypeOfPnLColor.PROFIT
      : closedCfdDetails?.pnl.type === 'LOSS'
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    closedCfdDetails?.pnl.type === 'PROFIT'
      ? TypeOfBorderColor.LONG
      : closedCfdDetails?.pnl.type === 'LOSS'
      ? TypeOfBorderColor.SHORT
      : TypeOfBorderColor.NORMAL;

  const displayedPositionState = closedCfdDetails.state === OrderState.OPENING ? 'Open' : 'Closed';

  const socialMediaStyle = 'hover:cursor-pointer hover:opacity-80';

  const openTime = timestampToString(closedCfdDetails.createTimestamp ?? 0);
  const closedTime = timestampToString(closedCfdDetails?.closeTimestamp ?? 0);

  const formContent = (
    <div className="relative flex-auto pt-0">
      <div
        className={`${displayedBorderColor} mx-7 mt-3 border-1px text-base leading-relaxed text-lightWhite`}
      >
        <div className="flex-col justify-center text-center text-xs">
          {/* {displayedDataFormat()} */}

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Type</div>
            {/* TODO: (20230317 - Shirley) i18n */}
            <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Amount</div>
            <div className="">
              {closedCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">PNL</div>
            <div className={`${displayedPnLColor}`}>
              {displayedPnLSymbol} ${' '}
              {closedCfdDetails?.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Open Value</div>
            <div className="">
              $ {closedCfdDetails?.openValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Closed Value</div>
            <div className="">
              $ {closedCfdDetails?.closeValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Open Price</div>
            <div className="">
              $ {closedCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Closed Price</div>
            <div className="">
              $ {closedCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Open Time</div>
            <div className="">
              {openTime.date} {openTime.time}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Closed Time</div>
            <div className="">
              {closedTime.date} {closedTime.time}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">TP/ SL</div>
            <div className="">
              <span className={`text-lightWhite`}>
                {closedCfdDetails?.takeProfit?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ??
                  '-'}
              </span>{' '}
              /{' '}
              <span className={`text-lightWhite`}>
                {closedCfdDetails?.stopLoss?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
              </span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Guaranteed Stop</div>
            <div className={``}>{displayedGuaranteedStopSetting}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">State</div>
            <div className="">{displayedPositionState}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">Closed Reason</div>
            <div className="">{displayedClosedReason}</div>
          </div>
        </div>
      </div>
      <div
        className={`mx-7 mt-5 flex items-center justify-between text-base leading-relaxed text-lightGray`}
      >
        <div className={``}>Share:</div>

        <div className={`${socialMediaStyle}`}>
          {' '}
          <Image src="/elements/group_15237.svg" width={44} height={44} alt="Facebook" />
        </div>

        <div className={`${socialMediaStyle}`}>
          {' '}
          <Image src="/elements/group_15236.svg" width={44} height={44} alt="Instagram" />
        </div>

        <div className={`${socialMediaStyle}`}>
          {' '}
          <Image src="/elements/group_15235.svg" width={44} height={44} alt="Twitter" />
        </div>

        <div className={`${socialMediaStyle}`}>
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
              <div className="ml-7 mr-5 mt-5 mb-3 flex w-450px justify-between">
                <div className="flex w-full items-center justify-center space-x-2 text-center text-2xl text-lightWhite">
                  {/* TODO: selected ticker should have default */}
                  <Image
                    src={marketCtx.selectedTicker?.tokenImg ?? ''}
                    width={30}
                    height={30}
                    alt="icon"
                  />
                  <h3 className="">{closedCfdDetails.ticker} </h3>
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

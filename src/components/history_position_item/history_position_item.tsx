import React from 'react';
import {
  TypeOfPnLColorHex,
  TypeOfTransaction,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {timestampToString} from '../../lib/common';
import {TypeOfPosition} from '../../constants/type_of_position';
import {useGlobal} from '../../contexts/global_context';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

interface IHistoryPositionItemProps {
  closedCfdDetails: IDisplayAcceptedCFDOrder;
}

const HistoryPositionItem = ({closedCfdDetails, ...otherProps}: IHistoryPositionItemProps) => {
  const globalCtx = useGlobal();

  const displayedString =
    closedCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfTransaction.LONG
      : TypeOfTransaction.SHORT;

  const displayedTextColor =
    closedCfdDetails.pnl.type === ProfitState.PROFIT ? 'text-lightGreen5' : 'text-lightRed';

  const displayedSymbol =
    closedCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : closedCfdDetails.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  const itemClickHandler = () => {
    globalCtx.dataHistoryPositionModalHandler(closedCfdDetails);
    globalCtx.visibleHistoryPositionModalHandler();
  };

  const displayedTime = timestampToString(closedCfdDetails?.closeTimestamp ?? 0);

  return (
    <>
      <div className="mt-3 text-xs hover:cursor-pointer" onClick={itemClickHandler}>
        <div className="flex justify-center">
          <div className="w-48px">
            <div className="text-lightGray">
              {displayedTime.day} {displayedTime.abbreviatedMonth}{' '}
            </div>
            <div className="text-lightGray">{displayedTime.abbreviatedTime}</div>
            {/* Divider */}
          </div>

          <div className="w-75px">
            <div>{closedCfdDetails.ticker}</div>
            <div className="text-lightWhite">
              {displayedString.TITLE}{' '}
              <span className="text-lightGray">{displayedString.SUBTITLE}</span>
            </div>
          </div>

          <div className="w-150px">
            <div className="text-lightGray">Open / Close Value</div>
            <div className="">
              $ {closedCfdDetails.openValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} / ${' '}
              {closedCfdDetails?.closeValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div>

          <div>
            <div className=""></div>
            <div className=""></div>
          </div>

          <div className="w-60px text-end">
            <div>PNL</div>
            <div className={`${displayedTextColor}`}>
              <span className="">{displayedSymbol}</span> ${' '}
              {closedCfdDetails.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-3 h-px w-full rounded bg-white/50"></div>
    </>
  );
};

export default HistoryPositionItem;

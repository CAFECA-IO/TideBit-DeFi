import React from 'react';
import {TypeOfPnLColorHex, TypeOfTransaction} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {timestampToString} from '../../lib/common';
import {IClosedCFDDetails} from '../../interfaces/tidebit_defi_background/closed_cfd_details';
import {TypeOfPosition} from '../../constants/type_of_position';

interface IHistoryPositionItemProps {
  closedCfdDetails: IClosedCFDDetails;
}

const HistoryPositionItem = ({closedCfdDetails, ...otherProps}: IHistoryPositionItemProps) => {
  // if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  // if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;

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

  return (
    <>
      <div className="mt-3 text-xs">
        <div className="flex justify-between">
          <div className="w-40px">
            <div className="text-lightGray">
              {timestampToString(closedCfdDetails.closedTimestamp).day}{' '}
              {timestampToString(closedCfdDetails.closedTimestamp).abbreviatedMonth}{' '}
            </div>
            <div className="text-lightGray">
              {timestampToString(closedCfdDetails.closedTimestamp).abbreviatedTime}
            </div>
            {/* Divider */}
          </div>

          <div className="w-70px">
            <div>{closedCfdDetails.ticker}</div>
            <div className="text-lightWhite">
              {displayedString.TITLE}{' '}
              <span className="text-lightGray">{displayedString.SUBTITLE}</span>
            </div>
          </div>

          <div className="w-150px">
            <div className="text-lightGray">Open / Close Value</div>
            <div className="">
              $ {closedCfdDetails.openValue} / $ {closedCfdDetails.closedValue}
            </div>
          </div>

          <div>
            <div className=""></div>
            <div className=""></div>
          </div>

          <div className="w-60px text-end">
            <div>PNL</div>
            <div className={`${displayedTextColor}`}>
              <span className="">{displayedSymbol}</span> $ {closedCfdDetails.pnl.value}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-3 h-px w-full rounded bg-white/50"></div>
    </>
  );
};

export default HistoryPositionItem;

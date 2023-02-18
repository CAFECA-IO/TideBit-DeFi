import React from 'react';
import {TypeOfPnLColorHex, TypeOfTransaction} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {timestampToString} from '../../lib/common';

interface IHistoryPositionItemProps {
  profitOrLoss: string;
  longOrShort: string;
  ticker: string;
  openValue: number;
  closeValue: number;
  profitOrLossAmount: number;
}

const HistoryPositionItem = ({
  profitOrLoss,
  longOrShort,
  openValue,
  closeValue,
  ticker,
  profitOrLossAmount: pNL,
  ...otherProps
}: IHistoryPositionItemProps) => {
  if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;

  const displayedString = longOrShort === 'long' ? TypeOfTransaction.LONG : TypeOfTransaction.SHORT;

  const displayedColor = profitOrLoss === ProfitState.PROFIT ? 'text-lightGreen' : 'text-lightRed';

  const displayedSymbol = profitOrLoss === ProfitState.PROFIT ? '+' : '-';

  return (
    <>
      <div className="mt-3 text-xs">
        <div className="flex justify-between">
          <div className="w-40px">
            {/* TODO: {timestampToString(historyCFD.openTime).day} {timestampToString(historyCFD.openTime).abbreviatedMonth} {timestampToString(historyCFD.openTime).abbreviatedTime} */}
            <div className="text-lightGray">11 Nov</div>
            <div className="text-lightGray">15:05</div>
            {/* Divider */}
          </div>

          <div className="w-55px">
            <div>{ticker}</div>
            <div className="text-lightWhite">
              {displayedString.TITLE}{' '}
              <span className="text-lightGray">{displayedString.SUBTITLE}</span>
            </div>
          </div>

          <div className="w-150px">
            <div className="text-lightGray">Open / Close Value</div>
            <div className="">
              $ {openValue} / $ {closeValue}
            </div>
          </div>

          <div>
            <div className=""></div>
            <div className=""></div>
          </div>

          <div className="w-60px text-end">
            <div>PNL</div>
            <div className={`${displayedColor}`}>
              <span className="">{displayedSymbol}</span> $ {pNL}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-3 h-px w-full rounded bg-white/50"></div>
    </>
  );
};

export default HistoryPositionItem;

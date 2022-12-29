import React from 'react';
import {PROFIT_LOSS_COLOR_TYPE, TRANSACTION_TYPE} from '../../constants/display';

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
  if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;

  const displayedString = longOrShort === 'long' ? TRANSACTION_TYPE.long : TRANSACTION_TYPE.short;

  const displayedColor = profitOrLoss === 'profit' ? 'text-lightGreen' : 'text-lightRed';

  const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  return (
    <>
      <div className="mt-3 text-xs">
        <div className="flex justify-between">
          <div>
            <div className="text-lightGray">11 Nov</div>
            <div className="text-lightGray">15:05</div>
            {/* Divider */}
          </div>

          <div className="w-60px">
            <div>{ticker}</div>
            <div className="text-lightWhite">
              {displayedString.title}{' '}
              <span className="text-lightGray">{displayedString.subtitle}</span>
            </div>
          </div>

          <div>
            <div className="text-lightGray">Open / Close Value</div>
            <div className="">
              $ {openValue} / $ {closeValue}
            </div>
          </div>

          <div>
            <div className=""></div>
            <div className=""></div>
          </div>

          <div className="w-65px text-end">
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

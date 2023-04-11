import React, {useContext} from 'react';
import Image from 'next/image';
import {TypeOfTransaction, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {timestampToString} from '../../lib/common';
import {TypeOfPosition} from '../../constants/type_of_position';
import {useGlobal} from '../../contexts/global_context';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {useTranslation} from 'react-i18next';
import {MarketContext} from '../../contexts/market_context';

type TranslateFunction = (s: string) => string;
interface IHistoryPositionItemProps {
  closedCfdDetails: IDisplayAcceptedCFDOrder;
}

const HistoryPositionItem = ({closedCfdDetails, ...otherProps}: IHistoryPositionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  // if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);

  const displayedString =
    closedCfdDetails.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
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

  const displayedTime = timestampToString(closedCfdDetails?.orderSnapshot?.closeTimestamp ?? 0);

  return (
    <>
      <div className="mt-3 text-xs hover:cursor-pointer" onClick={itemClickHandler}>
        <div className="flex justify-center">
          <div className="w-48px">
            <div className="text-lightGray">
              {displayedTime.day} {displayedTime.abbreviatedMonth}
            </div>
            <div className="text-lightGray">{displayedTime.abbreviatedTime}</div>
            {/* Divider */}
          </div>

          <div className="w-80px">
            <div className="inline-flex items-center">
              {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
              <Image
                src={marketCtx.selectedTicker?.tokenImg ?? ''}
                alt="currency icon"
                width={15}
                height={15}
              />
              <p className="ml-1">{closedCfdDetails.orderSnapshot.ticker}</p>
            </div>
            <div className="text-lightWhite">
              {displayedString.TITLE}
              <span className="text-lightGray">{displayedString.SUBTITLE}</span>
            </div>
          </div>

          <div className="w-120px">
            <div className="text-lightGray">{t('TRADE_PAGE.HISTORY_POSITION_ITEM_VALUE')}</div>
            <div className="">
              $
              {closedCfdDetails.openValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              })}
              / $
              {(closedCfdDetails.closeValue || 0).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="w-60px text-end">
            <div className="text-lightGray">{t('TRADE_PAGE.HISTORY_POSITION_ITEM_PNL')}</div>
            <div className={`${displayedTextColor} whitespace-nowrap`}>
              <span className="">{displayedSymbol}</span> $
              {closedCfdDetails.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-3 h-px w-full rounded bg-white/50"></div>
    </>
  );
};

export default HistoryPositionItem;

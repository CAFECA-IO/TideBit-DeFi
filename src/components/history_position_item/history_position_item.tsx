import React, {useContext} from 'react';
import Image from 'next/image';
import {TypeOfTransaction, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {FRACTION_DIGITS} from '../../constants/config';
import {ProfitState} from '../../constants/profit_state';
import {roundToDecimalPlaces, timestampToString, toPnl} from '../../lib/common';
import {TypeOfPosition} from '../../constants/type_of_position';
import {useGlobal} from '../../contexts/global_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {useTranslation} from 'react-i18next';
import {MarketContext} from '../../contexts/market_context';
import SafeMath from '../../lib/safe_math';

type TranslateFunction = (s: string) => string;
interface IHistoryPositionItemProps {
  closedCfdDetails: IDisplayCFDOrder;
}

const HistoryPositionItem = ({closedCfdDetails, ...otherProps}: IHistoryPositionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);

  const displayedString =
    closedCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfTransaction.LONG
      : TypeOfTransaction.SHORT;

  const closeValue = roundToDecimalPlaces(
    +SafeMath.mult(closedCfdDetails.closePrice!, closedCfdDetails.amount),
    2
  );
  const spread = marketCtx.getTickerSpread(closedCfdDetails.instId);
  const pnl =
    closedCfdDetails?.pnl ||
    toPnl({
      openPrice: closedCfdDetails.openPrice,
      closePrice: closedCfdDetails.closePrice!,
      amount: closedCfdDetails.amount,
      typeOfPosition: closedCfdDetails.typeOfPosition,
      spread: spread,
    });

  const displayedTextColor = pnl.type === ProfitState.PROFIT ? 'text-lightGreen5' : 'text-lightRed';

  const displayedPnLValue = Math.abs(pnl.value).toLocaleString(
    UNIVERSAL_NUMBER_FORMAT_LOCALE,
    FRACTION_DIGITS
  );

  const displayedPnLSymbol =
    pnl.type === ProfitState.PROFIT ? '+' : pnl.type === ProfitState.LOSS ? '-' : '';

  const itemClickHandler = () => {
    // Deprecated: (20230802 - Shirley)
    // eslint-disable-next-line no-console
    console.log('history in items', closedCfdDetails);
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
              {displayedTime.day} {displayedTime.abbreviatedMonth}
            </div>
            <div className="text-lightGray">{displayedTime.abbreviatedTime}</div>
            {/* Divider */}
          </div>

          <div className="w-80px">
            <div className="inline-flex items-center">
              {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
              <Image
                src={`/asset_icon/${closedCfdDetails.targetAsset.toLowerCase()}.svg` ?? ''}
                alt="currency icon"
                width={15}
                height={15}
              />
              <p className="ml-1">{closedCfdDetails.instId}</p>
            </div>
            <div className="text-lightWhite">
              {displayedString.TITLE}{' '}
              <span className="text-lightGray">{displayedString.SUBTITLE}</span>
            </div>
          </div>

          <div className="w-120px">
            <div className="text-lightGray">{t('TRADE_PAGE.HISTORY_POSITION_ITEM_VALUE')}</div>
            <div className="">
              $
              {closedCfdDetails.openValue.toLocaleString(
                UNIVERSAL_NUMBER_FORMAT_LOCALE,
                FRACTION_DIGITS
              )}
              / ${(closeValue || 0).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
            </div>
          </div>

          <div className="w-60px text-end">
            <div className="text-lightGray">{t('TRADE_PAGE.HISTORY_POSITION_ITEM_PNL')}</div>
            <div className={`${displayedTextColor} whitespace-nowrap`}>
              <span className="">{displayedPnLSymbol}</span> ${displayedPnLValue}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-3 h-px w-full rounded bg-white/50"></div>
    </>
  );
};

export default HistoryPositionItem;

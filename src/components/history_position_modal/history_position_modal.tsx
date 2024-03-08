import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {TypeOfBorderColor, TypeOfPnLColor} from '../../constants/display';
import Tooltip from '../tooltip/tooltip';
import {unitAsset} from '../../constants/config';
import React, {useContext} from 'react';
import {numberFormatted, roundToDecimalPlaces, timestampToString, toPnl} from '../../lib/common';
import {CFDClosedType} from '../../constants/cfd_closed_type';
import {OrderState} from '../../constants/order_state';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {useTranslation} from 'next-i18next';
import {UserContext} from '../../contexts/user_context';
import useShareProcess from '../../lib/hooks/use_share_process';
import {ShareType} from '../../constants/share_type';
import {ISocialMedia, ShareSettings} from '../../constants/social_media';
import {MarketContext} from '../../contexts/market_context';
import SafeMath from '../../lib/safe_math';
import {RoundCondition} from '../../interfaces/tidebit_defi_background/round_condition';

type TranslateFunction = (s: string) => string;
interface IHistoryPositionModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  closedCfdDetails: IDisplayCFDOrder;
}

const HistoryPositionModal = ({
  modalVisible,
  modalClickHandler,
  closedCfdDetails,
  ...otherProps
}: IHistoryPositionModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  const displayedClosedReason =
    closedCfdDetails.closedType === CFDClosedType.SCHEDULE
      ? t('POSITION_MODAL.CLOSED_REASON_SCHEDULE')
      : closedCfdDetails.closedType === CFDClosedType.FORCED_LIQUIDATION
      ? t('POSITION_MODAL.CLOSED_REASON_FORCED_LIQUIDATION')
      : closedCfdDetails.closedType === CFDClosedType.BY_USER
      ? t('POSITION_MODAL.CLOSED_REASON_BY_USER')
      : closedCfdDetails.closedType === CFDClosedType.TAKE_PROFIT
      ? t('POSITION_MODAL.CLOSED_REASON_TAKE_PROFIT')
      : closedCfdDetails.closedType === CFDClosedType.STOP_LOSS
      ? t('POSITION_MODAL.CLOSED_REASON_STOP_LOSS')
      : '';

  const displayedGuaranteedStopSetting = !!closedCfdDetails.guaranteedStop
    ? t('POSITION_MODAL.GUARANTEED_STOP_YES')
    : t('POSITION_MODAL.GUARANTEED_STOP_NO');

  const displayedPositionColor = 'text-tidebitTheme';

  const layoutInsideBorder = 'mx-5 flex justify-between';

  const closeValue = roundToDecimalPlaces(
    +SafeMath.mult(closedCfdDetails.closePrice ?? 0, closedCfdDetails.amount),
    2,
    RoundCondition.SHRINK
  );
  const spread = marketCtx.getTickerSpread(closedCfdDetails.instId);
  const pnl =
    closedCfdDetails?.pnl ||
    toPnl({
      openPrice: closedCfdDetails.openPrice,
      closePrice: closedCfdDetails.closePrice ?? 0,
      amount: closedCfdDetails.amount,
      typeOfPosition: closedCfdDetails.typeOfPosition,
      spread: spread,
    });

  const displayedPnLSymbol = pnl.type === 'PROFIT' ? '+' : pnl.type === 'LOSS' ? '-' : '';

  // TODO: Discuss the pnl value should include the symbol or not (20230804 - Shirley)
  const displayedPnLValue = numberFormatted(pnl.value);

  const displayedTypeOfPosition =
    closedCfdDetails?.typeOfPosition === 'BUY'
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    closedCfdDetails?.typeOfPosition === 'BUY'
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const displayedPnLColor =
    pnl.type === 'PROFIT'
      ? TypeOfPnLColor.PROFIT
      : pnl.type === 'LOSS'
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    pnl.type === 'PROFIT'
      ? TypeOfBorderColor.PROFIT
      : pnl.type === 'LOSS'
      ? TypeOfBorderColor.LOSS
      : TypeOfBorderColor.EQUAL;

  const displayedPositionState =
    closedCfdDetails.state === OrderState.OPENING
      ? t('POSITION_MODAL.STATE_OPEN')
      : t('POSITION_MODAL.STATE_CLOSED');

  const displayedIdBackgroundColor =
    pnl.type === 'PROFIT' ? 'bg-greenLinear' : pnl.type === 'LOSS' ? 'bg-redLinear' : '';

  const openTime = timestampToString(closedCfdDetails.createTimestamp ?? 0);
  const closedTime = timestampToString(closedCfdDetails?.closeTimestamp ?? 0);

  const {share} = useShareProcess({
    lockerName: 'history_position_modal.shareHandler',
    cfd: closedCfdDetails,
    shareType: ShareType.CFD,
    shareId: closedCfdDetails.id,
    enableShare: userCtx.enableShare,
  });

  const closeSpreadFee = closedCfdDetails.closeSpreadFee ?? 0;
  const openSpreadSymbol = closedCfdDetails?.openSpreadFee >= 0 ? '+' : '-';
  const closeSpreadSymbol = closeSpreadFee >= 0 ? '+' : '-';

  const formContent = (
    <div className="relative flex w-full flex-auto flex-col text-xs lg:text-sm">
      <div
        className={`${displayedBorderColor} mt-3 flex flex-col space-y-3 border-1px pb-3 text-lightWhite`}
      >
        {/* Info: (20231005 - Julian) CFD ID */}
        <div
          className={`px-5 py-2 ${displayedIdBackgroundColor} ${displayedBorderColor} border-b-1px`}
        >
          <p>{closedCfdDetails.id}</p>
        </div>
        {/* Info: (20231005 - Julian) Type */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
          <div className={`${displayedPositionColor}`}>
            {displayedTypeOfPosition}
            <span className="ml-1 text-xs text-lightGray">{displayedBuyOrSell}</span>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Amount */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
          <div className="">
            {numberFormatted(closedCfdDetails?.amount)}
            <span className="ml-1 text-xs text-lightGray">{closedCfdDetails.targetAsset}</span>
          </div>
        </div>
        {/* Info: (20231005 - Julian) PnL */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
          <div className={`${displayedPnLColor}`}>
            {displayedPnLSymbol} {displayedPnLValue}
            <span className="ml-1 text-xs">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Open Value */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_VALUE')}</div>
          <div className="">
            {numberFormatted(closedCfdDetails?.openValue)}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Closed Value */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_VALUE')}</div>
          <div className="">
            {numberFormatted(closeValue)}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Open Price */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
          <div className="flex items-center space-x-1">
            {/* Info: (20231003 - Julian) Spot Price */}
            {numberFormatted(closedCfdDetails.openSpotPrice)}
            {/* Info: (20231003 - Julian) Spread */}
            <span className="ml-1 whitespace-nowrap text-xs text-lightGray">
              {openSpreadSymbol}
              {numberFormatted(closedCfdDetails.openSpreadFee)}
            </span>
            {/* Info: (20231003 - Julian) Price */}
            <p>→ {numberFormatted(closedCfdDetails?.openPrice)}</p>
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
            <Tooltip id="HistoryOpenPriceTip" className="hidden lg:block">
              <p className="w-40 text-sm font-medium text-white">
                {t('POSITION_MODAL.SPREAD_HINT')}
              </p>
            </Tooltip>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Close Price */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
          <div className="flex items-center space-x-1">
            {/* Info: (20231003 - Julian) Spot Price */}
            {numberFormatted(closedCfdDetails.closeSpotPrice)}
            {/* Info: (20231003 - Julian) Spread */}
            <span className="ml-1 whitespace-nowrap text-xs text-lightGray">
              {closeSpreadSymbol}
              {numberFormatted(closedCfdDetails.closeSpreadFee)}
            </span>
            {/* Info: (20231003 - Julian) Price */}
            <p>→ {numberFormatted(closedCfdDetails.closePrice)}</p>
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
            <Tooltip id="HistoryClosePriceTip" className="hidden lg:block">
              <p className="w-40 text-sm font-medium text-white">
                {t('POSITION_MODAL.SPREAD_HINT')}
              </p>
            </Tooltip>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Open Time */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
          <div className="">
            {openTime.date} {openTime.time}
          </div>
        </div>
        {/* Info: (20231005 - Julian) Closed Time */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_TIME')}</div>
          <div className="">
            {closedTime.date} {closedTime.time}
          </div>
        </div>
        {/* Info: (20231005 - Julian) TP/SL */}
        <div className={`${layoutInsideBorder}`}>
          <div className="flex">
            <div className="text-lightGray mr-1">{t('POSITION_MODAL.TP_AND_SL')}</div>
            <Tooltip id="HistoryTpSlTip" tooltipPosition="left-2">
              <p className="w-56 text-left text-sm font-medium text-white">
                {t('POSITION_MODAL.TP_AND_SL_HINT')}
              </p>
            </Tooltip>
          </div>{' '}
          <div className="">
            <span className={`text-lightWhite`}>
              {numberFormatted(closedCfdDetails?.takeProfit, true)}
            </span>{' '}
            /{' '}
            <span className={`text-lightWhite`}>
              {numberFormatted(closedCfdDetails?.stopLoss, true)}
              <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
            </span>
          </div>
        </div>
        {/* Info: (20231005 - Julian) Guaranteed Stop */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
          <div className="flex">
            <div className={`flex`}>
              {displayedGuaranteedStopSetting}
              {closedCfdDetails?.guaranteedStop ? (
                <span className="flex items-baseline">
                  <span className="text-lightGray mx-1">({t('POSITION_MODAL.FEE')}:</span>
                  <span className="">{`${numberFormatted(
                    closedCfdDetails.guaranteedStopFee ?? 0
                  )}`}</span>
                  <span className="text-lightGray ml-1 text-xs">{unitAsset}</span>
                  <span className="text-lightGray text-sm">)</span>
                </span>
              ) : null}
            </div>

            <Tooltip id="HistoryGslTip" className="top-px ml-1">
              <p className="w-56 text-left text-sm font-medium text-white">
                {t('POSITION_MODAL.GUARANTEED_STOP_HINT')}
              </p>
            </Tooltip>
          </div>
        </div>

        {/* Info: Liquidation price (20231103 - Shirley) */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
          <div className="flex">
            {numberFormatted(closedCfdDetails.liquidationPrice, true)}{' '}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
          </div>{' '}
        </div>

        {/* Info: (20231005 - Julian) State */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.STATE')}</div>
          <div className="">{displayedPositionState}</div>
        </div>
        {/* Info: (20231005 - Julian) Closed Reason */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_REASON')}</div>
          <div className="">{displayedClosedReason}</div>
        </div>
      </div>
      {/* Info: (20231005 - Julian) Share */}
      <div className={`mt-2 flex items-center justify-end text-lightGray`}>
        <p>{t('POSITION_MODAL.SHARE')}:</p>
        <div className="flex items-center justify-between">
          {Object.entries(ShareSettings).map(([key, value]) => (
            <div
              id={`ShareHistoryTo${key}`}
              key={key}
              className={`text-base hover:cursor-pointer hover:opacity-80`}
            >
              <Image
                onClick={() => share({socialMedia: key as ISocialMedia, text: value.TEXT})}
                src={value.ICON}
                width={44}
                height={44}
                alt={key}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      {/* Info: (20231005 - Julian) Blur Mask */}
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative flex h-auto w-90vw flex-col rounded-xl bg-darkGray1 p-5 shadow-lg shadow-black/80 outline-none focus:outline-none sm:w-420px sm:p-8">
          {/* Info: (20231005 - Julian) Header */}
          <div className="flex items-start">
            {/* Info: (20231005 - Julian) Ticker Title */}
            <div className="flex w-full space-x-2 text-left text-2xl text-lightWhite">
              <Image
                src={`/asset_icon/${closedCfdDetails?.targetAsset.toLowerCase()}.svg`}
                alt={`${closedCfdDetails?.targetAsset}_icon`}
                width={30}
                height={30}
              />
              <h3>{closedCfdDetails.instId}</h3>
            </div>
            {/* Info: (20231005 - Julian) Close Button */}
            <button
              id="HistoryModalCloseButton"
              onClick={modalClickHandler}
              className="absolute right-5 top-5 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
            >
              <ImCross />
            </button>
          </div>
          {/* Info: (20231005 - Julian) Form Content */}
          {formContent}
        </div>
      </div>
    </div>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default HistoryPositionModal;

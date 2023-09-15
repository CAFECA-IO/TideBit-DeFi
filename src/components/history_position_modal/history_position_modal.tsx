import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {FRACTION_DIGITS, unitAsset} from '../../constants/config';
import {useContext} from 'react';
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

type TranslateFunction = (s: string) => string;
interface IHistoryPositionModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  closedCfdDetails: IDisplayCFDOrder;
}

const HistoryPositionModal = ({
  modalVisible,
  modalClickHandler,
  closedCfdDetails: closedCfdDetails,
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

  const displayedGuaranteedStopSetting = !!closedCfdDetails.guaranteedStop ? 'Yes' : 'No';

  const displayedPositionColor = 'text-tidebitTheme';

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const closeValue = roundToDecimalPlaces(
    +SafeMath.mult(closedCfdDetails.closePrice!, closedCfdDetails.amount),
    2,
    true
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

  const socialMediaStyle = 'hover:cursor-pointer hover:opacity-80';

  const openTime = timestampToString(closedCfdDetails.createTimestamp ?? 0);
  const closedTime = timestampToString(closedCfdDetails?.closeTimestamp ?? 0);

  const {share} = useShareProcess({
    lockerName: 'history_position_modal.shareHandler',
    cfd: closedCfdDetails,
    shareType: ShareType.CFD,
    shareId: closedCfdDetails.id,
    enableShare: userCtx.enableShare,
  });

  const formContent = (
    <div className="relative flex w-full flex-auto flex-col pt-0">
      <div
        className={`${displayedBorderColor} mx-7 mt-3 border-1px text-base leading-relaxed text-lightWhite`}
      >
        <div className="flex-col justify-center text-center text-xs">
          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
            <div className={`${displayedPositionColor}`}>
              {displayedTypeOfPosition}
              <span className="ml-1 text-lightGray">{displayedBuyOrSell}</span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
            <div className="">
              {numberFormatted(closedCfdDetails?.amount)}
              <span className="ml-1 text-lightGray">{closedCfdDetails.targetAsset}</span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
            <div className={`${displayedPnLColor}`}>
              {displayedPnLSymbol} $ {displayedPnLValue}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.OPEN_VALUE')}</div>
            <div className="">$ {numberFormatted(closedCfdDetails?.openValue)}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_VALUE')}</div>
            <div className="">$ {numberFormatted(closeValue)}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
            <div className="">
              {numberFormatted(closedCfdDetails?.openPrice)}
              <span className="ml-1 text-lightGray">{unitAsset}</span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
            <div className="">
              {numberFormatted(closedCfdDetails?.closePrice ?? 0)}
              <span className="ml-1 text-lightGray">{unitAsset}</span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
            <div className="">
              {openTime.date} {openTime.time}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_TIME')}</div>
            <div className="">
              {closedTime.date} {closedTime.time}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.TP_AND_SL')}</div>
            <div className="">
              <span className={`text-lightWhite`}>
                {numberFormatted(closedCfdDetails?.takeProfit, true)}
              </span>{' '}
              /{' '}
              <span className={`text-lightWhite`}>
                {numberFormatted(closedCfdDetails?.stopLoss, true)}
              </span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
            <div className={``}>{displayedGuaranteedStopSetting}</div>
          </div>

          {closedCfdDetails.guaranteedStop && (
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP_FEE')}</div>
              <div className={`${TypeOfPnLColor.LOSS}`}>
                {`- $ ${numberFormatted(closedCfdDetails?.guaranteedStopFee)}`}
              </div>
            </div>
          )}

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.STATE')}</div>
            <div className="">{displayedPositionState}</div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_REASON')}</div>
            <div className="">{displayedClosedReason}</div>
          </div>
        </div>
      </div>
      <div
        className={`mx-7 mt-2 flex items-center justify-end pb-3 text-base leading-relaxed text-lightGray`}
      >
        <div className="text-sm">{t('POSITION_MODAL.SHARE')}:</div>
        <div className="flex items-center justify-between">
          {Object.entries(ShareSettings).map(([key, value]) => (
            <div key={key} className={`${socialMediaStyle}`}>
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
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="mx-7 mb-1 mt-5 flex w-full justify-between">
                <div className="flex w-full items-center justify-center space-x-2 text-center text-2xl text-lightWhite">
                  {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
                  <Image
                    src={`/asset_icon/${closedCfdDetails?.targetAsset.toLowerCase()}.svg`}
                    alt="currency icon"
                    width={30}
                    height={30}
                  />
                  <h3 className="">{closedCfdDetails.instId} </h3>
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-4 top-4 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {formContent}

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

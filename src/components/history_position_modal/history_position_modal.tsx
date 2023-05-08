import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {API_ROUTE_DOMAIN, unitAsset} from '../../constants/config';
import Toggle from '../toggle/toggle';
import {useContext, useRef, useState} from 'react';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import {useGlobal} from '../../contexts/global_context';
import {timestampToString} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {CFDClosedType} from '../../constants/cfd_closed_type';
import {OrderState} from '../../constants/order_state';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {useTranslation} from 'react-i18next';

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
  // console.log('openCfdDetails in details modal: ', openCfdDetails.id);
  // const globalCtx = useGlobal();
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

  const displayedPnLSymbol =
    closedCfdDetails.pnl.type === 'PROFIT' ? '+' : closedCfdDetails.pnl.type === 'LOSS' ? '-' : '';

  const displayedTypeOfPosition =
    closedCfdDetails?.typeOfPosition === 'BUY'
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    closedCfdDetails?.typeOfPosition === 'BUY'
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const displayedPnLColor =
    closedCfdDetails?.pnl.type === 'PROFIT'
      ? TypeOfPnLColor.PROFIT
      : closedCfdDetails?.pnl.type === 'LOSS'
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    closedCfdDetails?.pnl.type === 'PROFIT'
      ? TypeOfBorderColor.PROFIT
      : closedCfdDetails?.pnl.type === 'LOSS'
      ? TypeOfBorderColor.LOSS
      : TypeOfBorderColor.EQUAL;

  const displayedPositionState =
    closedCfdDetails.state === OrderState.OPENING
      ? t('POSITION_MODAL.STATE_OPEN')
      : t('POSITION_MODAL.STATE_CLOSED');

  const socialMediaStyle = 'hover:cursor-pointer hover:opacity-80';

  const openTime = timestampToString(closedCfdDetails.createTimestamp ?? 0);
  const closedTime = timestampToString(closedCfdDetails?.closeTimestamp ?? 0);

  const shareToFacebook = () => {
    const shareUrl = API_ROUTE_DOMAIN + `/share/cfd/${Date.now()}`;
    // const shareUrl = API_ROUTE_DOMAIN + `/api/images/cfd/${Date.now()}`;

    window.open(`${shareUrl}`);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'facebook-share-dialog',
      'width=800,height=600'
    );
  };

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
              {closedCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              }) ?? 0}
              <span className="ml-1 text-lightGray">{closedCfdDetails.ticker}</span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
            <div className={`${displayedPnLColor}`}>
              {displayedPnLSymbol} ${' '}
              {closedCfdDetails?.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.OPEN_VALUE')}</div>
            <div className="">
              ${' '}
              {closedCfdDetails?.openValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              }) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_VALUE')}</div>
            <div className="">
              ${' '}
              {(closedCfdDetails?.closeValue ?? 0)?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              }) ?? 0}
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
            <div className="">
              {closedCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              }) ?? 0}
              <span className="ml-1 text-lightGray">{unitAsset}</span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
            <div className="">
              {closedCfdDetails?.closePrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                minimumFractionDigits: 2,
              }) ?? 0}
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
                {closedCfdDetails?.takeProfit?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? '-'}
              </span>{' '}
              /{' '}
              <span className={`text-lightWhite`}>
                {closedCfdDetails?.stopLoss?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? '-'}
              </span>
            </div>
          </div>

          <div className={`${layoutInsideBorder}`}>
            <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
            <div className={``}>{displayedGuaranteedStopSetting}</div>
          </div>

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
          <div className={`${socialMediaStyle}`}>
            <Image
              onClick={shareToFacebook}
              src="/elements/group_15237.svg"
              width={44}
              height={44}
              alt="Facebook"
            />
          </div>

          <div className={`${socialMediaStyle}`}>
            <Image src="/elements/group_15236.svg" width={44} height={44} alt="Instagram" />
          </div>

          <div className={`${socialMediaStyle}`}>
            <Image src="/elements/group_15235.svg" width={44} height={44} alt="Twitter" />
          </div>

          <div className={`${socialMediaStyle}`}>
            <Image src="/elements/group_15234.svg" width={44} height={44} alt="Reddit" />
          </div>
        </div>
      </div>
    </div>
  );

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="mx-7 mb-1 mt-5 flex w-full justify-between">
                <div className="flex w-full items-center justify-center space-x-2 text-center text-2xl text-lightWhite">
                  {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
                  <Image
                    src={marketCtx.selectedTicker?.tokenImg ?? ''}
                    alt="currency icon"
                    width={30}
                    height={30}
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

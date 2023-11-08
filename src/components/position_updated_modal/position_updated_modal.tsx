import {ImCross} from 'react-icons/im';
import {DELAYED_HIDDEN_SECONDS, TypeOfBorderColor} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {
  findCodeByReason,
  getValueByProp,
  locker,
  numberFormatted,
  roundToDecimalPlaces,
  timestampToString,
  validateNumberFormat,
  wait,
} from '../../lib/common';
import React, {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {IUpdatedCFDInputProps, useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'next-i18next';
import {unitAsset} from '../../constants/config';
import {IApplyUpdateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {CFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {Code} from '../../constants/code';
import {isCustomError} from '../../lib/custom_error';
import SafeMath from '../../lib/safe_math';
import Tooltip from '../tooltip/tooltip';

type TranslateFunction = (s: string) => string;
interface IPositionUpdatedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayCFDOrder;
  updatedProps?: IApplyUpdateCFDOrder;
}

const PositionUpdatedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  updatedProps,
}: IPositionUpdatedModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();

  const [tpTextStyle, setTpTextStyle] = useState('text-lightWhite');
  const [slTextStyle, setSlTextStyle] = useState('text-lightWhite');
  const [gtslTextStyle, setGtslTextStyle] = useState('text-lightWhite');
  const [disabled, setDisabled] = useState(false);

  const displayedPositionColor = 'text-tidebitTheme';
  const displayedBorderColor = TypeOfBorderColor.EQUAL;
  const layoutInsideBorder = 'flex justify-between w-full px-5 my-2';
  const spreadSymbol = openCfdDetails.openSpreadFee > 0 ? '+' : '-';

  const toApplyUpdateOrder = (position: IDisplayCFDOrder): IApplyUpdateCFDOrder => {
    const gsl = marketCtx.guaranteedStopFeePercentage;
    const gslFee = updatedProps?.guaranteedStop
      ? roundToDecimalPlaces(+SafeMath.mult(gsl ?? 0, position.openValue), 2)
      : 0;
    const request: IApplyUpdateCFDOrder = {
      operation: CFDOperation.UPDATE,
      orderType: OrderType.CFD,
      referenceId: position.id,
      ...updatedProps,
      guaranteedStop: updatedProps?.guaranteedStop ?? false,
      guaranteedStopFee: gslFee,
    };

    return request;
  };

  // Info: To show the updated CFD in UpdateFormModal: Create a function to compare the difference between updatedProps and openCfdDetails, if there's different, change the openCfdDetails's value to updatedProps's value
  const compareUpdatedProps = (position: IDisplayCFDOrder) => {
    const updatedPosition = {...position};

    if (updatedProps?.takeProfit !== updatedPosition.takeProfit) {
      updatedPosition.takeProfit =
        updatedProps?.takeProfit === undefined || 0 ? undefined : updatedProps.takeProfit;
    }

    if (updatedProps?.stopLoss !== updatedPosition.stopLoss) {
      updatedPosition.stopLoss =
        updatedProps?.stopLoss === undefined || 0 ? undefined : updatedProps.stopLoss;
    }

    if (position.guaranteedStop) {
      return updatedPosition;
    } else if (!position.guaranteedStop && !!updatedProps?.guaranteedStop) {
      if (!!updatedProps?.stopLoss) {
        updatedPosition.stopLoss = updatedProps.stopLoss;
      }
      updatedPosition.guaranteedStop = updatedProps.guaranteedStop;
      updatedPosition.guaranteedStopFee = updatedProps.guaranteedStopFee;
    }

    return updatedPosition;
  };

  const submitClickHandler = async () => {
    const [lock, unlock] = locker('position_updated_modal.submitClickHandler');

    if (!lock()) return;
    const applyUpdateOrder = toApplyUpdateOrder(openCfdDetails);

    await wait(DELAYED_HIDDEN_SECONDS / 5);
    modalClickHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: t('POSITION_MODAL.UPDATE_POSITION_TITLE'),
      modalContent: t('POSITION_MODAL.CONFIRM_CONTENT'),
      isShowZoomOutBtn: false,
    });
    globalCtx.visibleLoadingModalHandler();

    try {
      const result = await userCtx.updateCFDOrder(applyUpdateOrder);

      if (result.success) {
        const updatedPosition = compareUpdatedProps(openCfdDetails);
        // TODO: (20230413 - Shirley) the button URL
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('POSITION_MODAL.UPDATE_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.TRANSACTION_BROADCAST'),
          btnMsg: t('POSITION_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
          isShowZoomOutBtn: false,
        });

        // TODO: (20230317 - Shirley) temporary waiting
        await wait(DELAYED_HIDDEN_SECONDS);

        globalCtx.eliminateAllModals();

        globalCtx.dataSuccessfulModalHandler({
          modalTitle: t('POSITION_MODAL.UPDATE_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.TRANSACTION_SUCCEED'),
          btnMsg: t('POSITION_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
        });

        globalCtx.visibleSuccessfulModalHandler();

        await wait(DELAYED_HIDDEN_SECONDS);
        globalCtx.eliminateAllModals();

        globalCtx.dataUpdateFormModalHandler(updatedPosition);
        globalCtx.visibleUpdateFormModalHandler();
      } else if (
        // Info: cancel (20230412 - Shirley)
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('POSITION_MODAL.UPDATE_POSITION_TITLE'),
          modalContent: `${t('POSITION_MODAL.FAILED_REASON_CANCELED')} (${result.code})`,
        });

        globalCtx.visibleCanceledModalHandler();
      } else {
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.UPDATE_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_UPDATE')} (${result.code})`,
        });

        globalCtx.visibleFailedModalHandler();
      }
    } catch (error) {
      // ToDo: report error to backend (20230413 - Shirley)
      globalCtx.eliminateAllModals();

      if (isCustomError(error)) {
        const str = error.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_UPDATE')} (${errorCode})`,
        });

        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.UPDATE_POSITION_TITLE'),

          modalContent: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_UPDATE')} (${
            Code.UNKNOWN_ERROR_IN_COMPONENT
          })`,
        });

        globalCtx.visibleFailedModalHandler();
      }
    } finally {
      unlock();
      return;
    }
  };

  // Info: Double check if the value is updated (20230413 - Shirley)
  const renewDataStyle = () => {
    if (!updatedProps || Object.keys(updatedProps).length === 0) return;

    updatedProps.guaranteedStop && updatedProps.guaranteedStop !== openCfdDetails?.guaranteedStop
      ? setGtslTextStyle('text-lightYellow2')
      : setGtslTextStyle('text-lightWhite');

    // Info: 如果原本是0、undefined，updatedProps也是０、undefined，則不顯示 (20231103 - Shirley)
    (!openCfdDetails.takeProfit && !!updatedProps.takeProfit === !!openCfdDetails.takeProfit) ||
    updatedProps.takeProfit === openCfdDetails?.takeProfit
      ? setTpTextStyle('text-lightWhite')
      : setTpTextStyle('text-lightYellow2');

    (!openCfdDetails.stopLoss && !!updatedProps.stopLoss === !!openCfdDetails.stopLoss) ||
    updatedProps.stopLoss === openCfdDetails?.stopLoss
      ? setSlTextStyle('text-lightWhite')
      : setSlTextStyle('text-lightYellow2');
  };

  const validateRequest = (request: IUpdatedCFDInputProps) => {
    const propertiesToCheck = ['stopLoss', 'takeProfit'];

    const isValidFormat = propertiesToCheck.every(prop => {
      const value = getValueByProp(request, prop);

      if (value === undefined && (prop === 'stopLoss' || prop === 'takeProfit')) {
        return true;
      }

      const each = validateNumberFormat(value);
      return each;
    });

    if (!isValidFormat) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    renewDataStyle();

    if (updatedProps) {
      validateRequest(updatedProps);
    } else {
      setDisabled(true);
    }
  }, [globalCtx.visiblePositionUpdatedModal]);

  const displayedGuaranteedStopSetting = updatedProps?.guaranteedStop
    ? t('POSITION_MODAL.GUARANTEED_STOP_YES')
    : openCfdDetails?.guaranteedStop
    ? t('POSITION_MODAL.GUARANTEED_STOP_YES')
    : t('POSITION_MODAL.GUARANTEED_STOP_NO');

  // Info: updatedProps 都會有值，故判斷：若為0或undefined，則無論跟original是否有出入，都顯示'-'；若不為0或undefined，則判斷跟original是否有出入，有出入就顯示 updatedProps，值相同就顯示 openCfdDetails (20230802 - Shirley)
  const displayedTakeProfit = !!updatedProps?.takeProfit
    ? openCfdDetails.takeProfit !== updatedProps.takeProfit
      ? `${numberFormatted(updatedProps.takeProfit)}`
      : `${numberFormatted(openCfdDetails.takeProfit)}`
    : !!openCfdDetails.takeProfit !== !!updatedProps?.takeProfit
    ? '-'
    : '-';

  const displayedStopLoss = !!updatedProps?.stopLoss
    ? openCfdDetails.stopLoss !== updatedProps.stopLoss
      ? `${numberFormatted(updatedProps.stopLoss)}`
      : `${numberFormatted(openCfdDetails.stopLoss)}`
    : !!openCfdDetails.stopLoss !== !!updatedProps?.stopLoss
    ? '-'
    : '-';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const formContent = (
    <div className="mt-4 flex flex-col px-6 pb-2">
      <div className="flex items-center justify-center space-x-2 text-center lg:text-sm">
        <Image
          src={`/asset_icon/${openCfdDetails?.targetAsset.toLowerCase()}.svg`}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{openCfdDetails?.instId}</div>
      </div>

      <div className="relative flex flex-col items-center pt-1">
        <div
          className={`${displayedBorderColor} mt-3 w-full border-1px py-3 text-sm leading-relaxed text-lightWhite`}
        >
          <div className="flex flex-col justify-center text-center">
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>

              <div className={`${displayedPositionColor}`}>
                {displayedTypeOfPosition}
                <span className="ml-1 text-lightWhite">{displayedBuyOrSell}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
              <div className="flex items-baseline space-x-1">
                {numberFormatted(openCfdDetails?.openSpotPrice)}{' '}
                <span className="ml-1 whitespace-nowrap text-xs text-lightGray">
                  {spreadSymbol}
                  {numberFormatted(openCfdDetails?.openSpreadFee)}
                </span>
                {<p>→ {numberFormatted(openCfdDetails.openPrice)}</p>}
                <span className="ml-1 text-lightGray text-xs">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div>
            <div className={`${layoutInsideBorder} items-center`}>
              <div className="flex">
                <div className="text-lightGray mr-1">{t('POSITION_MODAL.TP_AND_SL')}</div>
                <Tooltip className={``} tooltipPosition="left-2">
                  <p className="w-56 text-left text-sm font-medium text-white">
                    {t('POSITION_MODAL.TP_AND_SL_HINT')}
                  </p>
                </Tooltip>
              </div>

              <div className="">
                <span className={`${tpTextStyle}`}>{displayedTakeProfit}</span> /{' '}
                <span className={`${slTextStyle}`}>{displayedStopLoss}</span>
                <span className={`ml-1 text-lightGray text-xs`}>{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
              <div className="flex">
                <div className={`${gtslTextStyle} flex`}>
                  {displayedGuaranteedStopSetting}

                  {updatedProps?.guaranteedStop || openCfdDetails?.guaranteedStop ? (
                    <span className="flex items-baseline">
                      <span className="text-lightGray mx-1">({t('POSITION_MODAL.FEE')}:</span>
                      <span className="">{`${numberFormatted(
                        (updatedProps?.guaranteedStopFee || openCfdDetails.guaranteedStopFee) ?? 0
                      )}`}</span>
                      <span className="text-lightGray ml-1 text-xs">{unitAsset}</span>
                      <span className="text-lightGray text-sm">)</span>
                    </span>
                  ) : null}
                </div>

                <Tooltip className="top-px ml-1">
                  <p className="w-56 text-left text-sm font-medium text-white">
                    {t('POSITION_MODAL.GUARANTEED_STOP_HINT')}
                  </p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="my-5 text-xs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          disabled={disabled}
          onClick={submitClickHandler}
          buttonType="button"
          className={`mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme w-90vw sm:w-300px py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none`}
        >
          {t('POSITION_MODAL.CONFIRM_BUTTON')}
        </RippleButton>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          {' '}
          <div className="relative flex h-auto w-90vw flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none sm:w-420px sm:p-8">
            <div className="flex items-start justify-between rounded-t pt-9 lg:pt-3">
              <div className="flex w-full flex-col items-center">
                <h3 className="w-full text-center text-xl font-normal text-lightWhite lg:text-3xl">
                  {t('POSITION_MODAL.UPDATE_POSITION_TITLE')}
                </h3>
                <p className="text-base text-lightGray">{t('POSITION_MODAL.CFD_TRADE')}</p>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
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
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default PositionUpdatedModal;

import {ImCross} from 'react-icons/im';
import {
  DEFAULT_LEVERAGE,
  DELAYED_HIDDEN_SECONDS,
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {
  locker,
  randomIntFromInterval,
  timestampToString,
  wait,
  getDeadline,
  getTimestamp,
  getTimestampInMilliseconds,
  roundToDecimalPlaces,
  findCodeByReason,
  toPnl,
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {
  DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS,
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
  SUGGEST_SL,
  SUGGEST_TP,
  WAITING_TIME_FOR_USER_SIGNING,
  unitAsset,
  FRACTION_DIGITS,
} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'react-i18next';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IApplyCloseCFDOrder} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import useStateRef from 'react-usestateref';
import {OrderState} from '../../constants/order_state';
import {defaultResultFailed, IResult} from '../../interfaces/tidebit_defi_background/result';
import {CFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {CFDClosedType} from '../../constants/cfd_closed_type';
import {ICFDOrder} from '../../interfaces/tidebit_defi_background/order';
import {Code, Reason} from '../../constants/code';
import {ToastTypeAndText} from '../../constants/toast_type';
import {ToastId} from '../../constants/toast_id';
import {CustomError, isCustomError} from '../../lib/custom_error';
import SafeMath from '../../lib/safe_math';

type TranslateFunction = (s: string) => string;
interface IPositionClosedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayCFDOrder;
}

const PositionClosedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails: openCfdDetails,
  ...otherProps
}: IPositionClosedModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  const [quotationError, setQuotationError, quotationErrorRef] = useStateRef(false);
  const [quotationErrorMessage, setQuotationErrorMessage, quotationErrorMessageRef] =
    useStateRef<IResult>(defaultResultFailed);

  // Info: dummy data (20230329 - Shirley)
  const quotation: IQuotation = {
    instId: openCfdDetails?.instId,
    typeOfPosition: openCfdDetails?.typeOfPosition,
    price: randomIntFromInterval(20, 29),
    spotPrice: randomIntFromInterval(20, 29),
    targetAsset: openCfdDetails?.targetAsset,
    unitAsset: openCfdDetails?.unitAsset,
    deadline: getDeadline(QUOTATION_RENEWAL_INTERVAL_SECONDS),
    signature: '0x',
  };

  const [gQuotation, setGQuotation, gQuotationRef] = useStateRef<IQuotation>(quotation);

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS
  );

  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  const [pnlRenewedStyle, setPnlRenewedStyle] = useState('');

  const displayedGuaranteedStopSetting = !!openCfdDetails?.guaranteedStop ? 'Yes' : 'No';

  const displayedPnLSymbol = !!openCfdDetails.pnl
    ? openCfdDetails?.pnl > 0
      ? '+'
      : openCfdDetails?.pnl < 0
      ? '-'
      : ''
    : '';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const displayedPnLColor = !!openCfdDetails?.pnl
    ? openCfdDetails?.pnl > 0
      ? TypeOfPnLColor.PROFIT
      : openCfdDetails?.pnl < 0
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL
    : TypeOfPnLColor.EQUAL;

  const displayedBorderColor = !!openCfdDetails?.pnl
    ? openCfdDetails?.pnl > 0
      ? TypeOfBorderColor.PROFIT
      : openCfdDetails?.pnl < 0
      ? TypeOfBorderColor.LOSS
      : TypeOfBorderColor.EQUAL
    : TypeOfBorderColor.EQUAL;

  const displayedPositionColor = 'text-tidebitTheme';

  const layoutInsideBorder = 'mx-5 my-2 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const toDisplayCloseOrder = (cfd: IDisplayCFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    const pnlSoFar = toPnl({
      openPrice: cfd.openPrice,
      closePrice: quotation.price,
      amount: cfd.amount,
      typeOfPosition: cfd.typeOfPosition,
      spread: marketCtx.getTickerSpread(cfd.instId),
    });
    return {
      ...cfd,
      closePrice: 0,
      pnl: pnlSoFar,
    };
  };

  const toApplyCloseOrder = (
    order: IDisplayCFDOrder,
    quotation: IQuotation
  ): IApplyCloseCFDOrder => {
    if (order.state !== OrderState.OPENING) {
      const error = new CustomError(Code.ORDER_NOT_OPENING);
      throw error;
    }

    const request: IApplyCloseCFDOrder = {
      referenceId: order.id,
      orderType: OrderType.CFD,
      operation: CFDOperation.CLOSE,
      closePrice: quotation.price,
      quotation: quotation,
      closeTimestamp: getTimestamp(),
      closedType: CFDClosedType.BY_USER, // TODO: veridy this (20230330 - tzuhan)
    };

    return request;
  };

  // Info: (20230315 - Shirley) organize the data before history modal
  const toHistoryModal = (cfd: ICFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    // TODO: replace `twoDecimal` with `toLocaleString` (20230325 - Shirley)
    const openPrice = cfd.openPrice;
    const closePrice = quotation.price;
    const leverage = marketCtx.tickerStatic?.leverage ?? DEFAULT_LEVERAGE;

    const openValue = roundToDecimalPlaces(+SafeMath.mult(openPrice, cfd.amount), 2);

    const pnl =
      cfd?.pnl ||
      toPnl({
        openPrice: openPrice,
        closePrice: closePrice,
        amount: cfd.amount,
        typeOfPosition: cfd.typeOfPosition,
        spread: marketCtx.getTickerSpread(cfd.instId),
      });

    const suggestion: ICFDSuggestion = {
      takeProfit:
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? +SafeMath.mult(openValue, SafeMath.plus(1, SafeMath.div(SUGGEST_TP, leverage)))
          : +SafeMath.mult(openValue, SafeMath.minus(1, SafeMath.div(SUGGEST_TP, leverage))),
      stopLoss:
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? +SafeMath.mult(openValue, SafeMath.minus(1, SafeMath.div(SUGGEST_SL, leverage)))
          : +SafeMath.mult(openValue, SafeMath.plus(1, SafeMath.div(SUGGEST_SL, leverage))),
    };

    const historyCfd: IDisplayCFDOrder = {
      ...cfd,
      pnl: pnl,
      openValue: openValue,
      // closeValue: closeValue,
      // positionLineGraph: positionLineGraph,
      suggestion: suggestion,
      // stateCode: cfdStateCode.COMMON,

      closeTimestamp: quotation.deadline,
      closePrice: closePrice,
      closedType: CFDClosedType.BY_USER,
      state: OrderState.CLOSED,
    };

    return historyCfd;
  };

  const getQuotation = async () => {
    let quotation = {...defaultResultFailed};
    const oppositeTypeOfPosition =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? TypeOfPosition.SELL
        : TypeOfPosition.BUY;

    try {
      quotation = await marketCtx.getCFDQuotation(openCfdDetails?.instId, oppositeTypeOfPosition);

      const data = quotation.data as IQuotation;

      // Info: if there's error fetching quotation, disable the submit btn (20230328 - Shirley)
      if (
        quotation.success &&
        data.typeOfPosition === oppositeTypeOfPosition &&
        data.instId === openCfdDetails.instId &&
        quotation.data !== null
      ) {
        globalCtx.eliminateToasts(ToastId.GET_QUOTATION_ERROR);
        setQuotationError(false);
        return data;
      } else {
        setQuotationError(true);

        // TODO: check the unit asset (20230612 - Shirley)
        if (data.instId !== openCfdDetails.instId) {
          setQuotationErrorMessage({
            success: false,
            code: Code.INCONSISTENT_TICKER_OF_QUOTATION,
            reason: Reason[Code.INCONSISTENT_TICKER_OF_QUOTATION],
          });

          // Deprecated: for debug (20230609 - Shirley)
          globalCtx.toast({
            type: ToastTypeAndText.ERROR.type,
            toastId: ToastId.INCONSISTENT_TICKER_OF_QUOTATION,
            message: `[t] ${quotationErrorMessageRef.current.reason} (${quotationErrorMessageRef.current.code})`,
            typeText: t(ToastTypeAndText.ERROR.text),
            isLoading: false,
            autoClose: false,
          });
        }

        /* Info: (20230508 - Julian) get quotation error message */
        setQuotationErrorMessage({success: false, code: quotation.code, reason: quotation.reason});
      }
    } catch (err) {
      setQuotationError(true);
      /* Info: (20230508 - Julian) get quotation error message */
      setQuotationErrorMessage({success: false, code: quotation.code, reason: quotation.reason});
      // Deprecated: for debug (20230609 - Shirley)
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.UNKNOWN_ERROR_IN_COMPONENT,
        message: `[t] ${quotationErrorMessageRef.current.reason} (${quotationErrorMessageRef.current.code})`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
    }
  };

  const submitClickHandler = async () => {
    const [lock, unlock] = locker('position_closed_modal.submitClickHandler');
    if (!lock()) return;

    const applyCloseOrder: IApplyCloseCFDOrder = toApplyCloseOrder(
      openCfdDetails,
      gQuotationRef.current
    );

    await wait(DELAYED_HIDDEN_SECONDS / 5);
    modalClickHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
      modalContent: t('POSITION_MODAL.CONFIRM_CONTENT'),
      isShowZoomOutBtn: false,
    });
    globalCtx.visibleLoadingModalHandler();

    try {
      const result = await userCtx.closeCFDOrder(applyCloseOrder);

      if (result.success) {
        const historyData: IDisplayCFDOrder = toHistoryModal(openCfdDetails, gQuotationRef.current);

        // TODO: (20230413 - Shirley) the button URL
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.TRANSACTION_BROADCAST'),
          btnMsg: t('POSITION_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
          isShowZoomOutBtn: false,
        });

        await wait(DELAYED_HIDDEN_SECONDS);

        globalCtx.eliminateAllModals();

        globalCtx.dataSuccessfulModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.TRANSACTION_SUCCEED'),
          btnMsg: t('POSITION_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
        });

        globalCtx.visibleSuccessfulModalHandler();

        await wait(DELAYED_HIDDEN_SECONDS);
        globalCtx.eliminateAllModals();

        globalCtx.dataHistoryPositionModalHandler(historyData);
        globalCtx.visibleHistoryPositionModalHandler();
      } else if (
        // Info: cancel (20230412 - Shirley)
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          modalContent: `${t('POSITION_MODAL.FAILED_REASON_CANCELED')} (${result.code})`,
        });

        globalCtx.visibleCanceledModalHandler();
      } else {
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_CLOSE')} (${result.code})`,
        });

        globalCtx.visibleFailedModalHandler();
      }
    } catch (error: any) {
      // ToDo: report error to backend (20230413 - Shirley)
      globalCtx.eliminateAllModals();

      if (isCustomError(error)) {
        const str = error.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_CLOSE')} (${errorCode})`,
        });

        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_CLOSE')} (${
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

  const renewDataStyleHandler = async (quotation: IQuotation) => {
    setDataRenewedStyle('animate-flash text-lightYellow2');
    setPnlRenewedStyle('animate-flash text-lightYellow2');

    const base = quotation.deadline - WAITING_TIME_FOR_USER_SIGNING;
    const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
    setSecondsLeft(tickingSec > 0 ? Math.floor(tickingSec) : 0);

    const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, quotation);

    globalCtx.dataPositionClosedModalHandler(displayedCloseOrder);

    await wait(DELAYED_HIDDEN_SECONDS / 5);

    setDataRenewedStyle('text-lightYellow2');
    setPnlRenewedStyle('text-lightYellow2');

    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
    setPnlRenewedStyle('');
  };

  // Info: Get quotation before the modal is shown (20230329 - Shirley)
  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) return;
    (async () => {
      const quotation = await getQuotation();
      if (!quotation) {
        /* Info: (20230508 - Julian) exception handling: error toast */
        globalCtx.toast({
          type: ToastTypeAndText.ERROR.type,
          toastId: ToastId.GET_QUOTATION_ERROR,
          message: `${t(
            quotationErrorMessageRef.current.reason ?? 'ERROR_MESSAGE.UNKNOWN_ERROR'
          )} (${quotationErrorMessageRef.current.code})`,
          typeText: t(ToastTypeAndText.ERROR.text),
          isLoading: false,
          autoClose: false,
        });
        return;
        // TODO: check users' signature in userCtx (20230613 - Shirley)
      } else if (quotation.instId === openCfdDetails.instId) {
        const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, quotation);
        globalCtx.dataPositionClosedModalHandler(displayedCloseOrder);

        setGQuotation(quotation);
        setDataRenewedStyle('text-lightWhite');
        setQuotationError(false);
      }
    })();
  }, [globalCtx.visiblePositionClosedModal]);

  // Info: renew the quotation when it expires (20230530 - Shirley)
  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) {
      setSecondsLeft(DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS);
      setDataRenewedStyle('text-lightWhite');
      setQuotationError(true);
      return;
    }

    const intervalId = setInterval(async () => {
      const base = gQuotationRef.current.deadline - WAITING_TIME_FOR_USER_SIGNING;

      const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;

      setSecondsLeft(tickingSec > 0 ? Math.floor(tickingSec) : 0);

      if (secondsLeft === 0) {
        const quotation = await getQuotation();

        if (!quotation) {
          setQuotationError(true);
          return;
        }

        setGQuotation(quotation);
        renewDataStyleHandler(quotation);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft, globalCtx.visiblePositionClosedModal]);

  const formContent = (
    <div className="mt-4 flex flex-col px-6 pb-2">
      <div className="flex items-center justify-center space-x-2 text-center">
        <Image
          src={`/asset_icon/${openCfdDetails?.targetAsset.toLowerCase()}.svg`}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{openCfdDetails?.instId}</div>
      </div>

      <div className="absolute right-6 top-90px flex items-center space-x-1 text-center">
        <BsClockHistory size={20} className="text-lightGray" />
        <p className="w-8 text-xs">00:{secondsLeft.toString().padStart(2, '0')}</p>
      </div>

      <div className="relative flex flex-col items-center pt-1">
        <div
          className={`${displayedBorderColor} mt-1 w-full border-1px py-4 text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex flex-col justify-center text-center">
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
              <div className={`${displayedPositionColor}`}>
                {displayedTypeOfPosition}
                <span className="ml-1 text-lightGray">{displayedBuyOrSell}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
              <div className="">
                {openCfdDetails?.openPrice.toLocaleString(
                  UNIVERSAL_NUMBER_FORMAT_LOCALE,
                  FRACTION_DIGITS
                ) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
              <div className="">
                {openCfdDetails?.amount.toLocaleString(
                  UNIVERSAL_NUMBER_FORMAT_LOCALE,
                  FRACTION_DIGITS
                )}{' '}
                <span className="ml-1 text-lightGray">{openCfdDetails?.targetAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
              <div className={`${dataRenewedStyle}`}>
                {openCfdDetails.closePrice
                  ? openCfdDetails.closePrice.toLocaleString(
                      UNIVERSAL_NUMBER_FORMAT_LOCALE,
                      FRACTION_DIGITS
                    )
                  : gQuotationRef.current.price?.toLocaleString(
                      UNIVERSAL_NUMBER_FORMAT_LOCALE,
                      FRACTION_DIGITS
                    ) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
              <div className={`${pnlRenewedStyle} ${displayedPnLColor}`}>
                {displayedPnLSymbol} ${' '}
                {Math.abs(openCfdDetails?.pnl ?? 0).toLocaleString(
                  UNIVERSAL_NUMBER_FORMAT_LOCALE,
                  FRACTION_DIGITS
                )}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
              <div className={``}>{displayedGuaranteedStopSetting}</div>
            </div>

            {openCfdDetails.guaranteedStop && (
              <div className={`${layoutInsideBorder}`}>
                <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP_FEE')}</div>
                <div className={`${TypeOfPnLColor.LOSS}`}>
                  {`- $ ${roundToDecimalPlaces(openCfdDetails?.guaranteedStopFee ?? 0, 2)}`}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="my-3 text-xs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          disabled={secondsLeft < 1 || quotationErrorRef.current}
          onClick={submitClickHandler}
          buttonType="button"
          className={`mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme px-16 py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
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
          <div className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="w-full text-center text-xl font-normal text-lightWhite">
                {t('POSITION_MODAL.CLOSE_POSITION_TITLE')}
              </h3>
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

export default PositionClosedModal;

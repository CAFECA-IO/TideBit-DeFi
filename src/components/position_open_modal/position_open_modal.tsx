import {ImCross} from 'react-icons/im';
import {
  DELAYED_HIDDEN_SECONDS,
  TOAST_DURATION_SECONDS,
  TypeOfBorderColor,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Tooltip from '../tooltip/tooltip';
import Image from 'next/image';
import {
  locker,
  wait,
  getTimestamp,
  getTimestampInMilliseconds,
  findCodeByReason,
  validateCFD,
  toDisplayCFDOrder,
  toPnl,
  roundToDecimalPlaces,
  numberFormatted,
  validateNumberFormat,
  getValueByProp,
} from '../../lib/common';
import React, {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {BsClockHistory} from 'react-icons/bs';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {
  CFD_LIQUIDATION_TIME,
  DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS,
  LIQUIDATION_PERCENTAGE,
  WAITING_TIME_FOR_USER_SIGNING,
  unitAsset,
} from '../../constants/config';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {useTranslation} from 'next-i18next';
import {
  defaultResultSuccess,
  defaultResultFailed,
  IResult,
} from '../../interfaces/tidebit_defi_background/result';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import useStateRef from 'react-usestateref';
import {Code, Reason} from '../../constants/code';
import {ToastTypeAndText} from '../../constants/toast_type';
import {ToastId} from '../../constants/toast_id';
import {isCustomError} from '../../lib/custom_error';
import {ICFDOrder} from '../../interfaces/tidebit_defi_background/order';
import SafeMath from '../../lib/safe_math';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;
interface IPositionOpenModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdRequest: IApplyCreateCFDOrder;
}

const PROPERTIES_TO_CHECK = [
  'amount',
  'fee',
  'guaranteedStopFee',
  'liquidationPrice',
  'margin.amount',
  'price',
  'stopLoss',
  'takeProfit',
];

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  openCfdRequest,
}: IPositionOpenModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft] = useStateRef(DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS);
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataFetchError, setDataFetchError, dataFetchErrorRef] = useStateRef(false); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataFetchErrorMessage, setDataFetchErrorMessage, dataFetchErrorMessageRef] =
    useStateRef<IResult>(defaultResultFailed); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invalidData, setInvalidData, invalidDataRef] = useStateRef(false); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gslFeePercentage, setGslFeePercentage, gslFeePercentageRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inadequateAvailableBalance, setInadequateAvailableBalance, inadequateAvailableBalanceRef] =
    useStateRef(false);

  const toApplyCreateOrder = (openCfdRequest: IApplyCreateCFDOrder): IApplyCreateCFDOrder => {
    const order: IApplyCreateCFDOrder = {
      ...openCfdRequest,
      createTimestamp: getTimestamp(),
      liquidationTime: openCfdRequest.quotation.deadline + CFD_LIQUIDATION_TIME,
    };

    return order;
  };

  const submitClickHandler = async () => {
    const [lock, unlock] = locker('position_open_modal.submitClickHandler');

    if (!lock()) return;
    const applyCreateOrder: IApplyCreateCFDOrder = toApplyCreateOrder(openCfdRequest);

    await wait(DELAYED_HIDDEN_SECONDS / 5);
    modalClickHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
      modalContent: t('POSITION_MODAL.CONFIRM_CONTENT'),
      isShowZoomOutBtn: false,
    });
    globalCtx.visibleLoadingModalHandler();

    try {
      const result = await userCtx.createCFDOrder(applyCreateOrder);
      if (result.success) {
        // TODO: (20230413 - Shirley) the button URL
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.TRANSACTION_BROADCAST'),
          btnMsg: t('POSITION_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
          isShowZoomOutBtn: false,
        });

        await wait(DELAYED_HIDDEN_SECONDS);

        globalCtx.eliminateAllModals();

        globalCtx.dataSuccessfulModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.TRANSACTION_SUCCEED'),
          btnMsg: t('POSITION_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
        });

        globalCtx.visibleSuccessfulModalHandler();

        await wait(DELAYED_HIDDEN_SECONDS);

        globalCtx.eliminateAllModals();

        const receipt = result.data as {order: ICFDOrder};
        const cfd = userCtx.getCFD(receipt.order.id) ?? {
          ...openCfdRequest,
          ...receipt.order,
        };

        const closePrice = marketCtx.predictCFDClosePrice(cfd.instId, cfd.typeOfPosition);
        const spread = marketCtx.getTickerSpread(cfd.instId);

        const pnl = toPnl({
          openPrice: cfd.openPrice,
          closePrice,
          typeOfPosition: cfd.typeOfPosition,
          amount: cfd.amount,
          spread,
        });

        const display = toDisplayCFDOrder(cfd);

        globalCtx.dataUpdateFormModalHandler({...display, pnl});
        globalCtx.visibleUpdateFormModalHandler();
      } else if (
        // Info: cancel (20230412 - Shirley)
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          modalContent: `${t('POSITION_MODAL.FAILED_REASON_CANCELED')} (${result.code})`,
        });

        globalCtx.visibleCanceledModalHandler();
      } else {
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_OPEN')} (${result.code})`,
        });

        globalCtx.visibleFailedModalHandler();
      }
    } catch (error) {
      notificationCtx.addException(
        'submitClickHandler position_open_modal',
        error as Error,
        Code.UNKNOWN_ERROR
      );
      // ToDo: report error to backend (20230413 - Shirley)
      globalCtx.eliminateAllModals();

      if (isCustomError(error)) {
        const str = error.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_OPEN')} (${errorCode})`,
        });

        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.FAILED_REASON_FAILED_TO_OPEN')} (${
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

  const displayedGuaranteedStopSetting = !!openCfdRequest.guaranteedStop
    ? t('POSITION_MODAL.GUARANTEED_STOP_YES')
    : t('POSITION_MODAL.GUARANTEED_STOP_NO');

  const displayedTypeOfPosition =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const displayedPositionColor = 'text-tidebitTheme';

  const displayedBorderColor = TypeOfBorderColor.EQUAL;

  const displayedTakeProfit = openCfdRequest.takeProfit ? `$ ${openCfdRequest.takeProfit}` : '-';
  const displayedStopLoss = openCfdRequest.stopLoss ? `$ ${openCfdRequest.stopLoss}` : '-';

  const layoutInsideBorder = 'flex justify-between w-full';

  const getQuotation = async () => {
    let result = {...defaultResultSuccess};
    try {
      result = await marketCtx.getCFDQuotation(
        openCfdRequest.instId,
        openCfdRequest.typeOfPosition
      );

      const data = result.data as IQuotation;

      // Info: if there's error fetching quotation, disable the submit btn (20230327 - Shirley)
      if (
        result.success &&
        data.typeOfPosition === openCfdRequest.typeOfPosition &&
        data.instId === openCfdRequest.instId &&
        result.data !== null
      ) {
        globalCtx.eliminateToasts(ToastId.GET_QUOTATION_ERROR);
        setDataFetchError(false);
        return data;
      } else {
        setDataFetchError(true);

        // TODO: check the unit asset (20230612 - Shirley)
        if (data.instId !== openCfdRequest.instId) {
          setDataFetchErrorMessage({
            success: false,
            code: Code.INCONSISTENT_TICKER_OF_QUOTATION,
            reason: Reason[Code.INCONSISTENT_TICKER_OF_QUOTATION],
          });
          return;
        }
        /* Info: (20230508 - Julian) get quotation error message */
        setDataFetchErrorMessage({success: false, code: result.code, reason: result.reason});
      }
    } catch (err) {
      notificationCtx.addException(
        'getQuotation position_open_modal',
        err as Error,
        Code.UNKNOWN_ERROR
      );

      setDataFetchError(true);
      /* Info: (20230508 - Julian) get quotation error message */
      setDataFetchErrorMessage({success: false, code: result.code, reason: result.reason});
    }
  };

  const getGslFeePercentage = async () => {
    let result = {...defaultResultSuccess};

    try {
      result = await marketCtx.getGuaranteedStopFeePercentage();

      if (result.success) {
        const data = result.data as number;
        setGslFeePercentage(data as number);
        return data;
      } else {
        setDataFetchError(true);
        setDataFetchErrorMessage({
          success: false,
          code: result.code,
          reason: result.reason,
        });
      }
    } catch (error) {
      setDataFetchError(true);
      setDataFetchErrorMessage({
        success: false,
        code: result.code,
        reason: result.reason,
      });

      notificationCtx.addException(
        'getGslFeePercentage position_open_modal',
        error as Error,
        Code.UNKNOWN_ERROR,
        '0'
      );
    }
  };

  const renewDataHandler = async () => {
    const newQuotation = await getQuotation();
    const gsl = !!gslFeePercentageRef.current
      ? gslFeePercentageRef.current
      : marketCtx.guaranteedStopFeePercentage ?? 0;

    if (!gsl) {
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.GET_QUOTATION_ERROR,
        message: `${t(dataFetchErrorMessageRef.current.reason ?? 'ERROR_MESSAGE.UNKNOWN_ERROR')} (${
          dataFetchErrorMessageRef.current.code
        })`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
    }

    /* Info: (20230508 - Julian) exception handling: error toast */
    if (!newQuotation || dataFetchErrorRef.current) {
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.GET_QUOTATION_ERROR,
        message: `${t(dataFetchErrorMessageRef.current.reason ?? 'ERROR_MESSAGE.UNKNOWN_ERROR')} (${
          dataFetchErrorMessageRef.current.code
        })`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
      return;
    }

    setDataRenewedStyle('animate-flash text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 5);

    // Info: if it's comments, it couldn't renew the quotation
    const base = newQuotation.deadline - WAITING_TIME_FOR_USER_SIGNING;
    const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
    setSecondsLeft(tickingSec > 0 ? Math.floor(tickingSec) : 0);

    const newPrice = newQuotation.price;

    const newMargin = roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(newQuotation.price, openCfdRequest.amount), 5),
      2
    );

    const newLiquidationPrice =
      openCfdRequest.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(
            +SafeMath.mult(newQuotation.price, SafeMath.minus(1, LIQUIDATION_PERCENTAGE)),
            2
          )
        : roundToDecimalPlaces(
            +SafeMath.mult(newQuotation.price, SafeMath.plus(1, LIQUIDATION_PERCENTAGE)),
            2
          );

    const gslFee = openCfdRequest.guaranteedStop
      ? roundToDecimalPlaces(+SafeMath.mult(gsl, SafeMath.mult(openCfdRequest.amount, newPrice)), 2)
      : 0;

    if (
      SafeMath.lt(userCtx.userAssets?.balance?.available ?? 0, SafeMath.plus(gslFee, newMargin))
    ) {
      setInadequateAvailableBalance(true);

      globalCtx.toast({
        type: ToastTypeAndText.WARNING.type,
        toastId: ToastId.INADEQUATE_AVAILABLE_BALANCE,
        message: `${t('ERROR_MESSAGE.INADEQUATE_AVAILABLE_BALANCE')} (${
          Code.INADEQUATE_AVAILABLE_BALANCE
        })`,
        typeText: t(ToastTypeAndText.WARNING.text),
        isLoading: false,
        autoClose: TOAST_DURATION_SECONDS,
      });
    } else {
      setInadequateAvailableBalance(false);
    }

    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: {
        ...openCfdRequest,
        quotation: newQuotation,
        price: newPrice,
        margin: {
          ...openCfdRequest.margin,
          amount: newMargin,
        },
        guaranteedStopFee: gslFee,
        liquidationPrice: newLiquidationPrice,
      },
    });

    setDataRenewedStyle('text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
  };

  // Info: get the quotation before the modal is shown (20230327 - Shirley)
  useEffect(() => {
    if (!globalCtx.visiblePositionOpenModal) {
      setDataRenewedStyle('text-lightWhite');
      setInvalidData(false);
      setInadequateAvailableBalance(false);
      return;
    }

    if (
      SafeMath.lt(
        userCtx.userAssets?.balance?.available ?? 0,
        SafeMath.plus(openCfdRequest.margin.amount, openCfdRequest.guaranteedStopFee ?? 0)
      )
    ) {
      setInadequateAvailableBalance(true);
    }
    // TODO: check the unit asset (20230612 - Shirley)
    if (openCfdRequest.quotation.instId !== openCfdRequest.instId) {
      setDataFetchError(true);
      setDataFetchErrorMessage({
        success: false,
        code: Code.INCONSISTENT_TICKER_OF_QUOTATION,
        reason: Reason[Code.INCONSISTENT_TICKER_OF_QUOTATION],
      });

      // Deprecated: for debug (20230609 - Shirley)
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.INCONSISTENT_TICKER_OF_QUOTATION,
        message: `${dataFetchErrorMessageRef.current.reason} (${dataFetchErrorMessageRef.current.code})`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
    } else {
      setDataFetchError(false);
    }

    const isValidFormat = PROPERTIES_TO_CHECK.every(prop => {
      const value = getValueByProp(openCfdRequest, prop);

      if (value === undefined && (prop === 'stopLoss' || prop === 'takeProfit')) {
        return true;
      }

      const each = validateNumberFormat(value);
      return each;
    });

    const isValidCFD = validateCFD(openCfdRequest.fee, openCfdRequest.amount);

    if (!isValidFormat || !isValidCFD) {
      setSecondsLeft(0);
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.INVALID_CFD_OPEN_REQUEST,
        message: t('ERROR_MESSAGE.INVALID_CFD_OPEN_REQUEST'),
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
      setInvalidData(true);
      return;
    }

    const base = openCfdRequest.quotation.deadline - WAITING_TIME_FOR_USER_SIGNING;
    const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
    setSecondsLeft(tickingSec > 0 ? Math.floor(tickingSec) : 0);
  }, [globalCtx.visiblePositionOpenModal]);

  // Info: countdown (20230609 - Shirley)
  useEffect(() => {
    if (!userCtx.enableServiceTerm) return;
    if (invalidDataRef.current) return;

    const intervalId = setInterval(() => {
      const base = openCfdRequest.quotation.deadline - WAITING_TIME_FOR_USER_SIGNING;
      const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
      setSecondsLeft(tickingSec > 0 ? Math.floor(tickingSec) : 0);

      if (modalVisible && secondsLeft === 0) {
        renewDataHandler();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft, globalCtx.visiblePositionOpenModal]);

  // Info: when the quotation is due, renew the guaranteed stop fee percentage (20231116 - Shirley)
  useEffect(() => {
    if (!userCtx.enableServiceTerm) return;
    if (invalidDataRef.current) return;
    if (secondsLeft >= 1) return;
    getGslFeePercentage();
  }, [secondsLeft]);

  const spreadSymbol = openCfdRequest.quotation.spreadFee >= 0 ? '+' : '-';

  const formContent = (
    <div className="mt-4 flex flex-col text-xs lg:text-sm">
      <div className="flex items-end justify-between">
        {/* Info: (20231003 - Julian) Ticker Title */}
        <div className="flex items-center space-x-2 text-center">
          <Image
            src={marketCtx.selectedTickerProperty?.tokenImg ?? ''}
            width={30}
            height={30}
            alt="ticker icon"
          />
          <p className="text-2xl">{marketCtx.selectedTickerProperty?.instId}</p>
        </div>

        {/* Info: (20231003 - Julian) Timer */}
        <div className="flex items-center space-x-1 text-center">
          <BsClockHistory size={20} className="text-lightGray" />
          <p className="w-8 text-xs">00:{secondsLeft.toString().padStart(2, '0')}</p>
        </div>
      </div>

      <div
        className={`${displayedBorderColor} mt-2 flex w-full flex-col items-center space-y-3 border-1px p-4 leading-relaxed text-lightWhite`}
      >
        {/* Info: (20231019 - Julian) Type */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
          <div className={`${displayedPositionColor}`}>
            {displayedTypeOfPosition}
            <span className="ml-1 text-lightGray text-xs">{displayedBuyOrSell}</span>
          </div>
        </div>
        {/* Info: (20231019 - Julian) Open Price */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
          <div className={`${dataRenewedStyle} flex items-baseline space-x-1`}>
            {/* Info: (20231019 - Julian) Spot Price */}
            {numberFormatted(openCfdRequest.quotation.spotPrice)}
            {/* Info: (20231019 - Julian) Spread */}
            <span className={`${dataRenewedStyle} ml-1 whitespace-nowrap text-xs text-lightGray`}>
              {spreadSymbol}
              {numberFormatted(openCfdRequest.quotation.spreadFee)}
            </span>
            {/* Info: (20231019 - Julian) Price */}
            {<p className={`${dataRenewedStyle}`}>→ {numberFormatted(openCfdRequest.price)}</p>}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
            <Tooltip className="top-1 hidden lg:block">
              <p className="w-40 text-sm font-medium text-white">
                {t('POSITION_MODAL.SPREAD_HINT')}
              </p>
            </Tooltip>
          </div>
        </div>
        {/* Info: (20231019 - Julian) Amount */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
          <div className="">
            {openCfdRequest.amount}
            <span className="ml-1 text-lightGray text-xs">{openCfdRequest.targetAsset}</span>
          </div>
        </div>
        {/* Info: (20231019 - Julian) Required Margin */}
        <div className={`${layoutInsideBorder} whitespace-nowrap`}>
          <div className="text-lightGray">{t('POSITION_MODAL.REQUIRED_MARGIN')}</div>
          <div className={`${dataRenewedStyle}`}>
            {openCfdRequest.margin.amount}
            <span className="ml-1 text-lightGray text-xs">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231019 - Julian) TP/ SL */}
        <div className={`${layoutInsideBorder}`}>
          <div className="flex">
            <div className="text-lightGray mr-1">{t('POSITION_MODAL.TP_AND_SL')}</div>
            <Tooltip className={``} tooltipPosition="left-2">
              <p className="w-56 text-left text-sm font-medium text-white">
                {t('POSITION_MODAL.TP_AND_SL_HINT')}
              </p>
            </Tooltip>
          </div>
          <div className="flex items-baseline">
            {displayedTakeProfit} / {displayedStopLoss}
            <span className="ml-1 text-lightGray text-xs">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231019 - Julian) Guaranteed Stop */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
          <div className={`relative flex items-center`}>
            {displayedGuaranteedStopSetting}

            {openCfdRequest.guaranteedStop ? (
              <span className="flex items-baseline">
                <span className="text-lightGray mx-1">({t('POSITION_MODAL.FEE')}:</span>
                <span className={`${dataRenewedStyle}`}>{`${numberFormatted(
                  openCfdRequest.guaranteedStopFee ?? 0
                )}`}</span>
                <span className="text-lightGray ml-1 text-xs">{unitAsset}</span>
                <span className="text-lightGray text-sm">)</span>
              </span>
            ) : null}

            <Tooltip className="ml-1">
              <p className="w-56 text-left text-sm font-medium text-white">
                {t('POSITION_MODAL.GUARANTEED_STOP_HINT')}
              </p>
            </Tooltip>
          </div>
        </div>
        {/* Info: (20231019 - Julian) Expiration Time */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.EXPIRATION_TIME')}</div>
          <div className="">{t('POSITION_MODAL.LIQUIDATION_TIME')}</div>
        </div>
        {/* Info: (20231019 - Julian) Liquidation Price */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
          <div className={`${dataRenewedStyle}`}>
            {numberFormatted(openCfdRequest.liquidationPrice)}
            <span className="ml-1 text-lightGray text-xs">{unitAsset}</span>
          </div>
        </div>
      </div>

      {/* Info: (20231019 - Julian) CFD Content */}
      <div className="my-3 text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>
      {/* Info: (20231019 - Julian) Submit Button */}
      <RippleButton
        id="OpenPositionButton"
        disabled={
          secondsLeft < 1 ||
          dataFetchErrorRef.current ||
          invalidDataRef.current ||
          inadequateAvailableBalanceRef.current
        }
        onClick={submitClickHandler}
        buttonType="button"
        className={`w-full whitespace-nowrap rounded bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
      >
        {t('POSITION_MODAL.CONFIRM_BUTTON')}
      </RippleButton>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      {/* Info: (20231019 - Julian) Blur Mask */}
      <div className="fixed inset-0 z-80 bg-black/25 flex items-center justify-center overflow-hidden backdrop-blur-sm">
        <div
          id="OpenPositionModal"
          className="relative mx-auto flex p-6 sm:p-8 w-90vw items-center h-auto sm:w-400px flex-col rounded-xl bg-darkGray1 shadow-lg shadow-black/80"
        >
          {/* Info: (20231019 - Julian) Header */}
          <div className="flex items-center justify-between rounded-t">
            <div className="flex w-full flex-col items-center">
              <h3 className="w-full text-center text-xl font-normal lg:text-3xl text-lightWhite">
                {t('POSITION_MODAL.OPEN_POSITION_TITLE')}
              </h3>

              <p className="text-base text-lightGray">{t('POSITION_MODAL.CFD_TRADE')}</p>
            </div>

            <button className="absolute right-5 top-5 p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
              <ImCross onClick={modalClickHandler} />
            </button>
          </div>
          {formContent}
        </div>
      </div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default PositionOpenModal;

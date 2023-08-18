import {ImCross} from 'react-icons/im';
import {
  DELAYED_HIDDEN_SECONDS,
  TypeOfBorderColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
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
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {BsClockHistory} from 'react-icons/bs';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {
  CFD_LIQUIDATION_TIME,
  DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS,
  FRACTION_DIGITS,
  LIQUIDATION_FIVE_LEVERAGE,
  WAITING_TIME_FOR_USER_SIGNING,
  unitAsset,
} from '../../constants/config';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {useTranslation} from 'react-i18next';
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
import {CustomError, isCustomError} from '../../lib/custom_error';
import {ICFDOrder, IOrder} from '../../interfaces/tidebit_defi_background/order';
import {OrderState} from '../../constants/order_state';
import SafeMath from '../../lib/safe_math';

type TranslateFunction = (s: string) => string;
interface IPositionOpenModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdRequest: IApplyCreateCFDOrder;
}

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  openCfdRequest,
  ...otherProps
}: IPositionOpenModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS
  );
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  const [quotationError, setQuotationError, quotationErrorRef] = useStateRef(false);
  const [quotationErrorMessage, setQuotationErrorMessage, quotationErrorMessageRef] =
    useStateRef<IResult>(defaultResultFailed);
  const [invalidData, setInvalidData, invalidDataRef] = useStateRef(false);

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
          // openPrice: openCfdRequest.price,
          ...receipt.order,
          // state: OrderState.OPENING,
        };

        // console.log('cfd from getCFD', userCtx.getCFD(receipt.order.id), 'scrambled cfd', {
        //   ...openCfdRequest,
        //   ...receipt.order,
        // });

        // const cfd: ICFDOrder = {
        //   ...openCfdRequest,
        //   // openPrice: openCfdRequest.price,
        //   ...receipt.order,
        //   // state: OrderState.OPENING,
        // };
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
    } catch (error: any) {
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

  const displayedGuaranteedStopSetting = !!openCfdRequest.guaranteedStop ? 'Yes' : 'No';

  const displayedTypeOfPosition =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const [guaranteedTooltipStatus, setGuaranteedTooltipStatus] = useState(0);

  const displayedPositionColor = 'text-tidebitTheme';

  const displayedBorderColor = TypeOfBorderColor.EQUAL;

  const displayedTakeProfit = openCfdRequest.takeProfit ? `$ ${openCfdRequest.takeProfit}` : '-';
  const displayedStopLoss = openCfdRequest.stopLoss ? `$ ${openCfdRequest.stopLoss}` : '-';

  const layoutInsideBorder = 'mx-5 my-2 flex justify-between';

  const getQuotation = async () => {
    let quotation = {...defaultResultSuccess};
    try {
      quotation = await marketCtx.getCFDQuotation(
        openCfdRequest.instId,
        openCfdRequest.typeOfPosition
      );

      const data = quotation.data as IQuotation;

      // Info: if there's error fetching quotation, disable the submit btn (20230327 - Shirley)
      if (
        quotation.success &&
        data.typeOfPosition === openCfdRequest.typeOfPosition &&
        data.instId === openCfdRequest.instId &&
        quotation.data !== null
      ) {
        globalCtx.eliminateToasts(ToastId.GET_QUOTATION_ERROR);
        setQuotationError(false);
        return data;
      } else {
        setQuotationError(true);

        // TODO: check the unit asset (20230612 - Shirley)
        if (data.instId !== openCfdRequest.instId) {
          setQuotationErrorMessage({
            success: false,
            code: Code.INCONSISTENT_TICKER_OF_QUOTATION,
            reason: Reason[Code.INCONSISTENT_TICKER_OF_QUOTATION],
          });

          // Deprecated: for debug (20230609 - Shirley)
          globalCtx.toast({
            type: ToastTypeAndText.ERROR.type,
            toastId: ToastId.INCONSISTENT_TICKER_OF_QUOTATION,
            message: `[dev] ${quotationErrorMessageRef.current.reason} (${quotationErrorMessageRef.current.code})`,
            typeText: t(ToastTypeAndText.ERROR.text),
            isLoading: false,
            autoClose: false,
          });

          return;
        }
        /* Info: (20230508 - Julian) get quotation error message */
        setQuotationErrorMessage({success: false, code: quotation.code, reason: quotation.reason});
      }
    } catch (err) {
      setQuotationError(true);
      /* Info: (20230508 - Julian) get quotation error message */
      setQuotationErrorMessage({success: false, code: quotation.code, reason: quotation.reason});
    }
  };

  const renewDataHandler = async () => {
    const newQuotation = await getQuotation();
    const gsl = marketCtx.guaranteedStopFeePercentage;

    /* Info: (20230508 - Julian) exception handling: error toast */
    if (!newQuotation || quotationErrorRef.current) {
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.GET_QUOTATION_ERROR,
        message: `${t(quotationErrorMessageRef.current.reason ?? 'ERROR_MESSAGE.UNKNOWN_ERROR')} (${
          quotationErrorMessageRef.current.code
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
        ? +SafeMath.mult(newQuotation.price, SafeMath.minus(1, LIQUIDATION_FIVE_LEVERAGE))
        : +SafeMath.mult(newQuotation.price, SafeMath.plus(1, LIQUIDATION_FIVE_LEVERAGE));
    const gslFee = +SafeMath.mult(gsl ?? 0, SafeMath.mult(openCfdRequest.amount, newPrice));

    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: {
        ...openCfdRequest,
        quotation: newQuotation,
        price: newPrice,
        margin: {
          ...openCfdRequest.margin,
          amount: newMargin,
        },
        guaranteedStopFee: openCfdRequest.guaranteedStop ? gslFee : 0,
        liquidationPrice: newLiquidationPrice,
      },
    });

    setDataRenewedStyle('text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
  };

  const mouseEnterHandler = () => setGuaranteedTooltipStatus(3);
  const mouseLeaveHandler = () => setGuaranteedTooltipStatus(0);

  // Info: get the quotation before the modal is shown (20230327 - Shirley)
  useEffect(() => {
    if (!globalCtx.visiblePositionOpenModal) {
      setDataRenewedStyle('text-lightWhite');
      setInvalidData(false);
      return;
    }

    // TODO: check the unit asset (20230612 - Shirley)
    if (openCfdRequest.quotation.instId !== openCfdRequest.instId) {
      setQuotationError(true);
      setQuotationErrorMessage({
        success: false,
        code: Code.INCONSISTENT_TICKER_OF_QUOTATION,
        reason: Reason[Code.INCONSISTENT_TICKER_OF_QUOTATION],
      });

      // Deprecated: for debug (20230609 - Shirley)
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.INCONSISTENT_TICKER_OF_QUOTATION,
        message: `[dev] ${quotationErrorMessageRef.current.reason} (${quotationErrorMessageRef.current.code})`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
    } else {
      setQuotationError(false);
    }

    const isValid = validateCFD(openCfdRequest.fee, openCfdRequest.amount);
    if (!isValid) {
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

  const formContent = (
    <div className="mt-4 flex flex-col px-6 pb-2">
      <div className="flex items-center justify-center space-x-2 text-center">
        <Image
          src={marketCtx.selectedTicker?.tokenImg ?? ''}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{marketCtx.selectedTicker?.instId}</div>
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
              <div className={`${dataRenewedStyle}`}>
                {numberFormatted(openCfdRequest.price)}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
              <div className="">
                {openCfdRequest.amount}
                <span className="ml-1 text-lightGray">{openCfdRequest.targetAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder} whitespace-nowrap`}>
              <div className="text-lightGray">{t('POSITION_MODAL.REQUIRED_MARGIN')}</div>
              <div className={`${dataRenewedStyle}`}>
                {openCfdRequest.margin.amount}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TP_AND_SL')}</div>
              <div className="">
                {displayedTakeProfit} / {displayedStopLoss}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
              <div className={`relative flex items-center`}>
                {displayedGuaranteedStopSetting}

                <div
                  className="relative ml-1"
                  onMouseEnter={mouseEnterHandler}
                  onMouseLeave={mouseLeaveHandler}
                >
                  <div className="opacity-70">
                    <AiOutlineQuestionCircle size={16} />
                  </div>
                  {guaranteedTooltipStatus == 3 && (
                    <div
                      role="tooltip"
                      className="absolute -left-52 -top-120px z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg shadow-black/80 transition duration-150 ease-in-out"
                    >
                      <p className="pb-0 text-sm font-medium text-white">
                        {t('POSITION_MODAL.GUARANTEED_STOP_HINT')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.EXPIRATION_TIME')}</div>
              <div className="">{t('POSITION_MODAL.LIQUIDATION_TIME')}</div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
              <div className={`${dataRenewedStyle}`}>
                {numberFormatted(openCfdRequest.liquidationPrice)}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4 text-xs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          disabled={secondsLeft < 1 || quotationErrorRef.current || invalidDataRef.current}
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
          <div
            id="PositionOpenModal"
            className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="w-full text-center text-xl font-normal text-lightWhite">
                {t('POSITION_MODAL.OPEN_POSITION_TITLE')}
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

export default PositionOpenModal;

import {ImCross} from 'react-icons/im';
import {
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
  twoDecimal,
  getTimestampInMilliseconds,
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
} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IClosedCFDInfoProps, useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {ProfitState} from '../../constants/profit_state';
import {UserContext} from '../../contexts/user_context';
import {useCountdown} from '../../lib/hooks/use_countdown';
import {useTranslation} from 'react-i18next';
import {
  IDisplayCFDOrder,
  // getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  IAcceptedCFDOrder,
  // getDummyAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCloseCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {
  IApplyCloseCFDOrder,
  // getDummyApplyCloseCFDOrderData,
} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import useStateRef from 'react-usestateref';
import {OrderState} from '../../constants/order_state';
import {IApplyCFDOrder} from '../../interfaces/tidebit_defi_background/apply_cfd_order';
import {defaultResultSuccess} from '../../interfaces/tidebit_defi_background/result';
import {CFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {CFDClosedType} from '../../constants/cfd_closed_type';
import {cfdStateCode} from '../../constants/cfd_state_code';
import {ICFDOrder} from '../../interfaces/tidebit_defi_background/order';
import {Code} from '../../constants/code';

type TranslateFunction = (s: string) => string;
interface IPositionClosedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayCFDOrder;
}

// TODO: replace all hardcode options with variables
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

  // Info: dummy data (20230329 - Shirley)
  const quotation: IQuotation = {
    ticker: openCfdDetails?.ticker,
    typeOfPosition: openCfdDetails?.typeOfPosition,
    price: randomIntFromInterval(20, 29),
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

  const displayedPnLSymbol =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? '-'
      : '';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  const displayedPnLColor =
    openCfdDetails?.pnl.type === ProfitState.PROFIT
      ? TypeOfPnLColor.PROFIT
      : openCfdDetails?.pnl.type === ProfitState.LOSS
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    openCfdDetails?.pnl.type === ProfitState.PROFIT
      ? TypeOfBorderColor.LONG
      : openCfdDetails?.pnl.type === ProfitState.LOSS
      ? TypeOfBorderColor.SHORT
      : TypeOfBorderColor.NORMAL;

  const displayedPositionColor = 'text-tidebitTheme';

  const layoutInsideBorder = 'mx-5 my-2 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const toDisplayCloseOrder = (cfd: IDisplayCFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    const openValue = cfd.openPrice * cfd.amount;
    const nowValue = quotation.price * cfd.amount;
    const pnlSoFar =
      cfd.typeOfPosition === TypeOfPosition.BUY ? nowValue - openValue : openValue - nowValue;

    return {
      ...cfd,
      pnl: {
        type: pnlSoFar > 0 ? ProfitState.PROFIT : ProfitState.LOSS,
        value: Math.abs(pnlSoFar),
      },
    };
  };

  const toApplyCloseOrder = (
    order: IDisplayCFDOrder,
    quotation: IQuotation
  ): IApplyCloseCFDOrder => {
    if (order.state !== OrderState.OPENING) {
      const error = new Error('Order is not opening!!');
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

  // TODO: (20230315 - Shirley) organize the data before history modal
  const toHistoryModal = (cfd: ICFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    // TODO: replace `twoDecimal` with `toLocaleString` (20230325 - Shirley)
    const openPrice = cfd.openPrice;
    const closePrice = quotation.price;

    const openValue = twoDecimal(openPrice * cfd.amount);
    const closeValue = twoDecimal(closePrice * cfd.amount);

    const pnlValue =
      cfd.typeOfPosition === TypeOfPosition.BUY
        ? twoDecimal(closeValue - openValue)
        : twoDecimal(openValue - closeValue);
    const pnl: IPnL = {
      type: pnlValue > 0 ? ProfitState.PROFIT : pnlValue < 0 ? ProfitState.LOSS : ProfitState.EQUAL,
      value: Math.abs(pnlValue),
    };

    const positionLineGraph = [100, 100]; // TODO: (20230316 - Shirley) from `marketCtx`

    const suggestion: ICFDSuggestion = {
      takeProfit:
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? openValue * (1 + SUGGEST_TP)
          : openValue * (1 - SUGGEST_TP),
      stopLoss:
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? openValue * (1 - SUGGEST_SL)
          : openValue * (1 + SUGGEST_SL),
    };

    const historyCfd: IDisplayCFDOrder = {
      ...cfd,
      pnl: pnl,
      openValue: openValue,
      closeValue: closeValue,
      positionLineGraph: positionLineGraph,
      suggestion: suggestion,
      stateCode: cfdStateCode.COMMON,

      closeTimestamp: quotation.deadline,
      closePrice: closePrice,
      closedType: CFDClosedType.BY_USER,
      state: OrderState.CLOSED,
    };

    return historyCfd;
  };

  const getQuotation = async () => {
    let quotation = {...defaultResultSuccess};

    try {
      quotation = await marketCtx.getCFDQuotation(
        openCfdDetails?.ticker,
        openCfdDetails?.typeOfPosition
      );

      const data = quotation.data as IQuotation;

      // Info: if there's error fetching quotation, disable the submit btn (20230328 - Shirley)
      if (
        quotation.success &&
        data.typeOfPosition === openCfdDetails?.typeOfPosition &&
        quotation.data !== null
      ) {
        return data;
      } else {
        setQuotationError(true);
      }
    } catch (err) {
      setQuotationError(true);
    }
  };

  /** TODO: 
    // loading modal -> UserContext.function (負責簽名) ->
    // 猶豫太久的話，單子會過期，就會顯示 failed modal，
    // 用戶沒簽名才是顯示 canceled modal
    // 用戶簽名成功，就會顯示 successful modal
   */
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
        });

        // ToDo: Need to get a singnal from somewhere to show the successful modal
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
        result.code === Code.SERVICE_TERM_DISABLE ||
        result.code === Code.WALLET_IS_NOT_CONNECT ||
        result.code === Code.EXPIRED_QUOTATION_CANCELED ||
        result.code === Code.REJECTED_SIGNATURE
      ) {
        // Deprecated: [debug] (20230413 - Shirley)
        // eslint-disable-next-line no-console
        console.log('close result', result);

        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.FAILED_REASON_CANCELED'),
        });

        globalCtx.visibleCanceledModalHandler();
      } else if (
        result.code === Code.INTERNAL_SERVER_ERROR ||
        result.code === Code.INVAILD_INPUTS ||
        result.code === Code.EXPIRED_QUOTATION_FAILED ||
        result.code === Code.UNKNOWN_ERROR
      ) {
        // Deprecated: [debug] (20230413 - Shirley)
        // eslint-disable-next-line no-console
        console.log('close result', result);

        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: t('POSITION_MODAL.FAILED_REASON_FAILED_TO_CLOSE'),
        });

        globalCtx.visibleFailedModalHandler();
      }
    } catch (error: any) {
      // Deprecated: [debug] (20230412 - Shirley)
      // eslint-disable-next-line no-console
      console.log('close position error', error);

      globalCtx.eliminateAllModals();

      if (error?.code === 4001) {
        globalCtx.dataCanceledModalHandler({
          modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
          modalContent: t('POSITION_MODAL.FAILED_REASON_CANCELED'),
        });

        globalCtx.visibleCanceledModalHandler();
      } else {
        // ToDo: report error to backend (20230413 - Shirley)
        // Info: Unknown error between context and component
        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.CLOSE_POSITION_TITLE'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: t('POSITION_MODAL.FAILED_REASON_ERROR'),
        });

        globalCtx.visibleFailedModalHandler();
      }
    }

    unlock();
    return;
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
        const error = new Error('Cannot get quotation');
        throw error;
      }

      const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, quotation);
      globalCtx.dataPositionClosedModalHandler(displayedCloseOrder);

      setGQuotation(quotation);
    })();
  }, [globalCtx.visiblePositionClosedModal]);

  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) {
      setSecondsLeft(DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS);
      setDataRenewedStyle('text-lightWhite');

      return;
    }

    const intervalId = setInterval(async () => {
      const base = gQuotationRef.current.deadline - WAITING_TIME_FOR_USER_SIGNING;

      const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;

      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

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
          src={marketCtx.selectedTicker?.tokenImg ?? ''}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{openCfdDetails?.ticker}</div>
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
                {openCfdDetails?.openPrice.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
              <div className="">
                {openCfdDetails?.amount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                })}{' '}
                <span className="ml-1 text-lightGray">{openCfdDetails?.ticker}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
              <div className={`${dataRenewedStyle}`}>
                {gQuotationRef.current.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
              <div className={`${pnlRenewedStyle} ${displayedPnLColor}`}>
                {displayedPnLSymbol} ${' '}
                {openCfdDetails?.pnl?.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                })}
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
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          {' '}
          {/*content & panel*/}
          <div
            // ref={modalRef}
            className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
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
            {/*body*/}
            {formContent}
            {/*footer*/}
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

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
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {POSITION_PRICE_RENEWAL_INTERVAL_SECONDS, unitAsset} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IClosedCFDInfoProps, useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {ProfitState} from '../../constants/profit_state';
import {UserContext} from '../../contexts/user_context';
import {useCountdown} from '../../lib/hooks/use_countdown';
import {useTranslation} from 'react-i18next';
import {
  IDisplayAcceptedCFDOrder,
  getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  IAcceptedCFDOrder,
  getDummyAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCloseCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {
  IApplyCloseCFDOrderData,
  getDummyApplyCloseCFDOrderData,
} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {ICFDSuggestion} from '../../interfaces/tidebit_defi_background/cfd_suggestion';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import useStateRef from 'react-usestateref';
import {OrderState} from '../../constants/order_state';
import {ApplyCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_cfd_order';

type TranslateFunction = (s: string) => string;
interface IPositionClosedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayAcceptedCFDOrder;
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

  // TODO: (20230317 - Shirley) get from marketCtx
  const quotation: IQuotation = {
    ticker: openCfdDetails.ticker,
    typeOfPosition: openCfdDetails.typeOfPosition,
    price: randomIntFromInterval(2, 500),
    targetAsset: openCfdDetails.targetAsset,
    unitAsset: openCfdDetails.unitAsset,
    deadline: getDeadline(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS),
    signature: '0x',
  };

  const cfdDetails: IDisplayAcceptedCFDOrder = {
    ...openCfdDetails,
    closePrice: quotation.price,
    pnl: {type: ProfitState.PROFIT, value: 1000}, // TODO: (20230317 - Shirley)  自己算 PNL
  };

  const [gQuotation, setGQuotation, gQuotationRef] = useStateRef<IQuotation>(quotation);

  const [secondsLeft, setSecondsLeft] = useState(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);

  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  const [pnlRenewedStyle, setPnlRenewedStyle] = useState('');

  const displayedGuaranteedStopSetting = !!openCfdDetails.guaranteedStop ? 'Yes' : 'No';

  const displayedPnLSymbol =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails.pnl.type === ProfitState.LOSS
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

  const toDisplayCloseOrder = (
    cfd: IDisplayAcceptedCFDOrder,
    quotation: IQuotation
  ): IDisplayAcceptedCFDOrder => {
    return {
      ...cfd,
      closePrice: quotation.price, // TODO: (20230317 - Shirley)  自己算 closePrice
      // TODO: (20230317 - Shirley)  自己算 PNL
      pnl: {
        type: randomIntFromInterval(0, 100) <= 50 ? ProfitState.PROFIT : ProfitState.LOSS,
        value: randomIntFromInterval(0, 1000),
      },
    };
  };

  const toApplyCloseOrder = (
    order: IDisplayAcceptedCFDOrder,
    quotation: IQuotation
  ): IApplyCloseCFDOrderData => {
    if (order.state !== OrderState.OPENING) {
      const error = new Error('Order is not opening');
      throw error;
    }

    const request: IApplyCloseCFDOrderData = {
      orderId: order.id,
      closePrice: quotation.price, // TODO: (20230315 - Shirley) get from marketCtx
      quotation: quotation,
      closeTimestamp: getTimestamp(),
    };

    return request;
  };

  // TODO: (20230315 - Shirley) organize the data before history modal
  const toHistoryModal = (cfd: IAcceptedCFDOrder): IDisplayAcceptedCFDOrder => {
    if (cfd.state !== OrderState.CLOSED || !cfd.closePrice) {
      const error = new Error('Order is not closed');
      throw error;
    }

    // TODO: replace `twoDecimal` with `toLocaleString` (20230325 - Shirley)
    const openValue = twoDecimal(cfd.openPrice * cfd.amount);
    const closeValue = twoDecimal(cfd.closePrice * cfd.amount);

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
      // TODO: (20230316 - Shirley) calculate
      takeProfit: 100,
      stopLoss: 100,
    };

    const historyCfd: IDisplayAcceptedCFDOrder = {
      ...cfd,
      pnl: pnl,
      openValue: openValue,
      closeValue: closeValue,
      positionLineGraph: positionLineGraph,
      suggestion: suggestion,
    };

    return historyCfd;
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
    await wait(DELAYED_HIDDEN_SECONDS / 5);
    modalClickHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Close Position',
      modalContent: 'Confirm the transaction',
    });
    globalCtx.visibleLoadingModalHandler();

    /*// Till: (20230409 - Shirley)
    // const quotation = {
    //   ticker: openCfdDetails.ticker,
    //   price: 202303, // TODO: (20230315 - Shirley) get from marketCtx
    //   targetAsset: openCfdDetails.targetAsset,
    //   uniAsset: openCfdDetails.uniAsset,
    //   deadline: getTimestamp() + RENEW_QUOTATION_INTERVAL_SECONDS, // TODO: (20230315 - Shirley) get from marketCtx
    //   signature: '0x', // TODO: (20230315 - Shirley) get from marketCtx
    // };
    */

    try {
      const applyCloseOrder: IApplyCloseCFDOrderData = toApplyCloseOrder(
        openCfdDetails,
        gQuotationRef.current
      );

      const result = await userCtx.closeCFDOrder(applyCloseOrder);
      // Deprecated: before merging into develop (20230330 - Shirley)
      // eslint-disable-next-line no-console
      console.log('close result', result);

      // TODO: temporary waiting
      await wait(DELAYED_HIDDEN_SECONDS);
      globalCtx.dataLoadingModalHandler({
        modalTitle: 'Close Position',
        modalContent: 'Transaction broadcast',
        btnMsg: 'View on Etherscan',
        btnUrl: '#',
      });

      // TODO: temporary waiting
      await wait(DELAYED_HIDDEN_SECONDS);

      // Close loading modal
      globalCtx.eliminateAllModals();

      // TODO: Revise the `result.reason` to constant by using enum or object
      // TODO: the button URL
      if (result.success) {
        globalCtx.dataSuccessfulModalHandler({
          modalTitle: 'Close Position',
          modalContent: 'Transaction succeed',
          btnMsg: 'View on Etherscan',
          btnUrl: '#',
        });

        const cfd = userCtx.getCFD(openCfdDetails.id);
        // Deprecated: before merging into develop (20230330 - Shirley)
        // eslint-disable-next-line no-console
        console.log('CFD gotten', cfd);

        // TODO: get the closed cfd and calculate the PNL and sth (20230324 - Shirley)
        // const closedCFD: IAcceptedCFDOrder = userCtx.getClosedCFD(openCfdDetails.id);
        // const historyData = toHistoryModal(closedCFD);

        if (cfd) {
          try {
            const historyData = toHistoryModal(cfd);

            globalCtx.visibleSuccessfulModalHandler();
            await wait(DELAYED_HIDDEN_SECONDS);
            globalCtx.eliminateAllModals();

            globalCtx.dataHistoryPositionModalHandler(historyData);
            globalCtx.visibleHistoryPositionModalHandler();
          } catch (error) {
            globalCtx.dataFailedModalHandler({
              modalTitle: 'Close Position',
              failedTitle: 'Failed',
              failedMsg: 'Order is not closed',
            });

            globalCtx.visibleFailedModalHandler();
          }
        }
      } else if (result.reason === 'CANCELED') {
        globalCtx.dataCanceledModalHandler({
          modalTitle: 'Close Position',
          modalContent: 'Transaction canceled',
        });

        globalCtx.visibleCanceledModalHandler();
      } else if (result.reason === 'FAILED') {
        globalCtx.dataFailedModalHandler({
          modalTitle: 'Close Position',
          failedTitle: 'Failed',
          failedMsg: 'Failed to close position',
        });

        globalCtx.visibleFailedModalHandler();
      }
    } catch (error) {
      globalCtx.dataFailedModalHandler({
        modalTitle: 'Close Position',
        failedTitle: 'Failed',
        failedMsg: 'Order is not opening',
      });

      globalCtx.visibleFailedModalHandler();
    }

    unlock();
    return;
  };

  const renewDataStyleHandler = async (quotation: IQuotation) => {
    setDataRenewedStyle('animate-flash text-lightYellow2');
    setPnlRenewedStyle('animate-flash text-lightYellow2');

    const newDeadline = gQuotationRef.current.deadline;
    setSecondsLeft(Math.round(newDeadline - getTimestamp()));

    const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, quotation);

    globalCtx.dataPositionClosedModalHandler(displayedCloseOrder);

    await wait(DELAYED_HIDDEN_SECONDS / 5);

    setDataRenewedStyle('text-lightYellow2');
    setPnlRenewedStyle('text-lightYellow2');

    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
    setPnlRenewedStyle('');
  };

  useEffect(() => {
    // TODO: (20230317 - Shirley) from marketCtx
    const quotation: IQuotation = {
      ticker: openCfdDetails.ticker,
      typeOfPosition: openCfdDetails.typeOfPosition,
      price: randomIntFromInterval(2, 500),
      targetAsset: openCfdDetails.targetAsset,
      unitAsset: openCfdDetails.unitAsset,
      deadline: getTimestamp() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
      signature: '0x',
    };

    // TODO: (20230317 - Shirley) PnL, close price
    const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, quotation);
    globalCtx.dataPositionClosedModalHandler(displayedCloseOrder);

    setGQuotation(quotation);
  }, [globalCtx.visiblePositionClosedModal]);

  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) {
      setSecondsLeft(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
      setDataRenewedStyle('text-lightWhite');

      const base = gQuotationRef.current.deadline;
      const tickingSec = base - getTimestamp();
      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

      return;
    }

    const intervalId = setInterval(() => {
      const base = gQuotationRef.current.deadline;

      const tickingSec = base - getTimestamp();

      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

      if (secondsLeft === 0) {
        // TODO: (20230317 - Shirley) get quotation from marketCtx
        const quotation: IQuotation = {
          ticker: openCfdDetails.ticker,
          typeOfPosition: openCfdDetails.typeOfPosition,
          price: randomIntFromInterval(10, 1000),
          targetAsset: openCfdDetails.targetAsset,
          unitAsset: openCfdDetails.unitAsset,
          deadline: getTimestamp() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
          signature: '0x',
        };

        setGQuotation(quotation);
        renewDataStyleHandler(quotation);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft, globalCtx.visiblePositionClosedModal]);

  const formContent = (
    <div className="mt-8 flex flex-col px-6 pb-2">
      <div className="flex items-center justify-center space-x-2 text-center">
        <Image
          src={marketCtx.selectedTicker?.tokenImg ?? ''}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{openCfdDetails.ticker}</div>
      </div>

      <div className="absolute top-105px right-6 flex items-center space-x-1 text-center">
        <BsClockHistory size={20} className="text-lightGray" />
        <p className="w-8 text-xs">00:{secondsLeft.toString().padStart(2, '0')}</p>
      </div>

      <div className="relative flex-auto pt-1">
        <div
          className={`${displayedBorderColor} mt-1 border-1px py-4 text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex flex-col justify-center text-center">
            {/* {displayedDataFormat()} */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
              {/* TODO: color variable */}
              <div className={`${displayedPositionColor}`}>
                {displayedTypeOfPosition}
                <span className="ml-1 text-lightGray">{displayedBuyOrSell}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
              <div className="">
                {/* TODO: Hardcode USDT */}
                {openCfdDetails.openPrice.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
              <div className="">
                {openCfdDetails.amount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                })}{' '}
                <span className="ml-1 text-lightGray">{openCfdDetails.ticker}</span>
              </div>
            </div>

            {/* FIXME: close price from market price DEPENDING ON sell or buy */}
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
              <div className={`${dataRenewedStyle}`}>
                {/* TODO: Hardcode USDT */}
                {gQuotationRef.current.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
              <div className={`${pnlRenewedStyle} ${displayedPnLColor}`}>
                {displayedPnLSymbol} ${' '}
                {openCfdDetails.pnl.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
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

        <div className="my-3 text-xxs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          disabled={secondsLeft < 1}
          onClick={submitClickHandler}
          buttonType="button"
          className={`mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
        >
          {t('POSITION_MODAL.CONFIRM_BUTTON')}
        </RippleButton>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      {/*  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">*/}
      {/*  overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none */}
      {/* position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative my-6 mx-auto w-auto max-w-xl">
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
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
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

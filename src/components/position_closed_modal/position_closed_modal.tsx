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
  getNowSeconds as getTimestamp,
  locker,
  randomIntFromInterval,
  timestampToString,
  twoDecimal,
  wait,
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {RENEW_QUOTATION_INTERVAL_SECONDS} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {ProfitState} from '../../constants/profit_state';
import {UserContext} from '../../contexts/user_context';
import {useCountdown} from '../../lib/hooks/use_countdown';
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

interface IPositionClosedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayAcceptedCFDOrder;
}

const PositionClosedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails: openCfdDetails,
  ...otherProps
}: IPositionClosedModal) => {
  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  // TODO: (20230317 - Shirley) get from marketCtx
  const quotation = {
    ticker: openCfdDetails.ticker,
    price: randomIntFromInterval(2, 500),
    targetAsset: openCfdDetails.targetAsset,
    uniAsset: openCfdDetails.uniAsset,
    deadline: getTimestamp() + RENEW_QUOTATION_INTERVAL_SECONDS,
    signature: '0x',
  };

  const cfdDetails: IDisplayAcceptedCFDOrder = {
    ...openCfdDetails,
    closePrice: quotation.price,
    pnl: {type: ProfitState.PROFIT, value: 1000}, // TODO: (20230317 - Shirley)  自己算 PNL
  };

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef<number>(
    RENEW_QUOTATION_INTERVAL_SECONDS
  );

  // INFO: #WI: 用 let 來記 #WII: 用 useRef (20230317 - Shirley)
  const [gQuotation, setGQuotation, gQuotationRef] = useStateRef<IQuotation>(quotation);

  const [cfd, setCfd, cfdRef] = useStateRef<IDisplayAcceptedCFDOrder>(cfdDetails);

  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  const [pnlRenewedStyle, setPnlRenewedStyle] = useState('');

  const displayedGuaranteedStopSetting = !!cfdRef.current.guaranteedStop ? 'Yes' : 'No';

  const displayedPnLSymbol =
    cfdRef.current.pnl.type === ProfitState.PROFIT
      ? '+'
      : cfdRef.current.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  const displayedTypeOfPosition =
    cfdRef.current?.typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

  const displayedPnLColor =
    cfdRef.current?.pnl.type === ProfitState.PROFIT
      ? TypeOfPnLColor.PROFIT
      : cfdRef.current?.pnl.type === ProfitState.LOSS
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    cfdRef.current?.pnl.type === ProfitState.PROFIT
      ? TypeOfBorderColor.LONG
      : cfdRef.current?.pnl.type === ProfitState.LOSS
      ? TypeOfBorderColor.SHORT
      : TypeOfBorderColor.NORMAL;

  const displayedPositionColor = 'text-tidebitTheme';

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedTime = timestampToString(cfdRef.current?.createTimestamp ?? 0);

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
  ): IApplyCloseCFDOrderData | undefined => {
    if (order.state !== OrderState.OPENING) return;
    const request: IApplyCloseCFDOrderData = {
      orderId: order.id,
      closePrice: quotation.price, // TODO: (20230315 - Shirley) get from marketCtx
      quotation: quotation,
      closeTimestamp: getTimestamp(),
    };

    return request;
  };

  // TODO: (20230315 - Shirley) organize the data before history modal
  const toHistoryModal = (cfd: IAcceptedCFDOrder): IDisplayAcceptedCFDOrder | undefined => {
    if (!cfd.closePrice) return;
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

    /* Info: (20230315 - Shirley) use dummy data will fail
    // getDummyApplyCloseCFDOrderData(marketCtx.selectedTicker?.currency ?? '') */
    const quotation = {
      ticker: openCfdDetails.ticker,
      price: 202303, // TODO: (20230315 - Shirley) get from marketCtx
      targetAsset: openCfdDetails.targetAsset,
      uniAsset: openCfdDetails.uniAsset,
      deadline: getTimestamp() + RENEW_QUOTATION_INTERVAL_SECONDS, // TODO: (20230315 - Shirley) get from marketCtx
      signature: '0x', // TODO: (20230315 - Shirley) get from marketCtx
    };
    const result = await userCtx.closeCFDOrder(toApplyCloseOrder(openCfdDetails, quotation));

    // TODO:  (20230317 - Shirley) for debug
    globalCtx.toast({message: 'close-position result: ' + JSON.stringify(result), type: 'info'});

    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Close Position',
      modalContent: 'Transaction broadcast',
      btnMsg: 'View on Etherscan',
      btnUrl: '#',
    });

    await wait(DELAYED_HIDDEN_SECONDS);

    globalCtx.eliminateAllModals();

    // TODO: (20230317 - Shirley)  Revise the `result.reason` to constant by using enum or object
    // TODO: (20230317 - Shirley)  the button URL
    if (result.success) {
      globalCtx.dataSuccessfulModalHandler({
        modalTitle: 'Close Position',
        modalContent: 'Transaction succeed',
        btnMsg: 'View on Etherscan',
        btnUrl: '#',
      });

      globalCtx.visibleSuccessfulModalHandler();
      await wait(DELAYED_HIDDEN_SECONDS);

      globalCtx.eliminateAllModals();

      const closedCFD: IAcceptedCFDOrder = userCtx.getClosedCFD(openCfdDetails.id);

      const historyData = toHistoryModal(closedCFD);

      if (!historyData) return;

      globalCtx.dataHistoryPositionModalHandler(historyData);
      globalCtx.visibleHistoryPositionModalHandler();
      // TODO: (20230317 - Shirley)  `result.code` (20230316 - Shirley)
    } else if (result.reason === 'CANCELED') {
      globalCtx.dataCanceledModalHandler({
        modalTitle: 'Close Position',
        modalContent: 'Transaction canceled',
      });
      globalCtx.visibleCanceledModalHandler();

      // TODO: (20230317 - Shirley)  `result.code` (20230316 - Shirley)
    } else if (result.reason === 'FAILED') {
      globalCtx.dataFailedModalHandler({
        modalTitle: 'Close Position',
        failedTitle: 'Failed',
        failedMsg: 'Failed to close position',
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

    globalCtx.dataPositionClosedModalHandler(toDisplayCloseOrder(cfdRef.current, quotation));

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
      ticker: cfdRef.current.ticker,
      price: randomIntFromInterval(2, 500),
      targetAsset: cfdRef.current.targetAsset,
      uniAsset: cfdRef.current.uniAsset,
      deadline: getTimestamp() + RENEW_QUOTATION_INTERVAL_SECONDS,
      signature: '0x',
    };

    // TODO: (20230317 - Shirley) PnL, close price
    // setDeadline(quotation.deadline);
    setCfd(toDisplayCloseOrder(cfdRef.current, quotation));
    setGQuotation(quotation);
  }, [globalCtx.visiblePositionClosedModal]);

  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) {
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
          ticker: cfdRef.current.ticker,
          price: randomIntFromInterval(10, 1000),
          targetAsset: cfdRef.current.targetAsset,
          uniAsset: cfdRef.current.uniAsset,
          deadline: getTimestamp() + RENEW_QUOTATION_INTERVAL_SECONDS,
          signature: '0x',
        };

        setCfd(toDisplayCloseOrder(cfdRef.current, quotation));

        setGQuotation(quotation);
        renewDataStyleHandler(quotation);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft, globalCtx.visiblePositionClosedModal]);

  const formContent = (
    <div>
      <div className="mt-8 mb-2 flex items-center justify-center space-x-2 text-center">
        <Image
          src={marketCtx.selectedTicker?.tokenImg ?? ''}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{cfdRef.current.ticker}</div>
      </div>

      <div className="absolute top-105px right-6 flex items-center space-x-1 text-center">
        <BsClockHistory size={20} className="text-lightGray" />
        <p className="w-8 text-xs">00:{secondsLeft.toString().padStart(2, '0')}</p>
      </div>

      <div className="relative flex-auto pt-1">
        <div
          className={`${displayedBorderColor} mx-6 mt-1 border-1px text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex-col justify-center text-center">
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Type</div>
              <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Price</div>
              <div className="">
                {cfdRef.current?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                {cfdRef.current.margin.asset}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Amount</div>
              <div className="">
                {cfdRef.current?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                {cfdRef.current.ticker}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Closed Price</div>
              <div className={`${dataRenewedStyle}`}>
                $ {cfdRef.current?.closePrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                USDT
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">PNL</div>
              <div className={`${pnlRenewedStyle} ${displayedPnLColor}`}>
                {displayedPnLSymbol} ${' '}
                {cfdRef.current.pnl.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Time</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Guaranteed Stop</div>
              <div className={``}>{displayedGuaranteedStopSetting}</div>
            </div>

            {/* <div className={`${tableLayout}`}> // TODO: (20230317 - Shirley) Liquidation Price
              <div className="text-lightGray">Liquidation Price</div>
              <div className="">$ 9.23</div>
            </div> */}
          </div>
        </div>

        <div className="mx-6 my-3 text-xxs text-lightGray">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna
        </div>

        <div className={`flex-col space-y-5 text-base leading-relaxed text-lightWhite`}>
          <RippleButton
            disabled={secondsLeft < 1}
            onClick={submitClickHandler}
            buttonType="button"
            className={`mx-22px mt-0 rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
          >
            Confirm the order
          </RippleButton>
        </div>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          {/*content & panel*/}
          <div
            // ref={modalRef}
            className="relative flex h-540px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="mt-0 w-full text-center text-xl font-normal text-lightWhite">
                Close Position
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

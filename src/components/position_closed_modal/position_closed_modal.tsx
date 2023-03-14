import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  DELAYED_HIDDEN_SECONDS,
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {locker, randomIntFromInterval, timestampToString, wait} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {RENEW_QUOTATION_INTERVAL_SECONDS} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IClosedCFDInfoProps, useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {ProfitState} from '../../constants/profit_state';
import {UserContext} from '../../contexts/user_context';
import {useCountdown} from '../../lib/hooks/use_countdown';
import {
  IDisplayAcceptedCFDOrder,
  getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {getDummyAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCloseCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {
  IApplyCloseCFDOrderData,
  getDummyApplyCloseCFDOrderData,
} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order_data';

interface IPositionClosedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  // 送出時要 `displayApplyCloseCFD: IApplyCFDOrder;`
  // TODO: 從 marketCtx 拿報價
  // TODO: 自己算 PnL

  openCfdDetails: IDisplayAcceptedCFDOrder;
  latestProps: IClosedCFDInfoProps;
}

// TODO: replace all hardcode options with variables
const PositionClosedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails: openCfdDetails,
  latestProps: latestProps,
  ...otherProps
}: IPositionClosedModal) => {
  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft] = useState(RENEW_QUOTATION_INTERVAL_SECONDS);

  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  const [pnlRenewedStyle, setPnlRenewedStyle] = useState('');

  // const displayedApplyCloseCfdData = displayApplyCloseCFD.data as IApplyCloseCFDOrderData;

  // const closePrice = displayedApplyCloseCfdData.quotation.price

  const displayedGuaranteedStopSetting = !!openCfdDetails.guaranteedStop ? 'Yes' : 'No';

  const displayedPnLSymbol =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

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

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  /** TODO: (20230314 - Shirley)
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

    const result = await userCtx.closeCFDOrder(
      getDummyApplyCloseCFDOrderData(marketCtx.selectedTicker?.currency ?? '')
    );
    // console.log('result from userCtx in position_closed_modal.tsx: ', result);

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

      // globalCtx.dataHistoryPositionModalHandler(userCtx.getClosedCFD(openCfdDetails.id));

      globalCtx.visibleSuccessfulModalHandler();
      await wait(DELAYED_HIDDEN_SECONDS);

      globalCtx.eliminateAllModals();

      globalCtx.visibleHistoryPositionModalHandler();
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

    unlock();
    return;
  };

  const organizeApplyOrder = () => {
    // const newData = getDummyDisplayAcceptedCFDOrder(marketCtx.selectedTicker!.currency);
    // const creatingData = newData;

    const applyData: IDisplayAcceptedCFDOrder = {
      // ...displayAcceptedCloseCFD,
      // ...displayedApplyCloseCfdData,
      ...openCfdDetails,

      closePrice:
        openCfdDetails.typeOfPosition === TypeOfPosition.BUY
          ? randomIntFromInterval(
              marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 0.75,
              marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.25
            )
          : openCfdDetails.typeOfPosition === TypeOfPosition.SELL
          ? randomIntFromInterval(
              marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.1,
              marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.25
            )
          : 99999,
      pnl: {
        type: randomIntFromInterval(0, 100) <= 50 ? ProfitState.PROFIT : ProfitState.LOSS,
        value: randomIntFromInterval(0, 1000),
      },
    };

    // const userInput = ['ticker', 'typeOfPosition', 'amount', 'targetAsset', 'uniAsset', 'leverage'];

    // const {
    //   ticker,
    //   typeOfPosition,
    //   amount,
    //   margin,
    //   takeProfit,
    //   stopLoss,
    //   guaranteedStop,
    //   targetAsset,
    //   uniAsset,
    //   leverage,
    //   ...dataRenewedWithoutExcludedProperties
    // } = creatingData;

    // const applyData = {
    //   ...displayApplyCreateCFD,
    //   data: {
    //     ...displayApplyCreateCFD.data,
    //     ...dataRenewedWithoutExcludedProperties,
    //   },
    // };

    return applyData;
  };

  const renewDataStyleHandler = async () => {
    // setSecondsLeft(latestProps.renewalDeadline - Date.now() / 1000);
    setDataRenewedStyle('animate-flash text-lightYellow2');
    setPnlRenewedStyle('animate-flash text-lightYellow2');

    // TODO: get latest price from marketCtx and calculate required margin data
    // FIXME: 應用 ?? 代替 !
    // FIXME: closedCfdDetails 的關倉價格
    // globalCtx.visiblePositionClosedModalHandler();

    const data = organizeApplyOrder();

    const newTimestamp = new Date().getTime() / 1000 + RENEW_QUOTATION_INTERVAL_SECONDS;
    setSecondsLeft(newTimestamp - Date.now() / 1000);

    globalCtx.dataPositionClosedModalHandler({
      openCfdDetails: {
        ...openCfdDetails,
        // TODO: 跟 userCtx 拿 getOpenCFD(id) 或自己算 PNL
        pnl: {
          type: randomIntFromInterval(0, 100) <= 50 ? ProfitState.PROFIT : ProfitState.LOSS,
          value: randomIntFromInterval(0, 1000),
        },
      },
      latestProps: {
        // renewalDeadline: Date.now() / 1000 + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
        renewalDeadline: newTimestamp,
        latestClosedPrice:
          openCfdDetails.typeOfPosition === TypeOfPosition.BUY
            ? randomIntFromInterval(
                marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 0.75,
                marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.25
              )
            : openCfdDetails.typeOfPosition === TypeOfPosition.SELL
            ? randomIntFromInterval(
                marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.1,
                marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.25
              )
            : 99999,
        // latestPnL: {
        //   type: randomIntFromInterval(0, 100) <= 2 ? ProfitState.PROFIT : ProfitState.LOSS,
        //   value: randomIntFromInterval(0, 1000),
        // },
      },
      // displayAcceptedCloseCFD: getDummyDisplayAcceptedCFDOrder('BTC'),
      // displayAcceptedCloseCFD: data,
      // displayApplyCloseCFD: getDummyDisplayApplyCloseCFDOrder('BTC'),
    });

    await wait(DELAYED_HIDDEN_SECONDS / 5);

    setDataRenewedStyle('text-lightYellow2');
    setPnlRenewedStyle('text-lightYellow2');

    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
    setPnlRenewedStyle('');
  };

  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) {
      setSecondsLeft(RENEW_QUOTATION_INTERVAL_SECONDS);
      setDataRenewedStyle('text-lightWhite');
      return;
    }

    // // FIXME: 用 globalCtx 傳 deadline
    const intervalId = setInterval(() => {
      // setSecondsLeft(Math.max(0, Math.round((latestProps.renewalDeadline - Date.now()) / 1000)));

      // console.log('deadline before ticking: ', latestProps.renewalDeadline);

      const base = latestProps.renewalDeadline;

      const tickingSec = base - Date.now() / 1000;
      // const tickingSec = latestProps.renewalDeadline - Date.now() / 1000 > 0 ? Math.round(latestProps.renewalDeadline - Date.now() / 1000) : Math.round();

      // console.log('inside useEffect: ', tickingSec);

      // setSecondsLeft()

      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);
      if (secondsLeft === 0) {
        renewDataStyleHandler();
      }
    }, 1000); // 不確定是否真的一秒執行一次

    return () => {
      clearInterval(intervalId);
      // unlock();
    };
    // const remainingTime = latestProps.renewalDeadline - Date.now() / 1000;
    // const {seconds: remainingTime} = useCountdown(latestProps.renewalDeadline);

    // setSecondsLeft(remainingTime);
  }, [
    secondsLeft,
    globalCtx.visiblePositionClosedModal,
    // globalCtx.dataPositionClosedModal?.latestProps.renewalDeadline,
  ]);

  const formContent = (
    <div>
      <div className="mt-8 mb-2 flex items-center justify-center space-x-2 text-center">
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
          className={`${displayedBorderColor} mx-6 mt-1 border-1px text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex-col justify-center text-center">
            {/* {displayedDataFormat()} */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Type</div>
              {/* TODO: color variable */}
              <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Price</div>
              <div className="">
                {/* TODO: Hardcode USDT */}${' '}
                {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                USDT
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Amount</div>
              <div className="">
                {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                {openCfdDetails.ticker}
              </div>
            </div>

            {/* FIXME: close price from market price DEPENDING ON sell or buy */}
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Closed Price</div>
              <div className={`${dataRenewedStyle}`}>
                ${' '}
                {latestProps.latestClosedPrice.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                USDT
              </div>
            </div>

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Required Margin</div>
              <div className="">$ {((openCfdDetails?.openPrice * 1.8) / 5).toFixed(2)} USDT</div>
            </div> */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">PNL</div>
              <div className={`${pnlRenewedStyle} ${displayedPnLColor}`}>
                {displayedPnLSymbol} ${' '}
                {openCfdDetails.pnl.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
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

            {/* <div className={`${tableLayout}`}>
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
            onClick={submitClickHandler}
            buttonType="button"
            className={`mx-22px mt-0 rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none`}
          >
            Confirm the order
          </RippleButton>
        </div>
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

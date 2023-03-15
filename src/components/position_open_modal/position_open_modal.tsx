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
import {
  getNowSeconds,
  locker,
  randomIntFromInterval,
  timestampToString,
  wait,
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {IPublicCFDOrder} from '../../interfaces/tidebit_defi_background/public_order';
import {BsClockHistory} from 'react-icons/bs';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {RENEW_QUOTATION_INTERVAL_SECONDS, UNIT_ASSET} from '../../constants/config';
import {dummyOpenCFDOrder} from '../../interfaces/tidebit_defi_background/open_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCreateCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {CFDOrderType} from '../../constants/cfd_order_type';
import {
  IApplyCreateCFDOrderData,
  getDummyApplyCreateCFDOrderData,
} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {ProfitState} from '../../constants/profit_state';

interface IPositionOpenModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdRequest: IApplyCreateCFDOrderData;
}

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  // displayApplyCreateCFD,
  openCfdRequest,
  ...otherProps
}: IPositionOpenModal) => {
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft] = useState(RENEW_QUOTATION_INTERVAL_SECONDS);
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');

  const [lock, unlock] = locker('position_open_modal.UseEffect');

  // const displayedApplyCreateCfdData = displayApplyCreateCFD.data as IApplyCreateCFDOrderData;

  /** TODO: (20230314 - Shirley)
    // loading modal -> UserContext.function (負責簽名) ->
    // 猶豫太久的話，單子會過期，就會顯示 failed modal，
    // 用戶沒簽名才是顯示 canceled modal
    // 用戶簽名成功，就會顯示 successful modal
   */

  // TODO: submit reqest
  const submitClickHandler = async () => {
    const [lock, unlock] = locker('position_open_modal.submitClickHandler');

    if (!lock()) return;
    await wait(DELAYED_HIDDEN_SECONDS / 5);
    modalClickHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Open Position',
      modalContent: 'Confirm the transaction',
    });
    globalCtx.visibleLoadingModalHandler();

    // FIXME: Use the real and correct data after the param is confirmed
    // const dummyCFDOrder: IApplyCreateCFDOrderData = getDummyApplyCreateCFDOrderData(
    //   marketCtx.selectedTicker?.currency || 'ETH'
    // );
    // eslint-disable-next-line no-console
    // console.log(`position_open_modal dummyCFDOrder`, dummyCFDOrder);
    const result = await userCtx.createCFDOrder(globalCtx.dataPositionOpenModal?.openCfdRequest);
    // console.log('result from userCtx in position_closed_modal.tsx: ', result);

    // TODO: temporary waiting
    await wait(DELAYED_HIDDEN_SECONDS);
    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Open Position',
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
        modalTitle: 'Open Position',
        modalContent: 'Transaction succeed',
        btnMsg: 'View on Etherscan',
        btnUrl: '#',
      });

      // globalCtx.dataHistoryPositionModalHandler(userCtx.getClosedCFD(openCfdDetails.id));

      globalCtx.visibleSuccessfulModalHandler();
      // await wait(DELAYED_HIDDEN_SECONDS);

      // globalCtx.eliminateAllModals();

      // globalCtx.visibleHistoryPositionModalHandler();
    } else if (result.reason === 'CANCELED') {
      globalCtx.dataCanceledModalHandler({
        modalTitle: 'Open Position',
        modalContent: 'Transaction canceled',
      });

      globalCtx.visibleCanceledModalHandler();
    } else if (result.reason === 'FAILED') {
      globalCtx.dataFailedModalHandler({
        modalTitle: 'Open Position',
        failedTitle: 'Failed',
        failedMsg: 'Failed to open Position',
      });

      globalCtx.visibleFailedModalHandler();
    }

    unlock();
    return;
  };

  const displayedGuaranteedStopSetting = !!openCfdRequest.guaranteedStop ? 'Yes' : 'No';
  // const displayedGuaranteedStopSetting =
  //   displayedApplyCreateCfdData.guaranteedStop === true ? 'Yes' : 'No';

  const test: IDisplayApplyCFDOrder = {
    type: CFDOrderType.CREATE,
    // data: getDummyDisplayApplyCreateCFDOrder(marketCtx.selectedTicker!.currency),
    data: {
      ticker: 'BTC',
      amount: 1.8, // User input
      typeOfPosition: TypeOfPosition.BUY, // User input
      leverage: 5,
      price: randomIntFromInterval(1000, 10000),
      targetAsset: 'USDT',
      uniAsset: 'USDT',
      margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)}, // User input
      takeProfit: 74521, // User input
      stopLoss: 25250, // User input
      guaranteedStop: true, // User input
      guaranteedStopFee: 1.8 * 10000 * 0.7,
      fee: 0,
      quotation: {
        ticker: 'BTC',
        targetAsset: 'USDT',
        uniAsset: 'USDT',
        price: randomIntFromInterval(1000, 10000),
        deadline: Date.now() / 1000 + RENEW_QUOTATION_INTERVAL_SECONDS,
        signature: '0x',
      }, // 報價單 定時從後端拿

      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: Date.now() / 1000 + 86400, // openTimestamp + 86400
    },
    signature: '0x',
    pnl: {
      type: ProfitState.PROFIT,
      value: 50,
    },
  };

  const displayedTypeOfPosition =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

  const displayedPositionColor = 'text-tidebitTheme';

  const displayedBorderColor = TypeOfBorderColor.NORMAL;

  const displayedTakeProfit = openCfdRequest.takeProfit ? `$ ${openCfdRequest.takeProfit}` : '-';
  const displayedStopLoss = openCfdRequest.stopLoss ? `$ ${openCfdRequest.stopLoss}` : '-';

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const toApplyCreateOrder = (
    openCfdRequest: IApplyCreateCFDOrderData
  ): IApplyCreateCFDOrderData => {
    const order: IApplyCreateCFDOrderData = {
      ...openCfdRequest,
      quotation: {
        ...openCfdRequest.quotation,
        // TODO: (20230315 - Shirley) get data from Ctx
        price: randomIntFromInterval(50, 40000),
        deadline: getNowSeconds() + RENEW_QUOTATION_INTERVAL_SECONDS,
        signature: '0x',
      },
      price:
        // TODO: (20230315 - Shirley) get data from Ctx
        openCfdRequest.typeOfPosition === TypeOfPosition.BUY
          ? randomIntFromInterval(
              marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 0.75,
              marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.25
            )
          : openCfdRequest.typeOfPosition === TypeOfPosition.SELL
          ? randomIntFromInterval(
              marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.1,
              marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.25
            )
          : 999999,
      // TODO: (20230315 - Shirley) calculate liquidationPrice
      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: getNowSeconds() + 86400, // openTimestamp + 86400
      // TODO: (20230315 - Shirley) calculate margin
      margin: {
        ...openCfdRequest.margin,
        amount: randomIntFromInterval(
          openCfdRequest.margin.amount * 0.9,
          openCfdRequest.margin.amount * 1.5
        ),
      },
      // TODO: (20230315 - Shirley) get data from Ctx
      // margin:
      // openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      //   ? (openCfdRequest.amount * marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice) /
      //     openCfdRequest.leverage
      //   : (openCfdRequest.amount * marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice) /
      //     openCfdRequest.leverage,
      /**
       *           amount: openCfdRequest.amount * (openCfdRequest.typeOfPosition === TypeOfPosition.BUY ? marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice ? marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice) / openCfdRequest.leverage,

       */
    };

    return order;
  };

  const renewDataHandler = async () => {
    // const applyData = toApplyCreateOrder();

    // const excludedProperties = ['margin', 'takeProfit', 'stopLoss'];

    // const creatingDataWithoutExcludedProperties = Object.keys(createCfdData)
    //   .filter(key => !excludedProperties.includes(key))
    //   .reduce((obj, key) => {
    //     return {
    //       ...obj,
    //       [key]: createCfdData[key],
    //     };
    //   }, {});

    setDataRenewedStyle('animate-flash text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 5);

    const newTimestamp = Math.ceil(new Date().getTime() / 1000) + RENEW_QUOTATION_INTERVAL_SECONDS;
    setSecondsLeft(Math.round(newTimestamp - getNowSeconds()));

    // TODO: (20230315 - Shirley) get latest price from marketCtx and calculate required margin data
    // TODO: (20230315 - Shirley) 應用 ?? 代替 !
    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: toApplyCreateOrder(openCfdRequest),
    });

    setDataRenewedStyle('text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
  };

  useEffect(() => {
    // if (!lock()) return;

    if (!globalCtx.visiblePositionOpenModal) {
      setSecondsLeft(RENEW_QUOTATION_INTERVAL_SECONDS);
      setDataRenewedStyle('text-lightWhite');

      return;
    }

    // if (secondsLeft === 0) {
    //   setSecondsLeft(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
    //   renewDataHandler();
    // }

    // async () => {
    //   if (secondsLeft === 0) {
    //     await wait(500);
    //     setSecondsLeft(15);
    //   }
    // };

    // it will start from 2 second
    // const newTimestamp = new Date().getTime() / 1000 + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS;

    const intervalId = setInterval(() => {
      // setSecondsLeft(prevSeconds => prevSeconds - 1);

      const base = openCfdRequest.quotation.deadline;
      const tickingSec = base - getNowSeconds();
      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

      //
      // console.log(
      //   'in setInterval, base: ',
      //   base,
      //   ', tickingSec: ',
      //   tickingSec,
      //   ', secondsLeft: ',
      //   secondsLeft
      // );

      if (secondsLeft === 0) {
        renewDataHandler();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      // unlock();
    };
  }, [secondsLeft, globalCtx.visiblePositionOpenModal]);

  // useEffect(() => {
  //   if (globalCtx.visiblePositionOpenModal) {
  //     setSecondsLeft(15);
  //   }

  //   // return () => {
  //   //   second;
  //   // };
  // }, [globalCtx.visiblePositionOpenModal]);

  const formContent = (
    <div>
      <div className="mt-8 mb-2 flex items-center justify-center space-x-2 text-center">
        <Image
          src={marketCtx.selectedTicker?.tokenImg ?? ''}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{marketCtx.selectedTicker?.currency}</div>
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
              <div className={`${dataRenewedStyle}`}>
                {/* TODO: Hardcode USDT */}${' '}
                {openCfdRequest.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                {openCfdRequest.margin.asset}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Amount</div>
              <div className="">
                {/* TODO:{openCfdRequest?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} */}
                {openCfdRequest.amount}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Required Margin</div>
              {/* TODO: Hardcode USDT */}
              <div className={`${dataRenewedStyle}`}>
                $ {openCfdRequest.margin.amount.toFixed(2)} {openCfdRequest.margin.asset}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">TP/ SL</div>
              <div className="">
                {displayedTakeProfit} / {displayedStopLoss}
              </div>
            </div>

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Time</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div> */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Liquidation Price</div>
              {/* TODO: Liquidation Price */}
              <div className="">$ {openCfdRequest.liquidationPrice}</div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Guaranteed Stop</div>
              <div className={``}>{displayedGuaranteedStopSetting}</div>
            </div>
          </div>
        </div>

        <div className="mx-6 my-2 text-xxs text-lightGray">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna
        </div>

        <div className={`flex-col space-y-5 text-base leading-relaxed text-lightWhite`}>
          <RippleButton
            // disabled={secondsLeft === INIT_POSITION_REMAINING_SECONDS}
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
      {/*  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">*/}
      {/*  overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none */}
      {/* position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          {/*content & panel*/}
          <div
            id="PositionOpenModal"
            // ref={modalRef}
            className="relative flex h-540px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="-mt-0 w-full text-center text-xl font-normal text-lightWhite">
                Open Position
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

export default PositionOpenModal;

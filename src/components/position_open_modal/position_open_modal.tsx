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
import {IPublicCFDOrder} from '../../interfaces/tidebit_defi_background/public_order';
import {BsClockHistory} from 'react-icons/bs';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {INIT_POSITION_REMAINING_SECONDS} from '../../constants/config';
import {dummyOpenCFDOrder} from '../../interfaces/tidebit_defi_background/open_cfd_order';

interface IPositionOpenModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdRequest: IPublicCFDOrder;
}

// TODO: seconds constant in display.ts or config.ts?

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  openCfdRequest,
  ...otherProps
}: IPositionOpenModal) => {
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft] = useState(INIT_POSITION_REMAINING_SECONDS);
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');

  const [lock, unlock] = locker('position_open_modal.UseEffect');

  /** TODO: 
    // loading modal -> UserContext.function (負責簽名) ->
    // 猶豫太久的話，單子會過期，就會顯示 failed modal，
    // 用戶沒簽名才是顯示 canceled modal
    // 用戶簽名成功，就會顯示 successful modal
   */
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
    const result = await userCtx.createOrder({...dummyOpenCFDOrder});
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

  // TODO: Typo `guaranteedStop`
  const displayedGuaranteedStopSetting = !!openCfdRequest.guranteedStop ? 'Yes' : 'No';

  // TODO: i18n
  const displayedTypeOfPosition =
    openCfdRequest?.typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

  // const displayedPnLColor =
  //   openCfdRequest?.pnl.type === 'PROFIT'
  //     ? TypeOfPnLColor.PROFIT
  //     : openCfdRequest?.pnl.type === 'LOSS'
  //     ? TypeOfPnLColor.LOSS
  //     : TypeOfPnLColor.EQUAL;

  const displayedPositionColor =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfPnLColor.PROFIT
      : TypeOfPnLColor.LOSS;

  const displayedBorderColor =
    openCfdRequest?.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfBorderColor.LONG
      : TypeOfBorderColor.SHORT;

  const displayedTakeProfit = openCfdRequest?.takeProfit ? `$ ${openCfdRequest.takeProfit}` : '-';
  const displayedStopLoss = openCfdRequest?.stopLoss ? `$ ${openCfdRequest.stopLoss}` : '-';

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  // let dataRenewedStyle = 'text-lightGray';

  // const displayedTime = timestampToString(openCfdRequest?.createdTime ?? 0);

  const renewDataHandler = async () => {
    setDataRenewedStyle('animate-flash text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 5);

    // TODO: get latest price from marketCtx and calculate required margin data
    // FIXME: 應用 ?? 代替 !
    globalCtx.dataPositionOpenModalHandler({
      ...openCfdRequest,
      price:
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
      // TODO:
      // margin:
      //   openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      //     ? (openCfdRequest.amount * marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice) /
      //       openCfdRequest.leverage
      //     : (openCfdRequest.amount * marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice) /
      //       openCfdRequest.leverage,

      margin: randomIntFromInterval(openCfdRequest.margin * 0.9, openCfdRequest.margin * 1.5),
    });

    setDataRenewedStyle('text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
  };

  useEffect(() => {
    // if (!lock()) return;

    if (!globalCtx.visiblePositionOpenModal) {
      setSecondsLeft(INIT_POSITION_REMAINING_SECONDS);
      setDataRenewedStyle('text-lightWhite');

      return;
    }

    if (secondsLeft === 0) {
      setSecondsLeft(INIT_POSITION_REMAINING_SECONDS);
      renewDataHandler();
    }
    // async () => {
    //   if (secondsLeft === 0) {
    //     await wait(500);
    //     setSecondsLeft(15);
    //   }
    // };

    const intervalId = setInterval(() => {
      setSecondsLeft(prevSeconds => prevSeconds - 1);
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
                {openCfdRequest?.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} USDT
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Amount</div>
              <div className="">
                {/* TODO:{openCfdRequest?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} */}
                {222}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Required Margin</div>
              {/* TODO: Hardcode USDT */}
              <div className={`${dataRenewedStyle}`}>
                $ {(openCfdRequest?.margin).toFixed(2)} USDT
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
              <div className="">$ 9.23</div>
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

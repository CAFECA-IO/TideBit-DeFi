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
import {INIT_POSITION_REMAINING_SECONDS} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IClosedCFDInfoProps, useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {ProfitState} from '../../constants/profit_state';
import {UserContext} from '../../contexts/user_context';

interface IPositionClosedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IOpenCFDDetails;
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

  const [mounted, setMounted] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(INIT_POSITION_REMAINING_SECONDS);
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');
  const [pnlDisplayedStyle, setPnlDisplayedStyle] = useState({
    color:
      openCfdDetails.pnl.type === ProfitState.PROFIT
        ? TypeOfPnLColor.PROFIT
        : openCfdDetails.pnl.type === ProfitState.LOSS
        ? TypeOfPnLColor.LOSS
        : TypeOfPnLColor.EQUAL,
    symbol:
      openCfdDetails.pnl.type === ProfitState.PROFIT
        ? '+'
        : openCfdDetails.pnl.type === ProfitState.LOSS
        ? '-'
        : '',
  });

  // TODO: create order function
  /**
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

    globalCtx.dataLoadingModalHandler({modalTitle: 'Close Position', modalContent: 'Loading...'});
    globalCtx.visibleLoadingModalHandler();

    const result = await userCtx.closeOrder({id: openCfdDetails.id});
    // console.log('result from userCtx in position_closed_modal.tsx: ', result);

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

      globalCtx.dataHistoryPositionModalHandler(userCtx.getClosedCFD(openCfdDetails.id));

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

  const displayedGuaranteedStopSetting = !!openCfdDetails.guaranteedStop ? 'Yes' : 'No';

  const displayedPnLSymbol =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === 'BUY' ? 'Up (Buy)' : 'Down (Sell)';

  const displayedPnLColor =
    openCfdDetails?.pnl.type === ProfitState.PROFIT
      ? TypeOfPnLColor.PROFIT
      : openCfdDetails?.pnl.type === ProfitState.LOSS
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    openCfdDetails?.typeOfPosition === 'BUY' ? TypeOfBorderColor.LONG : TypeOfBorderColor.SHORT;

  const displayedPositionColor =
    openCfdDetails.typeOfPosition === 'BUY' ? TypeOfPnLColor.PROFIT : TypeOfPnLColor.LOSS;

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.openTimestamp ?? 0);

  const renewDataHandler = async () => {
    setDataRenewedStyle('animate-flash text-lightYellow2');
    setPnlDisplayedStyle({
      symbol:
        openCfdDetails.pnl.type === ProfitState.PROFIT
          ? '+'
          : openCfdDetails.pnl.type === ProfitState.LOSS
          ? '-'
          : '',
      color: 'animate-flash text-lightYellow2',
    });

    // TODO: get latest price from marketCtx and calculate required margin data
    // FIXME: 應用 ?? 代替 !
    // FIXME: closedCfdDetails 的關倉價格
    globalCtx.dataPositionClosedModalHandler({
      openCfdDetails: {
        ...openCfdDetails,
        pnl: {
          type: randomIntFromInterval(0, 100) <= 60 ? ProfitState.PROFIT : ProfitState.LOSS,
          value: randomIntFromInterval(0, 1000),
        },
      },
      latestProps: {
        latestClosedPrice:
          openCfdDetails.typeOfPosition === TypeOfPosition.BUY
            ? randomIntFromInterval(
                marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 0.75,
                marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.25
              )
            : openCfdDetails.typeOfPosition === TypeOfPosition.SELL
            ? randomIntFromInterval(
                marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.1,
                marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.25
              )
            : 99999,
        // latestPnL: {
        //   type: randomIntFromInterval(0, 100) <= 2 ? ProfitState.PROFIT : ProfitState.LOSS,
        //   value: randomIntFromInterval(0, 1000),
        // },
      },
    });

    await wait(DELAYED_HIDDEN_SECONDS / 5);

    setDataRenewedStyle('text-lightYellow2');

    setPnlDisplayedStyle({
      color: 'text-lightYellow2',
      symbol:
        openCfdDetails.pnl.type === ProfitState.PROFIT
          ? '+'
          : openCfdDetails.pnl.type === ProfitState.LOSS
          ? '-'
          : '',
    });

    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');

    setPnlDisplayedStyle({
      color:
        openCfdDetails.pnl.type === ProfitState.PROFIT
          ? TypeOfPnLColor.PROFIT
          : openCfdDetails.pnl.type === ProfitState.LOSS
          ? TypeOfPnLColor.LOSS
          : TypeOfPnLColor.EQUAL,
      symbol:
        openCfdDetails.pnl.type === ProfitState.PROFIT
          ? '+'
          : openCfdDetails.pnl.type === ProfitState.LOSS
          ? '-'
          : '',
    });
  };

  useEffect(() => {
    // if (!lock()) return;
    setMounted(true);

    if (!mounted) {
      setPnlDisplayedStyle({
        color:
          openCfdDetails.pnl.type === ProfitState.PROFIT
            ? TypeOfPnLColor.PROFIT
            : openCfdDetails.pnl.type === ProfitState.LOSS
            ? TypeOfPnLColor.LOSS
            : TypeOfPnLColor.EQUAL,
        symbol:
          openCfdDetails.pnl.type === ProfitState.PROFIT
            ? '+'
            : openCfdDetails.pnl.type === ProfitState.LOSS
            ? '-'
            : '',
      });
    }

    if (!globalCtx.visiblePositionClosedModal) {
      setSecondsLeft(INIT_POSITION_REMAINING_SECONDS);
      setDataRenewedStyle('text-lightWhite');

      // console.log('open cfd PNL: ', openCfdDetails.pnl);
      // console.log('latest PNL: ', latestProps.latestPnL);

      return;
    }

    // console.log('openCfd pnl: ', openCfdDetails.pnl);

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
                {/* TODO: Hardcode USDT */}${' '}
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
              <div className={`${pnlDisplayedStyle.color}`}>
                {pnlDisplayedStyle.symbol} ${' '}
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

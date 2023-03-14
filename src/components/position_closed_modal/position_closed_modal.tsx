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
  locker,
  randomIntFromInterval,
  timestampToString,
  wait,
  getDeadline,
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {POSITION_PRICE_RENEWAL_INTERVAL_SECONDS} from '../../constants/config';
import {TypeOfPosition} from '../../constants/type_of_position';
import {IClosedCFDInfoProps, useGlobal} from '../../contexts/global_context';
import {BsClockHistory} from 'react-icons/bs';
import {ProfitState} from '../../constants/profit_state';
import {UserContext} from '../../contexts/user_context';
import {useCountdown} from '../../lib/hooks/use_countdown';
import {getDummyApplyCloseCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {useTranslation} from 'react-i18next';

type TranslateFunction = (s: string) => string;
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
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  // 1677229200
  // new Date('2023-02-25T17:00:00').getTime() / 1000
  // const {hours, minutes, seconds, timestamp} = useCountdown(latestProps.renewalDeadline);

  // console.log('renewalDeadline: ', latestProps.renewalDeadline);
  // console.log('use Countdown: ', hours, minutes, seconds);
  // console.log('use Countdown seconds left: ', seconds);

  // const tickingSec = latestProps.renewalDeadline - Date.now() / 1000;

  // tickingSec > 0 ? Math.round(tickingSec) : 0
  const [secondsLeft, setSecondsLeft] = useState(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
  // console.log('outside useEffect tickingSec: ', tickingSec);

  // Math.max(0, Math.round((latestProps.renewalDeadline - Date.now()) / 1000))

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

  const displayedTime = timestampToString(openCfdDetails?.openTimestamp ?? 0);

  // console.log('closed modal');

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

  const renewDataStyleHandler = async () => {
    // setSecondsLeft(latestProps.renewalDeadline - Date.now() / 1000);
    setDataRenewedStyle('animate-flash text-lightYellow2');
    setPnlRenewedStyle('animate-flash text-lightYellow2');

    // TODO: get latest price from marketCtx and calculate required margin data
    // FIXME: 應用 ?? 代替 !
    // FIXME: closedCfdDetails 的關倉價格
    // globalCtx.visiblePositionClosedModalHandler();

    const deadline = getDeadline(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
    setSecondsLeft(deadline - Date.now() / 1000);

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
        renewalDeadline: deadline,
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
    });

    // globalCtx.visiblePositionClosedModalHandler();

    // console.log('in renewDataHandler, deadline: ', latestProps.renewalDeadline);
    // console.log('in renewDataHandler, newTimestamp: ', newTimestamp);

    await wait(DELAYED_HIDDEN_SECONDS / 5);

    setDataRenewedStyle('text-lightYellow2');
    setPnlRenewedStyle('text-lightYellow2');

    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
    setPnlRenewedStyle('');
  };

  // function countdown(deadlineMs: number, callback: () => void) {
  //   const interval = setInterval(() => {
  //     const nowMs = Date.now();
  //     const remaining = deadlineMs - nowMs;
  //     console.log('remaining seconds: ', remaining / 1000);
  //     if (remaining <= 0) {
  //       clearInterval(interval);
  //       callback();
  //     }
  //   }, 1000);
  // }

  useEffect(() => {
    if (!globalCtx.visiblePositionClosedModal) {
      setSecondsLeft(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
      setDataRenewedStyle('text-lightWhite');
      return;
    }

    // // 原本有用的 code 在改成用 deadline - now 的方式之後就被直接在 useEffect 裡的 setInterval 寫 if (secondsLeft === 0) 就 renewData，並且在 renewData 裡面重新設定 secondsLeft 取代了
    // // 但還能讓 countdown 的數字跑到 1 就更新，不會跑到 0
    // if (Math.floor(secondsLeft) === 0) {
    //   renewDataStyleHandler();
    //   // console.log('should renew the deadline: ', latestProps.renewalDeadline);
    // }

    // async () => {
    //   if (secondsLeft === 0) {
    //     await wait(500);
    //     setSecondsLeft(15);
    //   }
    // };

    // console.log('before setInterval'); // 每跳一秒就重設 interval
    // const now = new Date().getTime();
    // TODO: --------timestamp in milliseconds-----------
    // const now = Date.now();
    // // const deadline = now + secondsLeft * 1000;
    // const deadline = now + SECONDS_INTERVAL_UNTIL_RENEWAL * 1000;

    // const options = {hour12: false};

    // const nowString = new Date(now).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, options);
    // const deadlineString = new Date(deadline).toLocaleString(
    //   UNIVERSAL_NUMBER_FORMAT_LOCALE,
    //   options
    // );

    // console.log('NOW: ', now, nowString);
    // console.log('DEADLINE: ', deadline, deadlineString);

    // const deadline = Date.now() + SECONDS_INTERVAL_UNTIL_RENEWAL * 1000;
    // countdown(deadline, () => {
    //   console.log('countdown finished');
    // });

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
      // console.log('in setInterval, secondsLeft: ', secondsLeft);

      // setSecondsLeft(Math.round(tickingSec > 0 ? tickingSec : 0));
      // setSecondsLeft(Math.max(0, Math.round(tickingSec)));
      // setSecondsLeft(Math.round(latestProps.renewalDeadline - Date.now() / 1000));
      // const tickingNow = Date.now();
      // const remainingTime = deadline - tickingNow;
      // setSecondsLeft(remainingTime); // 改成終點線-現在時間線
      // console.log('remainingTime: ', remainingTime / 1000);
      // console.log('tickingNow: ', new Date(tickingNow).toLocaleString());
      // console.log('deadline: ', new Date(deadline).toLocaleString());

      // setSecondsLeft(prevSeconds => prevSeconds - 1); // 改成終點線-現在時間線
      // console.log('prevSeconds: ', secondsLeft);
      if (secondsLeft === 0) {
        // base = new Date().getTime() / 1000 + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS;

        renewDataStyleHandler();

        // setSecondsLeft(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
        // setSecondsLeft(latestProps.renewalDeadline - Date.now() / 1000);
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
                {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">USDT</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
              <div className="">
                {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">{openCfdDetails.ticker}</span>
              </div>
            </div>

            {/* FIXME: close price from market price DEPENDING ON sell or buy */}
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.CLOSED_PRICE')}</div>
              <div className={`${dataRenewedStyle}`}>
                {/* TODO: Hardcode USDT */}
                {latestProps.latestClosedPrice.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">USDT</span>
              </div>
            </div>

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Required Margin</div>
              <div className="">$ {((openCfdDetails?.openPrice * 1.8) / 5).toFixed(2)} USDT</div>
            </div> */}

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

            {/* <div className={`${tableLayout}`}>
              <div className="text-lightGray">Liquidation Price</div>
              <div className="">$ 9.23</div>
            </div> */}
          </div>
        </div>

        <div className="my-3 text-xxs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          onClick={submitClickHandler}
          buttonType="button"
          className={`mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none`}
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

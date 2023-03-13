import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  DELAYED_HIDDEN_SECONDS,
  TypeOfBorderColor,
  TypeOfPnLColor,
  TypeOfTransaction,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import {locker, randomIntFromInterval, timestampToString, wait} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {IPublicCFDOrder} from '../../interfaces/tidebit_defi_background/public_order';
import {BsClockHistory} from 'react-icons/bs';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {POSITION_PRICE_RENEWAL_INTERVAL_SECONDS} from '../../constants/config';
import {dummyOpenCFDOrder} from '../../interfaces/tidebit_defi_background/open_cfd_order';
import {
  getDummyApplyCreateCFDOrderData,
  IApplyCreateCFDOrderData,
} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {useTranslation} from 'react-i18next';

type TranslateFunction = (s: string) => string;
interface IPositionOpenModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdRequest: IApplyCreateCFDOrderData;
  renewalDeadline: number;
}

// ToDo: seconds constant in display.ts or config.ts?

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  openCfdRequest,
  renewalDeadline,
  ...otherProps
}: IPositionOpenModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft] = useState(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');

  const [lock, unlock] = locker('position_open_modal.UseEffect');

  /** ToDo: 
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
    // const dummyCFDOrder: IApplyCreateCFDOrderData = getDummyApplyCreateCFDOrderData(
    //   marketCtx.selectedTicker?.currency || 'ETH'
    // );
    // eslint-disable-next-line no-console
    // console.log(`position_open_modal dummyCFDOrder`, dummyCFDOrder);
    const result = await userCtx.createCFDOrder(globalCtx.dataPositionOpenModal?.openCfdRequest);
    // console.log('result from userCtx in position_closed_modal.tsx: ', result);

    // ToDo: temporary waiting
    await wait(DELAYED_HIDDEN_SECONDS);
    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Open Position',
      modalContent: 'Transaction broadcast',
      btnMsg: 'View on Etherscan',
      btnUrl: '#',
    });

    // ToDo: temporary waiting
    await wait(DELAYED_HIDDEN_SECONDS);

    // Close loading modal
    globalCtx.eliminateAllModals();

    // ToDo: Revise the `result.reason` to constant by using enum or object
    // ToDo: the button URL
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

  // ToDo: Typo `guaranteedStop`
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

  // const displayedPnLColor =
  //   openCfdRequest?.pnl.type === 'PROFIT'
  //     ? TypeOfPnLColor.PROFIT
  //     : openCfdRequest?.pnl.type === 'LOSS'
  //     ? TypeOfPnLColor.LOSS
  //     : TypeOfPnLColor.EQUAL;

  const displayedPositionColor = 'text-tidebitTheme';
  // openCfdRequest.typeOfPosition === TypeOfPosition.BUY
  //   ? TypeOfPnLColor.PROFIT
  //   : TypeOfPnLColor.LOSS;

  const displayedBorderColor = TypeOfBorderColor.NORMAL;
  // openCfdRequest.typeOfPosition === TypeOfPosition.BUY
  //   ? TypeOfBorderColor.LONG
  //   : TypeOfBorderColor.SHORT;

  const displayedTakeProfit = openCfdRequest.takeProfit ? `$ ${openCfdRequest.takeProfit}` : '-';
  const displayedStopLoss = openCfdRequest.stopLoss ? `$ ${openCfdRequest.stopLoss}` : '-';

  //const displayedExpirationTime = timestampToString(openCfdRequest?.quotation.deadline ?? 0);

  const layoutInsideBorder = 'mx-5 my-2 flex justify-between';

  // let dataRenewedStyle = 'text-lightGray';

  // const displayedTime = timestampToString(openCfdRequest?.createTimestamp ?? 0);

  const renewDataHandler = async () => {
    setDataRenewedStyle('animate-flash text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 5);

    const newTimestamp =
      Math.ceil(new Date().getTime() / 1000) + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS;
    setSecondsLeft(newTimestamp - Date.now() / 1000);

    // ToDo: get latest price from marketCtx and calculate required margin data
    // FIXME: 應用 ?? 代替 !
    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: {
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
        margin: {
          ...openCfdRequest.margin,
          amount: randomIntFromInterval(
            openCfdRequest.margin.amount * 0.9,
            openCfdRequest.margin.amount * 1.5
          ),
        },
        // ToDo:
        // margin:
        //   openCfdRequest.typeOfPosition === TypeOfPosition.BUY
        //     ? (openCfdRequest.amount * marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice) /
        //       openCfdRequest.leverage
        //     : (openCfdRequest.amount * marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice) /
        //       openCfdRequest.leverage,
      },
      renewalDeadline: newTimestamp,
    });

    setDataRenewedStyle('text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
  };

  useEffect(() => {
    // if (!lock()) return;

    if (!globalCtx.visiblePositionOpenModal) {
      setSecondsLeft(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
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

      const base = renewalDeadline;
      const tickingSec = base - Date.now() / 1000;
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
    <div className="mt-8 flex flex-col px-6 pb-2">
      <div className="flex items-center justify-center space-x-2 text-center">
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
          className={`${displayedBorderColor} mt-1 border-1px py-4 text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex flex-col justify-center text-center">
            {/* {displayedDataFormat()} */}

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
                ${' '}
                {openCfdRequest.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">USDT</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
              {/* ToDo:{openCfdRequest?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} */}
              <div className="">
                {openCfdRequest.amount.toFixed(2)}
                <span className="ml-1 text-lightGray">{marketCtx.selectedTicker?.currency}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder} whitespace-nowrap`}>
              <div className="text-lightGray">{t('POSITION_MODAL.REQUIRED_MARGIN')}</div>
              <div className={`${dataRenewedStyle}`}>
                $ {openCfdRequest.margin.amount.toFixed(2)}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">USDT</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.LIMIT_AND_STOP')}</div>
              <div className="">
                {displayedTakeProfit} / {displayedStopLoss}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">USDT</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
              <div className={`relative flex items-center`}>
                {displayedGuaranteedStopSetting}

                <div
                  className="relative ml-1"
                  onMouseEnter={() => setGuaranteedTooltipStatus(3)}
                  onMouseLeave={() => setGuaranteedTooltipStatus(0)}
                >
                  <div className="opacity-70">
                    <AiOutlineQuestionCircle size={16} />
                  </div>
                  {guaranteedTooltipStatus == 3 && (
                    <div
                      role="tooltip"
                      className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg shadow-black/80 transition duration-150 ease-in-out"
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
              <div className="">
                {/* ToDo: Expiration Time */}
                2023-03-09 15:20:13
                {/* {displayedExpirationTime.date} {displayedExpirationTime.time} */}
              </div>
            </div>

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Time</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div> */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
              {/* ToDo: Liquidation Price */}

              <div className="">
                $ 9.23
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">USDT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4 text-xxs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          // disabled={secondsLeft === INIT_POSITION_REMAINING_SECONDS}
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
            id="PositionOpenModal"
            // ref={modalRef}
            className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="w-full text-center text-xl font-normal text-lightWhite">
                {t('POSITION_MODAL.OPEN_POSITION_TITLE')}
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

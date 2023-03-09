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

// TODO: seconds constant in display.ts or config.ts?

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

  // TODO: Typo `guaranteedStop`
  const displayedGuaranteedStopSetting = !!openCfdRequest.guaranteedStop ? 'Yes' : 'No';

  const displayedTypeOfPosition =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? t('open_position.CFD_Type_Up')
      : t('open_position.CFD_Type_Down');

  const displayedBuyOrSell =
    openCfdRequest.typeOfPosition === TypeOfPosition.BUY
      ? t('open_position.CFD_Type_Buy')
      : t('open_position.CFD_Type_Sell');

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

    // TODO: get latest price from marketCtx and calculate required margin data
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
        // TODO:
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
              <div className="text-lightGray">{t('open_position.CFD_Type')}</div>
              <div className="inline-flex">
                <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
                <div className="ml-1 text-lightGray">{displayedBuyOrSell}</div>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('open_position.OpenPrice')}</div>
              <div className={`${dataRenewedStyle}`}>
                {/* TODO: Hardcode USDT */}${' '}
                {openCfdRequest.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} USDT
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('open_position.Amount')}</div>
              <div className="inline-flex">
                {/* TODO:{openCfdRequest?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} */}
                <div className="">{openCfdRequest.amount}</div>
                <div className="ml-1 text-lightGray">{openCfdRequest.ticker}</div>
              </div>
            </div>

            <div className={`${layoutInsideBorder} whitespace-nowrap`}>
              <div className="text-lightGray">{t('open_position.RequiredMargin')}</div>
              {/* TODO: Hardcode USDT */}
              <div className={`${dataRenewedStyle}`}>
                $ {openCfdRequest.margin.amount.toFixed(2)} USDT
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('open_position.TPSL')}</div>
              <div className="">
                {displayedTakeProfit} / {displayedStopLoss}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('open_position.GuaranteedStop')}</div>
              <div className={`relative flex items-center`}>
                {displayedGuaranteedStopSetting}

                <div className="group">
                  <div className="invisible absolute bottom-6 right-0 w-180px bg-darkGray8 p-2 text-left text-xxs text-lightWhite opacity-0 shadow-lg shadow-black/80 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    {t('open_position.GuaranteedStopHint')}
                  </div>
                  <Image
                    className="ml-2"
                    src="/elements/question.svg"
                    alt="question icon"
                    width={12}
                    height={12}
                  />
                </div>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('open_position.Expiration')}</div>
              <div className="">
                {/* TODO: Expiration Time */}
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
              <div className="text-lightGray">{t('open_position.Liquidation')}</div>
              {/* TODO: Liquidation Price */}
              <div className="">$ 9.23</div>
            </div>
          </div>
        </div>

        <div className="my-4 text-xxs text-lightGray">{t('open_position.CFDContent')}</div>

        <RippleButton
          // disabled={secondsLeft === INIT_POSITION_REMAINING_SECONDS}
          onClick={submitClickHandler}
          buttonType="button"
          className={`mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
        >
          {t('open_position.Confirm_Button')}
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
              <h3 className="-mt-0 w-full text-center text-xl font-normal text-lightWhite">
                {t('open_position.CFD_Title')}
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

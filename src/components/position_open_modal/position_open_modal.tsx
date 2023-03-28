import {ImCross} from 'react-icons/im';
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
import {
  locker,
  randomIntFromInterval,
  timestampToString,
  wait,
  getDeadline,
  getNowSeconds,
  getTimestamp,
} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {BsClockHistory} from 'react-icons/bs';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {POSITION_PRICE_RENEWAL_INTERVAL_SECONDS, unitAsset} from '../../constants/config';
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
}

// ToDo: seconds constant in display.ts or config.ts?

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  openCfdRequest,
  ...otherProps
}: IPositionOpenModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  const [secondsLeft, setSecondsLeft] = useState(
    Math.round(openCfdRequest.quotation.deadline - getTimestamp() - 1)
  );
  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');

  const toApplyCreateOrder = (
    openCfdRequest: IApplyCreateCFDOrderData
  ): IApplyCreateCFDOrderData => {
    const order: IApplyCreateCFDOrderData = {
      ...openCfdRequest,
      createTimestamp: getTimestamp(),
      liquidationTime: getTimestamp() + 86400,
    };

    return order;
  };

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

    const applyCreateOrder: IApplyCreateCFDOrderData = toApplyCreateOrder(openCfdRequest);
    const result = await userCtx.createCFDOrder(applyCreateOrder);

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

      globalCtx.visibleSuccessfulModalHandler();
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

  const displayedExpirationTime = timestampToString(openCfdRequest?.quotation.deadline ?? 0);

  const layoutInsideBorder = 'mx-5 my-2 flex justify-between';

  const renewDataHandler = async () => {
    setDataRenewedStyle('animate-flash text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 5);

    const deadline = getDeadline(POSITION_PRICE_RENEWAL_INTERVAL_SECONDS);
    setSecondsLeft(deadline - getTimestamp());

    const newPrice =
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
        : 999999;
    const newMargin = randomIntFromInterval(100, 500);

    // TODO: (20230324 - Shirley) renew price, liquidation time, liquidation price
    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: {
        ...openCfdRequest,
        quotation: {
          ...openCfdRequest.quotation,
          deadline: deadline,
          price: newPrice,
          signature: '0x',
        },
        price: newPrice,
        margin: {
          ...openCfdRequest.margin,
          amount: newMargin,
        },
      },
    });

    setDataRenewedStyle('text-lightYellow2');
    await wait(DELAYED_HIDDEN_SECONDS / 2);
    setDataRenewedStyle('text-lightWhite');
  };

  const mouseEnterHandler = () => setGuaranteedTooltipStatus(3);
  const mouseLeaveHandler = () => setGuaranteedTooltipStatus(0);

  useEffect(() => {
    // if (!lock()) return;

    if (!globalCtx.visiblePositionOpenModal) {
      setSecondsLeft(Math.round(openCfdRequest.quotation.deadline - getTimestamp() - 1));
      setDataRenewedStyle('text-lightWhite');

      return;
    }

    const intervalId = setInterval(() => {
      const base = openCfdRequest.quotation.deadline;
      const tickingSec = base - getTimestamp();

      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

      if (secondsLeft === 0) {
        renewDataHandler();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      // unlock();
    };
  }, [secondsLeft, globalCtx.visiblePositionOpenModal]);

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
                {openCfdRequest.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
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
                {openCfdRequest.margin.amount.toFixed(2)}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TP_AND_SL')}</div>
              <div className="">
                {displayedTakeProfit} / {displayedStopLoss}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
              <div className={`relative flex items-center`}>
                {displayedGuaranteedStopSetting}

                <div
                  className="relative ml-1"
                  onMouseEnter={mouseEnterHandler}
                  onMouseLeave={mouseLeaveHandler}
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
                {displayedExpirationTime.date} {displayedExpirationTime.time}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
              <div className="">
                {openCfdRequest.liquidationPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}
                {/* ToDo: Hardcode USDT */}
                <span className="ml-1 text-lightGray">{unitAsset}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4 text-xxs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

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

import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  TypeOfBorderColor,
  TypeOfPnLColor,
  TypeOfPnLColorHex,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {useContext, useEffect, useRef} from 'react';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ProfitState} from '../../constants/profit_state';
import {randomIntFromInterval, roundToDecimalPlaces, timestampToString} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import useState from 'react-usestateref';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {POSITION_PRICE_RENEWAL_INTERVAL_SECONDS, unitAsset} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {useTranslation} from 'react-i18next';

type TranslateFunction = (s: string) => string;
interface IUpdatedFormModal {
  modalVisible: boolean;
  modalClickHandler: (bool?: boolean | any) => void;
  openCfdDetails: IOpenCFDDetails;
  // id?: string;
}

const UpdatedFormModal = ({
  // openCfdDetails,
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  // id,
  ...otherProps
}: IUpdatedFormModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // console.log('openCfdDetails in details modal: ', openCfdDetails.id);
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);

  const initialTpToggle = openCfdDetails?.takeProfit ? true : false;
  const initialSlToggle = openCfdDetails?.stopLoss ? true : false;

  const cfdTp = openCfdDetails?.takeProfit;
  const cfdSl = openCfdDetails?.stopLoss;

  const initialTpInput = cfdTp ?? openCfdDetails.recommendedTp;
  const initialSlInput = cfdSl ?? openCfdDetails.recommendedSl;

  const initialGuaranteedChecked = openCfdDetails.guaranteedStop;

  const [tpValue, setTpValue, tpValueRef] = useState(initialTpInput);
  const [slValue, setSlValue, slValueRef] = useState(initialSlInput);
  const [tpToggle, setTpToggle, tpToggleRef] = useState(initialTpToggle);
  const [slToggle, setSlToggle, slToggleRef] = useState(initialSlToggle);
  const [guaranteedChecked, setGuaranteedChecked, guaranteedpCheckedRef] =
    useState(initialGuaranteedChecked);

  const [guaranteedTooltipStatus, setGuaranteedTooltipStatus] = useState(0);

  // FIXME: SL setting should have a lower limit and an upper limit depending on its position type
  const [slLowerLimit, setSlLowerLimit] = useState(0);
  const [slUpperLimit, setSlUpperLimit] = useState(Infinity);

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [expectedProfitValue, setExpectedProfitValue, expectedProfitValueRef] = useStateRef(0);
  const [expectedLossValue, setExpectedLossValue, expectedLossValueRef] = useStateRef(0);

  const getToggledTpSetting = (bool: boolean) => {
    // setSubmitDisabled(true);

    setTpToggle(bool);

    const profit =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(
            (tpValueRef.current - openCfdDetails?.openPrice) * openCfdDetails.amount,
            2
          )
        : roundToDecimalPlaces(
            (openCfdDetails?.openPrice - tpValueRef.current) * openCfdDetails.amount,
            2
          );

    setExpectedProfitValue(profit);

    // if (bool !== initialTpToggle) {
    //   setSubmitDisabled(false);
    // }
  };

  const getToggledSlSetting = (bool: boolean) => {
    // setSubmitDisabled(true);

    setSlToggle(bool);

    // if (bool !== initialTpToggle) {
    //   setSubmitDisabled(false);
    // }
    const loss =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(
            (openCfdDetails?.openPrice - slValueRef.current) * openCfdDetails.amount,
            2
          )
        : roundToDecimalPlaces(
            (slValueRef.current - openCfdDetails?.openPrice) * openCfdDetails.amount,
            2
          );

    setExpectedLossValue(loss);
  };

  const getTpValue = (value: number) => {
    // setSubmitDisabled(true);

    setTpValue(value);

    const profit =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(
            (tpValueRef.current - openCfdDetails?.openPrice) * openCfdDetails.amount,
            2
          )
        : roundToDecimalPlaces(
            (openCfdDetails?.openPrice - tpValueRef.current) * openCfdDetails.amount,
            2
          );

    setExpectedProfitValue(profit);

    // if (value !== initialTpInput) {
    //   setSubmitDisabled(false);
    // }
    // console.log('tp value from Trading Input:', value);
  };

  const getSlValue = (value: number) => {
    // setSubmitDisabled(true);

    setSlValue(value);

    // if (value !== initialSlInput) {
    //   setSubmitDisabled(false);
    // }
    // console.log('sl value from Trading Input:', value);

    const loss =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(
            (openCfdDetails?.openPrice - slValueRef.current) * openCfdDetails.amount,
            2
          )
        : roundToDecimalPlaces(
            (slValueRef.current - openCfdDetails?.openPrice) * openCfdDetails.amount,
            2
          );

    setExpectedLossValue(loss);
  };

  const displayedExpectedProfit = (
    // longTpToggle ? (
    //   <div className={`${`translate-y-2`} -mt-0 items-center transition-all duration-500`}>
    //     <div className="text-sm text-lightWhite">
    //       {expectedLongProfitValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
    //     </div>
    //   </div>
    // ) : null;

    <div
      className={`${
        tpToggle ? `mb-3 translate-y-1` : `invisible translate-y-0`
      } -mt-0 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('POSITION_MODAL.EXPECTED_PROFIT')}: + ${' '}
        {roundToDecimalPlaces(Math.abs(expectedProfitValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedExpectedLoss = (
    <div
      className={`${
        slToggle ? `mb-3 translate-y-1` : `invisible translate-y-0`
      } -mt-1 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        *
        {guaranteedpCheckedRef.current
          ? t('POSITION_MODAL.CLOSE_AT_LOSS')
          : t('POSITION_MODAL.EXPECTED_LOSS')}
        : - ${' '}
        {roundToDecimalPlaces(Math.abs(expectedLossValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const guaranteedCheckedChangeHandler = () => {
    // If position is not guaranteed, then set the stop loss to the recommended value
    // setSubmitDisabled(true);

    // console.log('guaranteedChecked: ', guaranteedStopCheckRef.current);

    if (!openCfdDetails?.guaranteedStop) {
      // if (openCfdDetails.guaranteedStop) {
      //   setSubmitDisabled(true);
      //   return;
      // }

      setGuaranteedChecked(!guaranteedChecked);
      setSlToggle(true);
      setSlLowerLimit(0);
      setSlUpperLimit(Infinity);

      // setSubmitDisabled(false);

      return;
    } else {
      setSlLowerLimit(openCfdDetails?.stopLoss ?? openCfdDetails?.recommendedSl);
      setSlUpperLimit(openCfdDetails?.stopLoss ?? openCfdDetails?.recommendedSl);
      setSlValue(openCfdDetails?.stopLoss ?? openCfdDetails?.recommendedSl);

      // setSubmitDisabled(true);

      return;
    }

    // if (openCfdDetails)
  };

  // const getSlToggleFunction = (slToggleFunction: () => void) => {
  //   slToggleFunction();
  // };

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

  const displayedPositionColor = 'text-tidebitTheme';

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

  const displayedColorHex =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL;

  const displayedCrossColor =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : 'hover:before:bg-lightRed hover:after:bg-lightRed';
  const displayedCrossStyle =
    'before:absolute before:-left-2px before:top-10px before:z-40 before:block before:h-1 before:w-7 before:rotate-45 before:rounded-md after:absolute after:-left-2px after:top-10px after:z-40 after:block after:h-1 after:w-7 after:-rotate-45 after:rounded-md';

  const isDisplayedTakeProfitSetting = tpToggle ? 'flex' : 'invisible';
  const isDisplayedStopLossSetting = slToggle ? 'flex' : 'invisible';

  const displayedSlLowerLimit = openCfdDetails?.guaranteedStop
    ? openCfdDetails?.stopLoss ?? openCfdDetails.recommendedSl
    : slLowerLimit;
  const displayedSlUpperLimit = openCfdDetails?.guaranteedStop
    ? openCfdDetails?.stopLoss ?? openCfdDetails.recommendedSl
    : slUpperLimit;

  const displayedTime = timestampToString(openCfdDetails?.openTimestamp ?? 0);

  const layoutInsideBorder = 'mx-5 my-3 flex justify-between';

  const buttonClickHandler = () => {
    // console.log('btn clicked');
    // setSubmitDisabled(false);

    let changedProperties = {};

    // Detect if tpValue has changed
    if (tpToggle && tpValue !== openCfdDetails.takeProfit) {
      changedProperties = {
        ...changedProperties,
        takeProfit: tpValue,
      };
    }

    // Detect if spValue has changed
    if (slToggle && slValue !== openCfdDetails.stopLoss) {
      changedProperties = {...changedProperties, stopLoss: slValue};
    }

    // Detect if tpToggle has changed
    if (initialTpToggle !== tpToggle) {
      changedProperties = {
        ...changedProperties,
        takeProfit: tpToggle ? tpValue : 0,
      };
    }

    // Detect if slToggle has changed
    if (initialSlToggle !== slToggle) {
      changedProperties = {
        ...changedProperties,
        stopLoss: slToggle ? slValue : 0,
      };
    }

    // Detect if guaranteedStop has changed
    if (guaranteedChecked !== openCfdDetails.guaranteedStop) {
      const stopLoss = slValue !== openCfdDetails.stopLoss ? slValue : undefined;
      changedProperties = {
        ...changedProperties,
        guaranteedStopLoss: guaranteedChecked,
        stopLoss: stopLoss,
      };
    }

    // If there's no updates, do nothing
    if (Object.keys(changedProperties).length > 0) {
      globalCtx.visiblePositionDetailsModalHandler();

      // TODO: send changedProperties to MetaMask for signature
      changedProperties = {orderId: openCfdDetails.id, ...changedProperties};

      globalCtx.toast({
        type: 'info',
        message: 'Changes: \n' + JSON.stringify(changedProperties),
        toastId: JSON.stringify(changedProperties),
      });

      // console.log(changedProperties);
      // for (const [key, value] of Object.entries(changedProperties)) {
      //   console.log(`${key}: ${value}\n`);
      // }

      // TODO: before waiting for metamask signature, block the button
      setSubmitDisabled(true);

      // setTimeout(() => {
      //   globalContext.visiblePositionDetailsModalHandler(false);
      //   // console.log('modal visible: ', modalVisible);
      // }, 1000);
      globalCtx.dataPositionUpdatedModalHandler({
        openCfdDetails: {...openCfdDetails},
        updatedProps: {...changedProperties},
      });
      globalCtx.visiblePositionUpdatedModalHandler();

      return changedProperties;
    }
  };

  // FIXME: Inconsistent information between text and input
  const displayedTakeProfitSetting = (
    <div className={`mr-8 ${isDisplayedTakeProfitSetting}`}>
      <TradingInput
        getInputValue={getTpValue}
        lowerLimit={0}
        inputInitialValue={tpValue}
        inputValueFromParent={tpValue}
        setInputValueFromParent={setTpValue}
        inputPlaceholder="take profit"
        inputName="tpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  // FIXME: Inconsistent information between text and input
  const displayedStopLossSetting = (
    <div className={`mr-8 ${isDisplayedStopLossSetting}`}>
      <TradingInput
        getInputValue={getSlValue}
        lowerLimit={displayedSlLowerLimit}
        upperLimit={displayedSlUpperLimit}
        inputInitialValue={slValue}
        setInputValueFromParent={setSlValue}
        inputValueFromParent={slValue}
        inputPlaceholder="stop loss"
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const guaranteedStopLoss = (
    <div className="">
      <div className="flex items-center text-center">
        <input
          type="checkbox"
          value=""
          checked={guaranteedChecked}
          onChange={guaranteedCheckedChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-lightGray4"
        />
        <label className="ml-2 flex text-xs font-medium text-lightGray">
          {t('POSITION_MODAL.GUARANTEED_STOP')}
          <span className="ml-1 text-lightWhite">
            ({t('POSITION_MODAL.FEE')}: {openCfdDetails?.guaranteedStopFee} USDT)
          </span>
          {/* tooltip */}
          <div className="ml-3">
            <div
              className="relative"
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
        </label>
      </div>
    </div>
  );

  const changeComparison = () => {
    if (tpToggleRef.current && tpValueRef.current !== openCfdDetails?.takeProfit) {
      setSubmitDisabled(false);
      // console.log('tpValueRef current', tpValueRef.current);
    }

    if (slToggleRef.current && slValueRef.current !== openCfdDetails?.stopLoss) {
      setSubmitDisabled(false);
      // console.log('slValueRef current', slValueRef.current);
    }

    if (tpToggleRef.current !== initialTpToggle) {
      setSubmitDisabled(false);
      // console.log('tpToggleRef current', tpToggleRef.current);
    }

    if (slToggleRef.current !== initialSlToggle) {
      setSubmitDisabled(false);
      // console.log('slToggleRef current', slToggleRef.current);
    }

    if (guaranteedpCheckedRef.current !== openCfdDetails.guaranteedStop) {
      setSubmitDisabled(false);
      // console.log('guaranteedStopCheckRef current', guaranteedpCheckedRef.current);
      // console.log('openCfdDetails.guaranteedStop', openCfdDetails.guaranteedStop);
    }
  };

  const nowTimestamp = new Date().getTime() / 1000;
  // const yesterdayTimestamp = new Date().getTime() / 1000 - 3600 * 10 - 5;
  // const passedHour = ((nowTimestamp - openCfdDetails.openTimestamp) / 3600).toFixed(0);
  const passedHour = Math.round((nowTimestamp - openCfdDetails.openTimestamp) / 3600);

  const squareClickHandler = () => {
    globalCtx.visiblePositionDetailsModalHandler();

    globalCtx.visiblePositionClosedModalHandler();
    globalCtx.dataPositionClosedModalHandler({
      openCfdDetails: openCfdDetails,
      latestProps: {
        renewalDeadline: new Date().getTime() / 1000 + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
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
    // toast.error('test', {toastId: 'errorTest'});
    // console.log('show the modal displaying transaction detail');
    // return;  };
  };

  useEffect(() => {
    setSubmitDisabled(true);
    changeComparison();
  }, [
    tpValueRef.current,
    slValueRef.current,
    tpToggleRef.current,
    slToggleRef.current,
    guaranteedpCheckedRef.current,
  ]);

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div className="relative flex h-auto w-90vw flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none md:w-400px">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="mx-10 mt-6 flex w-full justify-between">
                <div className="flex items-center space-x-3 text-center text-lightWhite">
                  <Image
                    src={marketCtx.selectedTicker?.tokenImg ?? ''}
                    width={30}
                    height={30}
                    alt="icon"
                  />
                  <h3 className="text-2xl">{openCfdDetails?.ticker} </h3>
                </div>

                <div className="inline-flex items-center">
                  <div className="mr-1 text-lightGray">{t('POSITION_MODAL.EXPIRATION_TIME')}</div>
                  <div className="relative flex h-50px w-50px items-center">
                    <div
                      className={`absolute top-10px left-14px z-30 h-6 w-6 hover:cursor-pointer hover:bg-darkGray1 
                      ${displayedCrossColor} ${displayedCrossStyle} transition-all duration-150`}
                      onClick={squareClickHandler}
                    ></div>

                    <div className="">
                      <CircularProgressBar
                        showLabel={true}
                        numerator={passedHour}
                        denominator={24}
                        progressBarColor={[displayedColorHex]}
                        hollowSize="40%"
                        circularBarSize="100"
                        // clickHandler={circularClick}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex w-full flex-auto flex-col items-stretch pt-0">
              <div
                className={`${displayedBorderColor} mx-10 mt-2 border-1px text-xs leading-relaxed text-lightWhite`}
              >
                <div className="flex-col justify-center text-center">
                  {/* {displayedDataFormat()} */}

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
                    <div className={`${displayedPositionColor}`}>
                      {displayedTypeOfPosition}
                      <span className="ml-1 text-lightGray">{displayedBuyOrSell}</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
                    <div className="">
                      {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                        minimumFractionDigits: 2,
                      }) ?? 0}
                      <span className="ml-1 text-lightGray">{openCfdDetails.ticker}</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
                    <div className={`${displayedPnLColor}`}>
                      {displayedPnLSymbol} ${' '}
                      {openCfdDetails?.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.OPEN_VALUE')}</div>
                    <div className="">
                      ${' '}
                      {openCfdDetails?.openValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                        minimumFractionDigits: 2,
                      }) ?? 0}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
                    <div className="">
                      ${' '}
                      {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                        minimumFractionDigits: 2,
                      }) ?? 0}
                      <span className="ml-1 text-lightGray">USDT</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
                    <div className="">
                      {displayedTime.date} {displayedTime.time}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.LIMIT_AND_STOP')}</div>
                    <div className="">
                      <span className={`text-lightWhite`}>
                        {cfdTp?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                          minimumFractionDigits: 2,
                        }) ?? '-'}
                        {/* {openCfdDetails?.takeProfit?.toLocaleString(
                          UNIVERSAL_NUMBER_FORMAT_LOCALE
                        ) ?? '-'} */}
                      </span>{' '}
                      /{' '}
                      <span className={`text-lightWhite`}>
                        {cfdSl?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                          minimumFractionDigits: 2,
                        }) ?? '-'}
                        {/* {openCfdDetails?.stopLoss?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ??
                          '-'} */}
                      </span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
                    <div className="">
                      {' '}
                      {openCfdDetails?.liquidationPrice?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE,
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                      <span className="ml-1 text-lightGray">USDT</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.STATE')}</div>
                    <div className="">
                      {t('POSITION_MODAL.STATE_OPEN')}
                      {/* <button
                        type="button"
                        className="ml-2 text-tidebitTheme underline underline-offset-2"
                      >
                        Close
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mx-10 mt-3 flex-col text-xs leading-relaxed text-lightWhite`}>
                <div className="mb-2 h-50px">
                  <div className="flex items-center justify-between">
                    <div className="text-lightGray">{t('POSITION_MODAL.CLOSE_AT_PROFIT')}</div>
                    <div className="-mr-10">{displayedTakeProfitSetting}</div>
                    <Toggle
                      setToggleStateFromParent={setTpToggle}
                      toggleStateFromParent={tpToggle}
                      getToggledState={getToggledTpSetting}
                    />
                  </div>

                  {displayedExpectedProfit}
                </div>

                <div className="mb-5 h-70px">
                  <div className="flex items-center justify-between">
                    <div className="text-lightGray">{t('POSITION_MODAL.CLOSE_AT_LOSS')}</div>
                    <div className="-mr-50px">{displayedStopLossSetting}</div>
                    <Toggle
                      getToggledState={getToggledSlSetting}
                      lockedToOpen={guaranteedChecked}
                      initialToggleState={guaranteedChecked}
                      toggleStateFromParent={slToggle}
                      setToggleStateFromParent={setSlToggle}
                      // getToggleFunction={getSlToggleFunction}
                    />
                  </div>
                  {displayedExpectedLoss}
                  {guaranteedStopLoss}
                </div>

                {/* TODO: T/P value changed, S/L value changed, guaranteed-stop check changed, T/P toggle changed, S/L toggle changed */}
                <RippleButton
                  disabled={submitDisabled}
                  onClick={buttonClickHandler}
                  buttonType="button"
                  className="mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme p-90px py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray md:mt-0 md:px-28"
                >
                  {t('POSITION_MODAL.UPDATE_POSITION_TITLE')}
                </RippleButton>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </div>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default UpdatedFormModal;

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
import {IDataPositionClosedModal, useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ProfitState} from '../../constants/profit_state';
import {
  getNowSeconds,
  randomIntFromInterval,
  roundToDecimalPlaces,
  timestampToString,
} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import useState from 'react-usestateref';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {RENEW_QUOTATION_INTERVAL_SECONDS, unitAsset} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {getDummyDisplayApplyCloseCFDOrder} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {
  IDisplayAcceptedCFDOrder,
  getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {OrderState} from '../../constants/order_state';
import {IApplyUpdateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order_data';

interface IUpdatedFormModal {
  modalVisible: boolean;
  modalClickHandler: (bool?: boolean | any) => void;
  openCfdDetails: IDisplayAcceptedCFDOrder;
}

const UpdateFormModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  ...otherProps
}: IUpdatedFormModal) => {
  // console.log('openCfdDetails in details modal: ', openCfdDetails); // Info: (20230314 - Shirley) `openCFDs` data from `display_accepted_cfd_order`
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);

  const initialTpToggle = openCfdDetails?.takeProfit ? true : false;
  const initialSlToggle = openCfdDetails?.stopLoss ? true : false;

  const cfdTp = openCfdDetails?.takeProfit;
  const cfdSl = openCfdDetails?.stopLoss;

  const initialTpInput = cfdTp ?? openCfdDetails.suggestion.takeProfit;

  const initialSlInput = cfdSl ?? openCfdDetails.suggestion.takeProfit;

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

  const displayedState =
    openCfdDetails.state === OrderState.OPENING
      ? 'Open'
      : openCfdDetails.state === OrderState.CLOSED
      ? 'Close'
      : openCfdDetails.state === OrderState.FREEZED
      ? 'Freezed'
      : '';

  const getToggledTpSetting = (bool: boolean) => {
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
  };

  const getToggledSlSetting = (bool: boolean) => {
    setSlToggle(bool);

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
  };

  const getSlValue = (value: number) => {
    setSlValue(value);

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
    // Till: (20230330 - Shirley)
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
        * Expected profit: + ${' '}
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
        *{guaranteedpCheckedRef.current ? 'Close at loss' : 'Expected loss'}: - ${' '}
        {roundToDecimalPlaces(Math.abs(expectedLossValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const guaranteedCheckedChangeHandler = () => {
    if (!openCfdDetails?.guaranteedStop) {
      setGuaranteedChecked(!guaranteedChecked);
      setSlToggle(true);
      setSlLowerLimit(0);
      setSlUpperLimit(Infinity);

      return;
    } else {
      setSlLowerLimit(openCfdDetails?.stopLoss ?? openCfdDetails.suggestion.stopLoss);
      setSlUpperLimit(openCfdDetails?.stopLoss ?? openCfdDetails.suggestion.stopLoss);
      setSlValue(openCfdDetails?.stopLoss ?? openCfdDetails.suggestion.stopLoss);
      return;
    }
  };

  const displayedPnLSymbol =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  // TODO: i18n
  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

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
  const displayedHoverPausedColor =
    openCfdDetails.pnl.type === ProfitState.PROFIT ? 'hover:bg-lightGreen5' : 'hover:bg-lightRed';

  const isDisplayedTakeProfitSetting = tpToggle ? 'flex' : 'invisible';
  const isDisplayedStopLossSetting = slToggle ? 'flex' : 'invisible';

  const displayedSlLowerLimit = openCfdDetails?.guaranteedStop
    ? openCfdDetails?.stopLoss ?? openCfdDetails.suggestion.stopLoss
    : slLowerLimit;
  const displayedSlUpperLimit = openCfdDetails?.guaranteedStop
    ? openCfdDetails?.stopLoss ?? openCfdDetails.suggestion.stopLoss
    : slUpperLimit;

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const layoutInsideBorder = 'mx-5 my-3 flex justify-between';

  const toDisplayCloseOrder = (cfd: IDisplayAcceptedCFDOrder): IDisplayAcceptedCFDOrder => {
    const order = {
      ...cfd,
    };
    return order;
  };

  const toApplyUpdateOrder = () => {
    let changedProperties: IApplyUpdateCFDOrderData = {orderId: openCfdDetails.id};

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
      const guaranteedStopFee = Number(
        (openCfdDetails.openValue * (marketCtx?.tickerStatic?.guaranteedStopFee ?? 99)).toFixed(2)
      );

      changedProperties = {
        ...changedProperties,
        guaranteedStop: guaranteedChecked,
        guaranteedStopFee: guaranteedStopFee,
        stopLoss: stopLoss,
      };
    }

    if (Object.keys(changedProperties).filter(key => key !== 'orderId').length > 0) {
      changedProperties = {...changedProperties};

      globalCtx.toast({
        type: 'info',
        message: 'Changes: \n' + JSON.stringify(changedProperties),
        toastId: JSON.stringify(changedProperties),
      });
    }

    return changedProperties;
  };

  const buttonClickHandler = () => {
    const changedProperties: IApplyUpdateCFDOrderData = toApplyUpdateOrder();

    if (Object.keys(changedProperties).filter(key => key !== 'orderId').length === 0) return;

    setSubmitDisabled(true);

    globalCtx.visibleUpdateFormModalHandler();

    globalCtx.dataPositionUpdatedModalHandler({
      openCfdDetails: {...openCfdDetails},
      updatedProps: {...changedProperties},
    });
    globalCtx.visiblePositionUpdatedModalHandler();
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
          Guaranteed stop &nbsp;
          <span className="text-lightWhite"> (Fee: {openCfdDetails?.guaranteedStopFee} USDT)</span>
          {/* tooltip */}
          <div className="ml-3">
            <div
              className="relative"
              onMouseEnter={() => setGuaranteedTooltipStatus(3)}
              onMouseLeave={() => setGuaranteedTooltipStatus(0)}
            >
              <div className="">
                <AiOutlineQuestionCircle size={16} />
              </div>
              {guaranteedTooltipStatus == 3 && (
                <div
                  role="tooltip"
                  className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg shadow-black/80 transition duration-150 ease-in-out"
                >
                  <p className="pb-0 text-sm font-medium text-white">
                    Guaranteed stop will force the position to close at your chosen rate (price)
                    even if the market price surpasses it.
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
    }

    if (slToggleRef.current && slValueRef.current !== openCfdDetails?.stopLoss) {
      setSubmitDisabled(false);
    }

    if (tpToggleRef.current !== initialTpToggle) {
      setSubmitDisabled(false);
    }

    if (slToggleRef.current !== initialSlToggle) {
      setSubmitDisabled(false);
    }

    if (guaranteedpCheckedRef.current !== openCfdDetails.guaranteedStop) {
      setSubmitDisabled(false);
    }
  };

  const nowTimestamp = new Date().getTime() / 1000;
  const remainSecs = openCfdDetails.liquidationTime - nowTimestamp;

  const remainTime =
    remainSecs < 60
      ? Math.round(remainSecs)
      : remainSecs < 3600
      ? Math.round(remainSecs / 60)
      : Math.round(remainSecs / 3600);

  const label =
    remainSecs < 60
      ? [`${Math.round(remainSecs)} S`]
      : remainSecs < 3600
      ? [`${Math.round(remainSecs / 60)} M`]
      : [`${Math.round(remainSecs / 3600)} H`];

  const denominator = remainSecs < 60 ? 60 : remainSecs < 3600 ? 60 : 24;

  const squareClickHandler = () => {
    globalCtx.visibleUpdateFormModalHandler();

    globalCtx.dataPositionClosedModalHandler(toDisplayCloseOrder(openCfdDetails));
    globalCtx.visiblePositionClosedModalHandler();
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
          <div className="relative flex h-600px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="ml-10 mr-8 mt-8 mb-1 flex w-450px justify-between">
                <div className="mx-auto flex items-center space-x-3 text-center text-lightWhite">
                  <Image
                    src={marketCtx.selectedTicker?.tokenImg ?? ''}
                    width={30}
                    height={30}
                    alt="icon"
                  />
                  <h3 className="text-2xl">{openCfdDetails?.ticker} </h3>
                </div>

                <div
                  className={`absolute right-40px top-55px z-30 h-6 w-6 hover:cursor-pointer ${displayedHoverPausedColor}`}
                  onClick={squareClickHandler}
                ></div>

                <div className="absolute top-30px left-190px flex items-center space-x-1 text-center">
                  <CircularProgressBar
                    label={label}
                    showLabel={true}
                    numerator={remainTime}
                    denominator={denominator}
                    progressBarColor={[displayedColorHex]}
                    hollowSize="40%"
                    circularBarSize="100"
                  />
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto pt-1">
              <div
                className={`${displayedBorderColor} mx-6 mt-0 border-1px text-xs leading-relaxed text-lightWhite`}
              >
                <div className="flex-col justify-center text-center">
                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">Type</div>
                    <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">Amount</div>
                    <div className="">
                      {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">PNL</div>
                    <div className={`${displayedPnLColor}`}>
                      {displayedPnLSymbol} ${' '}
                      {openCfdDetails?.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">Open Value</div>
                    <div className="">
                      ${' '}
                      {openCfdDetails?.openValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ??
                        0}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">Open Price</div>
                    <div className="">
                      ${' '}
                      {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ??
                        0}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">Open Time</div>
                    <div className="">
                      {displayedTime.date} {displayedTime.time}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">TP/ SL</div>
                    <div className="">
                      <span className={`text-lightWhite`}>
                        {cfdTp?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
                      </span>{' '}
                      /{' '}
                      <span className={`text-lightWhite`}>
                        {cfdSl?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
                      </span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">Liquidation Price</div>
                    <div className="">
                      ${' '}
                      {openCfdDetails?.liquidationPrice?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE
                      )}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">State</div>
                    <div className="">{displayedState}</div>
                  </div>
                </div>
              </div>

              <div className={`mx-6 mt-3 flex-col text-xs leading-relaxed text-lightWhite`}>
                <div className="mb-0">
                  <div className="flex items-center justify-between">
                    <div className="text-lightGray">Close at profit</div>
                    <div className="-mr-10">{displayedTakeProfitSetting}</div>
                    <Toggle
                      setToggleStateFromParent={setTpToggle}
                      toggleStateFromParent={tpToggle}
                      getToggledState={getToggledTpSetting}
                    />
                  </div>

                  {displayedExpectedProfit}
                </div>

                <div className="mb-5">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-lightGray">Close at loss</div>
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

                <RippleButton
                  disabled={submitDisabled}
                  onClick={buttonClickHandler}
                  buttonType="button"
                  className="-mt-0 rounded border-0 bg-tidebitTheme px-75px py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray md:mt-0"
                >
                  Update Position
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

export default UpdateFormModal;

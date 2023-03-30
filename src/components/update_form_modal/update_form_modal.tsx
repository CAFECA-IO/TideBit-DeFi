import Image from 'next/image';
import {ImCross} from 'react-icons/im';
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
import {unitAsset} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {useTranslation} from 'react-i18next';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {OrderState} from '../../constants/order_state';
import {IApplyUpdateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order_data';

type TranslateFunction = (s: string) => string;
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
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);

  const initialTpToggle = openCfdDetails?.takeProfit ? true : false;
  const initialSlToggle = openCfdDetails?.stopLoss ? true : false;

  const cfdTp = openCfdDetails?.takeProfit;
  const cfdSl = openCfdDetails?.stopLoss;
  const gsl = marketCtx.guaranteedStopFeePercentage;

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

  const [guaranteedStopFee, setGuaranteedStopFee, guaranteedStopFeeRef] = useStateRef(
    Number(gsl) * openCfdDetails.openPrice * openCfdDetails.amount
  );

  useEffect(() => {
    setGuaranteedStopFee(Number(gsl) * openCfdDetails.openPrice * openCfdDetails.amount);
  }, [gsl, openCfdDetails.openPrice, openCfdDetails.amount]);

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

  const mouseEnterHandler = () => setGuaranteedTooltipStatus(3);
  const mouseLeaveHandler = () => setGuaranteedTooltipStatus(0);

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
        * {t('POSITION_MODAL.EXPECTED_PROFIT')}: +{' '}
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
          ? t('POSITION_MODAL.SL_SETTING')
          : t('POSITION_MODAL.EXPECTED_LOSS')}
        : -{' '}
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
    'before:absolute before:top-12px before:z-40 before:block before:h-1 before:w-7 before:rotate-45 before:rounded-md after:absolute after:top-12px after:z-40 after:block after:h-1 after:w-7 after:-rotate-45 after:rounded-md';

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

  const gslFee = openCfdDetails.guaranteedStop
    ? openCfdDetails.guaranteedStopFee
    : guaranteedStopFeeRef.current;

  const toDisplayCloseOrder = (cfd: IDisplayAcceptedCFDOrder): IDisplayAcceptedCFDOrder => {
    const order = {
      ...cfd,
    };
    return order;
  };

  const toApplyUpdateOrder = () => {
    let changedProperties: IApplyUpdateCFDOrderData = {orderId: openCfdDetails.id};

    // Info: (20230329 - Shirley) Detect if tpValue has changed
    if (tpToggle && tpValue !== openCfdDetails.takeProfit) {
      changedProperties = {
        ...changedProperties,
        takeProfit: tpValue,
      };
    }

    // Info: (20230329 - Shirley) Detect if spValue has changed
    if (slToggle && slValue !== openCfdDetails.stopLoss) {
      changedProperties = {...changedProperties, stopLoss: slValue};
    }

    // Info: (20230329 - Shirley) Detect if tpToggle has changed
    if (initialTpToggle !== tpToggle) {
      changedProperties = {
        ...changedProperties,
        takeProfit: tpToggle ? tpValue : 0,
      };
    }

    // Info: (20230329 - Shirley) Detect if slToggle has changed
    if (initialSlToggle !== slToggle) {
      changedProperties = {
        ...changedProperties,
        stopLoss: slToggle ? slValue : 0,
      };
    }

    // Info: (20230329 - Shirley) Detect if guaranteedStop has changed
    if (guaranteedChecked !== openCfdDetails.guaranteedStop) {
      const stopLoss = slValue !== openCfdDetails.stopLoss ? slValue : undefined;
      const guaranteedStopFee = guaranteedStopFeeRef.current;

      changedProperties = {
        ...changedProperties,
        guaranteedStop: guaranteedChecked,
        guaranteedStopFee: guaranteedStopFee,
        stopLoss: stopLoss,
      };
    }

    if (Object.keys(changedProperties).filter(key => key !== 'orderId').length > 0) {
      changedProperties = {...changedProperties};
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
          {t('POSITION_MODAL.GUARANTEED_STOP')}
          <span className="ml-1 text-lightWhite">
            ({t('POSITION_MODAL.FEE')}:{' '}
            {gslFee?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            {unitAsset})
          </span>
          {/* tooltip */}
          <div className="ml-3">
            <div
              className="relative"
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

    globalCtx.dataPositionClosedModalHandler(openCfdDetails);
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
                      className={`absolute top-10px left-12px z-30 h-7 w-7 rounded-full hover:cursor-pointer hover:bg-darkGray1 
                      ${displayedCrossColor} ${displayedCrossStyle} transition-all duration-150`}
                      onClick={squareClickHandler}
                    ></div>

                    <div className="">
                      <CircularProgressBar
                        label={label}
                        showLabel={true}
                        numerator={remainTime}
                        denominator={denominator}
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
            <div className="relative flex flex-auto flex-col items-center px-10 pt-0">
              <div
                className={`${displayedBorderColor} mt-2 w-full border-1px text-xs leading-relaxed text-lightWhite`}
              >
                <div className="flex-col justify-center text-center">
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
                      {' '}
                      {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                        minimumFractionDigits: 2,
                      }) ?? 0}
                      <span className="ml-1 text-lightGray">{unitAsset}</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
                    <div className="">
                      {displayedTime.date} {displayedTime.time}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.TP_AND_SL')}</div>
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
                      <span className="ml-1 text-lightGray">{unitAsset}</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.STATE')}</div>
                    <div className="">{t('POSITION_MODAL.STATE_OPEN')}</div>
                  </div>
                </div>
              </div>

              <div className={`mx-10 mt-3 flex-col text-xs leading-relaxed text-lightWhite`}>
                <div className="mb-2 h-50px">
                  <div className="flex items-center justify-between">
                    <div className="text-lightGray">{t('POSITION_MODAL.TP_SETTING')}</div>
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
                    <div className="text-lightGray">{t('POSITION_MODAL.SL_SETTING')}</div>
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

export default UpdateFormModal;

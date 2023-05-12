import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {
  TypeOfBorderColor,
  TypeOfPnLColor,
  TypeOfPnLColorHex,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {useContext, useEffect, useMemo, useRef} from 'react';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {IDataPositionClosedModal, useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ProfitState} from '../../constants/profit_state';
import {
  getEstimatedPnL,
  getNowSeconds,
  getTimestamp,
  randomIntFromInterval,
  roundToDecimalPlaces,
  timestampToString,
} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import useState from 'react-usestateref';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  unitAsset,
  FRACTION_DIGITS,
  TARGET_LIMIT_DIGITS,
  TP_SL_LIMIT_PERCENT,
} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {useTranslation} from 'react-i18next';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {OrderState} from '../../constants/order_state';
import {IApplyUpdateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order';
import {CFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';

type TranslateFunction = (s: string) => string;
interface IUpdatedFormModal {
  modalVisible: boolean;
  modalClickHandler: (bool?: boolean | any) => void;
  openCfdDetails: IDisplayCFDOrder;
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

  const initialTpInput = cfdTp ?? openCfdDetails?.suggestion?.takeProfit;
  const initialSlInput = cfdSl ?? openCfdDetails?.suggestion?.takeProfit;

  const initialState = {
    number: 0,
    symbol: '',
  };

  const [tpValue, setTpValue, tpValueRef] = useState(initialTpInput);
  const [slValue, setSlValue, slValueRef] = useState(initialSlInput);
  const [tpToggle, setTpToggle, tpToggleRef] = useState(initialTpToggle);
  const [slToggle, setSlToggle, slToggleRef] = useState(initialSlToggle);
  const [guaranteedChecked, setGuaranteedChecked, guaranteedpCheckedRef] = useState(
    openCfdDetails.guaranteedStop
  );

  const [guaranteedTooltipStatus, setGuaranteedTooltipStatus] = useState(0);

  const [slLowerLimit, setSlLowerLimit, slLowerLimitRef] = useState(0);
  const [slUpperLimit, setSlUpperLimit, slUpperLimitRef] = useState(0);
  const [tpLowerLimit, setTpLowerLimit, tpLowerLimitRef] = useState(0);
  const [tpUpperLimit, setTpUpperLimit, tpUpperLimitRef] = useState(0);

  const [submitDisabled, setSubmitDisabled, submitDisabledRef] = useStateRef(true);

  const [estimatedProfitValue, setEstimatedProfitValue, estimatedProfitValueRef] =
    useStateRef(initialState);
  const [estimatedLossValue, setEstimatedLossValue, estimatedLossValueRef] =
    useStateRef(initialState);

  const [guaranteedStopFee, setGuaranteedStopFee, guaranteedStopFeeRef] = useStateRef(
    Number(gsl) * openCfdDetails?.openPrice * openCfdDetails?.amount
  );

  const [disableSlInput, setDisableSlInput, disableSlInputRef] = useStateRef(false);

  const getToggledTpSetting = (bool: boolean) => {
    setTpToggle(bool);

    calculateProfit();
  };

  const getToggledSlSetting = (bool: boolean) => {
    setSlToggle(bool);

    calculateLoss();
  };

  const getTpValue = (value: number) => {
    setTpValue(value);

    calculateProfit();
  };

  const getSlValue = (value: number) => {
    setSlValue(value);
    calculateLoss();
  };

  const mouseEnterHandler = () => setGuaranteedTooltipStatus(3);
  const mouseLeaveHandler = () => setGuaranteedTooltipStatus(0);

  const displayedEstimatedProfit = (
    <div
      className={`${
        tpToggle ? `mb-3 translate-y-1` : `invisible translate-y-0`
      } -mt-0 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('POSITION_MODAL.EXPECTED_PROFIT')}: {estimatedProfitValueRef.current.symbol}{' '}
        {roundToDecimalPlaces(Math.abs(estimatedProfitValueRef.current.number), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedEstimatedLoss = (
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
        : {estimatedLossValueRef.current.symbol}{' '}
        {roundToDecimalPlaces(Math.abs(estimatedLossValueRef.current.number), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const guaranteedCheckedChangeHandler = () => {
    if (!openCfdDetails.guaranteedStop) {
      setGuaranteedChecked(!guaranteedChecked);
      setSlToggle(true);
      setSlLowerLimit(0);
      setSlUpperLimit(Infinity);

      return;
    } else {
      setGuaranteedChecked(true);

      // Info: Lock the change of input value when guaranteed stop is checked
      setSlLowerLimit(openCfdDetails?.stopLoss ?? openCfdDetails?.suggestion?.stopLoss);
      setSlUpperLimit(openCfdDetails?.stopLoss ?? openCfdDetails?.suggestion?.stopLoss);
      setSlValue(openCfdDetails?.stopLoss ?? openCfdDetails?.suggestion?.stopLoss);
      return;
    }
  };

  const displayedPnLSymbol = !!!marketCtx.selectedTicker?.price
    ? ''
    : openCfdDetails?.pnl?.type === ProfitState.PROFIT
    ? '+'
    : openCfdDetails?.pnl?.type === ProfitState.LOSS
    ? '-'
    : '';

  const displayedPnLValue = !!!marketCtx.selectedTicker?.price
    ? '- -'
    : openCfdDetails?.pnl?.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);

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
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? TypeOfPnLColor.PROFIT
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL;

  const displayedBorderColor =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? TypeOfBorderColor.PROFIT
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? TypeOfBorderColor.LOSS
      : TypeOfBorderColor.EQUAL;

  const displayedColorHex =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL;

  const displayedCrossColor =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : 'hover:before:bg-lightRed hover:after:bg-lightRed';
  const displayedCrossStyle =
    'before:absolute before:top-12px before:z-40 before:block before:h-1 before:w-7 before:rotate-45 before:rounded-md after:absolute after:top-12px after:z-40 after:block after:h-1 after:w-7 after:-rotate-45 after:rounded-md';

  const isDisplayedTakeProfitSetting = tpToggle ? 'flex' : 'invisible';
  const isDisplayedStopLossSetting = slToggle ? 'flex' : 'invisible';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const layoutInsideBorder = 'mx-5 my-3 flex justify-between';

  const gslFee = openCfdDetails?.guaranteedStop
    ? openCfdDetails?.guaranteedStopFee
    : guaranteedStopFeeRef.current;

  const toDisplayCloseOrder = (cfd: IDisplayCFDOrder): IDisplayCFDOrder => {
    const order = {
      ...cfd,
    };
    return order;
  };

  const toApplyUpdateOrder = () => {
    let changedProperties: IApplyUpdateCFDOrder = {
      referenceId: openCfdDetails?.id,
      operation: CFDOperation.UPDATE,
      orderType: OrderType.CFD,
      takeProfit: openCfdDetails.takeProfit,
      stopLoss: openCfdDetails.stopLoss,
      guaranteedStop: openCfdDetails.guaranteedStop,
      guaranteedStopFee: openCfdDetails.guaranteedStopFee,
    };

    // Info: (20230329 - Shirley) if tpValue has changed
    if (tpToggle) {
      if (tpValue !== openCfdDetails?.takeProfit) {
        changedProperties = {
          ...changedProperties,
          takeProfit: tpValue,
        };
      }
    } else {
      changedProperties = {
        ...changedProperties,
        takeProfit: 0,
      };
    }

    // Info: (20230329 - Shirley) if spValue has changed
    if (slToggle) {
      if (slValue !== openCfdDetails?.stopLoss) {
        changedProperties = {...changedProperties, stopLoss: slValue};
      }
    } else {
      changedProperties = {
        ...changedProperties,
        stopLoss: 0,
      };
    }

    // Info: (20230329 - Shirley) if guaranteedStop has changed
    if (!openCfdDetails.guaranteedStop && guaranteedChecked) {
      const stopLoss = slValue !== openCfdDetails?.stopLoss ? slValue : openCfdDetails?.stopLoss;
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
    const changedProperties: IApplyUpdateCFDOrder = toApplyUpdateOrder();

    if (Object.keys(changedProperties).filter(key => key !== 'orderId').length === 0) return;

    setSubmitDisabled(true);

    globalCtx.visibleUpdateFormModalHandler();

    globalCtx.dataPositionUpdatedModalHandler({
      openCfdDetails: {...openCfdDetails},
      updatedProps: {...changedProperties},
    });
    globalCtx.visiblePositionUpdatedModalHandler();
  };

  const displayedTakeProfitSetting = (
    <div className={`mr-8 ${isDisplayedTakeProfitSetting}`}>
      <TradingInput
        getInputValue={getTpValue}
        lowerLimit={tpLowerLimitRef.current}
        upperLimit={tpUpperLimitRef.current}
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

  const displayedStopLossSetting = (
    <div className={`mr-8 ${isDisplayedStopLossSetting}`}>
      <TradingInput
        disabled={disableSlInputRef.current}
        getInputValue={getSlValue}
        lowerLimit={slLowerLimitRef.current}
        upperLimit={slUpperLimitRef.current}
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
          checked={guaranteedpCheckedRef.current}
          onChange={guaranteedCheckedChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-lightGray4"
        />
        <label className="ml-2 flex text-xs font-medium text-lightGray">
          {t('POSITION_MODAL.GUARANTEED_STOP')}
          <span className="ml-1 text-lightWhite">
            ({t('POSITION_MODAL.FEE')}:{' '}
            {gslFee?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)} {unitAsset})
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
                  className="absolute -left-52 -top-120px z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg shadow-black/80 transition duration-150 ease-in-out"
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

  const calculateProfit = () => {
    const profit = getEstimatedPnL(
      openCfdDetails.amount,
      openCfdDetails.typeOfPosition,
      openCfdDetails.openPrice,
      tpValueRef.current,
      true
    );
    setEstimatedProfitValue(profit);
  };

  const calculateLoss = () => {
    const loss = getEstimatedPnL(
      openCfdDetails.amount,
      openCfdDetails.typeOfPosition,
      openCfdDetails.openPrice,
      slValueRef.current,
      false
    );
    setEstimatedLossValue(loss);
  };

  const compareChange = () => {
    if (tpToggleRef.current && tpValueRef.current !== openCfdDetails?.takeProfit) {
      setSubmitDisabled(false);
      calculateProfit();
    }

    if (slToggleRef.current && slValueRef.current !== openCfdDetails?.stopLoss) {
      setSubmitDisabled(false);
      calculateLoss();
    }

    if (tpToggleRef.current !== initialTpToggle) {
      setSubmitDisabled(false);
    }

    if (slToggleRef.current !== initialSlToggle) {
      setSubmitDisabled(false);
    }

    if (guaranteedpCheckedRef.current !== openCfdDetails?.guaranteedStop) {
      setSubmitDisabled(false);
    }
  };

  const nowTimestamp = getTimestamp();
  const remainSecs = openCfdDetails?.liquidationTime - nowTimestamp;

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

  const initPosition = () => {
    setGuaranteedChecked(openCfdDetails.guaranteedStop);
    setTpToggle(!!openCfdDetails.takeProfit);
    setSlToggle(!!openCfdDetails.stopLoss);

    // Info: minimum price (open price) with buffer (20230426 - Shirley)
    const caledTpLowerLimit =
      openCfdDetails.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(openCfdDetails.openPrice * (1 + TP_SL_LIMIT_PERCENT), 2)
        : 0;
    const caledTpUpperLimit =
      openCfdDetails.typeOfPosition === TypeOfPosition.SELL
        ? roundToDecimalPlaces(openCfdDetails.openPrice * (1 - TP_SL_LIMIT_PERCENT), 2)
        : TARGET_LIMIT_DIGITS;

    const isLiquidated =
      marketCtx.selectedTicker?.price !== undefined
        ? openCfdDetails.typeOfPosition === TypeOfPosition.BUY
          ? openCfdDetails.liquidationPrice > marketCtx.selectedTicker.price
          : openCfdDetails.typeOfPosition === TypeOfPosition.SELL
          ? openCfdDetails.liquidationPrice < marketCtx.selectedTicker.price
          : false
        : true;

    const caledSlLowerLimit = isLiquidated
      ? roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2) // Info: 相當於不能設定 SL (20230426 - Shirley)
      : openCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(openCfdDetails.liquidationPrice * (1 + TP_SL_LIMIT_PERCENT), 2)
      : roundToDecimalPlaces(openCfdDetails.openPrice * (1 + TP_SL_LIMIT_PERCENT), 2);

    const caledSlUpperLimit = isLiquidated
      ? roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2) // Info: 相當於不能設定 SL (20230426 - Shirley)
      : openCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(openCfdDetails.openPrice * (1 - TP_SL_LIMIT_PERCENT), 2)
      : roundToDecimalPlaces(openCfdDetails.liquidationPrice * (1 - TP_SL_LIMIT_PERCENT), 2);

    const caledSl =
      marketCtx.selectedTicker?.price !== undefined
        ? (openCfdDetails.typeOfPosition === TypeOfPosition.BUY &&
            marketCtx.selectedTicker.price < openCfdDetails.liquidationPrice) ||
          (openCfdDetails.typeOfPosition === TypeOfPosition.SELL &&
            marketCtx.selectedTicker.price > openCfdDetails.liquidationPrice)
          ? roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2)
          : roundToDecimalPlaces(
              (marketCtx.selectedTicker.price + openCfdDetails.liquidationPrice) / 2,
              2
            )
        : roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2);

    const suggestedSl =
      marketCtx.selectedTicker?.price !== undefined
        ? openCfdDetails.typeOfPosition === TypeOfPosition.BUY &&
          marketCtx.selectedTicker?.price < openCfdDetails.suggestion.stopLoss
          ? caledSl
          : openCfdDetails.typeOfPosition === TypeOfPosition.SELL &&
            marketCtx.selectedTicker?.price > openCfdDetails.suggestion.stopLoss
          ? caledSl
          : openCfdDetails.suggestion.stopLoss
        : openCfdDetails.suggestion.stopLoss;

    const gslFee =
      Number(marketCtx.guaranteedStopFeePercentage) *
      openCfdDetails?.openPrice *
      openCfdDetails?.amount;

    setDisableSlInput(isLiquidated);

    setGuaranteedStopFee(
      openCfdDetails.guaranteedStop ? Number(openCfdDetails?.guaranteedStopFee) : gslFee
    );

    setSlLowerLimit(caledSlLowerLimit);
    setSlUpperLimit(caledSlUpperLimit);

    setTpLowerLimit(caledTpLowerLimit);
    setTpUpperLimit(caledTpUpperLimit);

    setTpValue(
      openCfdDetails.takeProfit === 0 || openCfdDetails.takeProfit === undefined
        ? openCfdDetails.suggestion.takeProfit
        : openCfdDetails.takeProfit
    );

    setSlValue(
      openCfdDetails.stopLoss === 0 || openCfdDetails.stopLoss === undefined
        ? suggestedSl
        : openCfdDetails.stopLoss
    );
    calculateProfit();
    calculateLoss();
  };

  useEffect(() => {
    setGuaranteedStopFee(Number(gsl) * openCfdDetails?.openPrice * openCfdDetails?.amount);
  }, [gsl, openCfdDetails?.openPrice, openCfdDetails?.amount]);

  useEffect(() => {
    setSubmitDisabled(true);
    compareChange();
  }, [
    tpValueRef.current,
    slValueRef.current,
    tpToggleRef.current,
    slToggleRef.current,
    guaranteedpCheckedRef.current,
  ]);

  useEffect(() => {
    initPosition();
  }, [globalCtx.visibleUpdateFormModal]);

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          {/*content & panel*/}
          <div className="relative flex h-auto w-90vw flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none xs:w-400px">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="mx-10 mt-6 flex w-full justify-between">
                <div className="flex items-center space-x-3 text-center text-lightWhite">
                  <Image
                    src={`/asset_icon/${openCfdDetails?.ticker.toLowerCase()}.svg`}
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
                      className={`absolute left-12px top-10px z-30 h-7 w-7 rounded-full hover:cursor-pointer hover:bg-darkGray1 
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
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
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
                      <span className="ml-1 text-lightGray">{openCfdDetails?.ticker}</span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
                    <div className={`${displayedPnLColor}`}>
                      {displayedPnLSymbol} $ {displayedPnLValue}
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
                        {cfdTp === undefined || cfdTp === 0
                          ? '-'
                          : cfdTp.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                              minimumFractionDigits: 2,
                            })}
                      </span>{' '}
                      /{' '}
                      <span className={`text-lightWhite`}>
                        {cfdSl === undefined || cfdSl === 0
                          ? '-'
                          : cfdSl.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                              minimumFractionDigits: 2,
                            })}
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

                  {displayedEstimatedProfit}
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
                    />
                  </div>
                  {displayedEstimatedLoss}
                  {guaranteedStopLoss}
                </div>

                <RippleButton
                  disabled={submitDisabledRef.current}
                  onClick={buttonClickHandler}
                  buttonType="button"
                  className="mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme p-90px py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none disabled:cursor-default disabled:bg-lightGray md:mt-0 md:px-28"
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

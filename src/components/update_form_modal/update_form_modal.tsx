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
  toPnl,
  validateAllInput,
} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import useState from 'react-usestateref';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  unitAsset,
  FRACTION_DIGITS,
  TARGET_MAX_DIGITS,
  TP_SL_LIMIT_RATIO,
} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {useTranslation} from 'react-i18next';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IApplyUpdateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order';
import {CFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {TypeOfValidation} from '../../constants/validation';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {Code} from '../../constants/code';
import {ToastTypeAndText} from '../../constants/toast_type';
import {ToastId} from '../../constants/toast_id';
import SafeMath from '../../lib/safe_math';

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
    +SafeMath.mult(
      Number(gsl),
      SafeMath.mult(openCfdDetails?.openPrice ?? 0, openCfdDetails?.amount ?? 0)
    )
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
    validateInput();

    if (!openCfdDetails.guaranteedStop) {
      setGuaranteedChecked(!guaranteedChecked);
      setSlToggle(true);

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

  const displayedPnLSymbol =
    !marketCtx.selectedTicker?.price && !openCfdDetails?.pnl?.value
      ? ''
      : !!openCfdDetails?.pnl?.value && openCfdDetails?.pnl?.value > 0
      ? '+'
      : !!openCfdDetails?.pnl?.value && openCfdDetails?.pnl?.value < 0
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

  const displayedPnLColor = !!openCfdDetails?.pnl?.value
    ? openCfdDetails?.pnl?.value > 0
      ? TypeOfPnLColor.PROFIT
      : openCfdDetails?.pnl?.value < 0
      ? TypeOfPnLColor.LOSS
      : TypeOfPnLColor.EQUAL
    : TypeOfPnLColor.EQUAL;

  const displayedBorderColor = !!openCfdDetails?.pnl?.value
    ? openCfdDetails?.pnl?.value > 0
      ? TypeOfBorderColor.PROFIT
      : openCfdDetails?.pnl?.value < 0
      ? TypeOfBorderColor.LOSS
      : TypeOfBorderColor.EQUAL
    : TypeOfPnLColor.EQUAL;

  const displayedColorHex = !!openCfdDetails?.pnl?.value
    ? openCfdDetails?.pnl?.value > 0
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails?.pnl?.value < 0
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL
    : TypeOfPnLColor.EQUAL;

  const displayedCrossColor =
    !!openCfdDetails?.pnl && openCfdDetails?.pnl?.value > 0
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
      if (!!tpValue && tpValue !== openCfdDetails?.takeProfit) {
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
      if (!!slValue && slValue !== openCfdDetails?.stopLoss) {
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

    if (Object.keys(changedProperties).filter(key => key !== 'referenceId').length > 0) {
      changedProperties = {...changedProperties};
    }

    return changedProperties;
  };

  const buttonClickHandler = () => {
    const changedProperties: IApplyUpdateCFDOrder = toApplyUpdateOrder();

    if (Object.keys(changedProperties).filter(key => key !== 'referenceId').length === 0) return;

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
          {/* Info: tooltip (20230802 - Shirley) */}
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

  const validateInput = () => {
    let isTpValid = true;
    let isSlValid = true;

    if (tpToggleRef.current) {
      const tpValid = validateAllInput({
        typeOfValidation: TypeOfValidation.TPSL,
        value: tpValueRef.current,
        upperLimit: tpUpperLimitRef.current,
        lowerLimit: tpLowerLimitRef.current,
      });

      isTpValid = tpValid;
    }

    if (slToggleRef.current) {
      const slValid = validateAllInput({
        typeOfValidation: TypeOfValidation.TPSL,
        value: slValueRef.current,
        upperLimit: slUpperLimitRef.current,
        lowerLimit: slLowerLimitRef.current,
      });

      isSlValid = slValid;
    }

    if (isTpValid && isSlValid) {
      const valid = true;

      return valid;
    } else {
      const valid = false;

      return valid;
    }
  };

  const compareChange = () => {
    if (tpToggleRef.current && tpValueRef.current !== openCfdDetails?.takeProfit) {
      setSubmitDisabled(false);
      calculateProfit();
    } else if (slToggleRef.current && slValueRef.current !== openCfdDetails?.stopLoss) {
      setSubmitDisabled(false);
      calculateLoss();
    } else if (
      tpToggleRef.current !== initialTpToggle ||
      slToggleRef.current !== initialSlToggle ||
      guaranteedpCheckedRef.current !== openCfdDetails?.guaranteedStop
    ) {
      setSubmitDisabled(false);
    }
  };

  const nowTimestamp = getTimestamp() as number;
  const remainSecs = openCfdDetails?.liquidationTime - nowTimestamp;

  const remainTime =
    remainSecs < 60
      ? Math.round(remainSecs)
      : remainSecs < 3600
      ? Math.round(remainSecs / 60)
      : remainSecs < 86400
      ? Math.round(remainSecs / 3600)
      : Math.round(remainSecs / 86400);

  const label =
    remainSecs < 60
      ? [`${Math.round(remainSecs)} S`]
      : remainSecs < 3600
      ? [`${Math.round(remainSecs / 60)} M`]
      : remainSecs < 86400
      ? [`${Math.round(remainSecs / 3600)} H`]
      : [`${Math.round(remainSecs / 86400)} D`];

  const denominator = remainSecs < 60 ? 60 : remainSecs < 3600 ? 60 : remainSecs < 86400 ? 24 : 7;

  const closedModalClickHandler = async () => {
    globalCtx.visibleUpdateFormModalHandler();
    await getQuotation();
  };

  const toDisplayCloseOrder = (cfd: IDisplayCFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    const pnlSoFar = toPnl({
      openPrice: cfd.openPrice,
      closePrice: quotation.price,
      amount: cfd.amount,
      typeOfPosition: cfd.typeOfPosition,
      spread: marketCtx.getTickerSpread(cfd.instId),
    });

    return {
      ...cfd,
      closePrice: quotation.price,
      pnl: pnlSoFar,
    };
  };

  const getQuotation = async () => {
    let quotation = {...defaultResultFailed};
    const oppositeTypeOfPosition =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? TypeOfPosition.SELL
        : TypeOfPosition.BUY;

    try {
      quotation = await marketCtx.getCFDQuotation(openCfdDetails?.instId, oppositeTypeOfPosition);

      const data = quotation.data as IQuotation;
      if (
        quotation.success &&
        data.typeOfPosition === oppositeTypeOfPosition &&
        data.instId === openCfdDetails.instId &&
        quotation.data !== null
      ) {
        const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, data);
        globalCtx.dataPositionClosedModalHandler(displayedCloseOrder);

        globalCtx.visiblePositionClosedModalHandler();
      } else {
        globalCtx.toast({
          type: ToastTypeAndText.ERROR.type,
          toastId: ToastId.GET_QUOTATION_ERROR,
          message: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${
            Code.CANNOT_GET_QUOTATION_FROM_CONTEXT
          })`,
          typeText: t(ToastTypeAndText.ERROR.text),
          isLoading: false,
          autoClose: false,
        });
      }
    } catch (err) {
      // TODO: Report error to backend (20230613 - Shirley)
      globalCtx.toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.GET_QUOTATION_ERROR,
        message: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${Code.UNKNOWN_ERROR_IN_COMPONENT})`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
    }
  };

  const initPosition = () => {
    setGuaranteedChecked(openCfdDetails.guaranteedStop);
    setTpToggle(!!openCfdDetails.takeProfit);
    setSlToggle(!!openCfdDetails.stopLoss);

    // Info: minimum price (open price) with buffer (20230426 - Shirley)
    const caledTpLowerLimit =
      openCfdDetails.typeOfPosition === TypeOfPosition.BUY
        ? roundToDecimalPlaces(
            +SafeMath.mult(openCfdDetails.openPrice, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
            2
          )
        : 0;
    const caledTpUpperLimit =
      openCfdDetails.typeOfPosition === TypeOfPosition.SELL
        ? roundToDecimalPlaces(
            +SafeMath.mult(openCfdDetails.openPrice, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
            2
          )
        : TARGET_MAX_DIGITS;

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
      ? roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.liquidationPrice, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
          2
        )
      : roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.openPrice, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
          2
        );

    const caledSlUpperLimit = isLiquidated
      ? roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2) // Info: 相當於不能設定 SL (20230426 - Shirley)
      : openCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.openPrice, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
          2
        )
      : roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.liquidationPrice, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
          2
        );

    const caledSl =
      marketCtx.selectedTicker?.price !== undefined
        ? (openCfdDetails.typeOfPosition === TypeOfPosition.BUY &&
            marketCtx.selectedTicker.price < openCfdDetails.liquidationPrice) ||
          (openCfdDetails.typeOfPosition === TypeOfPosition.SELL &&
            marketCtx.selectedTicker.price > openCfdDetails.liquidationPrice)
          ? roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2)
          : roundToDecimalPlaces(
              +SafeMath.plus(marketCtx.selectedTicker.price, openCfdDetails.liquidationPrice) / 2,
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

    const gslFee = roundToDecimalPlaces(
      +SafeMath.mult(
        SafeMath.mult(Number(marketCtx.guaranteedStopFeePercentage), openCfdDetails?.openPrice),
        openCfdDetails?.amount
      ),
      2
    );

    setDisableSlInput(isLiquidated);

    setGuaranteedStopFee(
      openCfdDetails.guaranteedStop ? Number(openCfdDetails?.guaranteedStopFee) : gslFee
    );

    setSlLowerLimit(caledSlLowerLimit);
    setSlUpperLimit(caledSlUpperLimit);

    setTpLowerLimit(caledTpLowerLimit);
    setTpUpperLimit(caledTpUpperLimit);

    setTpValue(
      openCfdDetails.takeProfit === 0 || !openCfdDetails.takeProfit
        ? openCfdDetails.suggestion.takeProfit
        : openCfdDetails.takeProfit
    );

    setSlValue(
      openCfdDetails.stopLoss === 0 || !openCfdDetails.stopLoss
        ? suggestedSl
        : openCfdDetails.stopLoss
    );
    calculateProfit();
    calculateLoss();
  };

  useEffect(() => {
    setGuaranteedStopFee(
      roundToDecimalPlaces(
        +SafeMath.mult(
          Number(gsl),
          SafeMath.mult(openCfdDetails?.openPrice, openCfdDetails?.amount)
        ),
        2
      )
    );
  }, [gsl, openCfdDetails?.openPrice, openCfdDetails?.amount]);

  useEffect(() => {
    setSubmitDisabled(true);
    const isValidInput = validateInput();

    if (isValidInput) {
      compareChange();
    }
  }, [
    tpValueRef.current,
    slValueRef.current,
    tpToggleRef.current,
    slToggleRef.current,
    guaranteedpCheckedRef.current,
  ]);

  useEffect(() => {
    setSubmitDisabled(true);

    initPosition();
  }, [globalCtx.visibleUpdateFormModal]);

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div className="relative flex h-auto w-90vw flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none xs:w-400px">
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="mx-10 mt-6 flex w-full justify-between">
                <div className="flex items-center space-x-3 text-center text-lightWhite">
                  <Image
                    src={`/asset_icon/${openCfdDetails?.targetAsset.toLowerCase()}.svg`}
                    width={30}
                    height={30}
                    alt="icon"
                  />
                  <h3 className="text-2xl">{openCfdDetails?.instId} </h3>
                </div>

                <div className="inline-flex items-center">
                  <div className="mr-1 text-lightGray">{t('POSITION_MODAL.EXPIRATION_TIME')}</div>
                  <div className="relative flex h-50px w-50px items-center">
                    <div
                      className={`absolute left-12px top-10px z-30 h-7 w-7 rounded-full hover:cursor-pointer hover:bg-darkGray1 
                      ${displayedCrossColor} ${displayedCrossStyle} transition-all duration-150`}
                      onClick={closedModalClickHandler}
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
                      {openCfdDetails?.amount?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE,
                        FRACTION_DIGITS
                      ) ?? 0}
                      <span className="ml-1 text-lightGray">{openCfdDetails?.targetAsset}</span>
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
                      {openCfdDetails?.openValue?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE,
                        FRACTION_DIGITS
                      ) ?? 0}
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
                    <div className="">
                      {' '}
                      {openCfdDetails?.openPrice?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE,
                        FRACTION_DIGITS
                      ) ?? 0}
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
                        {!cfdTp || cfdTp === 0
                          ? '-'
                          : cfdTp.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
                      </span>{' '}
                      /{' '}
                      <span className={`text-lightWhite`}>
                        {!cfdSl || cfdSl === 0
                          ? '-'
                          : cfdSl.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
                      </span>
                    </div>
                  </div>

                  <div className={`${layoutInsideBorder}`}>
                    <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
                    <div className="">
                      {' '}
                      {openCfdDetails?.liquidationPrice?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE,
                        FRACTION_DIGITS
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

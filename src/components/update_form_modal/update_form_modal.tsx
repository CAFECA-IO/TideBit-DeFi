import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {
  DEFAULT_USER_BALANCE,
  TOAST_DURATION_SECONDS,
  TypeOfBorderColor,
  TypeOfPnLColor,
  TypeOfPnLColorHex,
} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {useContext, useEffect} from 'react';
import TradingInput from '../trading_input/trading_input';
import Tooltip from '../tooltip/tooltip';
import RippleButton from '../ripple_button/ripple_button';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {
  getEstimatedPnL,
  getTimestamp,
  numberFormatted,
  roundToDecimalPlaces,
  timestampToString,
  toPnl,
  validateAllInput,
  validateNumberFormat,
} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import useState from 'react-usestateref';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {unitAsset, TARGET_MAX_DIGITS, TP_SL_LIMIT_RATIO} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {useTranslation} from 'next-i18next';
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
import {RoundCondition} from '../../interfaces/tidebit_defi_background/round_condition';
import {UserContext} from '../../contexts/user_context';

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
  const userCtx = useContext(UserContext);

  const initialTpToggle = openCfdDetails?.takeProfit ? true : false;
  const initialSlToggle = openCfdDetails?.stopLoss ? true : false;

  const cfdTp = openCfdDetails?.takeProfit;
  const cfdSl = openCfdDetails?.stopLoss;
  const gslPercent = marketCtx.guaranteedStopFeePercentage;
  const availableBalance = userCtx.userAssets?.balance?.available ?? DEFAULT_USER_BALANCE;

  const initialTpInput = cfdTp ?? openCfdDetails?.suggestion?.takeProfit;
  const initialSlInput = cfdSl ?? openCfdDetails?.suggestion?.takeProfit;

  const initialState = {number: 0, symbol: ''};

  const [tpValue, setTpValue, tpValueRef] = useState(initialTpInput);
  const [slValue, setSlValue, slValueRef] = useState(initialSlInput);
  const [tpToggle, setTpToggle, tpToggleRef] = useState(initialTpToggle);
  const [slToggle, setSlToggle, slToggleRef] = useState(initialSlToggle);
  const [guaranteedChecked, setGuaranteedChecked, guaranteedCheckedRef] = useState(
    openCfdDetails.guaranteedStop
  );

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
      Number(gslPercent),
      SafeMath.mult(openCfdDetails?.openPrice ?? 0, openCfdDetails?.amount ?? 0)
    )
  );

  const [disableSlInput, setDisableSlInput, disableSlInputRef] = useStateRef(false);

  const [isTyping, setIsTyping, isTypingRef] = useStateRef({tp: false, sl: false});

  const getToggledTpSetting = (bool: boolean) => {
    setTpToggle(bool);

    calculateProfit();
  };

  const getToggledSlSetting = (bool: boolean) => {
    setSlToggle(bool);

    calculateLoss();
  };

  const getTpValid = (bool: boolean) => {
    if (!bool) {
      setSubmitDisabled(true);
      setEstimatedProfitValue(prev => ({...prev, number: 0}));
    } else {
      compareChange();
    }
  };

  const getSlValid = (bool: boolean) => {
    if (!bool) {
      setSubmitDisabled(true);
      setEstimatedLossValue(prev => ({...prev, number: 0}));
    } else {
      compareChange();
    }
  };

  const getTpValue = (value: number) => {
    setTpValue(value);

    calculateProfit();
  };

  const getSlValue = (value: number) => {
    setSlValue(value);
    calculateLoss();
  };

  const displayedEstimatedProfit = (
    <div
      className={`${
        tpToggle ? `mb-3 translate-y-1` : `invisible translate-y-0`
      } items-center transition-all`}
    >
      <div className="text-lightWhite">
        * {t('POSITION_MODAL.EXPECTED_PROFIT')}: {estimatedProfitValueRef.current.symbol}{' '}
        {numberFormatted(
          roundToDecimalPlaces(
            Math.abs(estimatedProfitValueRef.current.number),
            2,
            RoundCondition.SHRINK
          )
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedEstimatedLoss = (
    <div
      className={`${
        slToggle ? `mb-3 translate-y-1` : `invisible translate-y-0`
      } items-center transition-all`}
    >
      <div className="text-lightWhite">
        *
        {guaranteedCheckedRef.current
          ? t('POSITION_MODAL.SL_SETTING')
          : t('POSITION_MODAL.EXPECTED_LOSS')}
        : {estimatedLossValueRef.current.symbol}{' '}
        {numberFormatted(
          roundToDecimalPlaces(
            Math.abs(estimatedLossValueRef.current.number),
            2,
            RoundCondition.SHRINK
          )
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const guaranteedCheckedChangeHandler = () => {
    validateInput();

    const inadequateBalanceForGSL = SafeMath.lt(availableBalance, guaranteedStopFeeRef.current);

    // INFO: 之前沒有設定GSL，停在update form modal太久，當 GSL fee 變動時，會出現 GSL fee 不足的情況 (20231026 - Shirley)
    if (!openCfdDetails.guaranteedStop) {
      if (inadequateBalanceForGSL) {
        setGuaranteedChecked(prev => {
          if (prev === true) {
            globalCtx.toast({
              type: ToastTypeAndText.WARNING.type,
              toastId: ToastId.INADEQUATE_AVAILABLE_BALANCE,
              message: `${t('ERROR_MESSAGE.INADEQUATE_AVAILABLE_BALANCE')} (${
                Code.INADEQUATE_AVAILABLE_BALANCE
              })`,
              typeText: t(ToastTypeAndText.WARNING.text),
              isLoading: false,
              autoClose: TOAST_DURATION_SECONDS,
            });

            return false;
          } else {
            return prev;
          }
        });

        return;
      } else {
        setGuaranteedChecked(!guaranteedChecked);
        setSlToggle(true);

        return;
      }
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
      : openCfdDetails?.pnl?.value !== undefined && Math.abs(openCfdDetails?.pnl?.value) === 0
      ? '≈'
      : '';

  const displayedPnLValue = !!marketCtx.selectedTicker?.price
    ? openCfdDetails?.pnl?.value && numberFormatted(openCfdDetails?.pnl?.value)
    : '- -';

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
    : TypeOfBorderColor.EQUAL;

  const displayedColorHex = !!openCfdDetails?.pnl?.value
    ? openCfdDetails?.pnl?.value > 0
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails?.pnl?.value < 0
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL
    : TypeOfPnLColorHex.EQUAL;

  const displayedIdBackgroundColor = !!openCfdDetails?.pnl?.value
    ? openCfdDetails?.pnl?.value > 0
      ? 'bg-greenLinear'
      : openCfdDetails?.pnl?.value < 0
      ? 'bg-redLinear'
      : ''
    : '';

  const displayedCrossColor =
    !!openCfdDetails?.pnl && openCfdDetails?.pnl?.value > 0
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : !!openCfdDetails?.pnl && openCfdDetails?.pnl?.value < 0
      ? 'hover:before:bg-lightRed hover:after:bg-lightRed'
      : 'hover:before:bg-lightWhite hover:after:bg-lightWhite';

  const displayedCrossStyle =
    'before:absolute before:top-12px before:z-40 before:block before:h-1 before:w-6 before:rotate-45 before:rounded-md after:absolute after:top-12px after:z-40 after:block after:h-1 after:w-6 after:-rotate-45 after:rounded-md';

  const isDisplayedTakeProfitSetting = tpToggle ? 'flex' : 'invisible';
  const isDisplayedStopLossSetting = slToggle ? 'flex' : 'invisible';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const layoutInsideBorder = 'mx-5 flex justify-between';

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

  const handleTypingStatusChangeRouter = (typingStatus: boolean) => {
    const tp = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        tp: typingStatus,
      }));
    };

    const sl = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        sl: typingStatus,
      }));
    };

    return {
      tp,
      sl,
    };
  };

  const handleTypingStatusChange = handleTypingStatusChangeRouter(false);

  const checkTpSlWithinBounds = () => {
    if (validateNumberFormat(tpValueRef.current)) {
      if (+tpValueRef.current < tpLowerLimitRef.current) {
        setTpValue(openCfdDetails.suggestion.takeProfit);
        calculateProfit();
      }

      if (+tpValueRef.current > tpUpperLimitRef.current) {
        setTpValue(openCfdDetails.suggestion.takeProfit);
        calculateProfit();
      }
    } else {
      setTpValue(openCfdDetails.suggestion.takeProfit);
      calculateProfit();
    }

    if (validateNumberFormat(slValueRef.current)) {
      if (+slValueRef.current < slLowerLimitRef.current) {
        setSlValue(openCfdDetails.suggestion.stopLoss);
        calculateLoss();
      }

      if (+slValueRef.current > slUpperLimitRef.current) {
        setSlValue(openCfdDetails.suggestion.stopLoss);
        calculateLoss();
      }
    } else {
      setSlValue(openCfdDetails.suggestion.stopLoss);
      calculateLoss();
    }
  };

  const displayedTakeProfitSetting = (
    <div className={`mr-8 ${isDisplayedTakeProfitSetting}`}>
      <TradingInput
        getIsValueValid={getTpValid}
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
        onTypingStatusChange={handleTypingStatusChange.tp}
      />
    </div>
  );

  const displayedStopLossSetting = (
    <div className={`mr-8 ${isDisplayedStopLossSetting}`}>
      <TradingInput
        getIsValueValid={getSlValid}
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
        onTypingStatusChange={handleTypingStatusChange.sl}
      />
    </div>
  );

  const guaranteedStopLoss = (
    <div className="">
      <div className="flex items-center text-center">
        <input
          type="checkbox"
          disabled={SafeMath.lt(availableBalance, guaranteedStopFeeRef.current)}
          checked={guaranteedCheckedRef.current}
          onChange={guaranteedCheckedChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-lightGray4"
        />
        <label className="ml-2 flex font-medium text-lightGray">
          {t('POSITION_MODAL.GUARANTEED_STOP')}
          <span className="ml-1 text-lightWhite">
            ({t('POSITION_MODAL.FEE')}: {numberFormatted(gslFee)} {unitAsset})
          </span>
          {/* Info: (20231003 - Julian) Tooltip */}
          <Tooltip className="ml-3">
            <p className="w-56 text-left text-sm font-medium text-white">
              {t('POSITION_MODAL.GUARANTEED_STOP_HINT')}
            </p>
          </Tooltip>
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
      guaranteedCheckedRef.current !== openCfdDetails?.guaranteedStop
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
            2,
            RoundCondition.SHRINK
          )
        : 0;
    const caledTpUpperLimit =
      openCfdDetails.typeOfPosition === TypeOfPosition.SELL
        ? roundToDecimalPlaces(
            +SafeMath.mult(openCfdDetails.openPrice, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
            2,
            RoundCondition.SHRINK
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
          2,
          RoundCondition.SHRINK
        )
      : roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.openPrice, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
          2,
          RoundCondition.SHRINK
        );

    const caledSlUpperLimit = isLiquidated
      ? roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2) // Info: 相當於不能設定 SL (20230426 - Shirley)
      : openCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.openPrice, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
          2,
          RoundCondition.SHRINK
        )
      : roundToDecimalPlaces(
          +SafeMath.mult(openCfdDetails.liquidationPrice, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
          2,
          RoundCondition.SHRINK
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
              2,
              RoundCondition.SHRINK
            )
        : roundToDecimalPlaces(openCfdDetails.liquidationPrice, 2, RoundCondition.SHRINK);

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

  // Info: 用戶在輸入時不要檢查 tp/sl 是否在範圍內 (20231026 - Shirley)
  useEffect(() => {
    if (!isTypingRef.current.tp && !isTypingRef.current.sl) {
      checkTpSlWithinBounds();
    }
  }, [isTypingRef.current]);

  // Info: 計算 GSL fee (20231026 - Shirley)
  useEffect(() => {
    if (!gslPercent) {
      setSubmitDisabled(true);
      return;
    }

    setGuaranteedStopFee(
      roundToDecimalPlaces(
        +SafeMath.mult(
          Number(gslPercent),
          SafeMath.mult(openCfdDetails?.openPrice, openCfdDetails?.amount)
        ),
        2
      )
    );
  }, [gslPercent, openCfdDetails?.openPrice, openCfdDetails?.amount]);

  // Info: 確認 tp/sl/gsl 格式是否正確 (20231026 - Shirley)
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
    guaranteedCheckedRef.current,
  ]);

  // Info: 顯示視窗之前確保拿到該筆 CFD 的資料 (20231026 - Shirley)
  useEffect(() => {
    setSubmitDisabled(true);

    initPosition();
  }, [globalCtx.visibleUpdateFormModal]);

  const spreadSymbol = openCfdDetails?.openSpreadFee >= 0 ? '+' : '-';

  const formContent = (
    <div className="flex-col items-center text-xs lg:text-sm">
      <div
        className={`${displayedBorderColor} mt-1 w-full space-y-3 border-1px pb-3 leading-relaxed text-lightWhite lg:mt-2`}
      >
        {/* Info: (20231004 - Julian) CFD ID */}
        <div
          className={`px-5 py-2 ${displayedIdBackgroundColor} ${displayedBorderColor} border-b-1px`}
        >
          <p>{openCfdDetails.id}</p>
        </div>
        {/* Info: (20231004 - Julian) Type */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
          <div className={`${displayedPositionColor}`}>
            {displayedTypeOfPosition}
            <span className="ml-1 text-lightGray">{displayedBuyOrSell}</span>
          </div>
        </div>
        {/* Info: (20231004 - Julian) Amount */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.AMOUNT')}</div>
          <div className="">
            {numberFormatted(openCfdDetails?.amount) ?? 0}
            <span className="ml-1 text-xs text-lightGray">{openCfdDetails?.targetAsset}</span>
          </div>
        </div>
        {/* Info: (20231004 - Julian) PnL */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.PNL')}</div>
          <div className={`${displayedPnLColor}`}>
            {displayedPnLSymbol} {displayedPnLValue}{' '}
            <span className="ml-1 text-xs">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231004 - Julian) Open Value */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_VALUE')}</div>
          <div className="">
            {numberFormatted(openCfdDetails?.openValue) ?? 0}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231004 - Julian) Open Price */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
          <div className="flex items-center space-x-1 whitespace-nowrap">
            {/* Info: (20231003 - Julian) Spot Price */}
            {numberFormatted(openCfdDetails?.openSpotPrice)}
            {/* Info: (20231003 - Julian) Spread */}
            <span className="ml-1 whitespace-nowrap text-xs text-lightGray">
              {spreadSymbol}
              {numberFormatted(openCfdDetails?.openSpreadFee)}
            </span>
            {/* Info: (20231003 - Julian) Price */}
            {<p>→ {numberFormatted(openCfdDetails?.openPrice)}</p>}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
            <Tooltip className="hidden lg:block">
              <p className="w-40 text-sm font-medium text-white">
                {t('POSITION_MODAL.SPREAD_HINT')}
              </p>
            </Tooltip>
          </div>
        </div>
        {/* Info: (20231004 - Julian) Open Time */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
          <div className="">
            {displayedTime.date} {displayedTime.time}
          </div>
        </div>
        {/* Info: (20231004 - Julian) TP/SL */}
        <div className={`${layoutInsideBorder}`}>
          <div className="flex">
            <div className="text-lightGray mr-1">{t('POSITION_MODAL.TP_AND_SL')}</div>
            <Tooltip className={``} tooltipPosition="left-2">
              <p className="w-56 text-left text-sm font-medium text-white">
                {t('POSITION_MODAL.TP_AND_SL_HINT')}
              </p>
            </Tooltip>
          </div>

          <div className="">
            <span className={`text-lightWhite`}>{numberFormatted(cfdTp, true)}</span> /{' '}
            <span className={`text-lightWhite`}>{numberFormatted(cfdSl, true)}</span>
          </div>
        </div>
        {/* Info: (20231004 - Julian) Liquidation Price */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.LIQUIDATION_PRICE')}</div>
          <div className="">
            {numberFormatted(openCfdDetails?.liquidationPrice)}
            <span className="ml-1 text-xs text-lightGray">{unitAsset}</span>
          </div>
        </div>
        {/* Info: (20231004 - Julian) State */}
        <div className={`${layoutInsideBorder}`}>
          <div className="text-lightGray">{t('POSITION_MODAL.STATE')}</div>
          <div className="">{t('POSITION_MODAL.STATE_OPEN')}</div>
        </div>
      </div>

      <div className={`mt-3 flex-col leading-relaxed text-lightWhite`}>
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
          className="w-full whitespace-nowrap rounded bg-tidebitTheme py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none disabled:cursor-default disabled:bg-lightGray"
        >
          {t('POSITION_MODAL.UPDATE_POSITION_TITLE')}
        </RippleButton>
      </div>
    </div>
  );

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <div {...otherProps}>
      {/* Info: (20231004 - Julian) Blur Mask */}
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative flex h-auto w-90vw flex-col rounded-xl bg-darkGray1 px-5 py-8 shadow-lg shadow-black/80 outline-none focus:outline-none sm:w-400px sm:p-10">
          {/* Info: (20231004 - Julian) Header */}
          <div className="flex items-end justify-between pr-5 lg:pr-0">
            {/* Info: (20231004 - Julian) Ticker Title */}
            <div className="flex items-center space-x-2 text-lightWhite">
              <Image
                src={`/asset_icon/${openCfdDetails?.targetAsset.toLowerCase()}.svg`}
                width={30}
                height={30}
                alt={`${openCfdDetails?.targetAsset}_icon`}
              />
              <h3 className="text-2xl">{openCfdDetails?.instId}</h3>
            </div>
            {/* Info: (20231004 - Julian) Circular Progress Bar */}
            <div className="relative flex h-40px w-40px items-center">
              <div
                className={`absolute left-9px top-4px z-30 h-7 w-7 rounded-full hover:cursor-pointer hover:bg-darkGray1 
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
                  circularBarSize="90"
                />
              </div>
            </div>

            {/* Info: (20231004 - Julian) Close Button */}
            <button className="absolute right-3 top-3 p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none lg:right-5 lg:top-5">
              <ImCross onClick={modalClickHandler} />
            </button>
          </div>
          {/* Info: (20231004 - Julian) Form Content */}
          {formContent}
        </div>
      </div>
    </div>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default UpdateFormModal;

import React, {useContext, useEffect, useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {
  DEFAULT_BUY_PRICE,
  DEFAULT_EXPIRY_DATE,
  DEFAULT_FEE,
  DEFAULT_LEVERAGE,
  DEFAULT_SELL_PRICE,
  DEFAULT_USER_BALANCE,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {
  TARGET_MAX_DIGITS,
  unitAsset,
  SUGGEST_TP,
  SUGGEST_SL,
  LIQUIDATION_FIVE_LEVERAGE,
  FRACTION_DIGITS,
  TP_SL_LIMIT_PERCENT,
  DEFAULT_TICKER,
  DEFAULT_CURRENCY,
  CFD_LIQUIDATION_TIME,
  TARGET_MIN_DIGITS,
} from '../../constants/config';
import {useGlobal} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import useStateRef from 'react-usestateref';
import {TypeOfPosition} from '../../constants/type_of_position';
import {OrderType} from '../../constants/order_type';
import {ClickEvent} from '../../constants/tidebit_event';
import {
  getEstimatedPnL,
  getTimestamp,
  roundToDecimalPlaces,
  validateAllInput,
} from '../../lib/common';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {useTranslation} from 'next-i18next';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {CFDOperation} from '../../constants/cfd_order_type';
import {TypeOfValidation} from '../../constants/validation';

type TranslateFunction = (s: string) => string;

const TradeTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const initialState = {
    number: 0,
    symbol: '',
  };

  const tickerStaticStatistics = marketCtx.tickerStatic;

  const ticker = marketCtx.selectedTicker?.instId ?? '';
  const availableBalance = userCtx.userAssets?.balance?.available ?? DEFAULT_USER_BALANCE;

  const leverage = tickerStaticStatistics?.leverage ?? DEFAULT_LEVERAGE;
  const gsl = marketCtx.guaranteedStopFeePercentage;

  const [longPrice, setLongPrice, longPriceRef] = useStateRef(DEFAULT_BUY_PRICE);
  const [shortPrice, setShortPrice, shortPriceRef] = useStateRef(DEFAULT_SELL_PRICE);

  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [targetInputValue, setTargetInputValue, targetInputValueRef] = useStateRef(0.02);

  const [longTpValue, setLongTpValue, longTpValueRef] = useStateRef(
    Number((Number(longPriceRef.current) * (1 + SUGGEST_TP / leverage)).toFixed(2))
  );
  const [longSlValue, setLongSlValue, longSlValueRef] = useStateRef(
    Number((Number(longPriceRef.current) * (1 - SUGGEST_SL / leverage)).toFixed(2))
  );
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue, shortTpValueRef] = useStateRef(
    Number((Number(shortPriceRef.current) * (1 - SUGGEST_TP / leverage)).toFixed(2))
  );
  const [shortSlValue, setShortSlValue, shortSlValueRef] = useStateRef(
    Number((Number(shortPriceRef.current) * (1 + SUGGEST_SL / leverage)).toFixed(2))
  );
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [estimatedLongProfitValue, setEstimatedLongProfitValue, estimatedLongProfitValueRef] =
    useStateRef(initialState);

  const [estimatedLongLossValue, setEstimatedLongLossValue, estimatedLongLossValueRef] =
    useStateRef(initialState);

  const [estimatedShortProfitValue, setEstimatedShortProfitValue, estimatedShortProfitValueRef] =
    useStateRef(initialState);

  const [estimatedShortLossValue, setEstimatedShortLossValue, estimatedShortLossValueRef] =
    useStateRef(initialState);

  const [longGuaranteedStopChecked, setLongGuaranteedStopChecked] = useState(false);
  const [shortGuaranteedStopChecked, setShortGuaranteedStopChecked] = useState(false);

  const [requiredMarginLong, setRequiredMarginLong, requiredMarginLongRef] = useStateRef(
    roundToDecimalPlaces((targetInputValue * Number(longPriceRef.current)) / leverage, 2)
  );
  const [valueOfPositionLong, setValueOfPositionLong, valueOfPositionLongRef] = useStateRef(
    roundToDecimalPlaces(targetInputValue * Number(longPriceRef.current), 2)
  );

  const [requiredMarginShort, setRequiredMarginShort, requiredMarginShortRef] = useStateRef(
    roundToDecimalPlaces((targetInputValue * Number(shortPriceRef.current)) / leverage, 2)
  );
  const [valueOfPositionShort, setValueOfPositionShort, valueOfPositionShortRef] = useStateRef(
    roundToDecimalPlaces(targetInputValue * Number(shortPriceRef.current), 2)
  );

  const [marginWarningLong, setMarginWarningLong, marginWarningLongRef] = useStateRef(false);
  const [marginWarningShort, setMarginWarningShort, marginWarningShortRef] = useStateRef(false);

  const [longBtnDisabled, setLongBtnDisabled, longBtnDisabledRef] = useStateRef(false);
  const [shortBtnDisabled, setShortBtnDisabled, shortBtnDisabledRef] = useStateRef(false);

  const [targetLengthLong, setTargetLengthLong] = useState(
    roundToDecimalPlaces((targetInputValue * Number(longPriceRef.current)) / leverage, 2).toString()
      .length
  );
  const [targetLengthShort, setTargetLengthShort] = useState(
    roundToDecimalPlaces(
      (targetInputValue * Number(shortPriceRef.current)) / leverage,
      2
    ).toString().length
  );

  const [valueOfPositionLengthLong, setValueOfPositionLengthLong] = useState(
    roundToDecimalPlaces(targetInputValue * Number(longPriceRef.current), 2).toString().length
  );
  const [valueOfPositionLengthShort, setValueOfPositionLengthShort] = useState(
    roundToDecimalPlaces(targetInputValue * Number(shortPriceRef.current), 2).toString().length
  );

  const [guaranteedStopFeeLong, setGuaranteedStopFeeLong, guaranteedStopFeeLongRef] = useStateRef(
    Number(gsl) * valueOfPositionLongRef.current
  );
  const [guaranteedStopFeeShort, setGuaranteedStopFeeShort, guaranteedStopFeeShortRef] =
    useStateRef(Number(gsl) * valueOfPositionShortRef.current);

  const [longSlLowerLimit, setLongSlLowerLimit, longSlLowerLimitRef] = useStateRef(0);
  const [longSlUpperLimit, setLongSlUpperLimit, longSlUpperLimitRef] = useStateRef(0);
  const [shortSlLowerLimit, setShortSlLowerLimit, shortSlLowerLimitRef] = useStateRef(0);
  const [shortSlUpperLimit, setShortSlUpperLimit, shortSlUpperLimitRef] = useStateRef(0);

  const [longTpLowerLimit, setLongTpLowerLimit, longTpLowerLimitRef] = useStateRef(0);
  const [shortTpUpperLimit, setShortTpUpperLimit, shortTpUpperLimitRef] = useStateRef(0);

  const [longTpSuggestion, setLongTpSuggestion, longTpSuggestionRef] = useStateRef(0);
  const [longSlSuggestion, setLongSlSuggestion, longSlSuggestionRef] = useStateRef(0);
  const [shortTpSuggestion, setShortTpSuggestion, shortTpSuggestionRef] = useStateRef(0);
  const [shortSlSuggestion, setShortSlSuggestion, shortSlSuggestionRef] = useStateRef(0);

  // Info: Fetch quotation the first time (20230327 - Shirley)
  useEffect(() => {
    if (!userCtx.enableServiceTerm) return;

    (async () => {
      setPrice();

      setTpSlBounds();
      setSuggestions();
      renewPosition();
    })();
  }, [userCtx.enableServiceTerm]);

  // Info: update balance when balance changed (20230512 - Shirley)
  useEffect(() => {
    if (!userCtx.enableServiceTerm) return;

    renewPosition();
  }, [userCtx.userAssets?.balance?.available]);

  // Info: Calculate quotation when market price changes (20230427 - Shirley)
  useEffect(() => {
    setPrice();
    setTpSlBounds();
    checkTpSlWithinBounds();
    renewPosition();
    // eslint-disable-next-line no-console
  }, [marketCtx.selectedTicker?.price]);

  // Info: Fetch quotation when ticker changed (20230327 - Shirley)
  useEffect(() => {
    notificationCtx.emitter.once(ClickEvent.TICKER_CHANGED, async () => {
      setPrice();
      setTpSlBounds();
      setSuggestions();
      renewPosition();
    });

    return () => {
      notificationCtx.emitter.removeAllListeners(ClickEvent.TICKER_CHANGED);
    };
  }, [marketCtx.selectedTicker]);

  useEffect(() => {
    validateTpSlInput();
  }, [
    longTpValueRef.current,
    longSlValueRef.current,
    shortTpValueRef.current,
    shortSlValueRef.current,
  ]);

  const setPrice = () => {
    if (marketCtx.selectedTicker?.instId) {
      const buyPrice = roundToDecimalPlaces(
        marketCtx.predictCFDClosePrice(marketCtx.selectedTicker?.instId, TypeOfPosition.SELL),
        2
      );

      const sellPrice = roundToDecimalPlaces(
        marketCtx.predictCFDClosePrice(marketCtx.selectedTicker?.instId, TypeOfPosition.BUY),
        2
      );

      setLongPrice(buyPrice);
      setShortPrice(sellPrice);
    }
  };

  // Info: To get quotation to let user sign, if fail, make the quotation itself with already expired deadline (20230606 - Shirley)
  const getQuotation = async (instId: string) => {
    let longQuotation = {...defaultResultFailed};
    let shortQuotation = {...defaultResultFailed};

    try {
      longQuotation = await marketCtx.getCFDQuotation(instId, TypeOfPosition.BUY);
      shortQuotation = await marketCtx.getCFDQuotation(instId, TypeOfPosition.SELL);

      const long = longQuotation.data as IQuotation;
      const short = shortQuotation.data as IQuotation;

      if (
        longQuotation.success &&
        long.typeOfPosition === TypeOfPosition.BUY &&
        longQuotation.data !== null
      ) {
      } else {
        const buyQuotation: IQuotation = {
          ticker: marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER,
          targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
          typeOfPosition: TypeOfPosition.BUY,
          unitAsset: unitAsset,
          price: longPriceRef.current,
          deadline: DEFAULT_EXPIRY_DATE,
          signature: '0x',
        };

        longQuotation = {...defaultResultFailed, data: buyQuotation};
      }

      if (
        shortQuotation.success &&
        short.typeOfPosition === TypeOfPosition.SELL &&
        shortQuotation.data !== null
      ) {
      } else {
        const sellQuotation: IQuotation = {
          ticker: marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER,
          targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
          typeOfPosition: TypeOfPosition.SELL,
          unitAsset: unitAsset,
          price: shortPriceRef.current,
          deadline: DEFAULT_EXPIRY_DATE,
          signature: '0x',
        };

        shortQuotation = {...defaultResultFailed, data: sellQuotation};
      }
    } catch (err) {
      const buyQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
        typeOfPosition: TypeOfPosition.BUY,
        unitAsset: unitAsset,
        price: longPriceRef.current,
        deadline: DEFAULT_EXPIRY_DATE,
        signature: '0x',
      };

      const sellQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
        typeOfPosition: TypeOfPosition.SELL,
        unitAsset: unitAsset,
        price: shortPriceRef.current,
        deadline: DEFAULT_EXPIRY_DATE,
        signature: '0x',
      };

      longQuotation = {...defaultResultFailed, data: buyQuotation};
      shortQuotation = {...defaultResultFailed, data: sellQuotation};
    }

    return {longQuotation: longQuotation, shortQuotation: shortQuotation};
  };

  const calculateLongProfit = () => {
    const profit = getEstimatedPnL(
      targetInputValueRef.current,
      TypeOfPosition.BUY,
      longPriceRef.current,
      longTpValueRef.current,
      true
    );
    setEstimatedLongProfitValue(profit);
  };

  const calculateLongLoss = () => {
    const loss = getEstimatedPnL(
      targetInputValueRef.current,
      TypeOfPosition.BUY,
      longPriceRef.current,
      longSlValueRef.current,
      false
    );
    setEstimatedLongLossValue(loss);
  };

  const calculateShortProfit = () => {
    const profit = getEstimatedPnL(
      targetInputValueRef.current,
      TypeOfPosition.SELL,
      shortPriceRef.current,
      shortTpValueRef.current,
      true
    );
    setEstimatedShortProfitValue(profit);
  };

  const calculateShortLoss = () => {
    const loss = getEstimatedPnL(
      targetInputValueRef.current,
      TypeOfPosition.SELL,
      shortPriceRef.current,
      shortSlValueRef.current,
      false
    );
    setEstimatedShortLossValue(loss);
  };

  const getTargetInputValue = (value: number) => {
    setTargetInputValue(value);
    targetAmountDetection(value);

    calculateLongProfit();
    calculateLongLoss();
    calculateShortProfit();
    calculateShortLoss();
  };

  const getLongTpValue = (value: number) => {
    setLongTpValue(value);

    calculateLongProfit();
  };

  const getLongSlValue = (value: number) => {
    setLongSlValue(value);

    calculateLongLoss();
  };

  const getShortTpValue = (value: number) => {
    setShortTpValue(value);

    calculateShortProfit();
  };

  const getShortSlValue = (value: number) => {
    setShortSlValue(value);

    calculateShortLoss();
  };

  const validateTpSlInput = () => {
    const longTpValid = validateAllInput({
      typeOfValidation: TypeOfValidation.TPSL,
      value: longTpValueRef.current,
      upperLimit: Infinity,
      lowerLimit: longTpLowerLimitRef.current,
    });

    const longSlValid = validateAllInput({
      typeOfValidation: TypeOfValidation.TPSL,

      value: longSlValueRef.current,
      upperLimit: longSlUpperLimitRef.current,
      lowerLimit: longSlLowerLimitRef.current,
    });

    const shortTpValid = validateAllInput({
      typeOfValidation: TypeOfValidation.TPSL,

      value: shortTpValueRef.current,
      upperLimit: shortTpUpperLimitRef.current,
      lowerLimit: 0,
    });

    const shortSlValid = validateAllInput({
      typeOfValidation: TypeOfValidation.TPSL,

      value: shortSlValueRef.current,
      upperLimit: shortSlUpperLimitRef.current,
      lowerLimit: shortSlLowerLimitRef.current,
    });

    if (longTpValid && longSlValid) {
      setLongBtnDisabled(false);
    } else {
      setLongBtnDisabled(true);
    }

    if (shortTpValid && shortSlValid) {
      setShortBtnDisabled(false);
    } else {
      setShortBtnDisabled(true);
    }
  };

  const checkTpSlWithinBounds = () => {
    if (
      longSlValueRef.current < longSlLowerLimitRef.current ||
      longSlValueRef.current > longSlUpperLimitRef.current
    ) {
      setLongSlValue(longSlSuggestionRef.current);
    }

    if (
      shortSlValueRef.current > shortSlUpperLimitRef.current ||
      shortSlValueRef.current < shortSlLowerLimitRef.current
    ) {
      setShortSlValue(shortSlSuggestionRef.current);
    }

    if (longTpValueRef.current < longTpLowerLimitRef.current) {
      setLongTpValue(longTpSuggestionRef.current);
    }

    if (shortTpValueRef.current > shortTpUpperLimitRef.current) {
      setShortTpValue(shortTpSuggestionRef.current);
    }
  };

  const setTpSlBounds = () => {
    const longTpLowerBound = roundToDecimalPlaces(
      Number(longPriceRef.current) * (1 + TP_SL_LIMIT_PERCENT),
      2
    );
    const shortTpUpperBound = roundToDecimalPlaces(
      Number(shortPriceRef.current) * (1 - TP_SL_LIMIT_PERCENT),
      2
    );

    const longSlLowerBound = roundToDecimalPlaces(
      Number(longPriceRef.current) * (1 - LIQUIDATION_FIVE_LEVERAGE) * (1 + TP_SL_LIMIT_PERCENT),
      2
    );

    const shortSlUpperBound = roundToDecimalPlaces(
      Number(shortPriceRef.current) * (1 + LIQUIDATION_FIVE_LEVERAGE) * (1 - TP_SL_LIMIT_PERCENT),
      2
    );

    const longSlUpperBound = roundToDecimalPlaces(
      Number(longPriceRef.current) * (1 - TP_SL_LIMIT_PERCENT),
      2
    );

    const shortSlLowerBound = roundToDecimalPlaces(
      Number(shortPriceRef.current) * (1 + TP_SL_LIMIT_PERCENT),
      2
    );

    setLongSlLowerLimit(longSlLowerBound);
    setLongSlUpperLimit(longSlUpperBound); // Info: Open price with buffer (20230428 - Shirley)
    setLongTpLowerLimit(longTpLowerBound); // Info: Open price with buffer (20230428 - Shirley)

    setShortTpUpperLimit(shortTpUpperBound); // Info: Open price with buffer (20230428 - Shirley)
    setShortSlUpperLimit(shortSlUpperBound);
    setShortSlLowerLimit(shortSlLowerBound); // Info: Open price with buffer (20230428 - Shirley)

    updateSuggestions();
  };

  const updateSuggestions = () => {
    const tpTimes = SUGGEST_TP / leverage;
    const slTimes = SUGGEST_SL / leverage;

    setLongTpSuggestion(Number((Number(longPriceRef.current) * (1 + tpTimes)).toFixed(2)));
    setLongSlSuggestion(Number((Number(longPriceRef.current) * (1 - slTimes)).toFixed(2)));
    setShortTpSuggestion(Number((Number(shortPriceRef.current) * (1 - tpTimes)).toFixed(2)));
    setShortSlSuggestion(Number((Number(shortPriceRef.current) * (1 + slTimes)).toFixed(2)));
  };

  // Info: suggest the tp / sl in the beginning (20230329 - Shirley)
  const setSuggestions = () => {
    setLongTpValue(longTpSuggestionRef.current);
    setLongSlValue(longSlSuggestionRef.current);
    setShortTpValue(shortTpSuggestionRef.current);
    setShortSlValue(shortSlSuggestionRef.current);
  };

  // Info: renew the value of position when target input changed (20230328 - Shirley)
  const renewPosition = async () => {
    // Long
    const newLongValue = targetInputValueRef.current * Number(longPriceRef.current);

    const roundedLongValue = roundToDecimalPlaces(newLongValue, 2);
    setValueOfPositionLong(roundedLongValue);

    const marginLong = newLongValue / leverage;
    const roundedMarginLong = roundToDecimalPlaces(marginLong, 2);
    setRequiredMarginLong(roundedMarginLong);

    setMarginWarningLong(marginLong > availableBalance);

    setTargetLengthLong(roundedMarginLong.toString().length);
    setValueOfPositionLengthLong(roundedLongValue.toString().length);

    calculateLongProfit();
    calculateLongLoss();

    setGuaranteedStopFeeLong(Number(gsl) * valueOfPositionLongRef.current);

    // Short
    const newShortValue = targetInputValueRef.current * Number(shortPriceRef.current);

    const roundedShortValue = roundToDecimalPlaces(newShortValue, 2);
    setValueOfPositionShort(roundedShortValue);

    const marginShort = newShortValue / leverage;
    const roundedMarginShort = roundToDecimalPlaces(marginShort, 2);
    setRequiredMarginShort(roundedMarginShort);

    setMarginWarningShort(marginShort > availableBalance);

    setTargetLengthShort(roundedMarginShort.toString().length);
    setValueOfPositionLengthShort(roundedShortValue.toString().length);

    calculateShortProfit();
    calculateShortLoss();

    setGuaranteedStopFeeShort(Number(gsl) * valueOfPositionShortRef.current);
  };

  const targetAmountDetection = (value?: number) => {
    renewPosition();
  };

  const tabBodyWidth = 'w-320px';

  const getToggledLongTpSetting = (bool: boolean) => {
    setLongTpToggle(bool);

    calculateLongProfit();
  };

  const getToggledLongSlSetting = (bool: boolean) => {
    setLongSlToggle(bool);

    calculateLongLoss();
  };

  const getToggledShortTpSetting = (bool: boolean) => {
    setShortTpToggle(bool);

    calculateShortProfit();
  };

  const getToggledShortSlSetting = (bool: boolean) => {
    setShortSlToggle(bool);

    calculateShortLoss();
  };

  const toApplyCreateOrder = async () => {
    const {longQuotation, shortQuotation} = await getQuotation(
      marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER
    );

    const feePercent = marketCtx.tickerLiveStatistics?.fee ?? DEFAULT_FEE;

    const long = longQuotation.data as IQuotation;
    const short = shortQuotation.data as IQuotation;

    const share = {
      ticker: marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER,
      targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
      unitAsset: unitAsset,
      amount: targetInputValueRef.current,
      leverage: marketCtx.tickerStatic?.leverage ?? DEFAULT_LEVERAGE,
      margin: {
        asset: unitAsset,
        amount: requiredMarginLongRef.current,
      },
      liquidationTime: getTimestamp() + CFD_LIQUIDATION_TIME,
    };

    const longOrder: IApplyCreateCFDOrder = {
      ...share,
      orderType: OrderType.CFD,
      operation: CFDOperation.CREATE,
      price: long.price,
      typeOfPosition: TypeOfPosition.BUY,
      quotation: long,
      liquidationPrice: roundToDecimalPlaces(long.price * (1 - LIQUIDATION_FIVE_LEVERAGE), 2),
      fee: feePercent,
      guaranteedStop: longSlToggle ? longGuaranteedStopChecked : false,
      guaranteedStopFee:
        longSlToggle && longGuaranteedStopChecked ? guaranteedStopFeeLongRef.current : 0,
      takeProfit: longTpToggle ? longTpValue : undefined,
      stopLoss: longSlToggle ? longSlValue : undefined,
    };
    // TODO: if not getting `fee` from context, stop the transaction
    const shortOrder: IApplyCreateCFDOrder = {
      ...share,
      orderType: OrderType.CFD,
      operation: CFDOperation.CREATE,
      typeOfPosition: TypeOfPosition.SELL,
      quotation: short,
      price: short.price,
      liquidationPrice: roundToDecimalPlaces(short.price * (1 + LIQUIDATION_FIVE_LEVERAGE), 2),
      fee: feePercent,
      guaranteedStop: shortSlToggle ? shortGuaranteedStopChecked : false,
      guaranteedStopFee:
        shortSlToggle && shortGuaranteedStopChecked ? guaranteedStopFeeShortRef.current : 0,
      takeProfit: shortTpToggle ? shortTpValue : undefined,
      stopLoss: shortSlToggle ? shortSlValue : undefined,
    };

    return {longOrder, shortOrder};
  };

  const longOrderSubmitHandler = async () => {
    const {longOrder} = await toApplyCreateOrder();

    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: longOrder,
    });
    globalCtx.visiblePositionOpenModalHandler();

    return;
  };

  const shortOrderSubmitHandler = async () => {
    const {shortOrder} = await toApplyCreateOrder();

    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: shortOrder,
    });
    globalCtx.visiblePositionOpenModalHandler();

    return;
  };

  const isDisplayedLongSlSetting = longSlToggle ? 'flex' : 'invisible';
  const isDisplayedShortSlSetting = shortSlToggle ? 'flex' : 'invisible';

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const isDisplayedMarginLongStyle = marginWarningLongRef.current
    ? 'text-lightGray'
    : 'text-lightWhite';
  const isDisplayedMarginLongWarning = marginWarningLongRef.current ? 'flex' : 'invisible';
  const isDisplayedMarginLongSize = targetLengthLong > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueLongSize = valueOfPositionLengthLong > 7 ? 'text-sm' : 'text-base';

  const isDisplayedMarginShortStyle = marginWarningShortRef.current
    ? 'text-lightGray'
    : 'text-lightWhite';
  const isDisplayedMarginShortWarning = marginWarningShortRef.current ? 'flex' : 'invisible';
  const isDisplayedMarginShortSize = targetLengthShort > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueShortSize = valueOfPositionLengthShort > 7 ? 'text-sm' : 'text-base';

  const longToolMouseEnterHandler = () => setLongTooltipStatus(3);
  const longToolMouseLeaveHandler = () => setLongTooltipStatus(0);

  const shortToolMouseEnterHandler = () => setShortTooltipStatus(3);
  const shortToolMouseLeaveHandler = () => setShortTooltipStatus(0);

  // ----------Target area----------
  const displayedTargetAmountSetting = (
    <TradingInput
      lowerLimit={TARGET_MIN_DIGITS}
      upperLimit={TARGET_MAX_DIGITS}
      getInputValue={getTargetInputValue}
      inputInitialValue={targetInputValueRef.current}
      inputValueFromParent={targetInputValueRef.current}
      setInputValueFromParent={setTargetInputValue}
      inputPlaceholder="target amount input"
      inputName="targetInput"
      inputSize="h-44px w-160px text-xl"
      decrementBtnSize="44"
      incrementBtnSize="44"
    />
  );

  // ----------long area----------
  const displayedRequiredMarginLongStyle = (
    <>
      <div className={`${isDisplayedMarginLongStyle} ${isDisplayedMarginLongSize} my-1 text-base`}>
        {requiredMarginLongRef.current?.toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE,
          FRACTION_DIGITS
        )}{' '}
        {unitAsset}
      </div>
      <div className={`${isDisplayedMarginLongWarning} ml-3 text-xs text-lightRed`}>
        * {t('TRADE_PAGE.TRADE_TAB_NOT_ENOUGH_MARGIN')}
      </div>
    </>
  );

  const longGuaranteedStopChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongGuaranteedStopChecked(e.target.checked);
  };

  const displayedLongTpSetting = (
    <div className={`${isDisplayedLongTpSetting}`}>
      <TradingInput
        lowerLimit={longTpLowerLimitRef.current}
        upperLimit={TARGET_MAX_DIGITS}
        inputInitialValue={longTpValue}
        inputValueFromParent={longTpValue}
        setInputValueFromParent={setLongTpValue}
        getInputValue={getLongTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="tpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedExpectedLongProfit = (
    <div
      className={`${
        longTpToggle ? `mb-5 translate-y-2` : `invisible translate-y-0`
      } -mt-5 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')}: {estimatedLongProfitValueRef.current.symbol}{' '}
        ${' '}
        {roundToDecimalPlaces(
          Math.abs(estimatedLongProfitValueRef.current.number),
          2
        ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedLongSlSetting = (
    <div className={`${isDisplayedLongSlSetting}`}>
      <TradingInput
        lowerLimit={longSlLowerLimitRef.current}
        upperLimit={longSlUpperLimitRef.current}
        inputValueFromParent={longSlValue}
        setInputValueFromParent={setLongSlValue}
        getInputValue={getLongSlValue}
        inputPlaceholder="stop-loss setting"
        inputInitialValue={longSlValue}
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedExpectedLongLoss = (
    <div
      className={`${
        longSlToggle ? `mb-0 translate-y-2` : `invisible translate-y-0`
      } -mt-0 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')}: {estimatedLongLossValueRef.current.symbol} ${' '}
        {roundToDecimalPlaces(Math.abs(estimatedLongLossValueRef.current.number), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const longGuaranteedStop = (
    // <div className={`${isDisplayedLongSlSetting} mt-0 h-14 items-center`}>
    <div
      className={`${
        longSlToggle ? `translate-y-5` : `invisible translate-y-0`
      } mb-10 mt-0 flex items-center transition-all`}
    >
      <input
        type="checkbox"
        value=""
        onChange={longGuaranteedStopChangeHandler}
        className={`h-5 w-5 rounded text-lightWhite accent-tidebitTheme`}
      />
      <label className={`ml-2 flex text-sm font-medium text-lightGray`}>
        {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP')} &nbsp;
        <span className="text-lightWhite">
          {' '}
          ({t('TRADE_PAGE.TRADE_TAB_FEE')}:{' '}
          {guaranteedStopFeeLongRef.current?.toLocaleString(
            UNIVERSAL_NUMBER_FORMAT_LOCALE,
            FRACTION_DIGITS
          )}{' '}
          {unitAsset})
        </span>
        {/* tooltip */}
        <div className="ml-1">
          <div
            className="relative"
            onMouseEnter={longToolMouseEnterHandler}
            onMouseLeave={longToolMouseLeaveHandler}
          >
            <div className="">
              <AiOutlineQuestionCircle size={20} />
            </div>
            {longTooltipStatus == 3 && (
              <div
                role="tooltip"
                className={`absolute -left-52 -top-120px z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out`}
              >
                <p className="pb-1 text-sm font-medium text-white">
                  {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP_HINT')}
                </p>
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );

  // ----------short area----------
  const displayedRequiredMarginShortStyle = (
    <>
      <div
        className={`${isDisplayedMarginShortStyle} ${isDisplayedMarginShortSize} mt-1 text-base`}
      >
        {requiredMarginShortRef.current?.toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE,
          FRACTION_DIGITS
        )}{' '}
        {unitAsset}
      </div>
      <div className={`${isDisplayedMarginShortWarning} ml-3 text-xs text-lightRed`}>
        * {t('TRADE_PAGE.TRADE_TAB_NOT_ENOUGH_MARGIN')}
      </div>
    </>
  );

  const shortGuaranteedStopChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortGuaranteedStopChecked(e.target.checked);
  };

  const displayedShortTpSetting = (
    <div className={isDisplayedShortTpSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={shortTpUpperLimitRef.current}
        inputValueFromParent={shortTpValue}
        setInputValueFromParent={setShortTpValue}
        getInputValue={getShortTpValue}
        inputInitialValue={shortTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="shortTpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedExpectedShortProfit = (
    <div
      className={`${
        shortTpToggle ? `mb-5 translate-y-2` : `invisible translate-y-0`
      } -mt-5 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')}: {estimatedShortProfitValueRef.current.symbol}{' '}
        ${' '}
        {roundToDecimalPlaces(
          Math.abs(estimatedShortProfitValueRef.current.number),
          2
        ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedShortSlSetting = (
    <div className={isDisplayedShortSlSetting}>
      <TradingInput
        lowerLimit={shortSlLowerLimitRef.current}
        upperLimit={shortSlUpperLimitRef.current}
        inputInitialValue={shortSlValue}
        inputValueFromParent={shortSlValue}
        setInputValueFromParent={setShortSlValue}
        getInputValue={getShortSlValue}
        inputPlaceholder="stop-loss setting"
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedExpectedShortLoss = (
    <div
      className={`${
        shortSlToggle ? `mb-0 translate-y-2` : `invisible translate-y-0`
      } -mt-0 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')}: {estimatedShortLossValueRef.current.symbol} ${' '}
        {roundToDecimalPlaces(
          Math.abs(estimatedShortLossValueRef.current.number),
          2
        ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const shortGuaranteedStop = (
    <div
      className={`${
        shortSlToggle ? `translate-y-5` : `invisible translate-y-0`
      } mb-10 mt-0 items-center transition-all`}
    >
      <div className="mt-0 flex items-center">
        <input
          type="checkbox"
          value=""
          onChange={shortGuaranteedStopChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
        />
        <label className="ml-2 flex text-sm font-medium text-lightGray">
          {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP')} &nbsp;
          <span className="text-lightWhite">
            {' '}
            ({t('TRADE_PAGE.TRADE_TAB_FEE')}:{' '}
            {guaranteedStopFeeShortRef.current?.toLocaleString(
              UNIVERSAL_NUMBER_FORMAT_LOCALE,
              FRACTION_DIGITS
            )}{' '}
            {unitAsset})
          </span>
          {/* tooltip */}
          <div className="ml-1">
            <div
              className="relative"
              onMouseEnter={shortToolMouseEnterHandler}
              onMouseLeave={shortToolMouseLeaveHandler}
            >
              <div className="">
                <AiOutlineQuestionCircle size={20} />
              </div>
              {shortTooltipStatus == 3 && (
                <div
                  role="tooltip"
                  className="absolute -left-52 -top-120px z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
                >
                  <p className="pb-1 text-sm font-medium text-white">
                    {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP_HINT')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div
      className={`pointer-events-none fixed right-0 top-82px z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
    >
      <div className="relative mx-auto my-6 w-auto max-w-xl">
        {' '}
        <div className={`relative`}>
          {/* ---sidebar self--- */}
          <div
            className={`pointer-events-auto ${tabBodyWidth} h-screen overflow-y-auto bg-darkGray p-5 text-white transition-all duration-300`}
          >
            {/* <h1 className="pl-5 text-2xl font-bold">Start to trade</h1> */}

            {/* ---target input area--- */}
            {displayedTargetAmountSetting}

            {/* ---universal trading info area--- */}
            <div className="mt-2 text-lightGray">
              <div className="flex justify-center text-xs">{ticker}</div>
              <div className="mt-2">
                <div className="flex justify-center text-sm">
                  {t('TRADE_PAGE.TRADE_TAB_LEVERAGE')}
                </div>
                <div className="flex justify-center text-base text-lightWhite">1:{leverage}</div>
              </div>
            </div>

            {/* ---Long Section--- */}
            <div className="">
              {/* ---custom trading info area--- */}
              <div className="mt-2 flex justify-center text-center text-base tracking-normal">
                <div className="w-1/2 space-y-1">
                  <div className="text-sm text-lightGray">
                    {t('TRADE_PAGE.TRADE_TAB_REQUIRED_MARGIN')}
                  </div>
                  {displayedRequiredMarginLongStyle}
                </div>
                {/* Left Divider */}
                <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

                <div className="w-1/2 space-y-1">
                  <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
                  <div className={`text-base text-lightWhite ${isDisplayedValueLongSize}`}>
                    {valueOfPositionLongRef.current?.toLocaleString(
                      UNIVERSAL_NUMBER_FORMAT_LOCALE,
                      FRACTION_DIGITS
                    )}{' '}
                    {unitAsset}
                  </div>
                </div>
              </div>

              <div className="">
                {/* Take Profit Setting */}
                <div className="h-60px">
                  <div className="mb-5 mt-3 flex h-25px items-center justify-between">
                    <div className="text-sm text-lightGray">
                      {t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}
                    </div>
                    {displayedLongTpSetting}
                    <Toggle getToggledState={getToggledLongTpSetting} />
                  </div>

                  {displayedExpectedLongProfit}
                </div>

                {/* Stop Loss Setting */}
                <div>
                  <div className="flex h-25px items-center justify-between">
                    <div className="text-sm text-lightGray">
                      {t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}
                    </div>
                    <div className="w-105px">{displayedLongSlSetting}</div>
                    <Toggle getToggledState={getToggledLongSlSetting} />
                  </div>

                  {displayedExpectedLongLoss}

                  {/* Guaranteed stop */}
                  {longGuaranteedStop}
                </div>
              </div>

              {/* Long Button */}
              <div className="flex justify-center">
                <RippleButton
                  disabled={marginWarningLongRef.current || longBtnDisabledRef.current}
                  onClick={longOrderSubmitHandler}
                  buttonType="button"
                  className="w-125px rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray"
                >
                  <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
                  <span className="whitespace-nowrap">
                    ₮{' '}
                    {Number(longPriceRef.current).toLocaleString(
                      UNIVERSAL_NUMBER_FORMAT_LOCALE,
                      FRACTION_DIGITS
                    )}
                  </span>
                </RippleButton>
              </div>
            </div>

            {/* Divider: border-bottom */}
            <div className="mt-3 border-b-1px border-lightGray"></div>

            {/* Divider between long and short */}
            {/* <span
                className={`${isDisplayedDividerSpacing} absolute top-420px my-auto h-px w-7/8 rounded bg-white/50`}
              ></span> */}

            {/* ---Short Section--- */}
            <div className="pb-24">
              {/* ---custom trading info--- */}
              <div className="mt-5 flex justify-center text-center text-base tracking-normal">
                <div className="w-1/2 space-y-1">
                  <div className="text-sm text-lightGray">
                    {t('TRADE_PAGE.TRADE_TAB_REQUIRED_MARGIN')}
                  </div>
                  {displayedRequiredMarginShortStyle}
                </div>
                {/* Left Divider */}
                <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

                <div className="w-1/2 space-y-1">
                  <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
                  <div className={`text-base text-lightWhite ${isDisplayedValueShortSize}`}>
                    {valueOfPositionShortRef.current?.toLocaleString(
                      UNIVERSAL_NUMBER_FORMAT_LOCALE,
                      FRACTION_DIGITS
                    )}{' '}
                    {unitAsset}
                  </div>
                </div>
              </div>

              <div className="">
                {/* Take Profit Setting */}
                <div className="h-60px">
                  <div className="mb-5 mt-3 flex h-25px items-center justify-between">
                    <div className="text-sm text-lightGray">
                      {t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}
                    </div>
                    {displayedShortTpSetting} <Toggle getToggledState={getToggledShortTpSetting} />
                  </div>

                  {displayedExpectedShortProfit}
                </div>

                {/* Stop Loss Setting */}
                <div>
                  <div className="flex h-25px items-center justify-between">
                    <div className="text-sm text-lightGray">
                      {t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}
                    </div>
                    <div className="w-105px">{displayedShortSlSetting}</div>

                    <Toggle getToggledState={getToggledShortSlSetting} />
                  </div>

                  {displayedExpectedShortLoss}

                  {/* Guaranteed stop */}
                  {shortGuaranteedStop}
                </div>
              </div>

              {/* Short Button */}
              <div className="flex justify-center">
                <RippleButton
                  disabled={marginWarningShortRef.current || shortBtnDisabledRef.current}
                  onClick={shortOrderSubmitHandler}
                  buttonType="button"
                  className="w-125px rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray"
                >
                  <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
                  <span className="whitespace-nowrap">
                    ₮{' '}
                    {Number(shortPriceRef.current).toLocaleString(
                      UNIVERSAL_NUMBER_FORMAT_LOCALE,
                      FRACTION_DIGITS
                    )}
                  </span>
                </RippleButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeTab;

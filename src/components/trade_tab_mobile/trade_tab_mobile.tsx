import React, {useState, useContext, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import {useGlobal} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ImCross} from 'react-icons/im';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import UserOverview from '../user_overview/user_overview';
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
  SUGGEST_SL,
  SUGGEST_TP,
  LIQUIDATION_FIVE_LEVERAGE,
  FRACTION_DIGITS,
  TP_SL_LIMIT_RATIO,
  DEFAULT_TICKER,
  DEFAULT_CURRENCY,
  CFD_LIQUIDATION_TIME,
  TARGET_MIN_DIGITS,
} from '../../constants/config';
import {ClickEvent} from '../../constants/tidebit_event';
import {useTranslation} from 'next-i18next';
import {
  getEstimatedPnL,
  getTimestamp,
  roundToDecimalPlaces,
  validateAllInput,
} from '../../lib/common';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {OrderType} from '../../constants/order_type';
import {CFDOperation} from '../../constants/cfd_order_type';
import {TypeOfValidation} from '../../constants/validation';
import SafeMath from '../../lib/safe_math';

type TranslateFunction = (s: string) => string;

const TradeTabMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const tickerStaticStatistics = marketCtx.tickerStatic;

  const initialState = {
    number: 0,
    symbol: '',
  };

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
    roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.plus(1, SafeMath.div(SUGGEST_TP, leverage))),
      2
    )
  );
  const [longSlValue, setLongSlValue, longSlValueRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.minus(1, SafeMath.div(SUGGEST_SL, leverage))),
      2
    )
  );
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue, shortTpValueRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(shortPriceRef.current, SafeMath.minus(1, SafeMath.div(SUGGEST_TP, leverage))),
      2
    )
  );
  const [shortSlValue, setShortSlValue, shortSlValueRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(shortPriceRef.current, SafeMath.plus(1, SafeMath.div(SUGGEST_SL, leverage))),
      2
    )
  );
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [activeTab, setActiveTab] = useState('Long');
  const [openSubMenu, setOpenSubMenu] = useState(false);

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
    roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(targetInputValue, longPriceRef.current), leverage),
      2
    )
  );
  const [valueOfPositionLong, setValueOfPositionLong, valueOfPositionLongRef] = useStateRef(
    roundToDecimalPlaces(+SafeMath.mult(targetInputValue, longPriceRef.current), 2)
  );

  const [requiredMarginShort, setRequiredMarginShort, requiredMarginShortRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(targetInputValue, shortPriceRef.current), leverage),
      2
    )
  );
  const [valueOfPositionShort, setValueOfPositionShort, valueOfPositionShortRef] = useStateRef(
    roundToDecimalPlaces(+SafeMath.mult(targetInputValue, shortPriceRef.current), 2)
  );

  const [marginWarningLong, setMarginWarningLong, marginWarningLongRef] = useStateRef(false);
  const [marginWarningShort, setMarginWarningShort, marginWarningShortRef] = useStateRef(false);

  const [longBtnDisabled, setLongBtnDisabled, longBtnDisabledRef] = useStateRef(false);
  const [shortBtnDisabled, setShortBtnDisabled, shortBtnDisabledRef] = useStateRef(false);

  const [targetLengthLong, setTargetLengthLong] = useState(
    roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(targetInputValue, longPriceRef.current), leverage),
      2
    ).toString().length
  );
  const [targetLengthShort, setTargetLengthShort] = useState(
    roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(targetInputValue, shortPriceRef.current), leverage),
      2
    ).toString().length
  );

  const [valueOfPositionLengthLong, setValueOfPositionLengthLong] = useState(
    roundToDecimalPlaces(+SafeMath.mult(targetInputValue, longPriceRef.current), 2).toString()
      .length
  );
  const [valueOfPositionLengthShort, setValueOfPositionLengthShort] = useState(
    roundToDecimalPlaces(+SafeMath.mult(targetInputValue, shortPriceRef.current), 2).toString()
      .length
  );

  const [guaranteedStopFeeLong, setGuaranteedStopFeeLong, guaranteedStopFeeLongRef] = useStateRef(
    +SafeMath.mult(gsl ?? 0, valueOfPositionLongRef.current)
  );
  const [guaranteedStopFeeShort, setGuaranteedStopFeeShort, guaranteedStopFeeShortRef] =
    useStateRef(+SafeMath.mult(gsl ?? 0, valueOfPositionShortRef.current));

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

  const [isTyping, setIsTyping, isTypingRef] = useStateRef({
    longTp: false,
    longSl: false,
    shortTp: false,
    shortSl: false,
  });

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
    if (
      !isTypingRef.current.longSl &&
      !isTypingRef.current.shortSl &&
      !isTypingRef.current.longTp &&
      !isTypingRef.current.shortTp
    ) {
      checkTpSlWithinBounds();
    }

    renewPosition();
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

  const handleTypingStatusChangeRouter = (typingStatus: boolean) => {
    const longTp = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        longTp: typingStatus,
      }));
    };

    const longSl = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        longSl: typingStatus,
      }));
    };

    const shortTp = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        shortTp: typingStatus,
      }));
    };

    const shortSl = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        shortSl: typingStatus,
      }));
    };

    return {
      longTp,
      longSl,
      shortTp,
      shortSl,
    };
  };

  const handleTypingStatusChange = handleTypingStatusChangeRouter(false);

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
          spotPrice: marketCtx.selectedTicker?.price ?? 0,
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
          spotPrice: marketCtx.selectedTicker?.price ?? 0,
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
        spotPrice: marketCtx.selectedTicker?.price ?? 0,
        deadline: DEFAULT_EXPIRY_DATE,
        signature: '0x',
      };

      const sellQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.instId ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
        typeOfPosition: TypeOfPosition.SELL,
        unitAsset: unitAsset,
        price: shortPriceRef.current,
        spotPrice: marketCtx.selectedTicker?.price ?? 0,
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
      +SafeMath.mult(longPriceRef.current, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
      2
    );
    const shortTpUpperBound = roundToDecimalPlaces(
      +SafeMath.mult(shortPriceRef.current, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
      2
    );

    const longSlLowerBound = roundToDecimalPlaces(
      +SafeMath.mult(
        longPriceRef.current,
        SafeMath.mult(
          SafeMath.minus(1, LIQUIDATION_FIVE_LEVERAGE),
          SafeMath.plus(1, TP_SL_LIMIT_RATIO)
        )
      ),
      2
    );

    const shortSlUpperBound = roundToDecimalPlaces(
      +SafeMath.mult(
        shortPriceRef.current,
        SafeMath.mult(
          SafeMath.plus(1, LIQUIDATION_FIVE_LEVERAGE),
          SafeMath.minus(1, TP_SL_LIMIT_RATIO)
        )
      ),
      2
    );

    const longSlUpperBound = roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
      2
    );

    const shortSlLowerBound = roundToDecimalPlaces(
      +SafeMath.mult(shortPriceRef.current, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
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

    setLongTpSuggestion(
      roundToDecimalPlaces(+SafeMath.mult(longPriceRef.current, SafeMath.plus(1, tpTimes)), 2)
    );
    setLongSlSuggestion(
      roundToDecimalPlaces(+SafeMath.mult(longPriceRef.current, SafeMath.minus(1, slTimes)), 2)
    );
    setShortTpSuggestion(
      roundToDecimalPlaces(+SafeMath.mult(shortPriceRef.current, SafeMath.minus(1, tpTimes)), 2)
    );
    setShortSlSuggestion(
      roundToDecimalPlaces(+SafeMath.mult(shortPriceRef.current, SafeMath.plus(1, slTimes)), 2)
    );
  };

  // Info: suggest the tp / sl in the beginning (20230329 - Shirley)
  const setSuggestions = () => {
    setLongTpValue(longTpSuggestionRef.current);
    setLongSlValue(longSlSuggestionRef.current);
    setShortTpValue(shortTpSuggestionRef.current);
    setShortSlValue(shortSlSuggestionRef.current);
  };

  // Info: renew the value of position when target input changed (20230328 - Shirley)
  const renewPosition = () => {
    // Long
    const newLongValue = +SafeMath.mult(targetInputValueRef.current, longPriceRef.current);

    const roundedLongValue = roundToDecimalPlaces(newLongValue, 2);
    setValueOfPositionLong(roundedLongValue);

    const marginLong = +SafeMath.div(newLongValue, leverage);
    const roundedMarginLong = roundToDecimalPlaces(marginLong, 2);
    setRequiredMarginLong(roundedMarginLong);

    setMarginWarningLong(SafeMath.gt(marginLong, availableBalance));

    setTargetLengthLong(roundedMarginLong.toString().length);
    setValueOfPositionLengthLong(roundedLongValue.toString().length);

    calculateLongProfit();
    calculateLongLoss();

    setGuaranteedStopFeeLong(
      roundToDecimalPlaces(+SafeMath.mult(gsl ?? 0, valueOfPositionLongRef.current), 2)
    );

    // Short
    const newShortValue = +SafeMath.mult(targetInputValueRef.current, shortPriceRef.current);

    const roundedShortValue = roundToDecimalPlaces(newShortValue, 2);
    setValueOfPositionShort(roundedShortValue);

    const marginShort = +SafeMath.div(newShortValue, leverage);
    const roundedMarginShort = roundToDecimalPlaces(marginShort, 2);
    setRequiredMarginShort(roundedMarginShort);

    setMarginWarningShort(SafeMath.gt(marginShort, availableBalance));

    setTargetLengthShort(roundedMarginShort.toString().length);
    setValueOfPositionLengthShort(roundedShortValue.toString().length);

    calculateShortProfit();
    calculateShortLoss();

    setGuaranteedStopFeeShort(
      roundToDecimalPlaces(+SafeMath.mult(gsl ?? 0, valueOfPositionShortRef.current), 2)
    );
  };

  const targetAmountDetection = (value?: number) => {
    renewPosition();
  };

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
      liquidationPrice: roundToDecimalPlaces(
        +SafeMath.mult(long.price, SafeMath.minus(1, LIQUIDATION_FIVE_LEVERAGE)),
        2
      ),
      fee: feePercent,
      guaranteedStop: longSlToggle ? longGuaranteedStopChecked : false,
      guaranteedStopFee:
        longSlToggle && longGuaranteedStopChecked ? guaranteedStopFeeLongRef.current : 0,
      takeProfit: longTpToggle ? longTpValue : undefined,
      stopLoss: longSlToggle ? longSlValue : undefined,
    };

    const shortOrder: IApplyCreateCFDOrder = {
      ...share,
      orderType: OrderType.CFD,
      operation: CFDOperation.CREATE,
      typeOfPosition: TypeOfPosition.SELL,
      quotation: short,
      price: short.price,
      liquidationPrice: roundToDecimalPlaces(
        +SafeMath.mult(short.price, SafeMath.plus(1, LIQUIDATION_FIVE_LEVERAGE)),
        2
      ),
      fee: feePercent,
      guaranteedStop: shortSlToggle ? shortGuaranteedStopChecked : false,
      guaranteedStopFee:
        shortSlToggle && shortGuaranteedStopChecked ? guaranteedStopFeeShortRef.current : 0,
      takeProfit: shortTpToggle ? shortTpValue : undefined,
      stopLoss: shortSlToggle ? shortSlValue : undefined,
    };

    return {longOrder, shortOrder};
  };

  const longToolMouseEnterHandler = () => setLongTooltipStatus(3);
  const longToolMouseLeaveHandler = () => setLongTooltipStatus(0);

  const shortToolMouseEnterHandler = () => setShortTooltipStatus(3);
  const shortToolMouseLeaveHandler = () => setShortTooltipStatus(0);

  const longSectionClickHandler = async () => {
    setActiveTab('Long');
    const {longOrder} = await toApplyCreateOrder();

    if (!openSubMenu) {
      setOpenSubMenu(true);
    } else {
      {
        globalCtx.dataPositionOpenModalHandler({
          openCfdRequest: longOrder,
        });
        globalCtx.visiblePositionOpenModalHandler();
        return;
      }
    }
  };

  const shortSectionClickHandler = async () => {
    setActiveTab('Short');
    const {shortOrder} = await toApplyCreateOrder();

    if (!openSubMenu) {
      setOpenSubMenu(true);
    } else {
      {
        globalCtx.dataPositionOpenModalHandler({
          openCfdRequest: shortOrder,
        });
        globalCtx.visiblePositionOpenModalHandler();
        return;
      }
    }
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

  // ----------Target area----------
  const displayedTargetSetting = (
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
      <div className={`${isDisplayedMarginLongStyle} ${isDisplayedMarginLongSize} mt-1 text-base`}>
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
    <div className={isDisplayedLongTpSetting}>
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
        onTypingStatusChange={handleTypingStatusChange.longTp}
      />
    </div>
  );

  const displayedExpectedLongProfit = (
    <div className={`${longTpToggle ? `translate-y-2` : `invisible translate-y-0`} transition-all`}>
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')} {estimatedLongProfitValueRef.current.symbol}
        {roundToDecimalPlaces(
          Math.abs(estimatedLongProfitValueRef.current.number),
          2
        ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedLongSlSetting = (
    <div className={isDisplayedLongSlSetting}>
      <TradingInput
        lowerLimit={longSlLowerLimitRef.current}
        upperLimit={longSlUpperLimitRef.current}
        inputInitialValue={longSlValue}
        inputValueFromParent={longSlValue}
        setInputValueFromParent={setLongSlValue}
        getInputValue={getLongSlValue}
        inputPlaceholder="stop-loss setting"
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
        onTypingStatusChange={handleTypingStatusChange.longSl}
      />
    </div>
  );

  const displayedExpectedLongLoss = (
    <div
      className={`${longSlToggle ? `translate-y-0` : `invisible -translate-y-2`} transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')} {estimatedLongLossValueRef.current.symbol}
        {roundToDecimalPlaces(Math.abs(estimatedLongLossValueRef.current.number), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE,
          FRACTION_DIGITS
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const longGuaranteedStop = (
    <div className={`${isDisplayedLongSlSetting}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          value=""
          onChange={longGuaranteedStopChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
        />
        <label className="ml-2 flex text-sm font-medium text-lightGray">
          {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP')} &nbsp;
          <span className="text-lightWhite">
            ({t('TRADE_PAGE.TRADE_TAB_FEE')}{' '}
            {guaranteedStopFeeLongRef.current?.toLocaleString(
              UNIVERSAL_NUMBER_FORMAT_LOCALE,
              FRACTION_DIGITS
            )}{' '}
            {unitAsset})
          </span>
          {/* tooltip */}
          <div className="ml-2">
            <div
              className="relative"
              onMouseEnter={longToolMouseEnterHandler}
              onMouseLeave={longToolMouseLeaveHandler}
            >
              <div className="cursor-pointer">
                <AiOutlineQuestionCircle size={20} />
              </div>
              {longTooltipStatus == 3 && (
                <div
                  role="tooltip"
                  className="absolute -left-52 -top-120px z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
                >
                  <p className="pb-1 text-sm font-medium text-white">
                    {t('TRADE_PAGE.GUARANTEED_STOP_HINT')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );

  const longSetting = (
    <div
      className={`${
        activeTab === 'Long' ? 'flex' : 'hidden'
      } w-full flex-col items-center justify-center space-y-5`}
    >
      {/* Take Profit Setting */}
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}</div>
          {displayedLongTpSetting}
          <Toggle initialToggleState={longTpToggle} getToggledState={getToggledLongTpSetting} />
        </div>
        <div className="mb-5 mt-2 h-4 w-full">{displayedExpectedLongProfit}</div>
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center space-y-5">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}</div>
          {displayedLongSlSetting}
          <Toggle initialToggleState={longSlToggle} getToggledState={getToggledLongSlSetting} />
        </div>
        <div className="w-full">{displayedExpectedLongLoss}</div>

        {/* Guaranteed stop */}
        {longGuaranteedStop}
      </div>
    </div>
  );

  // ----------short area----------
  const displayedRequiredMarginShortStyle = (
    <>
      <div
        className={`${isDisplayedMarginShortStyle} ${isDisplayedMarginShortSize} mt-1 text-base`}
      >
        {' '}
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
        inputInitialValue={shortTpValue}
        inputValueFromParent={shortTpValue}
        setInputValueFromParent={setShortTpValue}
        getInputValue={getShortTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="tpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
        onTypingStatusChange={handleTypingStatusChange.shortTp}
      />
    </div>
  );

  const displayedExpectedShortProfit = (
    <div
      className={`${shortTpToggle ? `translate-y-2` : `invisible translate-y-0`} transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')} {estimatedShortProfitValueRef.current.symbol}
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
        onTypingStatusChange={handleTypingStatusChange.shortSl}
      />
    </div>
  );

  const displayedExpectedShortLoss = (
    <div
      className={`${
        shortSlToggle ? `translate-y-0` : `invisible -translate-y-2`
      } -mt-0 items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')} {estimatedShortLossValueRef.current.symbol}
        {roundToDecimalPlaces(
          Math.abs(estimatedShortLossValueRef.current.number),
          2
        ).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const shortGuaranteedStop = (
    <div className={isDisplayedShortSlSetting}>
      <div className="flex items-center">
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
            ({t('TRADE_PAGE.TRADE_TAB_FEE')}{' '}
            {guaranteedStopFeeShortRef.current?.toLocaleString(
              UNIVERSAL_NUMBER_FORMAT_LOCALE,
              FRACTION_DIGITS
            )}{' '}
            {unitAsset})
          </span>
          {/* tooltip */}
          <div className="ml-2">
            <div
              className="relative"
              onMouseEnter={shortToolMouseEnterHandler}
              onMouseLeave={shortToolMouseLeaveHandler}
            >
              <div className="cursor-pointer">
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

  const shortSetting = (
    <div
      className={`${
        activeTab === 'Short' ? 'flex' : 'hidden'
      } w-full flex-col items-center justify-center space-y-5`}
    >
      {/* Take Profit Setting */}
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}</div>
          {displayedShortTpSetting}
          <Toggle initialToggleState={shortTpToggle} getToggledState={getToggledShortTpSetting} />
        </div>
        <div className="mb-5 mt-2 h-4 w-full">{displayedExpectedShortProfit}</div>
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center space-y-5">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}</div>
          {displayedShortSlSetting}
          <Toggle initialToggleState={shortSlToggle} getToggledState={getToggledShortSlSetting} />
        </div>
        <div className="w-full">{displayedExpectedShortLoss}</div>

        {/* Guaranteed stop */}
        {shortGuaranteedStop}
      </div>
    </div>
  );

  const longButtonStyles =
    activeTab === 'Long' && openSubMenu
      ? 'z-20 w-320px -translate-x-16 absolute left-0'
      : 'w-120px translate-x-0 relative';

  const shortButtonStyles =
    activeTab === 'Short' && openSubMenu
      ? 'z-20 w-320px ml-0 -translate-x-16 absolute left-0 '
      : 'ml-4 w-120px translate-x-0 relative';

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center overflow-x-hidden overflow-y-hidden bg-darkGray ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-36 transition-all duration-150`}
    >
      <div className="flex self-end px-30px py-20px">
        <ImCross onClick={() => setOpenSubMenu(false)} className="z-20 cursor-pointer" />
      </div>

      {/* ---------- margin setting ---------- */}
      <div className="w-screen overflow-y-auto overflow-x-hidden px-8 sm:w-1/2">
        <div className="flex flex-col items-center justify-between space-y-7">
          <div className="flex w-full items-center justify-center">
            <UserOverview
              depositAvailable={userCtx.userAssets?.balance?.available ?? 0}
              marginLocked={userCtx.userAssets?.balance?.locked ?? 0}
              profitOrLossAmount={userCtx.userAssets?.pnl?.cumulative?.amount?.value ?? 0}
            />
          </div>
          <div className="flex w-full items-center justify-center">{displayedTargetSetting}</div>

          {/* ---universal trading info area--- */}
          <div className="flex w-full flex-col items-center justify-center text-lightGray">
            <div className="flex justify-center text-sm">{ticker}</div>
            <div className="mt-2 flex flex-col items-center justify-center space-y-2">
              <div className="text-sm">{t('TRADE_PAGE.TRADE_TAB_LEVERAGE')}</div>
              <div className="text-base text-lightWhite">1:{leverage}</div>
            </div>
          </div>

          {/* ---custom trading info area--- */}
          <div className="flex w-full justify-center text-center text-base tracking-wide">
            <div className="w-1/2">
              <div className="text-sm text-lightGray">
                {t('TRADE_PAGE.TRADE_TAB_REQUIRED_MARGIN')}
              </div>
              {activeTab === 'Long'
                ? displayedRequiredMarginLongStyle
                : displayedRequiredMarginShortStyle}
            </div>

            <div>
              <span className="mx-5 inline-block h-14 w-px rounded bg-lightGray/50"></span>
            </div>

            <div className="w-1/2">
              <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
              {activeTab === 'Long' ? (
                <div className={`text-base text-lightWhite ${isDisplayedValueLongSize}`}>
                  {valueOfPositionLongRef.current?.toLocaleString(
                    UNIVERSAL_NUMBER_FORMAT_LOCALE,
                    FRACTION_DIGITS
                  )}{' '}
                  {unitAsset}
                </div>
              ) : (
                <div className={`text-base text-lightWhite ${isDisplayedValueShortSize}`}>
                  {valueOfPositionShortRef.current?.toLocaleString(
                    UNIVERSAL_NUMBER_FORMAT_LOCALE,
                    FRACTION_DIGITS
                  )}{' '}
                  {unitAsset}
                </div>
              )}
            </div>
          </div>
          {longSetting}
          {shortSetting}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative flex items-center">
        {/* Long Button */}
        <div
          className={`min-w-120px bg-black/100 transition-all duration-300 ease-in-out ${longButtonStyles}`}
        >
          <RippleButton
            disabled={(openSubMenu && marginWarningLongRef.current) || longBtnDisabledRef.current}
            buttonType="button"
            className={`w-full rounded-md bg-lightGreen5 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray`}
            onClick={longSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
            <p className="text-xs">
              ₮{' '}
              {Number(longPriceRef.current).toLocaleString(
                UNIVERSAL_NUMBER_FORMAT_LOCALE,
                FRACTION_DIGITS
              )}
            </p>
          </RippleButton>
        </div>

        {/* Short Button */}
        <div
          className={`min-w-120px bg-black/100 transition-all duration-300 ease-in-out ${shortButtonStyles}`}
        >
          <RippleButton
            disabled={(openSubMenu && marginWarningShortRef.current) || shortBtnDisabledRef.current}
            buttonType="button"
            className={`w-full rounded-md bg-lightRed py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray`}
            onClick={shortSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
            <p className="text-xs">
              ₮{' '}
              {Number(shortPriceRef.current).toLocaleString(
                UNIVERSAL_NUMBER_FORMAT_LOCALE,
                FRACTION_DIGITS
              )}
            </p>
          </RippleButton>
        </div>
      </div>
      {subMenu}
    </>
  );
};

export default TradeTabMobile;

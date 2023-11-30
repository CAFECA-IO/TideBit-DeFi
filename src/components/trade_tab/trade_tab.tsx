import React, {useContext, useEffect, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import Tooltip from '../tooltip/tooltip';
import RippleButton from '../ripple_button/ripple_button';
import {
  DEFAULT_BUY_PRICE,
  DEFAULT_EXPIRY_DATE,
  DEFAULT_FEE,
  DEFAULT_LEVERAGE,
  DEFAULT_SELL_PRICE,
  DEFAULT_USER_BALANCE,
  TOAST_DURATION_SECONDS,
} from '../../constants/display';
import {
  TARGET_MAX_DIGITS,
  unitAsset,
  SUGGEST_TP,
  SUGGEST_SL,
  LIQUIDATION_PERCENTAGE,
  TP_SL_LIMIT_RATIO,
  DEFAULT_INSTID,
  DEFAULT_CURRENCY,
  CFD_LIQUIDATION_TIME,
  TARGET_MIN_DIGITS,
  DEFAULT_GUARANTEED_STOP_FEE,
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
  numberFormatted,
  roundToDecimalPlaces,
  validateAllInput,
  validateNumberFormat,
} from '../../lib/common';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {useTranslation} from 'next-i18next';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {CFDOperation} from '../../constants/cfd_order_type';
import {TypeOfValidation} from '../../constants/validation';
import SafeMath from '../../lib/safe_math';
import {LayoutAssertion} from '../../constants/layout_assertion';
import UserOverview from '../user_overview/user_overview';
import {ImCross} from 'react-icons/im';
import {RoundCondition} from '../../interfaces/tidebit_defi_background/round_condition';
import {ToastTypeAndText} from '../../constants/toast_type';
import {ToastId} from '../../constants/toast_id';
import {Code} from '../../constants/code';
import {TickerContext} from '../../contexts/ticker_context';

type TranslateFunction = (s: string) => string;

const TradeTab = ({rightPosition}: {rightPosition: string}) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const tickerCtx = useContext(TickerContext);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const initialState = {
    number: 0,
    symbol: '',
  };

  const tickerStaticStatistics = marketCtx.tickerStatic;

  const ticker = marketCtx.selectedTickerProperty?.instId ?? '';
  const availableBalance = userCtx.userAssets?.balance?.available ?? DEFAULT_USER_BALANCE;

  const leverage = tickerStaticStatistics?.leverage ?? DEFAULT_LEVERAGE;
  const gsl = marketCtx?.guaranteedStopFeePercentage ?? DEFAULT_GUARANTEED_STOP_FEE;
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longPrice, setLongPrice, longPriceRef] = useStateRef(DEFAULT_BUY_PRICE); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortPrice, setShortPrice, shortPriceRef] = useStateRef(DEFAULT_SELL_PRICE);

  const [targetInputValue, setTargetInputValue, targetInputValueRef] = useStateRef(0.02);

  const [longTpValue, setLongTpValue, longTpValueRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.plus(1, SafeMath.div(SUGGEST_TP, leverage))),
      2,
      RoundCondition.SHRINK
    )
  );
  const [longSlValue, setLongSlValue, longSlValueRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.minus(1, SafeMath.div(SUGGEST_SL, leverage))),
      2,
      RoundCondition.SHRINK
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimatedLongProfitValue, setEstimatedLongProfitValue, estimatedLongProfitValueRef] =
    useStateRef(initialState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimatedLongLossValue, setEstimatedLongLossValue, estimatedLongLossValueRef] =
    useStateRef(initialState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimatedShortProfitValue, setEstimatedShortProfitValue, estimatedShortProfitValueRef] =
    useStateRef(initialState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimatedShortLossValue, setEstimatedShortLossValue, estimatedShortLossValueRef] =
    useStateRef(initialState);

  const [longGuaranteedStopChecked, setLongGuaranteedStopChecked, longGuaranteedStopCheckedRef] =
    useStateRef(false);
  const [shortGuaranteedStopChecked, setShortGuaranteedStopChecked, shortGuaranteedStopCheckedRef] =
    useStateRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [requiredMarginLong, setRequiredMarginLong, requiredMarginLongRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(targetInputValue, longPriceRef.current), leverage),
      2
    )
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [valueOfPositionLong, setValueOfPositionLong, valueOfPositionLongRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(targetInputValue, longPriceRef.current),
      2,
      RoundCondition.SHRINK
    )
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [requiredMarginShort, setRequiredMarginShort, requiredMarginShortRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.div(SafeMath.mult(targetInputValue, shortPriceRef.current), leverage),
      2
    )
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [valueOfPositionShort, setValueOfPositionShort, valueOfPositionShortRef] = useStateRef(
    roundToDecimalPlaces(
      +SafeMath.mult(targetInputValue, shortPriceRef.current),
      2,
      RoundCondition.SHRINK
    )
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [marginWarningLong, setMarginWarningLong, marginWarningLongRef] = useStateRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [marginWarningShort, setMarginWarningShort, marginWarningShortRef] = useStateRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longBtnDisabled, setLongBtnDisabled, longBtnDisabledRef] = useStateRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guaranteedStopFeeLong, setGuaranteedStopFeeLong, guaranteedStopFeeLongRef] = useStateRef(
    +SafeMath.mult(gsl, valueOfPositionLongRef.current)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guaranteedStopFeeShort, setGuaranteedStopFeeShort, guaranteedStopFeeShortRef] =
    useStateRef(+SafeMath.mult(gsl, valueOfPositionShortRef.current));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longSlLowerLimit, setLongSlLowerLimit, longSlLowerLimitRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longSlUpperLimit, setLongSlUpperLimit, longSlUpperLimitRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortSlLowerLimit, setShortSlLowerLimit, shortSlLowerLimitRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortSlUpperLimit, setShortSlUpperLimit, shortSlUpperLimitRef] = useStateRef(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longTpLowerLimit, setLongTpLowerLimit, longTpLowerLimitRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortTpUpperLimit, setShortTpUpperLimit, shortTpUpperLimitRef] = useStateRef(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longTpSuggestion, setLongTpSuggestion, longTpSuggestionRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [longSlSuggestion, setLongSlSuggestion, longSlSuggestionRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortTpSuggestion, setShortTpSuggestion, shortTpSuggestionRef] = useStateRef(0); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortSlSuggestion, setShortSlSuggestion, shortSlSuggestionRef] = useStateRef(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTyping, setIsTyping, isTypingRef] = useStateRef({
    target: false,
    longTp: false,
    longSl: false,
    shortTp: false,
    shortSl: false,
  });

  const [isActiveTabLong, setIsActiveTabLong] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(false);

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

    if (!isTypingRef.current.target) {
      checkTargetWithinBounds();
    }

    renewPosition();

    // TODO: FIXME: [To be optimized] May run more than 10 times in a second (20230714 - Shirley)
    if (!longTpToggle && !shortTpToggle) setSuggestions();
  }, [tickerCtx.selectedTicker?.price, isTypingRef.current]);

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
  }, [tickerCtx.selectedTicker]);

  useEffect(() => {
    validateInputs();
  }, [
    longTpValueRef.current,
    longSlValueRef.current,
    shortTpValueRef.current,
    shortSlValueRef.current,
    targetInputValueRef.current,
  ]);

  const handleTypingStatusChangeRouter = () => {
    const target = (typingStatus: boolean) => {
      setIsTyping(prev => ({
        ...prev,
        target: typingStatus,
      }));
    };

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
      target,
      longTp,
      longSl,
      shortTp,
      shortSl,
    };
  };

  const handleTypingStatusChange = handleTypingStatusChangeRouter();

  const setPrice = () => {
    if (marketCtx.selectedTickerProperty?.instId) {
      const buyPrice = roundToDecimalPlaces(
        marketCtx.predictCFDClosePrice(
          marketCtx.selectedTickerProperty?.instId,
          TypeOfPosition.SELL
        ),
        2
      );

      const sellPrice = roundToDecimalPlaces(
        marketCtx.predictCFDClosePrice(
          marketCtx.selectedTickerProperty?.instId,
          TypeOfPosition.BUY
        ),
        2,
        RoundCondition.SHRINK
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
          instId: marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID,
          targetAsset: marketCtx.selectedTickerProperty?.currency ?? DEFAULT_CURRENCY,
          typeOfPosition: TypeOfPosition.BUY,
          unitAsset: unitAsset,
          price: longPriceRef.current,
          spotPrice: tickerCtx.selectedTicker?.price ?? 0,
          spreadFee: longPriceRef.current - (tickerCtx.selectedTicker?.price ?? 0),
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
          instId: marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID,
          targetAsset: marketCtx.selectedTickerProperty?.currency ?? DEFAULT_CURRENCY,
          typeOfPosition: TypeOfPosition.SELL,
          unitAsset: unitAsset,
          price: shortPriceRef.current,
          spotPrice: tickerCtx.selectedTicker?.price ?? 0,
          spreadFee: shortPriceRef.current - (tickerCtx.selectedTicker?.price ?? 0),
          deadline: DEFAULT_EXPIRY_DATE,
          signature: '0x',
        };

        shortQuotation = {...defaultResultFailed, data: sellQuotation};
      }
    } catch (err) {
      notificationCtx.addException('getQuotation trade_tab', err as Error, Code.UNKNOWN_ERROR);
      const buyQuotation: IQuotation = {
        instId: marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID,
        targetAsset: marketCtx.selectedTickerProperty?.currency ?? DEFAULT_CURRENCY,
        typeOfPosition: TypeOfPosition.BUY,
        unitAsset: unitAsset,
        price: longPriceRef.current,
        spotPrice: tickerCtx.selectedTicker?.price ?? 0,
        spreadFee: longPriceRef.current - (tickerCtx.selectedTicker?.price ?? 0),
        deadline: DEFAULT_EXPIRY_DATE,
        signature: '0x',
      };

      const sellQuotation: IQuotation = {
        instId: marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID,
        targetAsset: tickerCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
        typeOfPosition: TypeOfPosition.SELL,
        unitAsset: unitAsset,
        price: shortPriceRef.current,
        spotPrice: tickerCtx.selectedTicker?.price ?? 0,
        spreadFee: shortPriceRef.current - (tickerCtx.selectedTicker?.price ?? 0),
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
    targetAmountDetection();

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

  // Info: 如果 TpSl 不在合理範圍內，則讓按鈕反灰 (20230927 - Shirley)
  const validateInputs = () => {
    const targetInputValid = validateAllInput({
      typeOfValidation: TypeOfValidation.TARGET,
      value: targetInputValueRef.current,
      upperLimit: TARGET_MAX_DIGITS,
      lowerLimit: TARGET_MIN_DIGITS,
    });

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

    if (longTpValid && longSlValid && targetInputValid) {
      setLongBtnDisabled(false);
    } else {
      setLongBtnDisabled(true);
    }

    if (shortTpValid && shortSlValid && targetInputValid) {
      setShortBtnDisabled(false);
    } else {
      setShortBtnDisabled(true);
    }
  };

  // Info: 如果 TpSl 不在合理範圍內，則將其設為推薦值 (20230927 - Shirley)
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

  const checkTargetWithinBounds = () => {
    if (SafeMath.isNumber(targetInputValueRef.current)) {
      if (validateNumberFormat(targetInputValueRef.current)) {
        if (+targetInputValueRef.current > TARGET_MAX_DIGITS) {
          setTargetInputValue(TARGET_MAX_DIGITS);
        }

        if (+targetInputValueRef.current < TARGET_MIN_DIGITS) {
          setTargetInputValue(TARGET_MIN_DIGITS);
        }
      } else {
        setTargetInputValue(prev => roundToDecimalPlaces(prev, 2, RoundCondition.SHRINK));
      }
    } else {
      setTargetInputValue(TARGET_MIN_DIGITS);
    }
  };

  // Info: 設定 TpSl 上下限 (20230927 - Shirley)
  const setTpSlBounds = () => {
    const longTpLowerBound = roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
      2,
      RoundCondition.SHRINK
    );
    const shortTpUpperBound = roundToDecimalPlaces(
      +SafeMath.mult(shortPriceRef.current, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
      2,
      RoundCondition.SHRINK
    );

    const longSlLowerBound = roundToDecimalPlaces(
      +SafeMath.mult(
        longPriceRef.current,
        SafeMath.mult(
          SafeMath.minus(1, LIQUIDATION_PERCENTAGE),
          SafeMath.plus(1, TP_SL_LIMIT_RATIO)
        )
      ),
      2,
      RoundCondition.SHRINK
    );

    const shortSlUpperBound = roundToDecimalPlaces(
      +SafeMath.mult(
        shortPriceRef.current,
        SafeMath.mult(
          SafeMath.plus(1, LIQUIDATION_PERCENTAGE),
          SafeMath.minus(1, TP_SL_LIMIT_RATIO)
        )
      ),
      2,
      RoundCondition.SHRINK
    );

    const longSlUpperBound = roundToDecimalPlaces(
      +SafeMath.mult(longPriceRef.current, SafeMath.minus(1, TP_SL_LIMIT_RATIO)),
      2,
      RoundCondition.SHRINK
    );

    const shortSlLowerBound = roundToDecimalPlaces(
      +SafeMath.mult(shortPriceRef.current, SafeMath.plus(1, TP_SL_LIMIT_RATIO)),
      2,
      RoundCondition.SHRINK
    );

    setLongSlLowerLimit(longSlLowerBound);
    setLongSlUpperLimit(longSlUpperBound); // Info: Open price with buffer (20230428 - Shirley)
    setLongTpLowerLimit(longTpLowerBound); // Info: Open price with buffer (20230428 - Shirley)

    setShortTpUpperLimit(shortTpUpperBound); // Info: Open price with buffer (20230428 - Shirley)
    setShortSlUpperLimit(shortSlUpperBound);
    setShortSlLowerLimit(shortSlLowerBound); // Info: Open price with buffer (20230428 - Shirley)

    updateSuggestions();
  };

  // Info: 更新 TpSl 推薦值 (20230927 - Shirley)
  const updateSuggestions = () => {
    const tpTimes = SUGGEST_TP / leverage;
    const slTimes = SUGGEST_SL / leverage;

    setLongTpSuggestion(
      roundToDecimalPlaces(
        +SafeMath.mult(longPriceRef.current, SafeMath.plus(1, tpTimes)),
        2,
        RoundCondition.SHRINK
      )
    );
    setLongSlSuggestion(
      roundToDecimalPlaces(
        +SafeMath.mult(longPriceRef.current, SafeMath.minus(1, slTimes)),
        2,
        RoundCondition.SHRINK
      )
    );
    setShortTpSuggestion(
      roundToDecimalPlaces(
        +SafeMath.mult(shortPriceRef.current, SafeMath.minus(1, tpTimes)),
        2,
        RoundCondition.SHRINK
      )
    );
    setShortSlSuggestion(
      roundToDecimalPlaces(
        +SafeMath.mult(shortPriceRef.current, SafeMath.plus(1, slTimes)),
        2,
        RoundCondition.SHRINK
      )
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
    // Info: (20230927 - Shirley) Long
    const newLongValue = +SafeMath.mult(targetInputValueRef.current, longPriceRef.current);

    const roundedLongValue = roundToDecimalPlaces(newLongValue, 2, RoundCondition.SHRINK);
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
      roundToDecimalPlaces(+SafeMath.mult(gsl, valueOfPositionLongRef.current), 2)
    );

    const inadequateBalanceForLongGSL = SafeMath.lt(
      availableBalance,
      SafeMath.plus(guaranteedStopFeeLongRef.current, requiredMarginLongRef.current)
    );

    setLongGuaranteedStopChecked(prev => {
      if (prev === true && inadequateBalanceForLongGSL) {
        if (!globalCtx.visiblePositionOpenModal) {
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
        }
        return false;
      } else {
        return prev;
      }
    });

    // Info: (20230927 - Shirley) Short
    const newShortValue = +SafeMath.mult(targetInputValueRef.current, shortPriceRef.current);

    const roundedShortValue = roundToDecimalPlaces(newShortValue, 2, RoundCondition.SHRINK);
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
      roundToDecimalPlaces(+SafeMath.mult(gsl, valueOfPositionShortRef.current), 2)
    );

    const inadequateBalanceForShortGSL = SafeMath.lt(
      availableBalance,
      SafeMath.plus(guaranteedStopFeeShortRef.current, requiredMarginShortRef.current)
    );

    setShortGuaranteedStopChecked(prev => {
      if (prev === true && inadequateBalanceForShortGSL) {
        if (!globalCtx.visiblePositionOpenModal) {
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
        }

        return false;
      } else {
        return prev;
      }
    });
  };

  const targetAmountDetection = () => renewPosition();

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
      marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID
    );

    const feePercent = marketCtx.tickerLiveStatistics?.fee ?? DEFAULT_FEE;

    const long = longQuotation.data as IQuotation;
    const short = shortQuotation.data as IQuotation;

    const share = {
      instId: marketCtx.selectedTickerProperty?.instId ?? DEFAULT_INSTID,
      targetAsset: tickerCtx.selectedTicker?.currency ?? DEFAULT_CURRENCY,
      unitAsset: unitAsset,
      amount: roundToDecimalPlaces(targetInputValueRef.current, 2, RoundCondition.SHRINK),
      leverage: marketCtx.tickerStatic?.leverage ?? DEFAULT_LEVERAGE,

      liquidationTime: getTimestamp() + CFD_LIQUIDATION_TIME,
    };

    const longOrder: IApplyCreateCFDOrder = {
      ...share,
      orderType: OrderType.CFD,
      operation: CFDOperation.CREATE,
      price: long.price,
      margin: {
        asset: unitAsset,
        amount: requiredMarginLongRef.current,
      },
      typeOfPosition: TypeOfPosition.BUY,
      quotation: long,
      liquidationPrice: roundToDecimalPlaces(
        +SafeMath.mult(long.price, SafeMath.minus(1, LIQUIDATION_PERCENTAGE)),
        2,
        RoundCondition.SHRINK
      ),
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
      margin: {
        asset: unitAsset,
        amount: requiredMarginShortRef.current,
      },
      liquidationPrice: roundToDecimalPlaces(
        +SafeMath.mult(short.price, SafeMath.plus(1, LIQUIDATION_PERCENTAGE)),
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
      onTypingStatusChange={handleTypingStatusChange.target}
      inputId="TargetInput"
      decrementBtnId="TargetDecrementButton"
      incrementBtnId="TargetIncrementButton"
    />
  );

  // ----------long area----------
  const displayedRequiredMarginLongStyle = (
    <>
      <div className={`${isDisplayedMarginLongStyle} ${isDisplayedMarginLongSize} my-1 text-base`}>
        {numberFormatted(requiredMarginLongRef.current)} {unitAsset}
      </div>
      <div className={`${isDisplayedMarginLongWarning} ml-3 text-xs text-lightRed`}>
        * {t('TRADE_PAGE.TRADE_TAB_NOT_ENOUGH_MARGIN')}
      </div>
    </>
  );

  const longGuaranteedStopChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inadequateBalanceForLongGSL = SafeMath.lt(
      availableBalance,
      SafeMath.plus(guaranteedStopFeeLongRef.current, requiredMarginLongRef.current)
    );

    if (inadequateBalanceForLongGSL) {
      setLongGuaranteedStopChecked(false);
    } else {
      setLongGuaranteedStopChecked(e.target.checked);
    }
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
        onTypingStatusChange={handleTypingStatusChange.longTp}
        inputId="LongTpInput"
        decrementBtnId="LongTpDecrementButton"
        incrementBtnId="LongTpIncrementButton"
      />
    </div>
  );

  const displayedExpectedLongProfit = (
    <div
      className={`${
        longTpToggle ? `translate-y-2 lg:h-30px` : `invisible translate-y-0`
      }  transition-all duration-150 ease-in-out`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')}: {estimatedLongProfitValueRef.current.symbol}{' '}
        ${' '}
        {numberFormatted(
          roundToDecimalPlaces(
            Math.abs(estimatedLongProfitValueRef.current.number),
            2,
            RoundCondition.SHRINK
          )
        )}{' '}
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
        onTypingStatusChange={handleTypingStatusChange.longSl}
        inputId="LongSlInput"
        decrementBtnId="LongSlDecrementButton"
        incrementBtnId="LongSlIncrementButton"
      />
    </div>
  );

  const displayedExpectedLongLoss = (
    <div
      className={`${
        longSlToggle ? `translate-y-2 lg:h-20px` : `invisible translate-y-0`
      } items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')}: {estimatedLongLossValueRef.current.symbol} ${' '}
        {numberFormatted(
          roundToDecimalPlaces(
            Math.abs(estimatedLongLossValueRef.current.number),
            2,
            RoundCondition.SHRINK
          )
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const longGuaranteedStop = (
    <div
      className={`${
        longSlToggle ? `translate-y-5 lg:h-70px` : `invisible translate-y-0`
      } flex items-start transition-all duration-150 ease-in-out lg:mb-10 lg:mt-0`}
    >
      <input
        id="LongGuaranteedStopCheckbox"
        type="checkbox"
        disabled={SafeMath.lt(
          availableBalance,
          SafeMath.plus(guaranteedStopFeeLongRef.current, requiredMarginLongRef.current)
        )}
        checked={longGuaranteedStopCheckedRef.current}
        onChange={longGuaranteedStopChangeHandler}
        className={`h-5 w-5 rounded text-lightWhite accent-tidebitTheme`}
      />
      <label className={`ml-2 flex items-center text-sm font-medium text-lightGray`}>
        {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP')} &nbsp;
        <span className="text-lightWhite">
          {' '}
          ({t('TRADE_PAGE.TRADE_TAB_FEE')}: {numberFormatted(guaranteedStopFeeLongRef.current)}{' '}
          {unitAsset})
        </span>
        {/* Info: (20231003 - Julian) Tooltip */}
        <Tooltip className="ml-1">
          <p className="w-56 text-left text-sm font-medium text-white">
            {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP_HINT')}
          </p>
        </Tooltip>
      </label>
    </div>
  );

  // ----------short area----------
  const displayedRequiredMarginShortStyle = (
    <>
      <div
        className={`${isDisplayedMarginShortStyle} ${isDisplayedMarginShortSize} mt-1 text-base`}
      >
        {numberFormatted(requiredMarginShortRef.current)} {unitAsset}
      </div>
      <div className={`${isDisplayedMarginShortWarning} ml-3 text-xs text-lightRed`}>
        * {t('TRADE_PAGE.TRADE_TAB_NOT_ENOUGH_MARGIN')}
      </div>
    </>
  );

  const shortGuaranteedStopChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inadequateBalanceForShortGSL = SafeMath.lt(
      availableBalance,
      SafeMath.plus(guaranteedStopFeeShortRef.current, requiredMarginShortRef.current)
    );

    if (inadequateBalanceForShortGSL) {
      setShortGuaranteedStopChecked(false);
    } else {
      setShortGuaranteedStopChecked(e.target.checked);
    }
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
        onTypingStatusChange={handleTypingStatusChange.shortTp}
        inputId="ShortTpInput"
        decrementBtnId="ShortTpDecrementButton"
        incrementBtnId="ShortTpIncrementButton"
      />
    </div>
  );

  const displayedExpectedShortProfit = (
    <div
      className={`${
        shortTpToggle ? `translate-y-2 lg:h-30px` : `invisible translate-y-0`
      } transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')}: {estimatedShortProfitValueRef.current.symbol}{' '}
        ${' '}
        {numberFormatted(
          roundToDecimalPlaces(
            Math.abs(estimatedShortProfitValueRef.current.number),
            2,
            RoundCondition.SHRINK
          )
        )}{' '}
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
        inputId="ShortSlInput"
        decrementBtnId="ShortSlDecrementButton"
        incrementBtnId="ShortSlIncrementButton"
      />
    </div>
  );

  const displayedExpectedShortLoss = (
    <div
      className={`${
        shortSlToggle ? `translate-y-2 lg:h-20px` : `invisible translate-y-0`
      } items-center transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')}: {estimatedShortLossValueRef.current.symbol} ${' '}
        {numberFormatted(
          roundToDecimalPlaces(
            Math.abs(estimatedShortLossValueRef.current.number),
            2,
            RoundCondition.SHRINK
          )
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const shortGuaranteedStop = (
    <div
      className={`${
        shortSlToggle ? `translate-y-5 lg:h-70px` : `invisible translate-y-0`
      } mb-10 mt-0 items-center transition-all lg:mb-10 lg:mt-0`}
    >
      <div className="mt-0 flex items-center">
        <input
          id="ShortGuaranteedStopCheckbox"
          type="checkbox"
          disabled={SafeMath.lt(
            availableBalance,
            SafeMath.plus(guaranteedStopFeeShortRef.current, requiredMarginShortRef.current)
          )}
          checked={shortGuaranteedStopCheckedRef.current}
          onChange={shortGuaranteedStopChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
        />
        <label className="ml-2 flex items-center text-sm font-medium text-lightGray">
          {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP')} &nbsp;
          <span className="text-lightWhite">
            {' '}
            ({t('TRADE_PAGE.TRADE_TAB_FEE')}: {numberFormatted(guaranteedStopFeeShortRef.current)}{' '}
            {unitAsset})
          </span>
          {/* Info: (20231003 - Julian) Tooltip */}
          <Tooltip className="ml-1">
            <p className="w-56 text-left text-sm font-medium text-white">
              {t('TRADE_PAGE.TRADE_TAB_GUARANTEED_STOP_HINT')}
            </p>
          </Tooltip>
        </label>
      </div>
    </div>
  );

  // Info: -----The below is mobile specific part (20230808 - Shirley)-----

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
      onTypingStatusChange={handleTypingStatusChange.target}
      inputId="TargetInputMobile"
      decrementBtnId="TargetDecrementButtonMobile"
      incrementBtnId="TargetIncrementButtonMobile"
    />
  );

  const longSectionClickHandler = async () => {
    setIsActiveTabLong(true);
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
    setIsActiveTabLong(false);
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

  const mobileLongSetting = (
    <div
      className={`${
        isActiveTabLong ? 'flex' : 'hidden'
      } w-full flex-col items-center justify-center space-y-2`}
    >
      {/* Info: (20230725 - Julian) Take Profit Setting */}
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}</div>
          {displayedLongTpSetting}
          <Toggle
            id="longTpToggleMobile"
            initialToggleState={longTpToggle}
            getToggledState={getToggledLongTpSetting}
          />
        </div>
        <div className="mb-3 w-full">{displayedExpectedLongProfit}</div>
      </div>

      {/* Info: (20230725 - Julian) Stop Loss Setting */}
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}</div>
          {displayedLongSlSetting}
          <Toggle
            id="longSlToggleMobile"
            initialToggleState={longSlToggle}
            getToggledState={getToggledLongSlSetting}
          />
        </div>
        <div className="w-full">{displayedExpectedLongLoss}</div>

        {/* Info: (20230725 - Julian) Guaranteed stop */}
        {longGuaranteedStop}
      </div>
    </div>
  );

  const mobileShortSetting = (
    <div
      className={`${
        isActiveTabLong ? 'hidden' : 'flex'
      } w-full flex-col items-center justify-center space-y-2`}
    >
      {/* Info: (20230725 - Julian) Take Profit Setting */}
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}</div>
          {displayedShortTpSetting}
          <Toggle
            id="shortTpToggleMobile"
            initialToggleState={shortTpToggle}
            getToggledState={getToggledShortTpSetting}
          />
        </div>
        <div className="mb-3 w-full">{displayedExpectedShortProfit}</div>
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center space-y-2">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}</div>
          {displayedShortSlSetting}
          <Toggle
            id="shortSlToggleMobile"
            initialToggleState={shortSlToggle}
            getToggledState={getToggledShortSlSetting}
          />
        </div>
        <div className="w-full">{displayedExpectedShortLoss}</div>

        {/* Guaranteed stop */}
        {shortGuaranteedStop}
      </div>
    </div>
  );

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center bg-darkGray ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-36 transition-all duration-150`}
    >
      <div className="flex self-end px-30px pt-4">
        <ImCross onClick={() => setOpenSubMenu(false)} className="z-20 cursor-pointer" />
      </div>

      {/* Info: (20230725 - Julian) ---------- margin setting ---------- */}
      <div className="w-screen flex-1 overflow-hidden px-8 sm:w-1/2">
        <div className="flex flex-col items-center justify-between space-y-4">
          <div className="flex w-full items-center justify-center">
            <UserOverview
              depositAvailable={userCtx.userAssets?.balance?.available ?? 0}
              marginLocked={userCtx.userAssets?.balance?.locked ?? 0}
              profitOrLossAmount={userCtx.userAssets?.pnl?.cumulative?.amount?.value ?? 0}
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-xs text-lightGray py-2">
              {t('TRADE_PAGE.TRADE_TAB_INPUT_REMINDER')}
            </p>
            {displayedTargetSetting}
          </div>

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
              {isActiveTabLong
                ? displayedRequiredMarginLongStyle
                : displayedRequiredMarginShortStyle}
            </div>

            <div>
              <span className="mx-5 inline-block h-14 w-px rounded bg-lightGray/50"></span>
            </div>

            <div className="w-1/2">
              <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
              {isActiveTabLong ? (
                <div className={`text-base text-lightWhite ${isDisplayedValueLongSize}`}>
                  {numberFormatted(valueOfPositionLongRef.current)} {unitAsset}
                </div>
              ) : (
                <div className={`text-base text-lightWhite ${isDisplayedValueShortSize}`}>
                  {numberFormatted(valueOfPositionShortRef.current)} {unitAsset}
                </div>
              )}
            </div>
          </div>
          {mobileLongSetting}
          {mobileShortSetting}
        </div>
      </div>
    </div>
  );

  const expandedButton = (
    <div
      className={`absolute z-20 w-320px bg-black/100 ${
        openSubMenu ? 'visible opacity-100' : 'invisible opacity-0'
      } transition-all duration-500 ease-in-out`}
    >
      <RippleButton
        id="OpenPositionButtonMobile"
        disabled={
          (openSubMenu &&
            (isActiveTabLong ? marginWarningLongRef.current : marginWarningShortRef.current)) ||
          longBtnDisabledRef.current ||
          shortBtnDisabledRef.current ||
          +targetInputValueRef.current < TARGET_MIN_DIGITS
        }
        buttonType="button"
        className={`w-full rounded-md py-2 text-sm font-medium tracking-wide text-white ${
          isActiveTabLong
            ? 'bg-lightGreen5 hover:bg-lightGreen5/80'
            : 'bg-lightRed hover:bg-lightRed/80'
        } transition-colors duration-300 disabled:bg-lightGray`}
        onClick={isActiveTabLong ? longSectionClickHandler : shortSectionClickHandler}
      >
        <b>
          {isActiveTabLong
            ? t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')
            : t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}
        </b>{' '}
        <br />
        <p className="text-xs">
          ₮{' '}
          {isActiveTabLong
            ? numberFormatted(longPriceRef.current)
            : numberFormatted(shortPriceRef.current)}
        </p>
      </RippleButton>
    </div>
  );

  const desktopLayout = (
    <div
      className={`pointer-events-none fixed right-0 top-82px z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      style={{right: rightPosition}}
    >
      <div className="relative mx-auto my-6 w-auto max-w-xl">
        {/* Info: (20230925 - Shirley) ---sidebar self--- */}
        <div
          className={`pointer-events-auto ${tabBodyWidth} h-screen overflow-y-auto bg-darkGray p-5 text-white transition-all duration-300`}
        >
          <div className="flex items-center flex-col">
            {/* Info: (20231127 - Julian) --- Typing Reminder --- */}
            <p className="text-sm text-lightGray py-2">
              {t('TRADE_PAGE.TRADE_TAB_INPUT_REMINDER')}
            </p>
            {/* Info: (20230925 - Shirley) ---target input area--- */}
            {displayedTargetAmountSetting}
          </div>

          {/* Info: (20230925 - Shirley) ---universal trading info area--- */}
          <div className="mt-2 text-lightGray">
            <div className="flex justify-center text-xs">{ticker}</div>
            <div className="mt-2">
              <div className="flex justify-center text-sm">
                {t('TRADE_PAGE.TRADE_TAB_LEVERAGE')}
              </div>
              <div className="flex justify-center text-base text-lightWhite">1:{leverage}</div>
            </div>
          </div>

          {/* Info: (20230925 - Shirley) ---Long Section--- */}
          <div className="">
            {/* Info: (20230925 - Shirley) ---custom trading info area--- */}
            <div className="mt-2 flex justify-center text-center text-base tracking-normal">
              <div className="w-1/2 space-y-1">
                <div className="text-sm text-lightGray">
                  {t('TRADE_PAGE.TRADE_TAB_REQUIRED_MARGIN')}
                </div>
                {displayedRequiredMarginLongStyle}
              </div>
              {/* Info: (20230925 - Shirley) Left Divider */}
              <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

              <div className="w-1/2 space-y-1">
                <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
                <div className={`text-base text-lightWhite ${isDisplayedValueLongSize}`}>
                  {numberFormatted(valueOfPositionLongRef.current)} {unitAsset}
                </div>
              </div>
            </div>

            <div className="">
              {/* Info: (20230925 - Shirley) Take Profit Setting */}
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-lightGray">
                    {t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}
                  </div>
                  {displayedLongTpSetting}
                  <Toggle id="longTpToggle" getToggledState={getToggledLongTpSetting} />
                </div>

                {displayedExpectedLongProfit}
              </div>

              {/* Info: (20230925 - Shirley) Stop Loss Setting */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-lightGray">
                    {t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}
                  </div>
                  <div className="w-105px">{displayedLongSlSetting}</div>
                  <Toggle id="longSlToggle" getToggledState={getToggledLongSlSetting} />
                </div>

                {displayedExpectedLongLoss}

                {/* Info: (20230925 - Shirley) Guaranteed stop */}
                {longGuaranteedStop}
              </div>
            </div>

            {/* Info: (20230925 - Shirley) Long Button */}
            <div className={`-mt-14 flex justify-center`}>
              <RippleButton
                id="LongButtonDesktop"
                disabled={marginWarningLongRef.current || longBtnDisabledRef.current}
                onClick={longOrderSubmitHandler}
                buttonType="button"
                className="w-125px rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray"
              >
                <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
                <span className="whitespace-nowrap">₮ {numberFormatted(longPriceRef.current)}</span>
              </RippleButton>
            </div>
          </div>

          <div className="mt-3 border-b-1px border-lightGray"></div>

          {/* Info: (20230925 - Shirley) ---Short Section--- */}
          <div className="pb-24">
            {/* Info: (20230925 - Shirley) ---custom trading info--- */}
            <div className="mt-5 flex justify-center text-center text-base tracking-normal">
              <div className="w-1/2 space-y-1">
                <div className="text-sm text-lightGray">
                  {t('TRADE_PAGE.TRADE_TAB_REQUIRED_MARGIN')}
                </div>
                {displayedRequiredMarginShortStyle}
              </div>
              {/* Info: (20230925 - Shirley) Left Divider */}
              <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

              <div className="w-1/2 space-y-1">
                <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
                <div className={`text-base text-lightWhite ${isDisplayedValueShortSize}`}>
                  {numberFormatted(valueOfPositionShortRef.current)} {unitAsset}
                </div>
              </div>
            </div>

            <div className="">
              {/* Info: (20230925 - Shirley) Take Profit Setting */}
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-lightGray">
                    {t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}
                  </div>
                  {displayedShortTpSetting}{' '}
                  <Toggle id="shortTpToggle" getToggledState={getToggledShortTpSetting} />
                </div>

                {displayedExpectedShortProfit}
              </div>

              {/* Info: (20230925 - Shirley) Stop Loss Setting */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-lightGray">
                    {t('TRADE_PAGE.TRADE_TAB_SL_SETTING')}
                  </div>
                  <div className="w-105px">{displayedShortSlSetting}</div>

                  <Toggle id="shortSlToggle" getToggledState={getToggledShortSlSetting} />
                </div>

                {displayedExpectedShortLoss}

                {/* Info: (20230925 - Shirley) Guaranteed stop */}
                {shortGuaranteedStop}
              </div>
            </div>

            {/* Info: (20230925 - Shirley) Short Button */}
            <div className={`-mt-14 flex justify-center`}>
              <RippleButton
                id="ShortButtonDesktop"
                disabled={
                  marginWarningShortRef.current ||
                  shortBtnDisabledRef.current ||
                  +targetInputValueRef.current < TARGET_MIN_DIGITS
                }
                onClick={shortOrderSubmitHandler}
                buttonType="button"
                className="w-125px rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray"
              >
                <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
                <span className="whitespace-nowrap">
                  ₮ {numberFormatted(shortPriceRef.current)}
                </span>
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const mobileLayout = (
    <>
      <div className="relative flex items-center">
        {/* Info: (20230725 - Julian) Expanded Button (for open position) */}
        {expandedButton}
        {/* Info: (20230725 - Julian) Long Button */}
        <div className={`w-120px bg-black/100`}>
          <RippleButton
            id="LongButtonMobile"
            disabled={
              (openSubMenu && marginWarningLongRef.current) ||
              longBtnDisabledRef.current ||
              +targetInputValueRef.current < TARGET_MIN_DIGITS
            }
            buttonType="button"
            className={`w-full rounded-md bg-lightGreen5 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray`}
            onClick={longSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
            <p className="text-xs">₮ {numberFormatted(longPriceRef.current)}</p>
          </RippleButton>
        </div>

        {/* Info: (20230725 - Julian) Short Button */}
        <div className={`ml-4 w-120px bg-black/100`}>
          <RippleButton
            id="ShortButtonMobile"
            disabled={(openSubMenu && marginWarningShortRef.current) || shortBtnDisabledRef.current}
            buttonType="button"
            className={`w-full rounded-md bg-lightRed py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray`}
            onClick={shortSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
            <p className="text-xs">₮ {numberFormatted(shortPriceRef.current)}</p>
          </RippleButton>
        </div>
      </div>
      {subMenu}
    </>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <>{displayedLayout}</>;
};

export default TradeTab;

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
  DEFAULT_LEVERAGE,
  DEFAULT_SELL_PRICE,
  DEFAULT_USER_BALANCE,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {
  TARGET_LIMIT_DIGITS,
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
  unitAsset,
  SUGGEST_SL,
  SUGGEST_TP,
  LIQUIDATION_FIVE_LEVERAGE,
  WAITING_TIME_FOR_USER_SIGNING,
  FRACTION_DIGITS,
  TP_SL_LIMIT_PERCENT,
} from '../../constants/config';
import {ClickEvent} from '../../constants/tidebit_event';
import {useTranslation} from 'next-i18next';
import {
  getTimestamp,
  getTimestampInMilliseconds,
  roundToDecimalPlaces,
  twoDecimal,
} from '../../lib/common';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {Code} from '../../constants/code';
import {defaultResultSuccess} from '../../interfaces/tidebit_defi_background/result';
import {OrderType} from '../../constants/order_type';
import {CFDOperation} from '../../constants/cfd_order_type';

type TranslateFunction = (s: string) => string;

const TradeTabMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const tickerLiveStatistics = marketCtx.tickerLiveStatistics;
  const tickerStaticStatistics = marketCtx.tickerStatic;

  const TEMP_PLACEHOLDER = TARGET_LIMIT_DIGITS;
  const DEFAULT_TICKER = 'ETH';
  const SELL_PRICE_ERROR = 0;
  const BUY_PRICE_ERROR = 9999999999;
  const LEVERAGE_ERROR = 1;

  const ticker = marketCtx.selectedTicker?.currency ?? '';

  const USER_BALANCE = userCtx.balance?.available ?? DEFAULT_USER_BALANCE;

  const leverage = tickerStaticStatistics?.leverage ?? DEFAULT_LEVERAGE;
  const gsl = marketCtx.guaranteedStopFeePercentage;

  const defaultBuyQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.BUY);
  const defaultSellQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.SELL);

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    QUOTATION_RENEWAL_INTERVAL_SECONDS
  );
  const [longQuotation, setLongQuotation, longQuotationRef] =
    useStateRef<IQuotation>(defaultBuyQuotation);
  const [shortQuotation, setShortQuotation, shortQuotationRef] =
    useStateRef<IQuotation>(defaultSellQuotation);

  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [targetInputValue, setTargetInputValue, targetInputValueRef] = useStateRef(0.02);

  // FIXME: SL setting should have a lower limit and an upper limit depending on its position type
  const [longTpValue, setLongTpValue, longTpValueRef] = useStateRef(
    Number((Number(longQuotationRef.current?.price) * (1 + SUGGEST_TP / leverage)).toFixed(2))
  );
  const [longSlValue, setLongSlValue, longSlValueRef] = useStateRef(
    Number((Number(longQuotationRef.current?.price) * (1 - SUGGEST_SL / leverage)).toFixed(2))
  );
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue, shortTpValueRef] = useStateRef(
    Number((Number(shortQuotationRef.current?.price) * (1 - SUGGEST_TP / leverage)).toFixed(2))
  );
  const [shortSlValue, setShortSlValue, shortSlValueRef] = useStateRef(
    Number((Number(shortQuotationRef.current?.price) * (1 + SUGGEST_SL / leverage)).toFixed(2))
  );
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [activeTab, setActiveTab] = useState('Long');
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const [expectedLongProfitValue, setExpectedLongProfitValue, expectedLongProfitValueRef] =
    useStateRef(
      (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );

  const [expectedLongLossValue, setExpectedLongLossValue, expectedLongLossValueRef] = useStateRef(
    (Number(longQuotationRef.current?.price) - longSlValue) * targetInputValueRef.current
  );

  const [expectedShortProfitValue, setExpectedShortProfitValue, expectedShortProfitValueRef] =
    useStateRef(
      (Number(longQuotationRef.current?.price) - shortTpValue) * targetInputValueRef.current
    );

  const [expectedShortLossValue, setExpectedShortLossValue, expectedShortLossValueRef] =
    useStateRef(
      (shortSlValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );

  const [longGuaranteedStopChecked, setLongGuaranteedStopChecked] = useState(false);
  const [shortGuaranteedStopChecked, setShortGuaranteedStopChecked] = useState(false);

  const [requiredMarginLong, setRequiredMarginLong, requiredMarginLongRef] = useStateRef(
    roundToDecimalPlaces((targetInputValue * Number(longQuotationRef.current?.price)) / leverage, 2)
  );
  const [valueOfPositionLong, setValueOfPositionLong, valueOfPositionLongRef] = useStateRef(
    roundToDecimalPlaces(targetInputValue * Number(longQuotationRef.current?.price), 2)
  );

  const [requiredMarginShort, setRequiredMarginShort, requiredMarginShortRef] = useStateRef(
    roundToDecimalPlaces(
      (targetInputValue * Number(shortQuotationRef.current?.price)) / leverage,
      2
    )
  );
  const [valueOfPositionShort, setValueOfPositionShort, valueOfPositionShortRef] = useStateRef(
    roundToDecimalPlaces(targetInputValue * Number(shortQuotationRef.current?.price), 2)
  );

  const [marginWarningLong, setMarginWarningLong, marginWarningLongRef] = useStateRef(false);
  const [marginWarningShort, setMarginWarningShort, marginWarningShortRef] = useStateRef(false);

  const [targetLengthLong, setTargetLengthLong] = useState(
    roundToDecimalPlaces(
      (targetInputValue * Number(longQuotationRef.current?.price)) / leverage,
      2
    ).toString().length
  );
  const [targetLengthShort, setTargetLengthShort] = useState(
    roundToDecimalPlaces(
      (targetInputValue * Number(shortQuotationRef.current?.price)) / leverage,
      2
    ).toString().length
  );

  const [valueOfPositionLengthLong, setValueOfPositionLengthLong] = useState(
    roundToDecimalPlaces(targetInputValue * Number(longQuotationRef.current?.price), 2).toString()
      .length
  );
  const [valueOfPositionLengthShort, setValueOfPositionLengthShort] = useState(
    roundToDecimalPlaces(targetInputValue * Number(shortQuotationRef.current?.price), 2).toString()
      .length
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
      await getQuotation(marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER);

      setTpSlBounds();
      setSuggestions();
      renewPosition();
    })();
  }, [userCtx.enableServiceTerm]);

  // Info: Fetch quotation in period (20230327 - Shirley)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!longQuotationRef.current || !shortQuotationRef.current) return;

      const base = longQuotationRef.current.deadline - WAITING_TIME_FOR_USER_SIGNING;

      const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

      if (secondsLeftRef.current === 0) {
        await getQuotation(marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER);

        setTpSlBounds();
        checkTpSlWithinBounds();
        renewPosition();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft]);

  // Info: Fetch quotation when ticker changed (20230327 - Shirley)
  useEffect(() => {
    notificationCtx.emitter.once(ClickEvent.TICKER_CHANGED, async () => {
      await getQuotation(marketCtx.selectedTickerRef.current?.currency ?? DEFAULT_TICKER);

      setTpSlBounds();
      setSuggestions();
      renewPosition();
    });

    return () => {
      notificationCtx.emitter.removeAllListeners(ClickEvent.TICKER_CHANGED);
    };
  }, [marketCtx.selectedTicker]);

  const getQuotation = async (tickerId: string) => {
    let longQuotation = defaultResultSuccess;
    let shortQuotation = defaultResultSuccess;

    try {
      longQuotation = await marketCtx.getCFDQuotation(tickerId, TypeOfPosition.BUY);
      shortQuotation = await marketCtx.getCFDQuotation(tickerId, TypeOfPosition.SELL);

      const long = longQuotation.data as IQuotation;
      const short = shortQuotation.data as IQuotation;

      // Info: if there's error fetching quotation, use the previous quotation or calculate the quotation (20230327 - Shirley)
      if (
        longQuotation.success &&
        long.typeOfPosition === TypeOfPosition.BUY &&
        longQuotation.data !== null
      ) {
        setLongQuotation(long);
      } else {
        const buyPrice =
          (marketCtx.selectedTickerRef.current?.price ?? DEFAULT_BUY_PRICE) *
          (1 + (marketCtx.tickerLiveStatistics?.spread ?? 0));

        const buyQuotation: IQuotation = {
          ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          typeOfPosition: TypeOfPosition.BUY,
          unitAsset: unitAsset,
          price: buyPrice,
          deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
          signature: '0x',
        };

        setLongQuotation(buyQuotation);
      }

      // Info: if there's error fetching quotation, use the previous quotation or calculate the quotation (20230327 - Shirley)
      if (
        shortQuotation.success &&
        short &&
        short.typeOfPosition === TypeOfPosition.SELL &&
        shortQuotation.data !== null
      ) {
        setShortQuotation(short);
      } else {
        const sellPrice =
          (marketCtx.selectedTickerRef.current?.price ?? DEFAULT_BUY_PRICE) *
          (1 + (marketCtx.tickerLiveStatistics?.spread ?? 0));

        const sellQuotation: IQuotation = {
          ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          typeOfPosition: TypeOfPosition.SELL,
          unitAsset: unitAsset,
          price: sellPrice,
          deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
          signature: '0x',
        };

        setShortQuotation(sellQuotation);
      }
    } catch (err) {
      const buyPrice =
        (marketCtx.selectedTickerRef.current?.price ?? DEFAULT_BUY_PRICE) *
        (1 + (marketCtx.tickerLiveStatistics?.spread ?? 0));

      const buyQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        typeOfPosition: TypeOfPosition.BUY,
        unitAsset: unitAsset,
        price: buyPrice,
        deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      };

      setLongQuotation(buyQuotation);

      const sellPrice =
        (marketCtx.selectedTickerRef.current?.price ?? DEFAULT_SELL_PRICE) *
        (1 - (marketCtx.tickerLiveStatistics?.spread ?? 0));

      const sellQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        typeOfPosition: TypeOfPosition.SELL,
        unitAsset: unitAsset,
        price: sellPrice,
        deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      };

      setShortQuotation(sellQuotation);
    }

    return {longQuotation: longQuotation, shortQuotation: shortQuotation};
  };
  const getTargetInputValue = (value: number) => {
    setTargetInputValue(value);
    targetAmountDetection(value);

    setExpectedLongProfitValue(
      (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );
    setExpectedLongLossValue(
      (Number(longQuotationRef.current?.price) - longSlValue) * targetInputValueRef.current
    );
    setExpectedShortProfitValue(
      (Number(shortQuotationRef.current?.price) - shortTpValue) * targetInputValueRef.current
    );
    setExpectedShortLossValue(
      (shortSlValue - Number(shortQuotationRef.current?.price)) * targetInputValueRef.current
    );
  };
  const getLongTpValue = (value: number) => {
    setLongTpValue(value);

    setExpectedLongProfitValue(
      (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );
  };

  const getLongSlValue = (value: number) => {
    setLongSlValue(value);

    setExpectedLongLossValue(
      (Number(longQuotationRef.current?.price) - longSlValue) * targetInputValueRef.current
    );
  };

  const getShortTpValue = (value: number) => {
    setShortTpValue(value);

    setExpectedShortProfitValue(
      (Number(shortQuotationRef.current?.price) - shortTpValue) * targetInputValueRef.current
    );
  };

  const getShortSlValue = (value: number) => {
    setShortSlValue(value);

    setExpectedShortLossValue(
      (shortSlValue - Number(shortQuotationRef.current?.price)) * targetInputValueRef.current
    );
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
      Number(longQuotationRef.current?.price) * (1 + TP_SL_LIMIT_PERCENT),
      2
    );
    const shortTpUpperBound = roundToDecimalPlaces(
      Number(shortQuotationRef.current?.price) * (1 - TP_SL_LIMIT_PERCENT),
      2
    );

    const longSlLowerBound = roundToDecimalPlaces(
      Number(longQuotationRef.current?.price) *
        (1 - LIQUIDATION_FIVE_LEVERAGE) *
        (1 + TP_SL_LIMIT_PERCENT),
      2
    );

    const shortSlUpperBound = roundToDecimalPlaces(
      Number(shortQuotationRef.current?.price) *
        (1 + LIQUIDATION_FIVE_LEVERAGE) *
        (1 - TP_SL_LIMIT_PERCENT),
      2
    );

    const longSlUpperBound = roundToDecimalPlaces(
      Number(longQuotationRef.current?.price) * (1 - TP_SL_LIMIT_PERCENT),
      2
    );

    const shortSlLowerBound = roundToDecimalPlaces(
      Number(shortQuotationRef.current?.price) * (1 + TP_SL_LIMIT_PERCENT),
      2
    );

    setLongSlLowerLimit(longSlLowerBound);
    setLongSlUpperLimit(longSlUpperBound); // Open price with buffer
    setLongTpLowerLimit(longTpLowerBound); // Open price with buffer

    setShortTpUpperLimit(shortTpUpperBound); // Open price with buffer
    setShortSlUpperLimit(shortSlUpperBound);
    setShortSlLowerLimit(shortSlLowerBound); // Open price with buffer

    updateSuggestions();
  };

  const updateSuggestions = () => {
    const tpTimes = SUGGEST_TP / leverage;
    const slTimes = SUGGEST_SL / leverage;

    setLongTpSuggestion(
      Number((Number(longQuotationRef.current?.price) * (1 + tpTimes)).toFixed(2))
    );
    setLongSlSuggestion(
      Number((Number(longQuotationRef.current?.price) * (1 - slTimes)).toFixed(2))
    );
    setShortTpSuggestion(
      Number((Number(shortQuotationRef.current?.price) * (1 - tpTimes)).toFixed(2))
    );
    setShortSlSuggestion(
      Number((Number(shortQuotationRef.current?.price) * (1 + slTimes)).toFixed(2))
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
    const newLongValue = targetInputValueRef.current * Number(longQuotationRef.current?.price);

    const roundedLongValue = roundToDecimalPlaces(newLongValue, 2);
    setValueOfPositionLong(roundedLongValue);

    const marginLong = newLongValue / leverage;
    const roundedMarginLong = roundToDecimalPlaces(marginLong, 2);
    setRequiredMarginLong(roundedMarginLong);

    setMarginWarningLong(marginLong > USER_BALANCE);

    setTargetLengthLong(roundedMarginLong.toString().length);
    setValueOfPositionLengthLong(roundedLongValue.toString().length);

    setExpectedLongProfitValue(
      (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );
    setExpectedLongLossValue(
      (Number(longQuotationRef.current?.price) - longSlValue) * targetInputValueRef.current
    );

    setGuaranteedStopFeeLong(Number(gsl) * valueOfPositionLongRef.current);

    // Short
    const newShortValue = targetInputValueRef.current * Number(shortQuotationRef.current?.price);

    const roundedShortValue = roundToDecimalPlaces(newShortValue, 2);
    setValueOfPositionShort(roundedShortValue);

    const marginShort = newShortValue / leverage;
    const roundedMarginShort = roundToDecimalPlaces(marginShort, 2);
    setRequiredMarginShort(roundedMarginShort);

    setMarginWarningShort(marginShort > USER_BALANCE);

    setTargetLengthShort(roundedMarginShort.toString().length);
    setValueOfPositionLengthShort(roundedShortValue.toString().length);

    setExpectedShortProfitValue(
      (Number(shortQuotationRef.current?.price) - shortTpValue) * targetInputValueRef.current
    );
    setExpectedShortLossValue(
      (shortSlValue - Number(shortQuotationRef.current?.price)) * targetInputValueRef.current
    );
    setGuaranteedStopFeeShort(Number(gsl) * valueOfPositionShortRef.current);
  };

  const targetAmountDetection = (value?: number) => {
    renewPosition();
  };

  const getToggledLongTpSetting = (bool: boolean) => {
    setLongTpToggle(bool);

    setExpectedLongProfitValue(
      (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );
  };

  const getToggledLongSlSetting = (bool: boolean) => {
    setLongSlToggle(bool);

    setExpectedLongLossValue(
      (Number(longQuotationRef.current?.price) - longSlValue) * targetInputValueRef.current
    );
  };

  const getToggledShortTpSetting = (bool: boolean) => {
    setShortTpToggle(bool);

    setExpectedShortProfitValue(
      (Number(shortQuotationRef.current?.price) - shortTpValue) * targetInputValueRef.current
    );
  };

  const getToggledShortSlSetting = (bool: boolean) => {
    setShortSlToggle(bool);

    setExpectedShortLossValue(
      (shortSlValue - Number(shortQuotationRef.current?.price)) * targetInputValueRef.current
    );
  };

  const toApplyCreateOrder = (): {
    longOrder: IApplyCreateCFDOrder;
    shortOrder: IApplyCreateCFDOrder;
  } => {
    const share = {
      ticker: marketCtx.selectedTicker?.currency ?? '',
      targetAsset: marketCtx.selectedTicker?.currency ?? '',
      unitAsset: unitAsset,
      amount: targetInputValueRef.current,
      leverage: marketCtx.tickerStatic?.leverage ?? DEFAULT_LEVERAGE,
      margin: {
        asset: unitAsset,
        amount: requiredMarginLongRef.current,
      },
      liquidationTime: Math.ceil(Date.now() / 1000) + 86400,
    };

    const longOrder: IApplyCreateCFDOrder = {
      ...share,
      orderType: OrderType.CFD,
      operation: CFDOperation.CREATE,
      price: longQuotationRef.current.price,
      typeOfPosition: TypeOfPosition.BUY,
      quotation: longQuotationRef.current,
      liquidationPrice: longQuotationRef.current.price * (1 - LIQUIDATION_FIVE_LEVERAGE),
      fee: marketCtx.tickerLiveStatistics?.fee ?? DEFAULT_BUY_PRICE,
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
      quotation: shortQuotationRef.current,
      price: shortQuotationRef.current.price,
      liquidationPrice: shortQuotationRef.current.price * (1 + LIQUIDATION_FIVE_LEVERAGE),
      fee: marketCtx.tickerLiveStatistics?.fee ?? DEFAULT_BUY_PRICE,
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

  const longSectionClickHandler = () => {
    setActiveTab('Long');
    const {longOrder} = toApplyCreateOrder();

    if (!openSubMenu) {
      setOpenSubMenu(true);
    } else {
      {
        /* ToDo: 接 PositionOpenModal (20230313 - Julian) */
        globalCtx.dataPositionOpenModalHandler({
          openCfdRequest: longOrder,
        });
        globalCtx.visiblePositionOpenModalHandler();
        return;
      }
    }
  };

  const shortSectionClickHandler = () => {
    setActiveTab('Short');
    const {shortOrder} = toApplyCreateOrder();

    if (!openSubMenu) {
      setOpenSubMenu(true);
    } else {
      {
        /* ToDo: 接 PositionOpenModal (20230313 - Julian) */
        globalCtx.dataPositionOpenModalHandler({
          openCfdRequest: shortOrder,
        });
        globalCtx.visiblePositionOpenModalHandler();
        return;
      }
    }
  };

  const longProfitSymbol =
    expectedLongProfitValueRef.current > 0
      ? '+'
      : expectedLongProfitValueRef.current < 0
      ? '-'
      : '';

  const longLossSymbol =
    expectedLongLossValueRef.current > 0 ? '+' : expectedLongLossValueRef.current < 0 ? '-' : '';

  const shortProfitSymbol =
    expectedShortProfitValueRef.current > 0
      ? '+'
      : expectedShortProfitValueRef.current < 0
      ? '-'
      : '';

  const shortLossSymbol =
    expectedShortLossValueRef.current > 0 ? '+' : expectedShortLossValueRef.current < 0 ? '-' : '';

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
      lowerLimit={0}
      upperLimit={TARGET_LIMIT_DIGITS}
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
        upperLimit={TARGET_LIMIT_DIGITS}
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
    <div className={`${longTpToggle ? `translate-y-2` : `invisible translate-y-0`} transition-all`}>
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')} {longProfitSymbol}
        {roundToDecimalPlaces(Math.abs(expectedLongProfitValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
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
      />
    </div>
  );

  const displayedExpectedLongLoss = (
    <div
      className={`${longSlToggle ? `translate-y-0` : `invisible -translate-y-2`} transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')} {longLossSymbol}
        {roundToDecimalPlaces(Math.abs(expectedLongLossValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
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
      />
    </div>
  );

  const displayedExpectedShortProfit = (
    <div
      className={`${shortTpToggle ? `translate-y-2` : `invisible translate-y-0`} transition-all`}
    >
      <div className="text-xs text-lightWhite">
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')} {shortProfitSymbol}
        {roundToDecimalPlaces(Math.abs(expectedShortProfitValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
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
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')} {shortLossSymbol}
        {roundToDecimalPlaces(Math.abs(expectedShortLossValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
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
            ({t('TRADE_PAGE.TRADE_TAB_FEE')}
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
    activeTab === 'Long' && openSubMenu ? 'z-50 w-320px -translate-x-16 absolute' : 'w-120px'; //z-50 w-320px -translate-x-16 absolute

  const shortButtonStyles =
    activeTab === 'Short' && openSubMenu ? 'z-50 w-320px -translate-x-16 absolute' : 'ml-4 w-120px'; //z-50 w-320px -translate-x-16 absolute

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center overflow-x-hidden overflow-y-hidden bg-darkGray ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-40 transition-all duration-150`}
    >
      <div className="mb-3 mr-30px flex self-end sm:pr-30px">
        <ImCross onClick={() => setOpenSubMenu(false)} className="cursor-pointer" />
      </div>

      {/* ---------- margin setting ---------- */}
      <div className="w-screen overflow-y-auto overflow-x-hidden px-8 sm:w-1/2">
        <div className="flex flex-col items-center justify-between space-y-7">
          <div className="flex w-full items-center justify-center">
            <UserOverview
              depositAvailable={userCtx?.balance?.available ?? 0}
              marginLocked={userCtx?.balance?.locked ?? 0}
              profitOrLossAmount={userCtx?.balance?.PNL ?? 0}
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
      <div className="flex items-center justify-between">
        {/* Long Button */}
        <div className={`bg-black/100 transition-all duration-300 ease-in-out ${longButtonStyles}`}>
          <RippleButton
            disabled={marginWarningLongRef.current}
            buttonType="button"
            className={`w-full rounded-md bg-lightGreen5 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80`}
            onClick={longSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
            <p className="text-xs">
              ₮{' '}
              {Number(longQuotationRef.current?.price).toLocaleString(
                UNIVERSAL_NUMBER_FORMAT_LOCALE,
                FRACTION_DIGITS
              )}
            </p>
          </RippleButton>
        </div>

        {/* Short Button */}
        <div
          className={`bg-black/100 transition-all duration-300 ease-in-out ${shortButtonStyles}`}
        >
          <RippleButton
            disabled={marginWarningShortRef.current}
            buttonType="button"
            className={`w-full rounded-md bg-lightRed py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80`}
            onClick={shortSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
            <p className="text-xs">
              ₮{' '}
              {Number(shortQuotationRef.current?.price).toLocaleString(
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

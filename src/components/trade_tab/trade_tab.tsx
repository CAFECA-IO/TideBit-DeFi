import React, {useContext, useEffect, useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {
  TARGET_LIMIT_DIGITS,
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
  unitAsset,
  SUGGEST_TP,
  SUGGEST_SL,
  LIQUIDATION_FIVE_LEVERAGE,
  DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS,
  WAITING_TIME_FOR_USER_SIGNING,
} from '../../constants/config';
import {useGlobal} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import useStateRef from 'react-usestateref';
import {TypeOfPosition} from '../../constants/type_of_position';
import {OrderType} from '../../constants/order_type';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {ClickEvent} from '../../constants/tidebit_event';
import {getTimestamp, getTimestampInMilliseconds, roundToDecimalPlaces} from '../../lib/common';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {useTranslation} from 'next-i18next';
import {
  defaultResultFailed,
  defaultResultSuccess,
} from '../../interfaces/tidebit_defi_background/result';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {Code} from '../../constants/code';
import {CFDOperation} from '../../constants/cfd_order_type';

type TranslateFunction = (s: string) => string;

const TradeTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  // TODO: switch to the certain ticker's statistics
  const tickerLiveStatistics = marketCtx.tickerLiveStatistics;
  const tickerStaticStatistics = marketCtx.tickerStatic;

  const TEMP_PLACEHOLDER = TARGET_LIMIT_DIGITS;
  const DEFAULT_TICKER = 'ETH';
  const SELL_PRICE_ERROR = 0;
  const BUY_PRICE_ERROR = 9999999999;
  const LEVERAGE_ERROR = 1;

  const ticker = marketCtx.selectedTicker?.currency ?? '';
  const USER_BALANCE = userCtx.balance?.available ?? 0;

  const leverage = tickerStaticStatistics?.leverage ?? 1;
  const gsl = marketCtx.guaranteedStopFeePercentage;

  const defaultBuyQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.BUY);
  const defaultSellQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.SELL);

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS
  );
  const [longQuotation, setLongQuotation, longQuotationRef] =
    useStateRef<IQuotation>(defaultBuyQuotation);
  const [shortQuotation, setShortQuotation, shortQuotationRef] =
    useStateRef<IQuotation>(defaultSellQuotation);

  // Till: (20230410 - Shirley)
  // const buyPrice = longQuotationRef.current?.price ?? TEMP_PLACEHOLDER; // market price * (1+spread)
  // const sellPrice = shortQuotationRef.current?.price ?? TEMP_PLACEHOLDER; // market price * (1-spread)
  // const longRecommendedTp = Number(
  //   (tickerLiveStatistics?.longRecommendedTp ?? TEMP_PLACEHOLDER).toFixed(2)
  // ); // recommendedTp // MARKET_PRICE * 1.15
  // const longRecommendedSl = Number(
  //   (tickerLiveStatistics?.longRecommendedSl ?? TEMP_PLACEHOLDER).toFixed(2)
  // ); // recommendedSl // MARKET_PRICE * 0.85

  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [targetInputValue, setTargetInputValue, targetInputValueRef] = useStateRef(0.02);

  // FIXME: SL setting should have a lower limit and an upper limit depending on its position type
  const [longTpValue, setLongTpValue, loneTpValueRef] = useStateRef(
    Number((Number(longQuotationRef.current?.price) * (1 + SUGGEST_TP)).toFixed(2))
  );
  const [longSlValue, setLongSlValue, longSlValueRef] = useStateRef(
    Number((Number(longQuotationRef.current?.price) * (1 - SUGGEST_SL)).toFixed(2))
  );
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue, shortTpValueRef] = useStateRef(
    Number((Number(shortQuotationRef.current?.price) * (1 - SUGGEST_TP)).toFixed(2))
  );
  const [shortSlValue, setShortSlValue, shortSlValueRef] = useStateRef(
    Number((Number(shortQuotationRef.current?.price) * (1 + SUGGEST_SL)).toFixed(2))
  );
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [expectedLongProfitValue, setExpectedLongProfitValue, expectedLongProfitValueRef] =
    useStateRef(
      (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
    );

  const [expectedLongLossValue, setExpectedLongLossValue, expectedLongLossValueRef] = useStateRef(
    (longTpValue - Number(longQuotationRef.current?.price)) * targetInputValueRef.current
  );

  const [expectedShortProfitValue, setExpectedShortProfitValue, expectedShortProfitValueRef] =
    useStateRef(
      (shortTpValue - Number(shortQuotationRef.current?.price)) * targetInputValueRef.current
    );

  const [expectedShortLossValue, setExpectedShortLossValue, expectedShortLossValueRef] =
    useStateRef(
      (shortSlValue - Number(shortQuotationRef.current?.price)) * targetInputValueRef.current
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

  // Info: Fetch quotation the first time (20230327 - Shirley)
  useEffect(() => {
    if (!userCtx.enableServiceTerm) return;

    (async () => {
      renewQuotation();
      renewPosition();

      initSuggestion();
    })();

    // Deprecated: before merging into develop (20230327 - Shirley)
    // eslint-disable-next-line no-console
    console.log('first time Effect', longQuotationRef.current, shortQuotationRef.current);
  }, [userCtx.enableServiceTerm]);

  // Info: Fetch quotation in period (20230327 - Shirley)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!longQuotationRef.current || !shortQuotationRef.current) return;

      const base = longQuotationRef.current.deadline - WAITING_TIME_FOR_USER_SIGNING;
      const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);
      // const tempNow = getTimestamp();
      // const rs = base - tempNow;
      // ToDo: FIXME: countdown is inconsistent with position open modal (20230407 - Shirley)
      // eslint-disable-next-line no-console
      console.log(
        'tab, displayed deadline [ref]:',
        base,
        secondsLeftRef.current,
        'actual deadline:',
        longQuotationRef.current.deadline
      );

      if (secondsLeftRef.current === 0) {
        renewQuotation();
        renewPosition();

        // Deprecated: before merging into develop (20230327 - Shirley)
        // eslint-disable-next-line no-console
        console.log('countdown Effect', longQuotationRef.current, shortQuotationRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft]);

  // Info: Fetch quotation when ticker changed (20230327 - Shirley)
  useEffect(() => {
    notificationCtx.emitter.once(ClickEvent.TICKER_CHANGED, async () => {
      renewQuotation();
      renewPosition();

      // Deprecated: before merging into develop (20230327 - Shirley)
      // eslint-disable-next-line no-console
      console.log(
        'when ticker changed Effect',
        longQuotationRef.current,
        shortQuotationRef.current
      );
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
          (marketCtx.selectedTickerRef.current?.price ?? BUY_PRICE_ERROR) *
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
        // Deprecated: before merging into develop (20230327 - Shirley)
        // eslint-disable-next-line no-console
        console.log('calculate, long', longQuotationRef.current);
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
          (marketCtx.selectedTickerRef.current?.price ?? BUY_PRICE_ERROR) *
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
        // Deprecated: before merging into develop (20230327 - Shirley)
        // eslint-disable-next-line no-console
        console.log('calculate, short', shortQuotationRef.current);
      }
    } catch (err) {
      const buyPrice =
        (marketCtx.selectedTickerRef.current?.price ?? BUY_PRICE_ERROR) *
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
        (marketCtx.selectedTickerRef.current?.price ?? SELL_PRICE_ERROR) *
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

  // Info: suggest the tp / sl in the beginning (20230329 - Shirley)
  const initSuggestion = () => {
    setLongTpValue(Number((Number(longQuotationRef.current?.price) * (1 + SUGGEST_TP)).toFixed(2)));
    setLongSlValue(Number((Number(longQuotationRef.current?.price) * (1 - SUGGEST_SL)).toFixed(2)));

    setShortTpValue(
      Number((Number(shortQuotationRef.current?.price) * (1 - SUGGEST_TP)).toFixed(2))
    );
    setShortSlValue(
      Number((Number(shortQuotationRef.current?.price) * (1 + SUGGEST_SL)).toFixed(2))
    );
  };

  const renewQuotation = async () => {
    const {longQuotation, shortQuotation} = await getQuotation(
      marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER
    );
  };

  // Info: renew the value of position when target input changed (20230328 - Shirley)
  const renewPosition = async () => {
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

  const tabBodyWidth = 'w-320px';

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
      ? '-'
      : expectedShortProfitValueRef.current < 0
      ? '+'
      : '';

  const shortLossSymbol =
    expectedShortLossValueRef.current > 0 ? '-' : expectedShortLossValueRef.current < 0 ? '+' : '';

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
      leverage: marketCtx.tickerStatic?.leverage ?? LEVERAGE_ERROR,
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
      fee: marketCtx.tickerLiveStatistics?.fee ?? BUY_PRICE_ERROR,
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
      fee: marketCtx.tickerLiveStatistics?.fee ?? BUY_PRICE_ERROR,
      guaranteedStop: shortSlToggle ? shortGuaranteedStopChecked : false,
      guaranteedStopFee:
        shortSlToggle && shortGuaranteedStopChecked ? guaranteedStopFeeShortRef.current : 0,
      takeProfit: shortTpToggle ? shortTpValue : undefined,
      stopLoss: shortSlToggle ? shortSlValue : undefined,
    };

    return {longOrder, shortOrder};
  };

  const longOrderSubmitHandler = () => {
    const {longOrder} = toApplyCreateOrder();

    globalCtx.dataPositionOpenModalHandler({
      openCfdRequest: longOrder,
    });
    globalCtx.visiblePositionOpenModalHandler();

    return;
  };

  const shortOrderSubmitHandler = () => {
    const {shortOrder} = toApplyCreateOrder();

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
        {requiredMarginLongRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{' '}
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
        lowerLimit={0}
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
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')}: {longProfitSymbol} ${' '}
        {roundToDecimalPlaces(Math.abs(expectedLongProfitValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
        {unitAsset}
      </div>
    </div>
  );

  const displayedLongSlSetting = (
    <div className={`${isDisplayedLongSlSetting}`}>
      <TradingInput
        lowerLimit={0}
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
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')}: {longLossSymbol} ${' '}
        {roundToDecimalPlaces(Math.abs(expectedLongLossValueRef.current), 2).toLocaleString(
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
          {guaranteedStopFeeLongRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
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
        {requiredMarginShortRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{' '}
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
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_PROFIT')}: {shortProfitSymbol} ${' '}
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
        lowerLimit={0}
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
        * {t('TRADE_PAGE.TRADE_TAB_EXPECTED_LOSS')}: {shortLossSymbol} ${' '}
        {roundToDecimalPlaces(Math.abs(expectedShortLossValueRef.current), 2).toLocaleString(
          UNIVERSAL_NUMBER_FORMAT_LOCALE
        )}{' '}
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
            {guaranteedStopFeeShortRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
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
                    {valueOfPositionLongRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}{' '}
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
              <div className="ml-1/4">
                <RippleButton
                  disabled={marginWarningLongRef.current}
                  onClick={longOrderSubmitHandler}
                  buttonType="button"
                  className="mb-2 mr-2 rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray"
                >
                  <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />₮{' '}
                  {Number(longQuotationRef.current?.price).toLocaleString(
                    UNIVERSAL_NUMBER_FORMAT_LOCALE,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
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
                      UNIVERSAL_NUMBER_FORMAT_LOCALE
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
              <div className="ml-1/4">
                <RippleButton
                  disabled={marginWarningShortRef.current}
                  onClick={shortOrderSubmitHandler}
                  buttonType="button"
                  className="mb-2 mr-2 rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray"
                >
                  <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />₮{' '}
                  {Number(shortQuotationRef.current?.price).toLocaleString(
                    UNIVERSAL_NUMBER_FORMAT_LOCALE,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
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

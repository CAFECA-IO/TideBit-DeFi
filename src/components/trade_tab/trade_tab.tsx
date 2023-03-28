import React, {useContext, useEffect, useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {
  TARGET_LIMIT_DIGITS,
  POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
  unitAsset,
} from '../../constants/config';
import {useGlobal} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import useStateRef from 'react-usestateref';
import {TypeOfPosition} from '../../constants/type_of_position';
import {OrderType} from '../../constants/order_type';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {ClickEvent} from '../../constants/tidebit_event';
import {getTimestamp, roundToDecimalPlaces} from '../../lib/common';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {useTranslation} from 'next-i18next';
import {
  defaultResultFailed,
  defaultResultSuccess,
} from '../../interfaces/tidebit_defi_background/result';
import {IApplyCreateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {Code} from '../../constants/code';

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

  // FIXME: It should have the default value of `tickerLiveStatistics`
  const TEMP_PLACEHOLDER = TARGET_LIMIT_DIGITS;
  const DEFAULT_TICKER = 'ETH';
  const SELL_PRICE_ERROR = 0;
  const BUY_PRICE_ERROR = 9999999999;
  const LEVERAGE_ERROR = 1;

  const ticker = marketCtx.selectedTicker?.currency ?? '';
  // const LIQUIDATION_PRICE = 7548; // TODO: tickerLiveStatistics
  const USER_BALANCE = userCtx.balance?.available ?? 0;

  const leverage = tickerStaticStatistics?.leverage ?? 1;
  const guaranteedStopFee = tickerStaticStatistics?.guaranteedStopFee;

  // let marketPrice = tickerLiveStatistics?.price ?? TEMP_PLACEHOLDER;
  let marketPrice = marketCtx.selectedTicker?.price ?? TEMP_PLACEHOLDER;

  // const [mounted, setMounted, mountedRef] = useStateRef(false);
  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    POSITION_PRICE_RENEWAL_INTERVAL_SECONDS
  );
  const [longQuotation, setLongQuotation, longQuotationRef] = useStateRef<IQuotation>();
  const [shortQuotation, setShortQuotation, shortQuotationRef] = useStateRef<IQuotation>();

  const buyPrice = (longQuotationRef.current?.price ?? TEMP_PLACEHOLDER).toFixed(2); // market price * (1+spread)
  const sellPrice = (shortQuotationRef.current?.price ?? TEMP_PLACEHOLDER).toFixed(2); // market price * (1-spread)
  const longRecommendedTp = Number(
    (tickerLiveStatistics?.longRecommendedTp ?? TEMP_PLACEHOLDER).toFixed(2)
  ); // recommendedTp // MARKET_PRICE * 1.15
  const longRecommendedSl = Number(
    (tickerLiveStatistics?.longRecommendedSl ?? TEMP_PLACEHOLDER).toFixed(2)
  ); // recommendedSl // MARKET_PRICE * 0.85

  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [targetInputValue, setTargetInputValue, targetInputValueRef] = useStateRef(0.02);

  // FIXME: SL setting should have a lower limit and an upper limit depending on its position type
  const [longTpValue, setLongTpValue] = useState(longRecommendedTp);
  const [longSlValue, setLongSlValue] = useState(longRecommendedSl);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(longRecommendedSl);
  const [shortSlValue, setShortSlValue] = useState(longRecommendedTp);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [expectedLongProfitValue, setExpectedLongProfitValue, expectedLongProfitValueRef] =
    useStateRef((longTpValue - Number(buyPrice)) * targetInputValueRef.current);

  const [expectedLongLossValue, setExpectedLongLossValue, expectedLongLossValueRef] = useStateRef(
    (Number(buyPrice) - longSlValue) * targetInputValueRef.current
  );

  const [expectedShortProfitValue, setExpectedShortProfitValue, expectedShortProfitValueRef] =
    useStateRef((Number(sellPrice) - shortTpValue) * targetInputValueRef.current);

  const [expectedShortLossValue, setExpectedShortLossValue, expectedShortLossValueRef] =
    useStateRef((shortSlValue - Number(sellPrice)) * targetInputValueRef.current);

  const [longGuaranteedStopChecked, setLongGuaranteedStopChecked] = useState(false);
  const [shortGuaranteedStopChecked, setShortGuaranteedStopChecked] = useState(false);

  const [requiredMarginLong, setRequiredMarginLong, requiredMarginLongRef] = useStateRef(
    roundToDecimalPlaces((targetInputValue * Number(longQuotationRef.current?.price)) / leverage, 2)
  );
  const [valueOfPositionLong, setValueOfPositionLong, valueOfPositionLongRef] = useStateRef(
    roundToDecimalPlaces(targetInputValue * Number(longQuotationRef.current?.price), 2)
  );

  const [quotationError, setQuotationError, quotationErrorRef] = useStateRef(false);

  // TODO: long vs short (20230327 - Shirley)
  const [marginWarning, setMarginWarning, marginWarningRef] = useStateRef(false);

  // TODO: long vs short && rm marketPrice (20230327 - Shirley)
  const [targetLength, setTargetLength] = useState(
    roundToDecimalPlaces((targetInputValue * marketPrice) / leverage, 2).toString().length
  );

  // TODO: long vs short (20230327 - Shirley)
  const [valueOfPositionLength, setValueOfPositionLength] = useState(
    roundToDecimalPlaces(targetInputValue * marketPrice, 2).toString().length
  );

  // Info: Fetch quotation the first time (20230327 - Shirley)
  useEffect(() => {
    if (!userCtx.enableServiceTerm) return;

    const now = getTimestamp();

    (async () => {
      const {longQuotation, shortQuotation} = await getQuotation(
        marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER
      );

      // Deprecated: before merging into develop (20230327 - Shirley)
      // eslint-disable-next-line no-console
      console.log('first time Effect (direct long)', now, longQuotation.data);
      // eslint-disable-next-line no-console
      console.log('first time Effect (direct short)', now, shortQuotation.data);

      setRequiredMarginLong(
        roundToDecimalPlaces(
          (targetInputValue * Number(longQuotationRef.current?.price)) / leverage,
          2
        )
      );
      setValueOfPositionLong(
        roundToDecimalPlaces(targetInputValue * Number(longQuotationRef.current?.price), 2)
      );
      setMarginWarning(requiredMarginLongRef.current > USER_BALANCE);
    })();

    // Deprecated: before merging into develop (20230327 - Shirley)
    // eslint-disable-next-line no-console
    console.log('first time Effect', now, longQuotationRef.current, shortQuotationRef.current);
  }, [userCtx.enableServiceTerm]);

  // Info: Fetch quotation in period (20230327 - Shirley)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!longQuotationRef.current || !shortQuotationRef.current) return;

      const base = longQuotationRef.current.deadline;
      const diff = base - getTimestamp();
      const tickingSec = diff > 0 ? Math.floor(diff) : 0;
      setSecondsLeft(tickingSec);

      const now = getTimestamp();

      if (tickingSec === 0) {
        const {longQuotation, shortQuotation} = await getQuotation(
          marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER
        );

        setRequiredMarginLong(
          roundToDecimalPlaces(
            (targetInputValue * Number(longQuotationRef.current?.price)) / leverage,
            2
          )
        );
        setValueOfPositionLong(
          roundToDecimalPlaces(targetInputValue * Number(longQuotationRef.current?.price), 2)
        );
        setMarginWarning(requiredMarginLongRef.current > USER_BALANCE);

        // Deprecated: before merging into develop (20230327 - Shirley)
        // eslint-disable-next-line no-console
        console.log('countdown Effect', now, longQuotationRef.current, shortQuotationRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft]);

  // Info: Fetch quotation when ticker changed (20230327 - Shirley)
  useEffect(() => {
    notificationCtx.emitter.once(ClickEvent.TICKER_CHANGED, async () => {
      marketPrice = marketCtx.selectedTickerRef.current?.price ?? TEMP_PLACEHOLDER;
      renewValueOfPosition(marketPrice);

      const {longQuotation, shortQuotation} = await getQuotation(
        marketCtx.selectedTickerRef.current?.currency ?? DEFAULT_TICKER
        // TODO: should be marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER (20230327 - Shirley)
        // marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER
      );

      setRequiredMarginLong(
        roundToDecimalPlaces(
          (targetInputValue * Number(longQuotationRef.current?.price)) / leverage,
          2
        )
      );
      setValueOfPositionLong(
        roundToDecimalPlaces(targetInputValue * Number(longQuotationRef.current?.price), 2)
      );
      setMarginWarning(requiredMarginLongRef.current > USER_BALANCE);

      const now = getTimestamp();

      // eslint-disable-next-line no-console
      console.log(
        'when ticker changed Effect',
        now,
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

      const long = longQuotation.data as IQuotation;

      if (longQuotation.success && long.typeOfPosition === TypeOfPosition.BUY) {
        setLongQuotation(long);

        // Deprecated: before merging into develop (20230327 - Shirley)
        // eslint-disable-next-line no-console
        // console.log('long ref in effect', longQuotationRef.current);
      }

      // ToDo: handle the error code (20230327 - Shirley)
      if (longQuotation.code === Code.WALLET_IS_NOT_CONNECT) {
        // console.log('WALLET_IS_NOT_CONNECT');
        setQuotationError(true);
      } else if (longQuotation.code === Code.INVAILD_INPUTS) {
        // console.log('INVAILD_INPUTS');
        setQuotationError(true);
      } else if (longQuotation.code === Code.SERVICE_TERM_DISABLE) {
        // console.log('SERVICE_TERM_DISABLE');
        setQuotationError(true);
      } else if (longQuotation.code === Code.INTERNAL_SERVER_ERROR) {
        // console.log('INTERNAL_SERVER_ERROR');
        setQuotationError(true);
      }
    } catch (err) {
      // ToDo: handle the error code (20230327 - Shirley)
      // console.error(err);
      setQuotationError(true);
    }

    try {
      shortQuotation = await marketCtx.getCFDQuotation(tickerId, TypeOfPosition.SELL);

      const short = shortQuotation.data as IQuotation;

      if (shortQuotation.success && short && short.typeOfPosition === TypeOfPosition.SELL) {
        setShortQuotation(short);

        // Deprecated: before merging into develop (20230327 - Shirley)
        // eslint-disable-next-line no-console
        // console.log('short ref in effect', shortQuotationRef.current);
      }

      // ToDo: handle the error code (20230327 - Shirley)
      if (shortQuotation.code === Code.WALLET_IS_NOT_CONNECT) {
        // console.log('WALLET_IS_NOT_CONNECT');
        setQuotationError(true);
      } else if (shortQuotation.code === Code.INVAILD_INPUTS) {
        // console.log('INVAILD_INPUTS');
        setQuotationError(true);
      } else if (shortQuotation.code === Code.SERVICE_TERM_DISABLE) {
        // console.log('SERVICE_TERM_DISABLE');
        setQuotationError(true);
      } else if (shortQuotation.code === Code.INTERNAL_SERVER_ERROR) {
        // console.log('INTERNAL_SERVER_ERROR');
        setQuotationError(true);
      }
    } catch (err) {
      // ToDo: handle the error code (20230327 - Shirley)
      // console.error(err);
      setQuotationError(true);
    }

    return {longQuotation: longQuotation, shortQuotation: shortQuotation};
  };

  const getTargetInputValue = (value: number) => {
    setTargetInputValue(value);
    targetAmountDetection(value);

    setExpectedLongProfitValue((longTpValue - Number(buyPrice)) * targetInputValueRef.current);
    setExpectedLongLossValue((Number(buyPrice) - longSlValue) * targetInputValueRef.current);
    setExpectedShortProfitValue((Number(sellPrice) - shortTpValue) * targetInputValueRef.current);
    setExpectedShortLossValue((shortSlValue - Number(sellPrice)) * targetInputValueRef.current);
  };
  const getLongTpValue = (value: number) => {
    setLongTpValue(value);

    setExpectedLongProfitValue((longTpValue - Number(buyPrice)) * targetInputValueRef.current);
  };

  const getLongSlValue = (value: number) => {
    setLongSlValue(value);

    setExpectedLongLossValue((Number(buyPrice) - longSlValue) * targetInputValueRef.current);
  };

  const getShortTpValue = (value: number) => {
    setShortTpValue(value);

    setExpectedShortProfitValue((Number(sellPrice) - shortTpValue) * targetInputValueRef.current);
  };

  const getShortSlValue = (value: number) => {
    setShortSlValue(value);

    setExpectedShortLossValue((shortSlValue - Number(sellPrice)) * targetInputValueRef.current);
  };

  const renewValueOfPosition = (price?: number) => {
    const newValueOfPosition = price
      ? targetInputValueRef.current * price
      : targetInputValueRef.current * (longQuotationRef.current?.price ?? 0);

    const roundedValueOfPosition = roundToDecimalPlaces(newValueOfPosition, 2);
    setValueOfPositionLong(roundedValueOfPosition);

    const margin = newValueOfPosition / leverage;
    const roundedMargin = roundToDecimalPlaces(margin, 2);
    setRequiredMarginLong(roundedMargin);

    setMarginWarning(margin > USER_BALANCE);

    setTargetLength(roundedMargin.toString().length);
    setValueOfPositionLength(roundedValueOfPosition.toString().length);
  };

  const targetAmountDetection = (value?: number) => {
    renewValueOfPosition();
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
      ? '+'
      : expectedShortProfitValueRef.current < 0
      ? '-'
      : '';

  const shortLossSymbol =
    expectedShortLossValueRef.current > 0 ? '+' : expectedShortLossValueRef.current < 0 ? '-' : '';

  const getToggledLongTpSetting = (bool: boolean) => {
    setLongTpToggle(bool);

    setExpectedLongProfitValue((longTpValue - Number(buyPrice)) * targetInputValueRef.current);
  };

  const getToggledLongSlSetting = (bool: boolean) => {
    setLongSlToggle(bool);

    setExpectedLongLossValue((Number(buyPrice) - longSlValue) * targetInputValueRef.current);
  };

  const getToggledShortTpSetting = (bool: boolean) => {
    setShortTpToggle(bool);

    setExpectedShortProfitValue((Number(sellPrice) - shortTpValue) * targetInputValueRef.current);
  };

  const getToggledShortSlSetting = (bool: boolean) => {
    setShortSlToggle(bool);

    setExpectedShortLossValue((shortSlValue - Number(sellPrice)) * targetInputValueRef.current);
  };

  const isDisplayedLongSlSetting = longSlToggle ? 'flex' : 'invisible';
  const isDisplayedShortSlSetting = shortSlToggle ? 'flex' : 'invisible';

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const isDisplayedMarginStyle = marginWarningRef.current ? 'text-lightGray' : 'text-lightWhite';
  const isDisplayedMarginWarning = marginWarningRef.current ? 'flex' : 'invisible';
  const isDisplayedMarginSize = targetLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueSize = valueOfPositionLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedDividerSpacing =
    valueOfPositionLength > 10 || targetLength > 10 ? 'top-430px' : 'top-420px';

  const toApplyCreateOrder = (): {
    longOrder: IApplyCreateCFDOrderData;
    shortOrder: IApplyCreateCFDOrderData;
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

    const longOrder: IApplyCreateCFDOrderData = {
      ...share,
      price: Number(buyPrice) ?? BUY_PRICE_ERROR,
      typeOfPosition: TypeOfPosition.BUY,
      quotation: {
        ticker: marketCtx.selectedTicker?.currency ?? '',
        targetAsset: marketCtx.selectedTicker?.currency ?? '',
        typeOfPosition: TypeOfPosition.BUY,
        unitAsset: unitAsset,
        price: Number(buyPrice) ?? BUY_PRICE_ERROR,
        deadline: getTimestamp() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      },
      liquidationPrice: 1000,
      fee: marketCtx.tickerLiveStatistics?.fee ?? BUY_PRICE_ERROR,
      guaranteedStop: longSlToggle ? longGuaranteedStopChecked : false,
      // TODO: (20230315 - SHirley) cal guaranteedStopFee (percent from Ctx)
      guaranteedStopFee: longSlToggle && longGuaranteedStopChecked ? 22 : 0,
      takeProfit: longTpToggle ? longTpValue : undefined,
      stopLoss: longSlToggle ? longSlValue : undefined,
    };

    const shortOrder: IApplyCreateCFDOrderData = {
      ...share,
      typeOfPosition: TypeOfPosition.SELL,
      quotation: {
        ticker: marketCtx.selectedTicker?.currency ?? '',
        typeOfPosition: TypeOfPosition.SELL,
        targetAsset: marketCtx.selectedTicker?.currency ?? '',
        unitAsset: unitAsset,
        price: Number(sellPrice) ?? SELL_PRICE_ERROR,
        deadline: getTimestamp() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      },
      price: Number(sellPrice) ?? SELL_PRICE_ERROR,
      liquidationPrice: 1000,
      fee: marketCtx.tickerLiveStatistics?.fee ?? BUY_PRICE_ERROR,
      guaranteedStop: shortSlToggle ? shortGuaranteedStopChecked : false,
      // TODO: (20230315 - SHirley) cal guaranteedStopFee (percent from Ctx)
      guaranteedStopFee: shortSlToggle && shortGuaranteedStopChecked ? 22 : 0,
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

  const longToolMouseEnterHandler = () => setLongTooltipStatus(3);
  const longToolMouseLeaveHandler = () => setLongTooltipStatus(0);

  const shortToolMouseEnterHandler = () => setShortTooltipStatus(3);
  const shortToolMouseLeaveHandler = () => setShortTooltipStatus(0);

  /* Till: (20230409 - Shirley)
  // FIXME: it won't renew when user check guaranteed-stop
  // useEffect(() => {
  //   globalCtx.dataPositionOpenModalHandler({
  //     id: '202302221915',
  //     ticker: marketCtx.selectedTicker?.currency ?? '',
  //     typeOfPosition: TypeOfPosition.BUY,
  //     orderType: OrderType.CFD,
  //     orderStatus: OrderStatusUnion.PROCESSING,
  //     price: Number(buyEstimatedFilledPrice) ?? 9999999999,
  //     // price: marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 9999999999,
  //     // price: marketCtx.selectedTicker?.price ?? 9999999999,
  //     triggerPrice: marketCtx.selectedTicker?.price ?? 9999999999,
  //     estimatedFilledPrice: marketCtx.selectedTicker?.price ?? 9999999999,
  //     fee: marketCtx.tickerLiveStatistics?.fee ?? 9999999999,
  //     leverage: marketCtx.tickerStatic?.leverage ?? 1,
  //     // TODO: requiredMarginRef.current / requiredMargin
  //     margin: requiredMarginRef.current,
  //     guranteedStop: longSlToggle ? longGuaranteedStopChecked : false,
  //     takeProfit: longTpToggle ? longTpValue : undefined,
  //     stopLoss: longSlToggle ? longSlValue : undefined,
  //     createdTime: 1676369333495,
  //     targetUnit: marketCtx.selectedTicker?.currency ?? '',
  //     chargeUnit: 'USDT',
  //   });
  // }, [marginInputValue, marketCtx.selectedTicker]);
  */

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

  const displayedRequiredMarginStyle = (
    <>
      {/* <div className="mt-1 text-base text-lightWhite">$ 13.14 USDT</div> */}
      <div className={`${isDisplayedMarginStyle} ${isDisplayedMarginSize} mt-1 text-base`}>
        {requiredMarginLongRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} {unitAsset}
      </div>
      <div className={`${isDisplayedMarginWarning} ml-3 text-xs text-lightRed`}>
        * {t('TRADE_PAGE.TRADE_TAB_NOT_ENOUGH_MARGIN')}
      </div>
    </>
  );

  // ----------long area----------
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
    // longTpToggle ? (
    //   <div className={`${`translate-y-2`} -mt-0 items-center transition-all duration-500`}>
    //     <div className="text-sm text-lightWhite">
    //       {expectedLongProfitValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
    //     </div>
    //   </div>
    // ) : null;

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

  // TODO:　Guranteed stop Layout
  const longGuaranteedStop = (
    // <div className={`${isDisplayedLongSlSetting} mt-0 h-14 items-center`}>
    <div
      className={`${
        longSlToggle ? `translate-y-5` : `invisible translate-y-0`
      } mt-0 mb-10 flex items-center transition-all`}
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
          ({t('TRADE_PAGE.TRADE_TAB_FEE')}: {guaranteedStopFee} {unitAsset})
        </span>
        {/* <span className="">
          <AiOutlineQuestionCircle size={20} />
        </span> */}
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
                className={`absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out`}
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
    // <div className={isDisplayedShortSlSetting}>
    <div
      className={`${
        shortSlToggle ? `translate-y-5` : `invisible translate-y-0`
      } mt-0 mb-10 items-center transition-all`}
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
            ({t('TRADE_PAGE.TRADE_TAB_FEE')}: {guaranteedStopFee} {unitAsset})
          </span>
          {/* <span className="">
          <AiOutlineQuestionCircle size={20} />
        </span> */}
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
                  className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
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
    <div>
      {/* `overflow-y-scroll scroll-smooth` only show the scroll bar but no functionality */}
      <div
        className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
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
                    {displayedRequiredMarginStyle}
                  </div>
                  {/* Left Divider */}
                  <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

                  <div className="w-1/2 space-y-1">
                    <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
                    <div className={`text-base text-lightWhite ${isDisplayedValueSize}`}>
                      {valueOfPositionLongRef.current?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE
                      )}{' '}
                      {unitAsset}
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Take Profit Setting */}
                  <div className="h-60px">
                    <div className="mt-3 mb-5 flex h-25px items-center justify-between">
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

                {/* Deprecated: before merging into develop (20230327 - Shirley) */}
                <p>{secondsLeft}</p>
                {/* Long Button */}
                <div className="ml-1/4">
                  <RippleButton
                    disabled={marginWarningRef.current || quotationErrorRef.current}
                    onClick={longOrderSubmitHandler}
                    buttonType="button"
                    className="mr-2 mb-2 rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray"
                  >
                    <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
                    {t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON_SUBTITLE')} ₮ {buyPrice}
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
                    {displayedRequiredMarginStyle}
                  </div>
                  {/* Left Divider */}
                  <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

                  <div className="w-1/2 space-y-1">
                    <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
                    <div className={`text-base text-lightWhite ${isDisplayedValueSize}`}>
                      {valueOfPositionLongRef.current?.toLocaleString(
                        UNIVERSAL_NUMBER_FORMAT_LOCALE
                      )}{' '}
                      {unitAsset}
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Take Profit Setting */}
                  <div className="h-60px">
                    <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                      <div className="text-sm text-lightGray">
                        {t('TRADE_PAGE.TRADE_TAB_TP_SETTING')}
                      </div>
                      {displayedShortTpSetting}{' '}
                      <Toggle getToggledState={getToggledShortTpSetting} />
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
                    disabled={marginWarningRef.current || quotationErrorRef.current}
                    onClick={shortOrderSubmitHandler}
                    buttonType="button"
                    className="mr-2 mb-2 rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray"
                  >
                    <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
                    {t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON_SUBTITLE')} ₮ {sellPrice}
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeTab;

import React, {useContext, useEffect, useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {
  TARGET_LIMIT_DIGITS,
  RENEW_QUOTATION_INTERVAL_SECONDS,
  unitAsset,
} from '../../constants/config';
import {useGlobal} from '../../contexts/global_context';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import useStateRef from 'react-usestateref';
import EventEmitter from 'events';
import {TypeOfPosition} from '../../constants/type_of_position';
import {OrderType} from '../../constants/order_type';
import {OrderStatusUnion} from '../../constants/order_status_union';
import eventEmitter, {ClickEvent} from '../../constants/tidebit_event';
import {getDummyDisplayApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {IApplyCreateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {CFDOrderType} from '../../constants/cfd_order_type';
import {getNowSeconds, roundToDecimalPlaces} from '../../lib/common';

const TradeTab = () => {
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    eventEmitter.once(ClickEvent.TICKER_CHANGED, () => {
      marketPrice = marketCtx.selectedTickerRef.current?.price ?? TEMP_PLACEHOLDER;
      renewValueOfPosition(marketPrice);
    });

    return () => {
      eventEmitter.removeAllListeners(ClickEvent.TICKER_CHANGED);
    };
  }, [marketCtx.selectedTickerRef.current]);

  const tabBodyWidth = 'w-320px';

  // TODO: switch to the certain ticker's statistics
  const tickerLiveStatistics = marketCtx.tickerLiveStatistics;
  const tickerStaticStatistics = marketCtx.tickerStatic;

  // FIXME: It should have the default value of `tickerLiveStatistics`
  const TEMP_PLACEHOLDER = TARGET_LIMIT_DIGITS;

  const ticker = marketCtx.selectedTicker?.currency ?? '';
  // const LIQUIDATION_PRICE = 7548; // TODO: tickerLiveStatistics
  const USER_BALANCE = userCtx.balance?.available ?? 0;

  const leverage = tickerStaticStatistics?.leverage ?? 1;
  const guaranteedStopFee = tickerStaticStatistics?.guaranteedStopFee;

  let marketPrice = marketCtx.selectedTicker?.price ?? TEMP_PLACEHOLDER;

  const buyPrice = (tickerLiveStatistics?.buyEstimatedFilledPrice ?? TEMP_PLACEHOLDER).toFixed(2); // market price * (1+spread)
  const sellPrice = (tickerLiveStatistics?.sellEstimatedFilledPrice ?? TEMP_PLACEHOLDER).toFixed(2); // market price * (1-spread)
  const longRecommendedTp = Number(
    (tickerLiveStatistics?.longRecommendedTp ?? TEMP_PLACEHOLDER).toFixed(2)
  );
  const longRecommendedSl = Number(
    (tickerLiveStatistics?.longRecommendedSl ?? TEMP_PLACEHOLDER).toFixed(2)
  );

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

  const [requiredMargin, setRequiredMargin, requiredMarginRef] = useStateRef(
    roundToDecimalPlaces((targetInputValue * marketPrice) / leverage, 2)
  );
  const [valueOfPosition, setValueOfPosition, valueOfPositionRef] = useStateRef(
    roundToDecimalPlaces(targetInputValue * marketPrice, 2)
  );
  const [marginWarning, setMarginWarning] = useState(false);

  const [targetLength, setTargetLength] = useState(
    roundToDecimalPlaces((targetInputValue * marketPrice) / leverage, 2).toString().length
  );
  const [valueOfPositionLength, setValueOfPositionLength] = useState(
    roundToDecimalPlaces(targetInputValue * marketPrice, 2).toString().length
  );

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

    // TODO: (20230317 - Shirley)
    // console.log('longTpValue', longTpValue);
    // console.log('buyPrice', buyPrice);
    // console.log('marginInputValueRef.current', marginInputValueRef.current);

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
      : targetInputValueRef.current * marketPrice;

    const roundedValueOfPosition = roundToDecimalPlaces(newValueOfPosition, 2);
    setValueOfPosition(roundedValueOfPosition);

    const margin = newValueOfPosition / leverage;
    const roundedMargin = roundToDecimalPlaces(margin, 2);
    setRequiredMargin(roundedMargin);

    setMarginWarning(margin > USER_BALANCE);

    setTargetLength(roundedMargin.toString().length);
    setValueOfPositionLength(roundedValueOfPosition.toString().length);
  };

  const targetAmountDetection = (value?: number) => {
    renewValueOfPosition();
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

  // `block` `flex`
  const isDisplayedLongSlSetting = longSlToggle ? 'flex' : 'invisible';
  const isDisplayedShortSlSetting = shortSlToggle ? 'flex' : 'invisible';
  // const isDisplayedLongGuranteedCheckbox = longTpToggle ? 'absolute' : 'invisible';

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const isDisplayedMarginStyle = marginWarning ? 'text-lightGray' : 'text-lightWhite';
  const isDisplayedMarginWarning = marginWarning ? 'flex' : 'invisible';
  const isDisplayedMarginSize = targetLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueSize = valueOfPositionLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedDividerSpacing =
    valueOfPositionLength > 10 || targetLength > 10 ? 'top-430px' : 'top-420px';

  const toApplyCreateOrder = (): {
    longOrder: IApplyCreateCFDOrderData;
    shortOrder: IApplyCreateCFDOrderData;
  } => {
    const longOrder: IApplyCreateCFDOrderData = {
      ticker: marketCtx.selectedTicker?.currency ?? '',
      targetAsset: marketCtx.selectedTicker?.currency ?? '',
      uniAsset: unitAsset,
      price: Number(buyPrice) ?? 9999999999,
      amount: targetInputValueRef.current,
      typeOfPosition: TypeOfPosition.BUY,
      leverage: marketCtx.tickerStatic?.leverage ?? 1,
      margin: {
        asset: unitAsset,
        amount: requiredMarginRef.current,
      },
      quotation: {
        ticker: marketCtx.selectedTicker?.currency ?? '',
        targetAsset: marketCtx.selectedTicker?.currency ?? '',
        uniAsset: unitAsset,
        price: Number(buyPrice) ?? 9999999999,
        deadline: getNowSeconds() + RENEW_QUOTATION_INTERVAL_SECONDS,
        signature: '0x',
      },
      liquidationPrice: 1000,
      liquidationTime: Math.ceil(Date.now() / 1000) + 86400,
      fee: marketCtx.tickerLiveStatistics?.fee ?? 9999999999,
      guaranteedStop: longSlToggle ? longGuaranteedStopChecked : false,
      // TODO: (20230315 - SHirley) cal guaranteedStopFee (percent from Ctx)
      guaranteedStopFee: longSlToggle && longGuaranteedStopChecked ? 22 : 0,
      takeProfit: longTpToggle ? longTpValue : undefined,
      stopLoss: longSlToggle ? longSlValue : undefined,
    };

    const shortOrder: IApplyCreateCFDOrderData = {
      ticker: marketCtx.selectedTicker?.currency ?? '',
      targetAsset: marketCtx.selectedTicker?.currency ?? '',
      uniAsset: unitAsset,
      typeOfPosition: TypeOfPosition.SELL,
      margin: {
        asset: unitAsset,
        amount: requiredMarginRef.current,
      },
      quotation: {
        ticker: marketCtx.selectedTicker?.currency ?? '',
        targetAsset: marketCtx.selectedTicker?.currency ?? '',
        uniAsset: unitAsset,
        price: Number(sellPrice) ?? 9999999999,
        deadline: getNowSeconds() + RENEW_QUOTATION_INTERVAL_SECONDS,
        signature: '0x',
      },
      price: Number(sellPrice) ?? 9999999999,
      amount: targetInputValueRef.current,
      liquidationPrice: 1000,
      liquidationTime: getNowSeconds() + 86400,
      fee: marketCtx.tickerLiveStatistics?.fee ?? 9999999999,
      leverage: marketCtx.tickerStatic?.leverage ?? 1,
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
      <div className={`${isDisplayedMarginStyle} ${isDisplayedMarginSize} mt-1 text-base`}>
        $ {requiredMarginRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
      </div>
      <div className={`${isDisplayedMarginWarning} ml-3 text-xs text-lightRed`}>
        * Not enough margin
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
    // todo: (20230329 - Shirley)
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
        * Expected profit: {longProfitSymbol} ${' '}
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
        * Expected loss: {longLossSymbol} ${' '}
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
        Guaranteed stop &nbsp;
        <span className="text-lightWhite"> (Fee: {guaranteedStopFee} USDT)</span>
        {/* tooltip */}
        <div className="ml-1">
          <div
            className="relative"
            onMouseEnter={() => setLongTooltipStatus(3)}
            onMouseLeave={() => setLongTooltipStatus(0)}
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
                  Guaranteed stop will force the position to close at your chosen rate (price) even
                  if the market price surpasses it.
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
        * Expected profit: {shortProfitSymbol} ${' '}
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
        * Expected loss: {shortLossSymbol} ${' '}
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
          Guaranteed stop &nbsp;
          <span className="text-lightWhite"> (Fee: {guaranteedStopFee} USDT)</span>
          {/* tooltip */}
          <div className="ml-1">
            <div
              className="relative"
              onMouseEnter={() => setShortTooltipStatus(3)}
              onMouseLeave={() => setShortTooltipStatus(0)}
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
                    Guaranteed stop will force the position to close at your chosen rate (price)
                    even if the market price surpasses it. at your chosen rate (price) even if the
                    market price surpasses it.
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
              className={`pointer-events-auto ${tabBodyWidth} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
            >
              {/* <h1 className="pl-5 text-2xl font-bold">Start to trade</h1> */}

              {/* ---target input area--- */}
              {displayedTargetAmountSetting}

              {/* ---universal trading info area--- */}
              <div className="mt-2 text-lightGray">
                <div className="flex justify-center text-xs">{ticker}</div>
                <div className="mt-2">
                  <div className="flex justify-center text-sm">Leverage</div>
                  <div className="flex justify-center text-base text-lightWhite">1:{leverage}</div>
                </div>
              </div>

              {/* ---custom trading info area--- */}
              <div className="mt-2 flex w-full justify-center text-center text-base tracking-normal">
                <div className="-ml-0 mr-0 w-1/2">
                  <div className="text-sm text-lightGray">Required Margin</div>
                  {displayedRequiredMarginStyle}
                </div>

                {/* Left Divider */}
                <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

                <div>
                  {/* ml-1 mr-5  */}
                  {/* <span className="mx-1 inline-block h-11 w-px rounded bg-lightGray/50"></span> */}
                </div>

                <div className="ml-0 w-1/2 space-y-1">
                  <div className="text-sm text-lightGray">Value</div>
                  <div className={`text-base text-lightWhite ${isDisplayedValueSize}`}>
                    $ {valueOfPositionRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}{' '}
                    USDT
                  </div>
                </div>
              </div>

              {/* ---Long Section--- */}
              {/* Take Profit Setting */}
              <div>
                <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                  <div className="text-sm text-lightGray">Close at profit</div>
                  {displayedLongTpSetting}
                  <Toggle getToggledState={getToggledLongTpSetting} />
                </div>

                {displayedExpectedLongProfit}
              </div>

              {/* Stop Loss Setting */}
              <div>
                <div className="flex h-25px items-center justify-between">
                  <div className="text-sm text-lightGray">Clost at loss</div>
                  <div className="w-105px">{displayedLongSlSetting}</div>
                  <Toggle getToggledState={getToggledLongSlSetting} />
                </div>

                {displayedExpectedLongLoss}

                {/* Guaranteed stop */}
                {longGuaranteedStop}
              </div>

              {/* Below Use absolute for layout */}

              {/* Long Button */}
              {/* absolute top-350px left-20 */}
              <div className="mt-0 ml-1/4">
                {/* focus:outline-none focus:ring-4 focus:ring-green-300 */}
                <RippleButton
                  disabled={marginWarning}
                  onClick={longOrderSubmitHandler}
                  buttonType="button"
                  className="mr-2 mb-2 rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80 disabled:bg-lightGray"
                >
                  <b>UP</b> <br />
                  Above $ {buyPrice}
                </RippleButton>
              </div>
              {/* Divider: border-bottom */}
              <div className="mt-3 border-b-1px border-lightGray"></div>

              {/* Divider between long and short */}
              {/* <span
                className={`${isDisplayedDividerSpacing} absolute top-420px my-auto h-px w-7/8 rounded bg-white/50`}
              ></span> */}

              {/* ---Short Section--- */}
              <div className="">
                {/* ---custom trading info--- */}
                <div className="mt-5 flex justify-center text-center text-base tracking-normal">
                  <div className="w-1/2 space-y-1">
                    <div className="text-sm text-lightGray">Required Margin</div>
                    {displayedRequiredMarginStyle}
                  </div>
                  {/* Left Divider */}
                  <div className="mx-2 h-14 justify-center border-r-1px border-lightGray"></div>

                  <div>
                    {/* ml-1 mr-5  */}
                    {/* <span className="mx-1 inline-block h-11 w-px rounded bg-lightGray/50"></span> */}
                  </div>

                  <div className="w-1/2 space-y-1">
                    <div className="text-sm text-lightGray">Value</div>
                    <div className={`text-base text-lightWhite ${isDisplayedValueSize}`}>
                      $ {valueOfPositionRef.current?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}{' '}
                      USDT
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Take Profit Setting */}
                  <div>
                    <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                      <div className="text-sm text-lightGray">Close at profit</div>
                      {displayedShortTpSetting}
                      <div className="">
                        {' '}
                        <Toggle getToggledState={getToggledShortTpSetting} />
                      </div>
                    </div>

                    {displayedExpectedShortProfit}
                  </div>

                  {/* Stop Loss Setting */}
                  <div>
                    <div className="flex h-25px items-center justify-between">
                      <div className="text-sm text-lightGray">Clost at loss</div>
                      <div className="w-105px">{displayedShortSlSetting}</div>
                      <div className="">
                        <Toggle getToggledState={getToggledShortSlSetting} />
                      </div>
                    </div>

                    {displayedExpectedShortLoss}
                    {/* Guaranteed stop */}
                    {shortGuaranteedStop}
                  </div>
                </div>

                {/* Short Button */}
                <div className="mt-5 ml-1/4">
                  <RippleButton
                    disabled={marginWarning}
                    onClick={shortOrderSubmitHandler}
                    buttonType="button"
                    className="mr-2 mb-2 rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 disabled:bg-lightGray"
                  >
                    <b>Down</b> <br />
                    Below $ {sellPrice}
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

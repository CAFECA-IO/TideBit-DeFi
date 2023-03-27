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
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {
  TARGET_LIMIT_DIGITS,
  POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
  unitAsset,
} from '../../constants/config';
import {ClickEvent} from '../../constants/tidebit_event';
import {useTranslation} from 'next-i18next';
import {getTimestamp, roundToDecimalPlaces} from '../../lib/common';
import {getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {NotificationContext} from '../../contexts/notification_context';
import {IApplyCreateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';

type TranslateFunction = (s: string) => string;

const TradeTabMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    notificationCtx.emitter.once(ClickEvent.TICKER_CHANGED, () => {
      marketPrice = marketCtx.selectedTickerRef.current?.price ?? TEMP_PLACEHOLDER;
      renewValueOfPosition(marketPrice);
    });

    return () => {
      notificationCtx.emitter.removeAllListeners(ClickEvent.TICKER_CHANGED);
    };
  }, [marketCtx.selectedTicker]);

  const tickerLiveStatistics = marketCtx.tickerLiveStatistics;
  const tickerStaticStatistics = marketCtx.tickerStatic;

  const TEMP_PLACEHOLDER = TARGET_LIMIT_DIGITS;

  const ticker = marketCtx.selectedTicker?.currency ?? '';

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

  const [longTpValue, setLongTpValue] = useState(longRecommendedTp);
  const [longSlValue, setLongSlValue] = useState(longRecommendedSl);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(longRecommendedSl);
  const [shortSlValue, setShortSlValue] = useState(longRecommendedTp);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [activeTab, setActiveTab] = useState('Long');
  const [openSubMenu, setOpenSubMenu] = useState(false);

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

  const longToolMouseEnterHandler = () => setLongTooltipStatus(3);
  const longToolMouseLeaveHandler = () => setLongTooltipStatus(0);

  const shortToolMouseEnterHandler = () => setShortTooltipStatus(3);
  const shortToolMouseLeaveHandler = () => setShortTooltipStatus(0);

  const toApplyCreateOrder = (): {
    longOrder: IApplyCreateCFDOrderData;
    shortOrder: IApplyCreateCFDOrderData;
  } => {
    const longOrder: IApplyCreateCFDOrderData = {
      ticker: marketCtx.selectedTicker?.currency ?? '',
      targetAsset: marketCtx.selectedTicker?.currency ?? '',
      unitAsset: unitAsset,
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
        typeOfPosition: TypeOfPosition.BUY,
        unitAsset: unitAsset,
        price: Number(buyPrice) ?? 9999999999,
        deadline: getTimestamp() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
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
      unitAsset: unitAsset,
      typeOfPosition: TypeOfPosition.SELL,
      margin: {
        asset: unitAsset,
        amount: requiredMarginRef.current,
      },
      quotation: {
        ticker: marketCtx.selectedTicker?.currency ?? '',
        typeOfPosition: TypeOfPosition.SELL,
        targetAsset: marketCtx.selectedTicker?.currency ?? '',
        unitAsset: unitAsset,
        price: Number(sellPrice) ?? 9999999999,
        deadline: getTimestamp() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      },
      price: Number(sellPrice) ?? 9999999999,
      amount: targetInputValueRef.current,
      liquidationPrice: 1000,
      liquidationTime: getTimestamp() + 86400,
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

  const isDisplayedMarginStyle = marginWarning ? 'text-lightGray' : 'text-lightWhite';
  const isDisplayedMarginWarning = marginWarning ? 'flex' : 'invisible';
  const isDisplayedMarginSize = targetLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueSize = valueOfPositionLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedDividerSpacing =
    valueOfPositionLength > 10 || targetLength > 10 ? 'top-430px' : 'top-420px';

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

  const displayedRequiredMarginStyle = (
    <>
      <div className={`${isDisplayedMarginStyle} ${isDisplayedMarginSize} mt-1 text-base`}>
        {requiredMargin?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} {unitAsset}
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
    <div className={isDisplayedLongTpSetting}>
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
        lowerLimit={0}
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

  // TODO:　Guranteed stop Layout
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
            ({t('TRADE_PAGE.TRADE_TAB_FEE')} {guaranteedStopFee} {unitAsset})
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
                  className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
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
  const shortGuaranteedStopChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortGuaranteedStopChecked(e.target.checked);
  };

  const displayedShortTpSetting = (
    <div className={isDisplayedShortTpSetting}>
      <TradingInput
        lowerLimit={0}
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
            ({t('TRADE_PAGE.TRADE_TAB_FEE')} {guaranteedStopFee} {unitAsset})
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
              {displayedRequiredMarginStyle}
            </div>

            <div>
              <span className="mx-5 inline-block h-14 w-px rounded bg-lightGray/50"></span>
            </div>

            <div className="w-1/2">
              <div className="text-sm text-lightGray">{t('TRADE_PAGE.TRADE_TAB_VALUE')}</div>
              <div className={`text-base text-lightWhite ${isDisplayedValueSize}`}>
                {valueOfPosition?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} {unitAsset}
              </div>
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
            buttonType="button"
            className={`w-full rounded-md bg-lightGreen5 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80`}
            onClick={longSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON')}</b> <br />
            <p className="text-xs">
              {t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON_SUBTITLE')} ₮ {buyPrice}
            </p>
          </RippleButton>
        </div>

        {/* Short Button */}
        <div
          className={`bg-black/100 transition-all duration-300 ease-in-out ${shortButtonStyles}`}
        >
          <RippleButton
            buttonType="button"
            className={`w-full rounded-md bg-lightRed py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80`}
            onClick={shortSectionClickHandler}
          >
            <b>{t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON')}</b> <br />
            <p className="text-xs">
              {t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON_SUBTITLE')} ₮ {sellPrice}
            </p>
          </RippleButton>
        </div>
      </div>
      {subMenu}
    </>
  );
};

export default TradeTabMobile;

import React, {useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput, {TRADING_INPUT_HANDLER_TYPE_CLASSES} from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {MARGIN_LIMIT_DIGITS} from '../../constants/config';
import {useGlobal} from '../../contexts/global_context';

const TradeTab = () => {
  const globalCtx = useGlobal();
  // TODO: Use Stop loss limit and other data from Market context
  const MARKET_PRICE = 6290.41;
  const LIQUIDATION_PRICE = 7548;
  const USER_BALANCE = 1000;
  const LEVERAGE = 5;
  const guaranteedStopFee = 0.97;
  const buyEstimatedFilledPrice = (MARKET_PRICE * 1.008).toFixed(2); // market price * (1+spread)
  const sellEstimatedFilledPrice = (MARKET_PRICE * 0.992).toFixed(2); // market price * (1-spread)
  const longRecommendedTp = Number((MARKET_PRICE * 1.15).toFixed(2)); // recommendedTp // MARKET_PRICE * 1.15
  const longRecommendedSl = Number((MARKET_PRICE * 0.85).toFixed(2)); // recommendedSl // MARKET_PRICE * 0.85
  // const shortRecommendedTp = Number((MARKET_PRICE * 0.85).toFixed(2));
  // const shortRecommendedSl = Number((MARKET_PRICE * 1.15).toFixed(2));

  const roundToDecimalPlaces = (val: number, precision: number): number => {
    const roundedNumber = Number(val.toFixed(precision));
    return roundedNumber;
  };

  // const marginInputRef = useRef<HTMLInputElement>(null);

  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [margingInputValue, setMarginInputValue] = useState(0.02);

  const [longTpValue, setLongTpValue] = useState(longRecommendedTp);
  const [longSlValue, setLongSlValue] = useState(longRecommendedSl);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(longRecommendedSl);
  const [shortSlValue, setShortSlValue] = useState(longRecommendedTp);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [requiredMargin, setRequiredMargin] = useState(
    roundToDecimalPlaces((margingInputValue * MARKET_PRICE) / LEVERAGE, 2)
  );
  const [valueOfPosition, setValueOfPosition] = useState(
    roundToDecimalPlaces(margingInputValue * MARKET_PRICE, 2)
  );
  const [marginWarning, setMarginWarning] = useState(false);

  const [marginLength, setMarginLength] = useState(
    roundToDecimalPlaces((margingInputValue * MARKET_PRICE) / LEVERAGE, 2).toString().length
  );
  const [valueOfPositionLength, setValueOfPositionLength] = useState(
    roundToDecimalPlaces(margingInputValue * MARKET_PRICE, 2).toString().length
  );

  const getMarginInputValue = (value: number) => {
    setMarginInputValue(value);
    marginDetection(value);
    // console.log('getMarginInputValue', value);
  };
  const getLongTpValue = (value: number) => {
    setLongTpValue(value);
  };

  const getLongSlValue = (value: number) => {
    setLongSlValue(value);
  };

  const getShortTpValue = (value: number) => {
    setShortTpValue(value);
  };

  const getShortSlValue = (value: number) => {
    setShortSlValue(value);
  };

  const marginDetection = (value: number) => {
    const newValueOfPosition = value * MARKET_PRICE;
    const roundedValueOfPosition = roundToDecimalPlaces(newValueOfPosition, 2);
    setValueOfPosition(roundedValueOfPosition);

    const margin = newValueOfPosition / 5;
    const roundedMargin = roundToDecimalPlaces(margin, 2);
    setRequiredMargin(roundedMargin);

    setMarginWarning(margin > USER_BALANCE);

    setMarginLength(roundedMargin.toString().length);
    setValueOfPositionLength(roundedValueOfPosition.toString().length);
  };

  const getToggledLongTpSetting = (bool: boolean) => {
    setLongTpToggle(bool);
  };

  const getToggledLongSlSetting = (bool: boolean) => {
    setLongSlToggle(bool);
  };

  const getToggledShortTpSetting = (bool: boolean) => {
    setShortTpToggle(bool);
  };

  const getToggledShortSlSetting = (bool: boolean) => {
    // console.log('getToggledShortSlSetting', bool);
    setShortSlToggle(bool);
  };

  // const longTpToggleClickHandler = () => {
  //   setLongTpToggle(!longTpToggle);
  // };

  // const longSlToggleClickHandler = () => {
  //   setLongSlToggle(!longSlToggle);
  // };

  // const shortTpToggleClickHandler = () => {
  //   setShortTpToggle(!shortTpToggle);
  // };

  // const shortSlToggleClickHandler = () => {
  //   setShortSlToggle(!shortSlToggle);
  // };

  // `block` `flex`
  const isDisplayedLongSlSetting = longSlToggle ? 'flex' : 'invisible';
  const isDisplayedShortSlSetting = shortSlToggle ? 'flex' : 'invisible';
  // const isDisplayedLongGuranteedCheckbox = longTpToggle ? 'absolute' : 'invisible';

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const isDisplayedMarginStyle = marginWarning ? 'text-lightGray' : 'text-lightWhite';
  const isDisplayedMarginWarning = marginWarning ? 'flex' : 'invisible';
  const isDisplayedMarginSize = marginLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueSize = valueOfPositionLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedDividerSpacing =
    valueOfPositionLength > 10 || marginLength > 10 ? 'top-430px' : 'top-420px';

  const longOrderSubmitHandler = () => {
    return;
  };

  const shortOrderSubmitHandler = () => {
    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Open position',
      modalContent: 'Please wait...',
    });
    globalCtx.visibleLoadingModalHandler();
  };

  // ----------margin area----------
  const displayedMarginSetting = (
    <TradingInput
      lowerLimit={0}
      upperLimit={MARGIN_LIMIT_DIGITS}
      getInputValue={getMarginInputValue}
      inputInitialValue={margingInputValue}
      inputValueFromParent={margingInputValue}
      setInputValueFromParent={setMarginInputValue}
      inputPlaceholder="margin input"
      inputName="marginInput"
      inputSize="h-44px w-160px text-xl"
      decrementBtnSize="44"
      incrementBtnSize="44"
    />
  );

  const displayedRequiredMarginStyle = (
    <>
      {/* <div className="mt-1 text-base text-lightWhite">$ 13.14 USDT</div> */}
      <div className={`${isDisplayedMarginStyle} ${isDisplayedMarginSize} mt-1 text-base`}>
        $ {requiredMargin?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
      </div>
      <div className={`${isDisplayedMarginWarning} ml-3 text-xs text-lightRed`}>
        * Not enough margin
      </div>
    </>
  );

  // const displayedValueofPosition =

  // ----------long area----------
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

  // TODO:　Guranteed stop Layout
  const longGuaranteedStop = (
    <div className={`${isDisplayedLongSlSetting} mt-0 h-14 items-center`}>
      <input
        type="checkbox"
        value=""
        className={`h-5 w-5 rounded text-lightWhite accent-tidebitTheme`}
      />
      <label className={`ml-2 flex text-sm font-medium text-lightGray`}>
        Guaranteed stop &nbsp;
        <span className="text-lightWhite"> (Fee: {guaranteedStopFee} USDT)</span>
        {/* <span className="">
          <AiOutlineQuestionCircle size={20} />
        </span> */}
        {/* tooltip */}
        <div className="ml-1">
          <div
            className="relative"
            onMouseEnter={() => setLongTooltipStatus(3)}
            onMouseLeave={() => setLongTooltipStatus(0)}
          >
            <div className="cursor-pointer">
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

  const shortGuaranteedStop = (
    <div className={isDisplayedShortSlSetting}>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          value=""
          className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
        />
        <label className="ml-2 flex text-sm font-medium text-lightGray">
          Guaranteed stop &nbsp;
          <span className="text-lightWhite"> (Fee: {guaranteedStopFee} USDT)</span>
          {/* <span className="">
          <AiOutlineQuestionCircle size={20} />
        </span> */}
          {/* tooltip */}
          <div className="ml-1">
            <div
              className="relative"
              onMouseEnter={() => setShortTooltipStatus(3)}
              onMouseLeave={() => setShortTooltipStatus(0)}
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
                    Guaranteed stop will force the position to close at your chosen rate (price)
                    even if the market price surpasses it.
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
              className={`pointer-events-auto ${'w-300px'} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
            >
              {/* <h1 className="pl-5 text-2xl font-bold">Start to trade</h1> */}

              {/* ---margin input area--- */}
              {displayedMarginSetting}

              {/* ---universal trading info area--- */}
              <div className="mt-2 text-lightGray">
                <div className="flex justify-center text-xs">ETH</div>
                <div className="mt-2">
                  <div className="flex justify-center text-sm">Leverage</div>
                  <div className="flex justify-center text-base text-lightWhite">1:5</div>
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
                    $ {valueOfPosition?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
                  </div>
                </div>
              </div>

              {/* ---Long Section--- */}
              {/* Take Profit Setting */}
              <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                <div className="text-sm text-lightGray">Close at profit</div>
                {displayedLongTpSetting}
                <Toggle getToggledState={getToggledLongTpSetting} />
              </div>

              {/* Stop Loss Setting */}
              <div>
                <div className="flex h-25px items-center justify-between">
                  <div className="text-sm text-lightGray">Clost at loss</div>
                  <div className="w-105px">{displayedLongSlSetting}</div>
                  <Toggle getToggledState={getToggledLongSlSetting} />
                </div>
                {/* Guaranteed stop */}
                {longGuaranteedStop}
              </div>

              {/* Below Use absolute for layout */}

              {/* Long Button */}
              {/* absolute top-350px left-20 */}
              <div className="mt-0 ml-14">
                {/* focus:outline-none focus:ring-4 focus:ring-green-300 */}
                <RippleButton
                  onClick={longOrderSubmitHandler}
                  buttonType="button"
                  className="mr-2 mb-2 rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80"
                >
                  <b>UP</b> <br />
                  Above $ {buyEstimatedFilledPrice}
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
                      $ {valueOfPosition?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Take Profit Setting */}
                  <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                    <div className="text-sm text-lightGray">Close at profit</div>
                    {displayedShortTpSetting}
                    <div className="">
                      {' '}
                      <Toggle getToggledState={getToggledShortTpSetting} />
                    </div>
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
                    {/* Guaranteed stop */}
                    {shortGuaranteedStop}
                  </div>
                </div>

                {/* Short Button */}
                <div className="mt-5 ml-14">
                  <RippleButton
                    onClick={shortOrderSubmitHandler}
                    buttonType="button"
                    className="mr-2 mb-2 rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80"
                  >
                    <b>Down</b> <br />
                    Below $ {sellEstimatedFilledPrice}
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

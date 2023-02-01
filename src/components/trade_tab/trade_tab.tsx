import React, {useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput, {TRADING_INPUT_HANDLER_TYPE_CLASSES} from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';

// TODO: Stop loss limit
// 1388.4 * 0.82
const LONG_RESTRICTION_SL = 1138.48;
// 1388.4 * 1.18
const SHORT_RESTRICTION_SL = 1638.31;

const MARGIN_LIMIT = 0.05;

const TradeTab = () => {
  // const marginInputRef = useRef<HTMLInputElement>(null);
  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [inputValue, setInputValue] = useState(0.02);

  // TODO: useState or constant to refresh?
  const [longTpValue, setLongTpValue] = useState(1388.4);
  const [longSlValue, setLongSlValue] = useState(1328.4);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(1328.4);
  const [shortSlValue, setShortSlValue] = useState(1388.4);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [marginWarning, setMarginWarning] = useState(true);

  const marginDetection = (value: number) => {
    if (value > MARGIN_LIMIT) {
      setMarginWarning(true);
    } else {
      setMarginWarning(false);
    }
  };

  const getToggledLongTpSetting = (bool: boolean) => {
    // console.log('getToggledLongTpSetting', bool);
    setLongTpToggle(bool);
  };

  const getToggledLongSlSetting = (bool: boolean) => {
    // console.log('getToggledLongSlSetting', bool);
    setLongSlToggle(bool);
  };

  const getToggledShortTpSetting = (bool: boolean) => {
    // console.log('getToggledShortTpSetting', bool);
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

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const isDisplayedMarginStyle = marginWarning ? 'text-lightGray' : 'text-lightWhite';
  const isDisplayedMarginWarning = marginWarning ? 'flex' : 'invisible';

  // ----------margin area----------
  const displayedMarginSetting = (
    <TradingInput
      lowerLimit={0}
      upperLimit={1000000}
      inputInitialValue={inputValue}
      inputPlaceholder="margin input"
      inputName="marginInput"
      inputSize="h-44px w-160px text-xl"
      decrementBtnSize="44"
      incrementBtnSize="44"
    />
  );

  const displayedRequiredMargin = (
    <>
      {/* <div className="mt-1 text-base text-lightWhite">$ 13.14 USDT</div> */}
      <div className={`${isDisplayedMarginStyle} mt-1 text-base`}>$ 13.14 USDT</div>
      <div className={`${isDisplayedMarginWarning} ml-3 text-xs text-lightRed`}>
        * Not enough margin
      </div>
    </>
  );

  // ----------long area----------
  const displayedLongTpSetting = (
    <div className={isDisplayedLongTpSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={longTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="tpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedLongSlSetting = (
    <div className={isDisplayedLongSlSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputPlaceholder="stop-loss setting"
        inputInitialValue={longSlValue}
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const longGuaranteedStop = (
    <div className={`${isDisplayedLongSlSetting} mt-4 items-center`}>
      <input
        type="checkbox"
        value=""
        className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
      />
      <label className="ml-2 flex text-sm font-medium text-lightGray">
        Guaranteed stop &nbsp;
        <span className="text-lightWhite"> (Fee: 0.77 USDT)</span>
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
                className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
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
        upperLimit={1000000}
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
        upperLimit={1000000}
        inputInitialValue={shortSlValue}
        inputValue={shortSlValue}
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
          <span className="text-lightWhite"> (Fee: 0.77 USDT)</span>
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
              <div className="mt-2 flex justify-center text-center text-base tracking-wide">
                <div className="mr-0">
                  <div className="text-sm text-lightGray">Required Margin</div>
                  {displayedRequiredMargin}
                </div>

                <div>
                  {/* ml-1 mr-5  */}
                  <span className="mx-2 inline-block h-11 w-px rounded bg-lightGray/50"></span>
                </div>

                <div className="ml-3 space-y-1">
                  <div className="text-sm text-lightGray">Value</div>
                  <div className="text-base text-lightWhite">$ 65.69 USDT</div>
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
              <div className="absolute top-350px left-20">
                {/* focus:outline-none focus:ring-4 focus:ring-green-300 */}
                <RippleButton
                  buttonType="button"
                  className="mr-2 mb-2 rounded-md bg-lightGreen5 px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80"
                >
                  <b>UP</b> <br />
                  Above $ 1545.0
                </RippleButton>
              </div>

              {/* Divider between long and short */}
              <span className="absolute top-420px my-auto h-px w-7/8 rounded bg-white/50"></span>

              {/* ---Short Section--- */}
              <div className="">
                {/* custom trading info */}
                <div className="absolute top-430px left-30px mt-2 flex justify-center text-center text-base tracking-wide">
                  <div className="space-y-1">
                    <div className="text-sm text-lightGray">Required Margin</div>
                    <div className="text-base text-lightWhite">$ 13.14 USDT</div>
                  </div>

                  <div>
                    {/* ml-1 mr-5  */}
                    <span className="mx-5 inline-block h-11 w-px rounded bg-lightGray/50"></span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-lightGray">Value</div>
                    <div className="text-base text-lightWhite">$ 65.69 USDT</div>
                  </div>
                </div>

                <div className="absolute top-500px">
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
                <div className="absolute top-650px left-20">
                  <RippleButton
                    buttonType="button"
                    className="mr-2 mb-2 rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80"
                  >
                    <b>Down</b> <br />
                    Below $ 1030.0
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

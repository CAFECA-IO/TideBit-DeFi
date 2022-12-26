import React, {useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';

const INCREMENT_OR_DECREMENT_UNIT = 0.01;

// TODO: Stop loss limit
// 1388.4 * 0.82
const LONG_RESTRICTION_SL = 1138.48;
// 1388.4 * 1.18
const SHORT_RESTRICTION_SL = 1638.31;

const TradeTab = () => {
  // const marginInputRef = useRef<HTMLInputElement>(null);
  const [tooltipStatus, setTooltipStatus] = useState(0);

  const [inputValue, setInputValue] = useState(0.02);

  const [longTpValue, setLongTpValue] = useState(1388.4);
  const [longSlValue, setLongSlValue] = useState(1328.4);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(1328.4);
  const [shortSlValue, setShortSlValue] = useState(1388.4);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const tpToggleClickHandler = () => {
    setLongTpToggle(!longTpToggle);
  };

  const slToggleClickHandler = () => {
    setLongSlToggle(!longSlToggle);
  };

  const marginInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const log = marginInputRef.current?.value;
    const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      setInputValue(Number(value));
    }
  };

  const incrementMarginHandler = () => {
    // const change = Number(marginInputRef?.current?.value) + COUNT_CLICK;
    // const changeRounded = Math.round(change * 1000000) / 1000000;

    // if (marginInputRef.current) {
    //   marginInputRef.current.value = changeRounded.toString();
    //     }

    const change = inputValue + INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;
    setInputValue(changeRounded);
  };

  const decrementMarginHandler = () => {
    // const change = Number(marginInputRef?.current?.value) - COUNT_CLICK;
    // const changeRounded = Math.round(change * 1000000) / 1000000;

    // if (Number(marginInputRef?.current?.value) <= 0 || changeRounded < 0) {
    //   return;
    // }

    // if (marginInputRef.current) {
    //   marginInputRef.current.value = changeRounded.toString();
    // }
    const change = inputValue - INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (inputValue <= 0 || changeRounded < 0.01) {
      return;
    }
    setInputValue(changeRounded);
  };

  const tpInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      setLongTpValue(Number(value));
    }
  };

  const incrementTpHandler = () => {
    const change = longTpValue + INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;
    setLongTpValue(changeRounded);
  };

  const decrementTpHandler = () => {
    const change = longTpValue - INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (longTpValue <= 0 || changeRounded < 0.01) {
      return;
    }
    setLongTpValue(changeRounded);
  };

  const slInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      // TODO: Stop loss limit
      if (Number(value) <= LONG_RESTRICTION_SL) {
        // console.log('Stop loss restriction');
      }
      setLongSlValue(Number(value));
    }
  };

  const incrementSlHandler = () => {
    const change = longSlValue + INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;
    setLongSlValue(changeRounded);
  };

  const decrementSlHandler = () => {
    const change = longSlValue - INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (longSlValue <= LONG_RESTRICTION_SL || changeRounded < 0.01) {
      return;
    }
    setLongSlValue(changeRounded);
  };

  const displayedTpSetting = longTpToggle ? (
    <TradingInput
      decrementClickHandler={decrementTpHandler}
      incrementClickHandler={incrementTpHandler}
      inputValue={longTpValue}
      inputName="tpInput"
      inputSize="h-25px w-70px text-sm"
      decrementBtnSize="25"
      incrementBtnSize="25"
      inputChangeHandler={tpInputChangeHandler}
    />
  ) : null;

  const displayedSlSetting = longSlToggle ? (
    <TradingInput
      decrementClickHandler={decrementSlHandler}
      incrementClickHandler={incrementSlHandler}
      inputValue={longSlValue}
      inputName="slInput"
      inputSize="h-25px w-70px text-sm"
      decrementBtnSize="25"
      incrementBtnSize="25"
      inputChangeHandler={slInputChangeHandler}
    />
  ) : null;

  const guaranteedStop = longSlToggle ? (
    <div className="mt-4 flex items-center">
      <input
        type="checkbox"
        value=""
        className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme ring-tidebitTheme focus:accent-tidebitTheme focus:ring-0"
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
            onMouseEnter={() => setTooltipStatus(3)}
            onMouseLeave={() => setTooltipStatus(0)}
          >
            <div className="cursor-pointer">
              <AiOutlineQuestionCircle size={20} />
            </div>
            {tooltipStatus == 3 && (
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
  ) : null;

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
              <TradingInput
                decrementClickHandler={decrementMarginHandler}
                incrementClickHandler={incrementMarginHandler}
                inputValue={inputValue}
                inputName="marginInput"
                inputSize="h-44px w-160px text-xl"
                decrementBtnSize="44"
                incrementBtnSize="44"
                inputChangeHandler={marginInputChangeHandler}
              />

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

              {/* ---Long Section--- */}
              {/* Take Profit Setting */}
              <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                <div className="text-sm text-lightGray">Close at profit</div>
                <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                {displayedTpSetting}
                <Toggle toggle={longTpToggle} toggleClickHandler={tpToggleClickHandler} />
              </div>

              {/* Stop Loss Setting */}
              <div>
                <div className="flex h-25px items-center justify-between">
                  <div className="text-sm text-lightGray">Clost at loss</div>
                  <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                  {displayedSlSetting}
                  <Toggle toggle={longSlToggle} toggleClickHandler={slToggleClickHandler} />
                </div>
                {/* Guaranteed stop */}
                {guaranteedStop}
              </div>

              {/* Below Use absolute for layout */}

              {/* Long Button */}
              <div className="absolute top-350px left-20">
                {/* focus:outline-none focus:ring-4 focus:ring-green-300 */}
                <button
                  type="button"
                  className="mr-2 mb-2 rounded-md bg-lightGreen px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen/80"
                >
                  <b>UP</b> <br />
                  Above $ 1545.0
                </button>
              </div>

              {/* Divider between long and short */}
              <span className="absolute top-420px my-auto h-px w-full rounded bg-white/50 xs:inline-block"></span>

              {/* ---Short Section--- */}

              <div className="absolute top-480px">
                {/* Take Profit Setting */}
                <div className="mt-3 mb-5 flex h-25px items-center justify-between">
                  <div className="text-sm text-lightGray">Close at profit</div>
                  <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                  {displayedTpSetting}
                  <Toggle toggle={longTpToggle} toggleClickHandler={tpToggleClickHandler} />
                </div>

                {/* Stop Loss Setting */}
                <div>
                  <div className="flex h-25px items-center justify-between">
                    <div className="text-sm text-lightGray">Clost at loss</div>
                    <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                    {displayedSlSetting}
                    <Toggle toggle={longSlToggle} toggleClickHandler={slToggleClickHandler} />
                  </div>
                  {/* Guaranteed stop */}
                  {guaranteedStop}
                </div>
              </div>

              {/* Short Button */}
              <div className="absolute top-600px left-20">
                <button
                  type="button"
                  className="mr-2 mb-2 rounded-md bg-lightRed px-7 py-1 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  <b>Down</b> <br />
                  Below $ 1030.0
                </button>
              </div>

              {/* <div className="mt-20">
                <NotificationItem />
              </div>
              <div className="mt-5">
                <NotificationItem />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeTab;

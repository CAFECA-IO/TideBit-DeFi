import React, {useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
// import TradingInput from '../trading_input/trading_input';

const INCREMENT_OR_DECREMENT_UNIT = 0.01;

// TODO: Stop loss limit
// 1388.4 * 0.82
const LONG_RESTRICTION_SL = 1138.48;
// 1388.4 * 1.18
const SHORT_RESTRICTION_SL = 1638.31;

const TradeTab = () => {
  // const marginInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(0.02);
  const [tpValue, setTpValue] = useState(1388.4);
  const [slValue, setSlValue] = useState(1328.4);
  const [tpToggle, setTpToggle] = useState(false);
  const [slToggle, setSlToggle] = useState(false);
  // const tpToggle = <Toggle />;

  const tpToggleClickHandler = () => {
    setTpToggle(!tpToggle);
  };

  const slToggleClickHandler = () => {
    setSlToggle(!slToggle);
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
      setTpValue(Number(value));
    }
  };

  const incrementTpHandler = () => {
    const change = tpValue + INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;
    setTpValue(changeRounded);
  };

  const decrementTpHandler = () => {
    const change = tpValue - INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (tpValue <= 0 || changeRounded < 0.01) {
      return;
    }
    setTpValue(changeRounded);
  };

  const slInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      // TODO: Stop loss limit
      if (Number(value) <= LONG_RESTRICTION_SL) {
        // console.log('Stop loss restriction');
      }
      setSlValue(Number(value));
    }
  };

  const incrementSlHandler = () => {
    const change = slValue + INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;
    setSlValue(changeRounded);
  };

  const decrementSlHandler = () => {
    const change = slValue - INCREMENT_OR_DECREMENT_UNIT;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (slValue <= LONG_RESTRICTION_SL || changeRounded < 0.01) {
      return;
    }
    setSlValue(changeRounded);
  };

  const displayedTpSetting = tpToggle ? (
    <TradingInput
      decrementClickHandler={decrementTpHandler}
      incrementClickHandler={incrementTpHandler}
      inputValue={tpValue}
      inputName="tpInput"
      inputSize="h-25px w-70px text-sm"
      decrementBtnSize="25"
      incrementBtnSize="25"
      inputChangeHandler={tpInputChangeHandler}
    />
  ) : null;

  const displayedSlSetting = slToggle ? (
    <TradingInput
      decrementClickHandler={decrementSlHandler}
      incrementClickHandler={incrementSlHandler}
      inputValue={slValue}
      inputName="slInput"
      inputSize="h-25px w-70px text-sm"
      decrementBtnSize="25"
      incrementBtnSize="25"
      inputChangeHandler={slInputChangeHandler}
    />
  ) : null;

  return (
    <div>
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

              {/* Take Profit Setting */}
              <div className="mt-3 mb-8 flex h-25px items-center justify-between">
                <div className="text-sm text-lightGray">Close at profit</div>
                <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                {displayedTpSetting}
                <Toggle toggle={tpToggle} toggleClickHandler={tpToggleClickHandler} />
              </div>

              {/* Stop Loss Setting */}
              <div>
                <div className="flex h-25px items-center justify-between">
                  <div className="text-sm text-lightGray">Clost at loss</div>
                  <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                  {displayedSlSetting}
                  <Toggle toggle={slToggle} toggleClickHandler={slToggleClickHandler} />
                </div>
                <div>
                  <input type="checkbox" />
                </div>
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

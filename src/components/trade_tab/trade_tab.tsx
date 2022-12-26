import React, {useRef, useState} from 'react';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
// import TradingInput from '../trading_input/trading_input';

const INCREMENT_OR_DECREMENT_UNIT = 0.01;

const TradeTab = () => {
  // const marginInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(0.02);
  const [tpToggle, setTpToggle] = useState(false);
  const [slToggle, setSlToggle] = useState(false);
  // const tpToggle = <Toggle />;

  const tpToggleClickHandler = () => {
    setTpToggle(!tpToggle);
  };

  const slToggleClickHandler = () => {
    setSlToggle(!slToggle);
  };

  // const [count, setCount] = useState(0);
  // const count = useRef<number>(0.01);

  // function maringInputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
  //   // update the count and the value of the input element
  //   const value = event.target.value;
  //   const regex = /^\d*\.?\d{0,2}$/;
  //   if (regex.test(value)) {
  //     setInputValue(value);
  //     setCount(parseInt(value));
  //   }
  // }

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
                inputSize="h-44px w-160px"
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
                <div className="">
                  <div className="text-sm text-lightGray">Required Margin</div>
                  <div className="text-base text-lightWhite">$ 13.14 USDT</div>
                </div>
                <div>
                  {/* ml-1 mr-5  */}
                  <span className="mx-5 inline-block h-11 w-px rounded bg-lightGray/50"></span>
                </div>
                <div>
                  <div className="text-sm text-lightGray">Value</div>
                  <div className="text-base text-lightWhite">$ 65.69 USDT</div>
                </div>
              </div>

              {/* TP */}
              <div className="mt-3 mb-8 flex items-center justify-between">
                <div className="text-sm text-lightGray">Close at profit</div>
                <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                <Toggle toggle={tpToggle} toggleClickHandler={tpToggleClickHandler} />
              </div>

              {/* SL */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-lightGray">Clost at loss</div>
                <div className="hidden text-base text-lightWhite">$ 65.69 USDT</div>
                <Toggle toggle={slToggle} toggleClickHandler={slToggleClickHandler} />
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

import {useState, Dispatch, SetStateAction} from 'react';
import {TRADING_INPUT_STEP} from '../../constants/display';

export const TRADING_INPUT_HANDLER_TYPE_CLASSES = {
  margin: {
    input: 'margin-input',
    decrement: 'margin-decrement',
    increment: 'margin-increment',
  },
  long: {
    takeProfit: {
      input: 'long-take-profit-input',
      decrement: 'long-take-profit-decrement',
      increment: 'long-take-profit-increment',
    },
    stopLoss: {
      input: 'long-stop-loss-input',
      decrement: 'long-stop-loss-decrement',
      increment: 'long-stop-loss-increment',
    },
  },
  short: {
    takeProfit: {
      input: 'short-take-profit-input',
      decrement: 'short-take-profit-decrement',
      increment: 'short-take-profit-increment',
    },
    stopLoss: {
      input: 'short-stop-loss-input',
      decrement: 'short-stop-loss-decrement',
      increment: 'short-stop-loss-increment',
    },
  },
};

interface ITradingInputProps {
  // decrementClickHandler?: () => void;
  // incrementClickHandler?: () => void;
  // inputChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputInitialValue: number;
  getInputValue?: (props: number) => void;

  inputValueFromParent?: number;
  setInputValueFromParent?: Dispatch<SetStateAction<number>>;

  inputName: string;
  decrementBtnSize: string;
  incrementBtnSize: string;
  inputSize: string;
  inputPlaceholder: string;

  handlerType?: string;
  lowerLimit: number;
  upperLimit?: number;

  shortSlLimit?: number;
  longSlLimit?: number;
  marginLimit?: number;

  shortTpLimit?: number;
  longTpLimit?: number;
}

const TradingInput = ({
  inputInitialValue,
  inputName,
  inputSize = 'h-44px w-160px text-xl',
  decrementBtnSize = '44',
  incrementBtnSize = '44',
  inputValueFromParent,
  setInputValueFromParent,
  inputPlaceholder,
  getInputValue,

  lowerLimit,
  upperLimit,

  ...otherProps
}: ITradingInputProps) => {
  const [inputValue, setInputValue] =
    inputValueFromParent && setInputValueFromParent
      ? [inputValueFromParent, setInputValueFromParent]
      : useState<number>(inputInitialValue);

  const regex = /^\d*\.?\d{0,2}$/;

  const passValueHandler = (data: number) => {
    getInputValue && getInputValue(data);
  };

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const log = marginInputRef.current?.value;
    // const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;

    if (regex.test(value)) {
      // TODO: 讓 input 不能變成 '01' 的條件式
      // if (Number(value) >= upperLimit || Number(value) <= lowerLimit) {
      //   return;
      // }

      if (upperLimit && Number(value) >= upperLimit) {
        setInputValue(upperLimit);
        passValueHandler(upperLimit);

        return;
      }

      if (upperLimit && lowerLimit === upperLimit) {
        return;
      }

      setInputValue(Number(value));
      passValueHandler(Number(value));
    }
  };

  const incrementClickHandler = () => {
    // const change = Number(marginInputRef?.current?.value) + COUNT_CLICK;
    // const changeRounded = Math.round(change * 1000000) / 1000000;

    // if (marginInputRef.current) {
    //   marginInputRef.current.value = changeRounded.toString();
    //     }

    const change = inputValue + TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    if (upperLimit && changeRounded >= upperLimit) {
      return;
    }
    setInputValue(changeRounded);
    passValueHandler(changeRounded);
  };

  /** Margin
 // minimum margin is 0.01
    if (inputValue <= 0 || changeRounded < 0.01) {
      return;
    }
   */
  // TODO: refactor: use callback `someFunction: () => boolean`
  // TODO: `handlerType?: string` error because it applies to `onClick`?
  const decrementClickHandler = () => {
    const change = inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (inputValue <= 0 || changeRounded < 0.01 || changeRounded < lowerLimit) {
      // getHandler(handlerType);
      return;
    }
    setInputValue(changeRounded);
    passValueHandler(changeRounded);
  };

  // *----------Margin handlers-----*
  const marginDecrementHandler = () => {
    const change = inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (inputValue <= 0 || changeRounded < 0.01) {
      return;
    }
    setInputValue(changeRounded);
  };

  // TODO: make it easier to read `const localMarginLimit = upperLimit;`
  const marginIncrementHandler = () => {
    const change = inputValue + TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // limit to each one's deposit or trading restriction
    const localMarginLimit = upperLimit ?? 0;
    if (inputValue >= localMarginLimit) {
      // console.log('Margin restriction');
      // <p>Couldn't above marginLimit</p>
      return;
    }

    setInputValue(changeRounded);
  };

  const marginInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const log = marginInputRef.current?.value;
    // const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;

    if (regex.test(value)) {
      const localMarginLimit = upperLimit;
      if (localMarginLimit) {
        if (Number(value) >= localMarginLimit) {
          // console.log('Margin restriction');
          // <p>Couldn't above marginLimit</p>
          return;
        }
      }
      setInputValue(Number(value));
    }
  };

  // *----------Long handlers----------*
  const longSlInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      // [lower limit] Long's stop-loss limit [longSlLimit/lowerLimit]
      // let localLongStopLossLimit = lowerLimit
      if (lowerLimit >= Number(value)) {
        // console.log('Stop loss restriction');
        // <p>Couldn't below longSlLimit</p>
        return;
      }
      setInputValue(Number(value));
    }
  };

  // TODO: Logic condition for Long's stop loss
  // const longSlIncrementHandler = () => {}
  const longSlDecrementHandler = () => {
    const change = inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // [lower limit] Long's stop-loss limit [longSlLimit/lowerLimit]
    if (lowerLimit >= inputValue || changeRounded < 0.01) {
      // <p>Couldn't below longSlLimit</p>
      return;
    }
    setInputValue(changeRounded);
  };

  // TODO: Limit condition for Long's take profit
  const longTpInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      if (upperLimit) {
        // [upper limit] Long's take-profit limit [longTpLimit/upperLimit]
        if (Number(value) >= upperLimit) {
          // console.log('Take profit restriction');
          // <p>Couldn't above shortTpLimit</p>
          return;
        }
      }
      setInputValue(Number(value));
    }
  };

  // TODO: Logic condition for Long's stop loss
  // const longTpDecrementHandler = () => {}
  // const longTpIncrementHandler = () => {}

  // ----------Short handlers----------
  const shortSlInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      // [upper limit] Short's stop loss limit [shortSlLimit/upperLimit]
      if (upperLimit) {
        if (upperLimit <= Number(value)) {
          // console.log('Stop loss restriction');
          // <p>Couldn't above shortSlLimit</p>
          return;
        }
      }

      setInputValue(Number(value));
    }
  };

  const shortSlDecrementHandler = () => {
    const change = inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // [upper limit] Short's stop loss limit [shortSlLimit/upperLimit]
    if (upperLimit) {
      if (upperLimit <= inputValue || changeRounded < 0.01) {
        // <p>Couldn't above shortSlLimit</p>
        return;
      }
    }

    setInputValue(changeRounded);
  };

  const getHandler = (handlerType: string) => {
    return {
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.margin.input]: marginInputChangeHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.margin.increment]: marginIncrementHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.margin.decrement]: marginDecrementHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.long.stopLoss.input]: longSlInputChangeHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.long.stopLoss.decrement]: longSlDecrementHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.long.takeProfit.input]: longTpInputChangeHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.short.stopLoss.input]: shortSlInputChangeHandler,
      [TRADING_INPUT_HANDLER_TYPE_CLASSES.short.stopLoss.decrement]: shortSlDecrementHandler,
    }[handlerType];

    // switch (type) {
    //   case 'marginDecrement':
    //     return marginDecrementHandler;
    //   case 'marginIncrement':
    //     return marginIncrementHandler;
    //   case 'marginInputChange':
    //     return marginInputChangeHandler;
    //   case 'longSlDecrement':
    //     return longSlDecrementHandler;
    //   case 'longSlInputChange':
    //     return longSlInputChangeHandler;
    //   case 'longTpInputChange':
    //     return longTpInputChangeHandler;
    //   case 'shortSlDecrement':
    //     return shortSlDecrementHandler;
    //   case 'shortSlInputChange':
    //     return shortSlInputChangeHandler;
    //   default:
    //     return () => {};
    // }
  };

  return (
    <>
      {' '}
      {/* ---margin input area--- */}
      <div className="flex items-center justify-center">
        {/* '-.svg' symbol */}
        <button type="button" onClick={decrementClickHandler}>
          <svg
            id="Group_15147"
            data-name="Group 15147"
            xmlns="http://www.w3.org/2000/svg"
            width={decrementBtnSize}
            height={decrementBtnSize}
            viewBox="0 0 44 44"
          >
            <path
              id="Rectangle_812"
              data-name="Rectangle 812"
              d="M22,0H44a0,0,0,0,1,0,0V44a0,0,0,0,1,0,0H22A22,22,0,0,1,0,22v0A22,22,0,0,1,22,0Z"
              fill="#404a55"
            />
            <line
              id="Line_377"
              data-name="Line 377"
              x2="15"
              transform="translate(14.5 22.5)"
              fill="none"
              stroke="#f2f2f2"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
        </button>

        <div className="">
          <input
            type="number"
            className={`${inputSize} bg-darkGray8 text-center text-lightWhite outline-none ring-transparent`}
            value={inputValue}
            name={inputName}
            onChange={inputChangeHandler}
            placeholder={inputPlaceholder}
          />
        </div>

        {/* '+.svg' symbol */}
        <button type="button" onClick={incrementClickHandler} className="">
          <svg
            id="Group_15149"
            data-name="Group 15149"
            xmlns="http://www.w3.org/2000/svg"
            width={incrementBtnSize}
            height={incrementBtnSize}
            viewBox="0 0 44 44"
          >
            <path
              id="Rectangle_813"
              data-name="Rectangle 813"
              d="M0,0H22A22,22,0,0,1,44,22v0A22,22,0,0,1,22,44H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z"
              fill="#404a55"
            />
            <g id="Group_15148" data-name="Group 15148" transform="translate(11.26 15)">
              <line
                id="Line_375"
                data-name="Line 375"
                x2="15"
                transform="translate(0 7.5)"
                fill="none"
                stroke="#f2f2f2"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <line
                id="Line_376"
                data-name="Line 376"
                y1="15"
                transform="translate(7.74)"
                fill="none"
                stroke="#f2f2f2"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </g>
          </svg>
        </button>
      </div>
    </>
  );
};

export default TradingInput;

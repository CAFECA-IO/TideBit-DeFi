import {useState, Dispatch, SetStateAction} from 'react';
import {TRADING_INPUT_STEP} from '../../constants/display';

interface ITradingInputProps {
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
    const value = event.target.value;

    if (regex.test(value)) {
      // Info: (20230316 - Shirley) 讓 input 不能變成 '01' 的條件式
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
    const change = inputValue + TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    if (upperLimit && changeRounded >= upperLimit) {
      return;
    }
    setInputValue(changeRounded);
    passValueHandler(changeRounded);
  };

  const decrementClickHandler = () => {
    const change = inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (inputValue <= 0 || changeRounded < 0.01 || changeRounded < lowerLimit) {
      return;
    }
    setInputValue(changeRounded);
    passValueHandler(changeRounded);
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

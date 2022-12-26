import {useState} from 'react';
import {TRADING_INPUT_STEP} from '../../constants/display';

interface ITradingInputProps {
  decrementClickHandler?: () => void;
  incrementClickHandler?: () => void;
  inputChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputInitialValue: number;
  inputValue?: number;
  inputName: string;
  decrementBtnSize: string;
  incrementBtnSize: string;
  inputSize: string;
}

const TradingInput = ({
  inputInitialValue = 0.05,
  inputName,
  inputSize = 'h-44px w-160px text-xl',
  decrementBtnSize = '44',
  incrementBtnSize = '44',
  ...otherProps
}: ITradingInputProps) => {
  const [inputValue, setInputValue] = useState<number>(inputInitialValue);

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    // const log = marginInputRef.current?.value;
    const regex = /^\d*\.?\d{0,2}$/;
    const value = event.target.value;
    if (regex.test(value)) {
      setInputValue(Number(value));
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
    setInputValue(changeRounded);
  };

  const decrementClickHandler = () => {
    const change = inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // minimum margin is 0.01
    if (inputValue <= 0 || changeRounded < 0.01) {
      return;
    }
    setInputValue(changeRounded);
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

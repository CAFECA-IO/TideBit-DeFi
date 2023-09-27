import {useState, Dispatch, SetStateAction, useEffect, useRef, useCallback} from 'react';
import {
  DELAYED_HIDDEN_SECONDS,
  INPUT_VALIDATION_DELAY,
  TRADING_INPUT_STEP,
  TYPING_KEYUP_DELAY,
} from '../../constants/display';
import useStateRef from 'react-usestateref';
import SafeMath from '../../lib/safe_math';
import {TARGET_MIN_DIGITS} from '../../constants/config';

interface ITradingInputProps {
  inputInitialValue: number;
  getInputValue?: (props: number) => void;
  onTypingStatusChange?: (props: boolean) => void;

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

  reachOppositeLimit?: boolean;
  disabled?: boolean;
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

  reachOppositeLimit,
  disabled,
  onTypingStatusChange,

  ...otherProps
}: ITradingInputProps) => {
  const [disabledState, setDisabledState, disabledStateRef] = useStateRef<boolean>(false);
  const [inputValue, setInputValue, inputValueRef] = useStateRef<number | string>(
    inputInitialValue
  );

  const [validationTimeout, setValidationTimeout, validationTimeoutRef] = useStateRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [typingTimeout, setTypingTimeout, typingTimeoutRef] = useStateRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [isTyping, setIsTyping, isTypingRef] = useStateRef<boolean>(false);

  const regex = /^\d*\.?\d{0,2}$/;

  const passValueHandler = useCallback(
    (data: number | string) => {
      if (SafeMath.isNumber(data)) {
        getInputValue && getInputValue(+data);
      } else {
        getInputValue && getInputValue(TARGET_MIN_DIGITS);
      }
    },
    [getInputValue]
  );

  // Info: [TradeTab] 透過 isTyping 跟 checkTpSlWithinBounds 來檢查 input 是否正當 (20230927 - Shirley)
  const validateInput = (value: number) => {
    if (upperLimit && value >= upperLimit) {
      setInputValue(upperLimit);
      passValueHandler(upperLimit);
      return;
    } else if (lowerLimit && value <= lowerLimit) {
      // Info: For short SL setting, if the value is lower than the lower limit, it will be set to the UPPER limit (Liquidation Price) (20230424 - Shirley)
      if (!!reachOppositeLimit && upperLimit) {
        setInputValue(upperLimit);
        passValueHandler(upperLimit);
        return;
      }

      setInputValue(lowerLimit);
      passValueHandler(lowerLimit);
      return;
    } else if (upperLimit && lowerLimit === upperLimit) {
      // Info: Do nothing (20230617 - Shirley)
      return;
    } else {
      setInputValue(value);
      passValueHandler(value);
      return;
    }
  };

  const debounceValidation = (value: number | string) => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (regex.test(value.toString())) {
        const numberValue = +value;
        if (numberValue === upperLimit && numberValue === lowerLimit) {
          return;
        }

        if (SafeMath.isNumber(value)) {
          validateInput(+value);
        } else {
          passValueHandler(value);
        }
      }
    }, INPUT_VALIDATION_DELAY);

    setValidationTimeout(newTimeout);
  };

  const onKeyDown = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setIsTyping(true);
  };

  const onKeyUp = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      setIsTyping(false);
    }, TYPING_KEYUP_DELAY);

    setTypingTimeout(newTimeout);
  };

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    const value = event.target.value;

    setInputValue(value);
    passValueHandler(value);

    debounceValidation(value);
  };

  const incrementClickHandler = () => {
    const change = +inputValue + TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    if (upperLimit && changeRounded >= upperLimit) {
      return;
    } else if (lowerLimit && changeRounded <= lowerLimit) {
      // Info: 在下限內加，要直接加到下限值 (20230426 - Shirley)
      setInputValue(lowerLimit);
      passValueHandler(lowerLimit);
      return;
    }
    setInputValue(changeRounded);
    passValueHandler(changeRounded);
  };

  const decrementClickHandler = () => {
    const change = +inputValue - TRADING_INPUT_STEP;
    const changeRounded = Math.round(change * 100) / 100;

    // Info: minimum margin is 0.01 (20230714 - Shirley)
    if (+inputValue <= 0 || changeRounded < 0.01 || changeRounded < lowerLimit) {
      return;
    }
    setInputValue(changeRounded);
    passValueHandler(changeRounded);
  };

  useEffect(() => {
    if (inputValueFromParent !== undefined && setInputValueFromParent !== undefined) {
      setInputValue(inputValueFromParent);
    }

    setDisabledState(!!disabled);
  }, [inputValueFromParent, setInputValueFromParent, disabled]);

  useEffect(() => {
    // Info: Clean up validation timeout when unmount (20230424 - Shirley)
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [validationTimeout, typingTimeout]);

  useEffect(() => {
    onTypingStatusChange && onTypingStatusChange(isTypingRef.current);
  }, [isTypingRef.current]);

  return (
    <>
      {' '}
      <div className="flex items-center justify-center">
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
            className={`${inputSize} rounded-none bg-darkGray8 text-center text-lightWhite outline-none ring-transparent`}
            disabled={
              disabledStateRef.current ||
              (Number(inputValueRef.current) === upperLimit &&
                Number(inputValueRef.current) === lowerLimit)
            }
            value={inputValueRef.current}
            name={inputName}
            onChange={inputChangeHandler}
            placeholder={inputPlaceholder}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
          />
        </div>

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

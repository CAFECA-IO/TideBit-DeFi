import React, {useRef} from 'react';

const COUNT_CLICK = 0.01;

const TradeTab = () => {
  const marginInputRef = useRef<HTMLInputElement>(null);
  const count = useRef<number>(0.01);

  // const marginInputHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
  //   const log = marginInputRef.current?.value;
  // };

  const incrementMarginHandler = () => {
    // console.log('increment margin handler');
    // let currentInput = Number(marginInputRef.current?.value);
    // currentInput++;
    // marginInputRef.current.value = currentInput.toString();
    // marginInputRef.current += 0.01;

    count.current += 0.01;
    // const change = count.current + COUNT_CLICK;
    const countRounded = Math.round(count.current * 100) / 100;

    if (marginInputRef.current) {
      marginInputRef.current.value = countRounded.toString();
      // marginInputRef.current.value = change.toString();
    }
  };

  const decrementMarginHandler = () => {
    if (count.current <= 0) {
      return;
    }

    count.current -= 0.01;
    // const change = count.current + COUNT_CLICK;
    const countRounded = Math.round(count.current * 100) / 100;

    if (marginInputRef.current) {
      marginInputRef.current.value = countRounded.toString();
      // marginInputRef.current.value = change.toString();
    }
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
              <div className="-mt-5 flex items-center">
                {/* '-' svg */}
                <button type="button" onClick={decrementMarginHandler}>
                  <svg
                    id="Group_15147"
                    data-name="Group 15147"
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
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

                <div className="mb-5">
                  <input
                    ref={marginInputRef}
                    type="number"
                    className="mt-5 h-44px w-160px bg-darkGray8 text-center text-xl text-lightWhite outline-none ring-transparent"
                    defaultValue="0.01"
                    name="marginInput"
                  />
                </div>

                {/* '+' svg */}
                <button type="button" onClick={incrementMarginHandler} className="">
                  <svg
                    id="Group_15149"
                    data-name="Group 15149"
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
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

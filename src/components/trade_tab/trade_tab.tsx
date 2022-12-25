import React, {useRef} from 'react';

const TradeTab = () => {
  const marginInputRef = useRef<HTMLInputElement>(null);

  const marginInputHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    const log = marginInputRef.current?.value;
    // marginInputRef = event.target.value;

    // console.log(event.target.value);
    // console.log('margin input handler');
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
                <div>
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
                      stroke-linecap="round"
                      stroke-width="3"
                    />
                  </svg>
                </div>

                <div className="mb-5">
                  <input
                    ref={marginInputRef}
                    type="number"
                    className="mt-5 h-44px w-160px bg-darkGray8 pl-5 text-xl text-lightWhite outline-none ring-transparent"
                    value="0.01"
                    onChange={marginInputHandler}
                    name="marginInput"
                  />
                </div>

                {/* '+' svg */}
                <div className="">
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
                        stroke-linecap="round"
                        stroke-width="3"
                      />
                      <line
                        id="Line_376"
                        data-name="Line 376"
                        y1="15"
                        transform="translate(7.74)"
                        fill="none"
                        stroke="#f2f2f2"
                        stroke-linecap="round"
                        stroke-width="3"
                      />
                    </g>
                  </svg>
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

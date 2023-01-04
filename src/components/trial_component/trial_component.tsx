import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
// import useRippleAnimation from '../../lib/hooks/use_ripple_animation';
import {config} from 'process';

const TrialComponent = () => {
  const [tooltipStatus, setTooltipStatus] = useState(0);

  // const bgNextTailwindImage = (
  //   <div className="h-96 bg-slate-700 bg-[url('/public/elements/2634.png')] bg-scroll"></div>
  // );

  // it works
  const test2BgImage = (
    <div
      className="w-full"
      style={{backgroundImage: `url('/elements/group_15244.svg')`, height: '500px', width: '100%'}}
    ></div>
  );

  const fixedBgImage = (
    <>
      <div
        style={{
          zIndex: -1,
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
        className="bg-scroll"
      >
        <Image
          src="/elements/group_15244.svg"
          alt="Mountains with snow"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1
        style={{
          paddingTop: '30vh',
          fontFamily: 'monospace',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Next.js Background Image Tutorial
      </h1>
      <div className="flex w-full justify-center">
        <div className="w-278px p-4 md:right-250px md:w-400px lg:right-1/3 xl:right-2/5">
          <div className="flex h-full flex-col rounded-lg bg-darkGray4 p-8">
            <div className="mb-3 flex items-center">
              <div className="mr-3 inline-flex shrink-0 items-center justify-center rounded-full text-lightWhite">
                {/* <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                className="h-5 w-5"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg> */}
                <Image
                  src="/elements/tether-seeklogo.com.svg"
                  width={50}
                  height={50}
                  alt="tether-seeklogo.com.svg"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-medium text-lightGreen2">USDT</h2>
                <p className="-my-1 mb-1">reserve ratio</p>
              </div>
            </div>

            <div className="grow">
              <p className="font-bold">
                <span className="pr-2 text-6xl font-bold leading-relaxed">120</span> %
              </p>
              <label className="ml-52 rounded-full bg-lightGray3 px-3 py-1 text-sm">
                Blockchain
              </label>
              <span className="my-auto h-px w-full rounded bg-lightGray1/30 xs:inline-block"></span>

              {/* <a className="mt-3 inline-flex items-center text-indigo-400">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a> */}
              <div className="mb-5 flex flex-col space-y-2">
                <div className="text-base text-lightGray">TideBit user asset holdings</div>
                <div>3,016,827,845</div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="text-base text-lightGray">TideBit wallet assets</div>
                <div>3,061,068,937</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const testPopoverCom = (
    <>
      <button
        data-popover-target="popover-default"
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Default popover
      </button>
      <div
        data-popover
        id="popover-default"
        role="tooltip"
        className="invisible absolute z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm font-light text-gray-500 opacity-0 shadow-sm transition-opacity duration-300 hover:visible dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
      >
        <div className="rounded-t-lg border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Popover title</h3>
        </div>
        <div className="px-3 py-2">
          <p>And here's some amazing content. It's very engaging. Right?</p>
        </div>
        <div data-popper-arrow></div>
      </div>
    </>
  );

  const tooltipCom = (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      {/* tooltip */}
      <div className="relative inline-block">
        <a className="px-2 py-1 font-medium hover:text-gray-400">Help</a>
        {/* tooltip-item  */}
        <div className="invisible absolute right-0 z-20 flex h-80 w-60 flex-col rounded-md bg-white p-4 ">
          <a href="" className="pb-4 font-semibold">
            Help
          </a>
          <ul className="list-disc space-y-2">
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Order Status{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Shipping & Delivery{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Returns{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Size Charts{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Contact Us{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Privacy Policy{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Terms of Sale{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Terms of Use{' '}
              </a>
            </li>
            <li className="flex items-start">
              <a href="" className="text-sm font-medium text-gray-500 hover:text-black">
                {' '}
                Send Us Feedback{' '}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // half works
  const anotherTooltipCom = (
    <div className="py-12 ">
      <div className="container relative mx-auto max-w-250px rounded bg-white px-4 py-4">
        <p className="text-sm font-semibold leading-none text-gray-800">Tooltip Title</p>
        <p className=" pt-2 pb-2 text-xs leading-none text-gray-600">
          Tooltip Description will come here!
        </p>
        <svg
          className="absolute -bottom-10  z-10"
          width={16}
          height={10}
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 10L0 0L16 1.41326e-06L8 10Z" fill="white" />
        </svg>
        <svg
          className="absolute -bottom-20  z-10 cursor-pointer"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.75 2C4.57469 2 2 4.57469 2 7.75C2 10.9253 4.57469 13.5 7.75 13.5C10.9253 13.5 13.5 10.9253 13.5 7.75C13.5 4.57469 10.9253 2 7.75 2Z"
            stroke="#1F2937"
            strokeMiterlimit={10}
          />
          <path
            d="M6.875 6.875H7.875V10.5"
            stroke="#1F2937"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6.5 10.625H9.25" stroke="#1F2937" strokeMiterlimit={10} strokeLinecap="round" />
          <path
            d="M7.75 4.0625C7.5893 4.0625 7.43222 4.11015 7.2986 4.19943C7.16499 4.28871 7.06084 4.41561 6.99935 4.56407C6.93785 4.71254 6.92176 4.8759 6.95311 5.03351C6.98446 5.19112 7.06185 5.3359 7.17548 5.44953C7.28911 5.56316 7.43388 5.64054 7.59149 5.67189C7.7491 5.70324 7.91247 5.68715 8.06093 5.62566C8.2094 5.56416 8.3363 5.46002 8.42557 5.3264C8.51485 5.19279 8.5625 5.0357 8.5625 4.875C8.5625 4.65951 8.4769 4.45285 8.32453 4.30048C8.17215 4.1481 7.96549 4.0625 7.75 4.0625Z"
            fill="#1F2937"
          />
        </svg>
      </div>
    </div>
  );

  // TODO: IT WORKS
  const tooltipCom1 = (
    <>
      <div className="flex flex-col items-center md:flex-row md:justify-center">
        {/*Code Block for white tooltip starts*/}
        <div
          className="relative mt-20 md:mt-0"
          onMouseEnter={() => setTooltipStatus(1)}
          onMouseLeave={() => setTooltipStatus(0)}
        >
          <div className="mr-2 cursor-pointer">
            <svg
              aria-haspopup="true"
              xmlns="http://www.w3.org/2000/svg"
              className=""
              width={25}
              height={25}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#A0AEC0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx={12} cy={12} r={9} />
              <line x1={12} y1={8} x2="12.01" y2={8} />
              <polyline points="11 12 12 12 12 16 13 16" />
            </svg>
          </div>
          {tooltipStatus == 1 && (
            <div
              role="tooltip"
              className="absolute left-0 z-20 -mt-20 ml-8 w-64 rounded bg-white p-4 shadow-lg transition duration-150 ease-in-out"
            >
              <svg
                className="absolute left-0 bottom-0 top-0 -ml-2 h-full"
                width="9px"
                height="16px"
                viewBox="0 0 9 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#FFFFFF">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon
                          id="Triangle"
                          transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                          points="4.5 57.5 12.5 66.5 -3.5 66.5"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p className="pb-1 text-sm font-bold text-gray-800">Keep track of follow ups</p>
              <p className="pb-3 text-xs leading-4 text-gray-600">
                Reach out to more prospects at the right moment.
              </p>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-xs font-bold text-indigo-700">Step 1 of 4</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 cursor-pointer text-xs text-gray-600 underline">
                    Skip Tour
                  </span>
                  <button className="rounded bg-indigo-700 px-5 py-1 text-xs text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}{' '}
        </div>
        {/*Code Block for white tooltip ends*/}
        {/*Code Block for indigo tooltip starts*/}
        <div
          className="relative my-28 md:my-0 md:mx-40"
          onMouseEnter={() => setTooltipStatus(2)}
          onMouseLeave={() => setTooltipStatus(0)}
        >
          <div className="mr-2 cursor-pointer">
            <svg
              aria-haspopup="true"
              xmlns="http://www.w3.org/2000/svg"
              className=""
              width={25}
              height={25}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#A0AEC0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx={12} cy={12} r={9} />
              <line x1={12} y1={8} x2="12.01" y2={8} />
              <polyline points="11 12 12 12 12 16 13 16" />
            </svg>
          </div>
          {tooltipStatus == 2 && (
            <div
              role="tooltip"
              className="absolute left-0 z-20 -mt-20 ml-8 w-64 rounded bg-indigo-700 p-4 shadow-lg transition duration-150 ease-in-out"
            >
              <svg
                className="absolute left-0 bottom-0 top-0 -ml-2 h-full"
                width="9px"
                height="16px"
                viewBox="0 0 9 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#4c51bf">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon
                          id="Triangle"
                          transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                          points="4.5 57.5 12.5 66.5 -3.5 66.5"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p className="pb-1 text-sm font-bold text-white">Keep track of follow ups</p>
              <p className="pb-3 text-xs leading-4 text-white">
                Reach out to more prospects at the right moment.
              </p>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-xs font-bold text-white">Step 1 of 4</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 cursor-pointer text-xs text-white underline">
                    Skip Tour
                  </span>
                  <button className="rounded bg-white px-5 py-1 text-xs text-indigo-700 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/*Code Block for indigo tooltip ends*/}
        {/*Code Block for gray tooltip starts*/}
        <div
          className="relative"
          onMouseEnter={() => setTooltipStatus(3)}
          onMouseLeave={() => setTooltipStatus(0)}
        >
          <div className="mr-2 cursor-pointer">
            <svg
              aria-haspopup="true"
              xmlns="http://www.w3.org/2000/svg"
              className=""
              width={25}
              height={25}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#A0AEC0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx={12} cy={12} r={9} />
              <line x1={12} y1={8} x2="12.01" y2={8} />
              <polyline points="11 12 12 12 12 16 13 16" />
            </svg>
          </div>
          {tooltipStatus == 3 && (
            <div
              role="tooltip"
              className="absolute left-0 z-20 -mt-20 ml-8 w-64 rounded bg-gray-800 p-4 shadow-lg transition duration-150 ease-in-out"
            >
              <svg
                className="absolute left-0 bottom-0 top-0 -ml-2 h-full"
                width="9px"
                height="16px"
                viewBox="0 0 9 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#2D3748">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon
                          id="Triangle"
                          transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                          points="4.5 57.5 12.5 66.5 -3.5 66.5"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p className="pb-1 text-sm font-bold text-white">Keep track of follow ups</p>
              <p className="pb-3 text-xs leading-4 text-white">
                Reach out to more prospects at the right moment.
              </p>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-xs font-bold text-white">Step 1 of 4</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 cursor-pointer text-xs text-white underline">
                    Skip Tour
                  </span>
                  <button className="rounded bg-white px-5 py-1 text-xs text-gray-600 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/*Code Block for gray tooltip ends*/}
      </div>
    </>
  );

  // const buttonRef = useRef<HTMLDivElement | undefined>();
  // // useRippleAnimation((element = buttonRef), config);

  // useEffect(() => {
  //   const applyContainerProperties = () => {
  //     if (!buttonRef) return;
  //     buttonRef?.current?.classList.add('effectContainer');
  //   };

  //   // MouseEvent property
  //   const applyStyles = (e: MouseEvent) => {
  //     const {offsetX, offsetY} = e;
  //     const {style} = buttonRef.current;
  //     const sizeOffset = 50;

  //     style.setProperty('--effect-top', `${offsetY - sizeOffset}px`);
  //     style.setProperty('--effect-left', `${offsetX - sizeOffset}px`);
  //   };

  //   const onClick = (e: MouseEvent) => {
  //     // if (buttonRef)
  //     buttonRef?.current?.classList.remove('active');
  //     applyStyles(e);

  //     buttonRef?.current?.classList.add('active');

  //     // setTimeout(() => {
  //     //   buttonRef?.current.classList.add('active');
  //     // }, 1);
  //   };

  //   applyContainerProperties();

  //   // Add the event listener on mount
  //   buttonRef?.current?.addEventListener('mouseup', onClick);

  //   // Needed for referencing the ref in the return function
  //   const cleanupRef = buttonRef?.current;

  //   return () => {
  //     // Remove the event listener on unmount
  //     cleanupRef?.removeEventListener('mouseup', onClick);
  //   };
  // });

  // const rippleButton = (
  //   <div>
  //     <button
  //       className="rounded-md bg-lightRed px-8 py-2 transition-all"
  //       type="button"
  //       ref={buttonRef}
  //     >
  //       Click me
  //     </button>
  //     {/* <Image ref={buttonRef} src="/elements/group_15198@2x.png" width={512} height={512} /> */}
  //   </div>
  // );

  return (
    <>
      {/* {test2BgImage} */}
      {/* {testPopoverCom} */}
      {/* {anotherTooltipCom} */}
      {/* {tooltipCom1} */}
      {/* {rippleButton} */}
    </>
  );
};

export default TrialComponent;

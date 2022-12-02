import Image from 'next/image';
import React from 'react';
import LineGraph from '../line_graph/line_graph';
// import {FaEthereum} from 'react-icons/fa';
// // import {ReactComponent as ethIcon} from '/public/elements/group_15143.svg';
// // import {ReactComponent as Logo} from './logo.svg';
// import LineGraph from '../line_graph/line_graph';

/**
 * @dev used when it needs the star functionality
 * @param {star} empty star
 * @param {starred} filled star or not
 *
 */
const CryptoCard = ({
  gradientColor = null,
  tokenComponent = null,
  img = '',
  chain = '',
  currency = '',
  lineGraph = null,
  price = 0,
  fluctuating = -1,
  star = false,
  starred = false,
  ...otherProps
}) => {
  price = price > 0.001 ? price.toLocaleString() : price;
  fluctuating = Number(fluctuating);
  // console.log('fluctuating', fluctuating);
  let priceRise = fluctuating > 0 ? true : false;
  let fluctuatingRate = priceRise ? `(+${fluctuating}%)▴` : `(${fluctuating}%)▾`;
  // TODO: input the data and price color change as props
  let priceColor = priceRise ? `text-lightGreen` : `text-lightRed`;
  // let priceColor = '';

  // console.log('priceColor', priceColor);

  // const upSvg = (
  //   <svg
  //     width="20"
  //     height="20"
  //     fill="currentColor"
  //     viewBox="0 0 1792 1792"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
  //   </svg>
  // );

  const desktopVersionBreakpoint = 'xs:flex';
  const mobileVersionBreakpoint = 'xs:hidden';

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomArray(min, max, length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(randomeNumber(min, max));
    }
    return arr;
  }

  // function arrayGenerator() {
  //   let arr = [];
  //   for (let i = 0; i < 10; i++) {
  //     arr.push(randomArray(22, 222, 5));
  //   }
  //   return arr;
  // }
  // console.log(arrayGenerator());

  const sampleArray = randomArray(1100, 1200, 10);

  // TODO: Taking Notes- execution order about parameters and logic flow
  // #1AE2A0 is light green, #E86D6D is light red
  const fakeDataColor = () => {
    if (sampleArray[sampleArray.length - 1] > sampleArray[sampleArray.length - 2]) {
      // priceColor = 'text-lightGreen';
      return '#1AE2A0';
    }

    // priceColor = 'text-lightRed';
    return '#E86D6D';
  };
  const thisRandomColor = fakeDataColor();

  // const priceColorDetect = () => {
  //   if (thisRandomColor === '#1AE2A0') {
  //     priceColor = 'text-lightGreen';
  //   } else if (thisRandomColor === '#E86D6D') {
  //     priceColor = 'text-lightRed';
  //   }
  // };

  // priceColorDetect();

  // console.log('randomColor', randomColor());

  return (
    <>
      {/* Desktop (width > 500px) version (Card 200x120) */}
      <div
        className={`${desktopVersionBreakpoint} ${otherProps?.className} relative m-0 hidden h-120px w-200px rounded-2xl border-0.5px p-0 ${gradientColor} bg-black bg-gradient-to-b opacity-90 shadow-lg`}
      >
        <div className="px-2 py-1">
          {/* token icon & chain & coin name */}
          <div className="flex items-center">
            <span className="relative h-40px w-40px">{tokenComponent}</span>
            <div className="ml-3 items-center">
              <p className="text-lg leading-6 text-lightWhite"> {chain}</p>
              <p className="text-sm text-lightWhite opacity-60">{currency}</p>
            </div>
          </div>

          {/* line graph & price & fluctuating rate */}
          <div className="flex flex-col justify-start">
            <div className="absolute top-4 h-96 bg-transparent">
              <LineGraph
                sampleArray={sampleArray}
                strokeColor={thisRandomColor}
                lineGraphWidth="170"
              />

              {/* <div className="absolute top-0 left-0 h-2 w-2/3 rounded bg-blue-200"></div> */}
            </div>
            {/**@note no default text color, otherwise it will make actual text color not work */}
            <div className="absolute bottom-0 flex w-200px justify-between">
              <span
                className={`flex items-center justify-between text-sm ${priceColor} mt-3 align-middle`}
              >
                <p className="mx-1 text-left text-xl font-normal tracking-wide">$ {price}</p>
                <div className="absolute right-4 flex">
                  <span className="text-sm"> {fluctuatingRate}</span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile (width < 500px) version (Card 134x81) */}
      <div
        className={`${mobileVersionBreakpoint} ${otherProps?.className} relative m-0 h-81px w-134px rounded-2xl border-0.5px p-0 ${gradientColor} bg-black bg-gradient-to-b opacity-90 shadow-lg`}
      >
        <div className="px-2 py-1">
          {/* token icon & chain & coin name */}
          <div className="mb-1 flex items-center">
            <span className="relative h-28px w-28px">{tokenComponent}</span>
            <div className="ml-3 items-center">
              <p className="text-sm leading-none text-lightWhite"> {chain}</p>
              <p className="text-xs text-lightWhite opacity-60">{currency}</p>
            </div>
          </div>

          {/* line graph & price & fluctuating rate */}
          <div className="flex flex-col justify-start">
            <div className="absolute right-0 top-1 bg-transparent">
              {/* <div className="absolute top-0 left-0 h-2 w-2/3 rounded bg-blue-200"></div> */}
              <LineGraph
                sampleArray={sampleArray}
                strokeColor={fakeDataColor()}
                lineGraphWidth="140"
              />
            </div>
            {/**@note no default text color, otherwise it will make actual text color not work */}
            <div className="absolute bottom-0 flex w-134px justify-between">
              <span
                className={`flex items-center justify-between text-xs ${priceColor} mt-3 align-middle`}
              >
                <p className="ml-0 mb-1 text-left text-xs font-normal tracking-wide">$ {price}</p>
                <div className="absolute bottom-5px right-4 flex">
                  <span className="text-xxs"> {fluctuatingRate}</span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoCard;

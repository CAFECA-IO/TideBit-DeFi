import LineGraph from '../line_graph/line_graph';
import {BsStar, BsStarFill} from 'react-icons/bs';
import {useState} from 'react';
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

interface CardProps {
  gradientColor?: string;
  tokenComponent?: JSX.Element;
  img?: string;
  chain: string;
  currency: string;
  lineGraph?: JSX.Element;
  price: number;
  fluctuating: number;
  star?: boolean;
  starred?: boolean;
  className?: string;
  starColor?: string;
  getStarredState?: (props: boolean) => void;
}

const CryptoCard = ({
  gradientColor = '',
  tokenComponent,
  img = '',
  chain = '',
  currency = '',
  lineGraph,
  price = 0,
  fluctuating = -1,
  star = false,
  starred = false,
  starColor,
  getStarredState: getStarredState,
  ...otherProps
}: CardProps): JSX.Element => {
  // FIXME: comment for `.tsx`
  // price = price > 0.001 ? price.toLocaleString() : price;
  fluctuating = Number(fluctuating);
  // console.log('fluctuating', fluctuating);
  const priceRise = fluctuating > 0 ? true : false;
  const fluctuatingRate = priceRise ? `(+${fluctuating}%)▴` : `(${fluctuating}%)▾`;
  // TODO: input the data and price color change as props
  const priceColor = priceRise ? `text-lightGreen` : `text-lightRed`;
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
  const [starFilled, setStarFilled] = useState(false);

  const passStarClickHandler = (data: boolean) => {
    if (!getStarredState) return;

    getStarredState(data);
  };

  const starClickHandler = () => {
    setStarFilled(!starFilled);
    passStarClickHandler(!starFilled);
  };

  const showStar = starFilled ? (
    <div className="absolute top-2 right-3">
      <BsStarFill
        onClick={starClickHandler}
        size={20}
        className={`${starColor} hover:cursor-pointer`}
      />
    </div>
  ) : star ? (
    <div onClick={starClickHandler} className="absolute top-2 right-3 hover:cursor-pointer">
      <BsStar size={20} className={`${starColor}`} />
    </div>
  ) : null;

  const showStarMobile = starFilled ? (
    <div onClick={starClickHandler} className="absolute top-1 right-1 hover:cursor-pointer">
      <BsStarFill size={13} className={`${starColor}`} />
    </div>
  ) : star ? (
    <div onClick={starClickHandler} className="absolute top-1 right-1 hover:cursor-pointer">
      <BsStar size={13} className={`${starColor}`} />
    </div>
  ) : null;

  const desktopVersionBreakpoint = 'xs:flex';
  const mobileVersionBreakpoint = 'xs:hidden';

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomArray(min: number, max: number, length: number) {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(randomNumber(min, max));
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
      return ['#1AE2A0'];
    }

    // priceColor = 'text-lightRed';
    return ['#E86D6D'];
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
            <div className="">{showStar}</div>
          </div>

          {/* line graph & price & fluctuating rate */}
          <div className="flex flex-col justify-start">
            <div className="pointer-events-none absolute top-4 h-96 bg-transparent">
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
            <div className="">{showStarMobile}</div>
          </div>

          {/* line graph & price & fluctuating rate */}
          <div className="flex flex-col justify-start">
            <div className="pointer-events-none absolute right-0 top-1 bg-transparent">
              {/* <div className="absolute top-0 left-0 h-2 w-2/3 rounded bg-blue-200"></div> */}
              <LineGraph
                sampleArray={sampleArray}
                strokeColor={thisRandomColor}
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

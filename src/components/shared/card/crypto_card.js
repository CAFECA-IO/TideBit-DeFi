import Image from 'next/image';
import React from 'react';
import {FaEthereum} from 'react-icons/fa';
// import {ReactComponent as ethIcon} from '/public/elements/group_15143.svg';
// import {ReactComponent as Logo} from './logo.svg';

// TODO: Fix the height and the weight of each cards

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
  const priceColor = priceRise ? `text-green-400` : `text-red-400`;
  // console.log('priceColor', priceColor);

  const upSvg = (
    <svg
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 1792 1792"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
    </svg>
  );

  const EthIconDownloadOnline = (
    <FaEthereum
      size={30}
      className="absolute top-1/2 left-1/2 h-5 -translate-x-1/2 -translate-y-1/2 transform text-white"
    />
  );

  const ImageComponent = (
    <Image src="/elements/group_15143.svg" width={50} height={50} className="text-red-600" />
  );

  const tokenComponentExample = (
    <img src="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg" alt="token" />
  );

  // const SvgComponent = props => (
  //   <svg width={48} height={1} xmlns="http://www.w3.org/2000/svg" {...props}>
  //     <title>{'Crypto Icon'}</title>
  //     <path d="M0 0h48v1H0z" fill="#243c5a" fillRule="evenodd" />
  //   </svg>
  // );

  return (
    <div className="h-[120px] w-[200px] rounded-2xl border-2 border-red-900 bg-white from-red-800 via-gray-900 to-black opacity-90 shadow-lg dark:bg-gradient-to-b">
      <div className="px-2 py-1">
        {/* token icon & chain & coin */}
        <div className="flex items-center">
          <span className="relative">
            {tokenComponent ? tokenComponent : tokenComponentExample}
          </span>
          <div className="ml-2 items-center">
            <p className="text-lg leading-6 text-gray-700 dark:text-gray-50">
              {' '}
              {chain ? chain : 'Ethereum'}
            </p>
            <p className="text-sm opacity-60 dark:text-gray-200">{currency ? currency : 'ETH'}</p>
          </div>
        </div>

        {/* line graph & price & fluctuating rate */}
        <div className="flex flex-col justify-start">
          <div className="relative mt-2 h-2 w-28 rounded bg-gray-200">
            <div className="absolute top-0 left-0 h-2 w-2/3 rounded bg-blue-200"></div>
          </div>
          {/**@note no default text color, otherwise it will make actual text color not work */}
          <div className="relative mt-2 flex w-[200px] justify-between">
            <span className={`mb-5 flex items-center justify-between text-sm ${priceColor}`}>
              <p className="my-4 text-left text-xl tracking-wide">
                {price ? `$ ${price}` : '$17,414'}
              </p>
              <div className="absolute right-5 flex">
                <span className="text-sm"> {fluctuatingRate ? fluctuatingRate : '(+11.1%)'}</span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;

import {BsStar, BsStarFill} from 'react-icons/bs';
import React, {useContext, useState} from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {TypeOfPnLColorHex, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {UserContext, IUserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {useGlobal} from '../../contexts/global_context';
import {ICurrency} from '../../constants/currency';
import {ToastTypeAndText} from '../../constants/toast_type';
import {useTranslation} from 'react-i18next';
import {FRACTION_DIGITS} from '../../constants/config';

type TranslateFunction = (s: string) => string;

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

export interface ILineGraphProps {
  dataArray?: number[];
  strokeColor?: string[];
  lineGraphWidth?: string;
  lineGraphWidthMobile?: string;
}

export interface ICardProps {
  tokenImg: string;
  chain: string;
  instId: string;
  currency: ICurrency;
  price: number;
  fluctuating: number;
  gradientColor: string;
  lineGraphProps: ILineGraphProps;

  star?: boolean;
  starColor?: string;
  starred?: boolean;
  getStarredState?: (props: boolean) => void;

  className?: string;
  cardClickHandler?: () => void;
}

/** Info: (20230628 - Shirley)
 * @dev used when it needs the star functionality
 * @param {boolean} star blank star
 * @param {boolean} starred fill star or not
 *
 */
const CryptoCard = ({
  gradientColor,
  tokenImg,
  chain,
  instId,
  currency,
  price = 0,
  fluctuating = -1,
  star,
  starred,
  starColor,
  lineGraphProps,
  cardClickHandler,
  ...otherProps
}: ICardProps): JSX.Element => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const userCtx = useContext(UserContext) as IUserContext;
  const marketCtx = useContext(MarketContext);
  fluctuating = Number(fluctuating);
  const priceRise = fluctuating > 0 ? true : false;
  const fluctuatingAbs = Math.abs(fluctuating);
  const fluctuatingRate = priceRise
    ? `▴ ${fluctuatingAbs.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}%`
    : `▾ ${fluctuatingAbs.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}%`;
  const priceColor = priceRise ? `text-lightGreen5` : `text-lightRed`;
  const strokeColor = priceRise ? [TypeOfPnLColorHex.PROFIT] : [TypeOfPnLColorHex.LOSS];

  const globalCtx = useGlobal();

  const starClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!userCtx.enableServiceTerm) {
      globalCtx.toast({
        type: ToastTypeAndText.INFO.type,
        message: 'Please login to add to favorites',
        typeText: t(ToastTypeAndText.INFO.text),
        autoClose: 3000,
        isLoading: false,
      });
    }

    event.stopPropagation(); // Prevent the div click handler from firing

    if (!starred) {
      userCtx.addFavorites(currency);
    } else {
      userCtx.removeFavorites(currency);
    }
  };

  const showStar = starred ? (
    <button type="button" onClick={starClickHandler} className="absolute top-2 right-3">
      <BsStarFill size={20} className={`${starColor} hover:cursor-pointer`} />
    </button>
  ) : star ? (
    <button
      type="button"
      onClick={starClickHandler}
      className="absolute top-2 right-3 hover:cursor-pointer"
    >
      <BsStar size={20} className={`${starColor}`} />
    </button>
  ) : null;

  const showStarMobile = starred ? (
    <button
      type="button"
      onClick={starClickHandler}
      className="absolute top-1 right-1 hover:cursor-pointer"
    >
      <BsStarFill size={13} className={`${starColor}`} />
    </button>
  ) : star ? (
    <button
      type="button"
      onClick={starClickHandler}
      className="absolute top-1 right-1 hover:cursor-pointer"
    >
      <BsStar size={13} className={`${starColor}`} />
    </button>
  ) : null;

  const desktopVersionBreakpoint = 'xs:flex';
  const mobileVersionBreakpoint = 'xs:hidden';

  function lineGraph({
    strokeColor = ['#3CC8C8'],
    dataArray = [42, 50, 45, 55, 49, 52, 48, 68, 48, 20],
    lineGraphWidth,
    ...otherProps
  }: ILineGraphProps) {
    const chartOptions: ApexOptions = {
      chart: {
        type: 'line',
        zoom: {
          enabled: false,
        },
        foreColor: '#373d3f',
        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        colors: strokeColor,
        width: 1.2,
      },
      xaxis: {
        axisBorder: {show: false},
        axisTicks: {show: false},
        labels: {
          show: false,
        },
        type: 'numeric',
      },
      yaxis: {
        axisBorder: {show: false},
        axisTicks: {show: false},
        labels: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    };
    const [dataSample, setDataSample] = useState({
      options: chartOptions,
      toolbar: {
        show: false,
        enabled: false,
      },
      series: [
        {
          name: 'series-1',
          data: [...dataArray],
        },
      ],
    });

    return (
      <div>
        <Chart
          options={dataSample.options}
          series={dataSample.series}
          type="line"
          width={lineGraphWidth}
        />
      </div>
    );
  }

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

  const sampleArray = randomArray(1100, 1200, 10);

  const fakeDataColor = () => {
    if (sampleArray[sampleArray.length - 1] > sampleArray[sampleArray.length - 2]) {
      return [TypeOfPnLColorHex.PROFIT];
    }

    return [TypeOfPnLColorHex.LOSS];
  };
  const thisRandomColor = fakeDataColor();

  return (
    <>
      {/* -----Info: Desktop (width > 500px) version (Card 200x120) (20230628 - Shirley)----- */}
      <div
        className={`${desktopVersionBreakpoint} ${otherProps?.className} relative m-0 hidden h-120px w-200px rounded-2xl border-0.5px p-0 hover:cursor-pointer ${gradientColor} bg-transparent bg-gradient-to-b opacity-90 shadow-lg`}
        onClick={() => {
          marketCtx.selectTickerHandler(instId);
          cardClickHandler && cardClickHandler();
        }}
      >
        <div className="px-2 py-1">
          <div className="flex items-center">
            <Image src={tokenImg} alt={currency} height={40} width={40} />

            <div className="ml-3 items-center">
              <p className="text-lg leading-6 text-lightWhite"> {chain}</p>
              <p className="text-sm text-lightWhite opacity-60">{currency}</p>
            </div>
            <div className="">{showStar}</div>
          </div>

          <div className="flex flex-col justify-start">
            <div className="pointer-events-none absolute top-4 h-96 bg-transparent">
              {lineGraph({
                dataArray: lineGraphProps?.dataArray || sampleArray,
                strokeColor: strokeColor || lineGraphProps?.strokeColor || thisRandomColor,
                lineGraphWidth: lineGraphProps?.lineGraphWidth || '170',
              })}
            </div>
            <div className="absolute bottom-0 flex w-200px justify-between">
              <span
                className={`flex items-center justify-between text-sm ${priceColor} mt-3 align-middle`}
              >
                <p className="mx-1 text-left text-xl font-normal tracking-wide">₮ {price}</p>
                <div className="absolute right-4 flex">
                  <span className="text-sm"> {fluctuatingRate}</span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* -----Info: Mobile (width < 500px) version (Card 134x81) (20230628 - Shirley)----- */}
      <div
        className={`${mobileVersionBreakpoint} ${otherProps?.className} relative m-0 h-81px w-134px rounded-2xl border-0.5px p-0 ${gradientColor} bg-black bg-gradient-to-b opacity-90 shadow-lg`}
        onClick={() => {
          marketCtx.selectTickerHandler(instId);
          cardClickHandler && cardClickHandler();
        }}
      >
        <div className="px-2 py-1">
          <div className="mb-1 flex items-center">
            <Image src={tokenImg} alt={currency} width={28} height={28} />

            <div className="ml-3 items-center">
              <p className="text-sm leading-none text-lightWhite"> {chain}</p>
              <p className="text-xs text-lightWhite opacity-60">{currency}</p>
            </div>
            <div className="">{showStarMobile}</div>
          </div>

          <div className="flex flex-col justify-start">
            <div className="pointer-events-none absolute right-0 top-1 bg-transparent">
              {lineGraph({
                dataArray: lineGraphProps?.dataArray || sampleArray,
                strokeColor: strokeColor || lineGraphProps?.strokeColor || thisRandomColor,
                lineGraphWidth: lineGraphProps?.lineGraphWidthMobile || '140',
              })}
            </div>
            <div className="absolute bottom-0 flex w-134px justify-between">
              <span
                className={`flex items-center justify-between text-xs ${priceColor} mt-3 align-middle`}
              >
                <p className="ml-0 mb-1 text-left text-xs font-normal tracking-wide">
                  ₮ {price.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
                </p>
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

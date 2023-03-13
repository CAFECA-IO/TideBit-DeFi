import React, {useState, useContext, useEffect, useRef} from 'react';
import Lottie, {useLottie} from 'lottie-react';
import spotAnimation from '../../../public/animation/circle.json';
import {
  EXAMPLE_BLUE_COLOR,
  LIGHT_GRAY_COLOR,
  LINE_GRAPH_STROKE_COLOR,
  TRADING_CHART_BORDER_COLOR,
  TypeOfPnLColorHex,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from 'react-icons/bs';
import {MarketContext, MarketProvider} from '../../contexts/market_context';
import {randomFloatFromInterval, randomIntFromInterval, timestampToString} from '../../lib/common';
import {
  ICandlestickData,
  getDummyCandlestickChartData,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import useStateRef from 'react-usestateref';
import {
  VictoryScatter,
  VictoryLabel,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine,
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
  VictoryCursorContainer,
} from 'victory';
import {AppContext} from '../../contexts/app_context';
import Image from 'next/image';
import {GlobalContext} from '../../contexts/global_context';

interface ITradingChartGraphProps {
  strokeColor: string[];
  candlestickOn: boolean;
  lineGraphOn: boolean;
  candlestickChartWidth: string;
  candlestickChartHeight: string;
}

export interface ILineChartData {
  x: Date;
  y: number | null;
}

export const updateDummyCandlestickChartData = (data: ICandlestickData[]): ICandlestickData[] => {
  const n = 80;
  const chartBlank = 1.68;
  const dummyDataSize = 80;
  const unitOfLive = 1000;

  const now = new Date().getTime();

  const origin = [...data].slice(1);

  const count = countNullArrays(origin);

  // Till: (20230327 - Shirley)
  // const originWithoutNull = originalData.slice(0, -count);
  const originWithoutNull = origin.filter(obj => !obj.y.includes(null));

  const lastTime = originWithoutNull[originWithoutNull.length - 1]?.x.getTime() as number;
  const lastPoint = originWithoutNull[originWithoutNull.length - 1]?.y[3] as number;

  // Inform: Generate new data
  const nowSecond = now - (now % unitOfLive);

  const newYs: (number | null)[] = new Array(4).fill(0).map(v => {
    const price = lastPoint * randomFloatFromInterval(0.95, 1.05, 2);

    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });

  const newCandlestickData: ICandlestickData = {
    x: new Date(nowSecond - 1 * unitOfLive),
    y: newYs,
  };

  const addition = n / chartBlank;

  const nullNum = 1;
  const nullTime = 10;

  const withNullData = [
    ...originWithoutNull,
    newCandlestickData,
    ...Array.from({length: nullNum}, (_, i) => ({
      x: new Date(nowSecond + unitOfLive * nullTime),
      y: [null, null, null, null],
    })),
  ];

  return withNullData;
};

function countNullArrays(arr: {y: any[]}[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].y) && arr[i].y.every(v => v === null)) {
      count++;
    }
  }
  return count;
}

export interface IProcessCandlestickData {
  data: ICandlestickData[];
  requiredDataNum: number;
}

// TODO: (20230313 - Shirley) after getting the complete data from Context, process it to the required format
export function processCandlestickData({data, requiredDataNum}: IProcessCandlestickData) {
  const origin = [...data];
  const nullNum = countNullArrays(origin);

  const unitOfLive = 1000;
  const now = new Date().getTime();
  const nowSecond = now - (now % unitOfLive);

  const originWithoutNull = origin.filter(obj => !obj.y.includes(null));
  const latestData = originWithoutNull.slice(-requiredDataNum);
  const toCandlestickData = [
    ...latestData,
    ...Array.from({length: nullNum}, (_, i) => ({
      x: new Date(nowSecond + unitOfLive * (i + 1)),
      y: [null, null, null, null],
    })),
  ];

  return toCandlestickData;
}

export interface ITrimCandlestickData {
  data: ICandlestickData[];
  requiredDataNum: number;
}

export function trimCandlestickData({data, requiredDataNum}: ITrimCandlestickData) {
  const latestData = data.slice(-requiredDataNum);
  if (latestData === undefined || latestData.length === 0) return;

  const trimmedData = latestData;

  return trimmedData;
}

export default function CandlestickChart({
  strokeColor,
  candlestickOn,
  lineGraphOn,
  candlestickChartWidth,
  candlestickChartHeight,
  ...otherProps
}: ITradingChartGraphProps) {
  const marketCtx = useContext(MarketContext);
  const appCtx = useContext(AppContext);
  const globalCtx = useContext(GlobalContext);

  const candlestickChartDataFromCtx =
    marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  const NULL_ARRAY_NUM = 1;

  const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useStateRef<
    ICandlestickData[] | undefined
  >(() =>
    trimCandlestickData({
      data: marketCtx?.candlestickChartData ?? [],
      requiredDataNum: 30,
    })
  );

  const [toCandlestickChartData, setToCandlestickChartData, toCandlestickChartDataRef] =
    useStateRef<
      | {
          x: Date;
          open: number | null;
          high: number | null;
          low: number | null;
          close: number | null;
        }[]
      | undefined
    >(() => {
      const trimmedData = trimCandlestickData({
        data: candlestickChartDataFromCtx,
        requiredDataNum: 30,
      });
      return trimmedData?.map(data => ({
        x: data.x,
        open: data.y[0],
        high: data.y[1],
        low: data.y[2],
        close: data.y[3],
      }));
    });

  const [toLineChartData, setToLineChartData, toLineChartDataRef] = useStateRef<
    {
      x: Date;
      y: number | null;
    }[]
  >(() =>
    candlestickChartDataFromCtx.map((data, i) => ({
      x: data.x,
      y: data.y[3],
    }))
  );

  const [toLatestPriceLineData, setToLatestPriceLineData, toLatestPriceLineDataRef] = useStateRef<
    {
      x: Date;
      y: number | null;
    }[]
  >(
    toLineChartData?.map(data => ({
      x: data?.x,
      y: toLineChartData?.[toLineChartData.length - NULL_ARRAY_NUM - 1]?.y,
    }))
  );

  // the max and min shouldn't be responsive to the candlestick data
  const ys = candlestickChartDataFromCtx.flatMap(d => d.y.filter(y => y !== null)) as number[];

  const maxNumber = ys.length > 0 ? Math.max(...ys) : null;
  const minNumber = ys.length > 0 ? Math.min(...ys) : null;

  const userOpenPrice = randomIntFromInterval(minNumber ?? 100, maxNumber ?? 1000);
  const userOpenPriceLine = toLatestPriceLineData?.map(data => ({
    x: data?.x,
    y: 10000,
  }));

  useEffect(() => {
    if (!appCtx.isInit) return;
    if (marketCtx.candlestickChartData === null) return;

    if (!toCandlestickChartDataRef.current) {
      setCandlestickChartData(() =>
        trimCandlestickData({data: marketCtx?.candlestickChartData ?? [], requiredDataNum: 30})
      );

      setToCandlestickChartData(
        candlestickChartData?.map(data => ({
          x: data.x,
          open: data.y[0],
          high: data.y[1],
          low: data.y[2],
          close: data.y[3],
        }))
      );
    }

    const setStateInterval = setInterval(() => {
      if (!candlestickChartDataRef?.current) return;

      const updatedCandlestickChartData = updateDummyCandlestickChartData(
        candlestickChartDataRef?.current
      );

      setCandlestickChartData(updatedCandlestickChartData);

      const toCandlestickChartData = updatedCandlestickChartData?.map(data => ({
        x: data.x,
        open: data.y[0],
        high: data.y[1],
        low: data.y[2],
        close: data.y[3],
      }));

      /* TODO: (20230313 - Shirley) Sometimes, the candlestick overlays with another candlestick (20230310 - Shirley)
       console.log('data put into chart', toCandlestickChartDataRef.current);
       console.log('market Ctx', marketCtx.candlestickChartData);
      */

      setToCandlestickChartData(toCandlestickChartData);

      const toLineChartData = updatedCandlestickChartData.map((data, i) => ({
        x: data.x,
        y: data.y[3],
      }));
      setToLineChartData(toLineChartData);

      const latestPrice = toLineChartData?.[toLineChartData.length - NULL_ARRAY_NUM - 1]?.y;
      const toLatestPriceLineData = toLineChartData?.map(data => ({
        x: data?.x,
        y: latestPrice,
      }));

      setToLatestPriceLineData(toLatestPriceLineData);
    }, 1000 * 1);

    return () => {
      clearInterval(setStateInterval);
    };
  }, [marketCtx.candlestickChartData]);

  // TODO: VictoryThemeDefinition to get the type (20230310 - Shirley)
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: LIGHT_GRAY_COLOR,
          fontSize: 10,
          fontFamily: 'barlow',
          padding: 5,
        },
        axis: {
          stroke: LIGHT_GRAY_COLOR,
        },
        grid: {
          stroke: 'none',
        },
      },
    },
    line: {
      style: {
        data: {
          stroke: LIGHT_GRAY_COLOR,
          strokeWidth: 1,
        },
      },
    },
  };

  const isDisplayedCharts =
    candlestickChartDataRef.current && candlestickChartDataRef.current?.length > 0 ? (
      <VictoryChart
        theme={chartTheme}
        minDomain={{y: minNumber !== null ? minNumber * 0.7 : undefined}}
        maxDomain={{y: maxNumber !== null ? maxNumber * 1.3 : undefined}} // TODO: measure the biggest number to decide the y-axis
        // Till: (20230327 - Shirley)  // domainPadding={{x: 1}}
        width={Number(candlestickChartWidth)}
        height={Number(candlestickChartHeight)}
        /* Till: (20230327 - Shirley)
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({datum}) =>
                `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
              }
              labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
            />
          }
        */
      >
        {/* Till: (20230327 - Shirley) 
        <VictoryLabel
        x={25}
        y={24}
        style={{stroke: EXAMPLE_BLUE_COLOR}}
        text={`${(d: any) => d.datum}`}
      /> */}
        <VictoryAxis
          // Till: (20230327 - Shirley) // scale={{x: 'time'}}
          style={{
            axis: {stroke: 'none'},
          }}
          tickFormat={t => ` ${timestampToString(t / 1000).time}`}
        />
        <VictoryAxis
          tickLabelComponent={<VictoryLabel dx={45} />}
          offsetX={Number(candlestickChartWidth) - 50}
          dependentAxis
          // tickValues={[minNumber, maxNumber]}
          // tickLabelComponent={<OpenPriceLabel x={1000} />}
        />

        {candlestickOn && (
          <VictoryCandlestick
            animate={{
              duration: 0,
              onExit: {
                duration: 0,
                before(datum, index, data) {
                  return {y: datum._y1, _y1: datum._y0};
                },
              },
            }}
            style={{
              data: {
                fillOpacity: 1,
                stroke: (d: any) =>
                  d.close > d.open ? TypeOfPnLColorHex.LOSS : TypeOfPnLColorHex.PROFIT,
                strokeWidth: 1,
                strokeOpacity: 0.5,
                textDecorationColor: 'white',
              },
            }}
            candleRatio={0.5}
            // Till: (20230327 - Shirley) // candleWidth={8}
            candleColors={{
              positive: TypeOfPnLColorHex.PROFIT,
              negative: TypeOfPnLColorHex.LOSS,
            }}
            data={toCandlestickChartDataRef.current ?? []}
            labels={({datum}) =>
              `O:${datum.open} 　H:${datum.high}　 L:${datum.low}　 C:${datum.close}`
            }
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
                // Till: (20230327 - Shirley) // center={{x: 170, y: -10}}
                x={26}
                y={-10}
                flyoutStyle={{
                  stroke: 'none',
                  fill: '#000000',
                }}
                style={{
                  padding: 0,
                  backgroundColor: '#000000',
                  background: '#000000',
                  fill: LIGHT_GRAY_COLOR,
                  fontFamily: 'barlow',
                  fontSize: 14,

                  /*  Till: (20230327 - Shirley) it works but it's not as designed 
                  fill: (d: any) =>
                    d.datum.close > d.datum.open
                      ? TypeOfPnLColorHex.PROFIT
                      : TypeOfPnLColorHex.LOSS,
                  padding: 8,
                  letterSpacing: 0.5,
                  */
                }}
                pointerLength={0}
                pointerWidth={0}
              />
            }
            /* Till: (20230327 - Shirley)
              containerComponent={
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={({datum}) =>
                    `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
                  }
                  labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
                />
              }
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onMouseOver: () => ({
                     // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
                      target: 'openLabels',
                      mutation: () => ({active: true}),
                    }),
                    onMouseOut: () => ({
                     // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
                      target: 'openLabels',
                      mutation: () => ({active: false}),
                    }),
                  },
                },
              ]}
            */
          />
        )}

        {lineGraphOn && (
          <VictoryLine
            animate={{
              duration: 0,
              onEnter: {
                duration: 100,
                before(datum, index, data) {
                  return {y: datum._y1, _y1: datum._y0};
                },
              },
            }}
            style={{
              data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
            }}
            data={toLineChartDataRef.current ?? []}
          />
        )}

        <VictoryLine
          /* Till: (20230327 - Shirley)
            animate={{
              duration: 1000,
            }}
          */
          style={{
            data: {stroke: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME, strokeWidth: 1},
          }}
          data={toLatestPriceLineDataRef.current ?? []}
        />

        <VictoryScatter
          data={toLatestPriceLineDataRef.current ?? []}
          style={{
            data: {
              fill: ({datum}) =>
                datum.x ===
                toLatestPriceLineDataRef?.current[toLatestPriceLineDataRef?.current?.length - 1].x
                  ? 'transparent'
                  : 'transparent',
              // opacity: 0.5,
            },
            labels: {
              opacity: 0.5,
              fill: 'transparent',
              // fillOpacity: 0.5,
            },
          }}
          labels={({datum}) =>
            datum.x ===
            toLatestPriceLineDataRef?.current[toLatestPriceLineDataRef?.current?.length - 1].x
              ? `${datum.y}`
              : ``
          }
          labelComponent={
            <VictoryLabel
              x={Number(candlestickChartWidth) - 28}
              style={{
                fill: LINE_GRAPH_STROKE_COLOR.DEFAULT,
                fontSize: 10,
                // opacity: 0.5,
              }}
              backgroundStyle={{fill: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME}} // Info: sets the background style
              backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}} // Info: sets the background padding
            />
          }
        />

        {/* TODO: User open position line on charts (20230310 - Shirley)  */}
        <VictoryLine
          style={{
            data: {stroke: EXAMPLE_BLUE_COLOR, strokeWidth: 1, strokeDasharray: '2,2'},
            // parent: {border: '1px solid #ccc'},
          }}
          data={userOpenPriceLine}
          // data={new Array(30)
          //   .fill(0)
          //   .map((v, index) => {
          //     return {
          //       x: new Date(new Date().getTime() - index * 1000),
          //       y: 10000,
          //     };
          //   })
          //   .reverse()}
        />

        <VictoryScatter
          style={{data: {fill: 'transparent'}, labels: {background: 'transparent'}}}
          data={userOpenPriceLine}
          // `⬆️⬆&#xf436; ${datum.y}`
          labels={({datum}) =>
            datum.x === userOpenPriceLine[userOpenPriceLine.length - 1].x
              ? `Position $${datum.y.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}　Close`
              : ``
          }
          // dataComponent={<OpenPriceLabel x={Number(candlestickChartWidth) - 68} />}
          labelComponent={
            // <OpenPriceLabel x={Number(candlestickChartWidth) - 68} />
            <VictoryLabel
              // backgroundComponent={
              //   // <Image src="/elements/tether-seeklogo.com.svg" width={12} height={12} alt="icon" />
              // }
              // style={{backgroundImage: 'url(/elements/tether-seeklogo.com.svg)'}}
              // children={''}
              // bg-[url('/elements/tether-seeklogo.com.svg')]
              className="hover:cursor-pointer hover:opacity-80"
              // img={''}
              events={{
                onClick: e => {
                  // console.log(e.clientX, e.clientY);
                  globalCtx.visiblePositionClosedModalHandler();
                },
              }}
              // backgroundComponent={<OpenPriceLabel x={123456} />}
              // backgroundComponent={
              //   <svg
              //     xmlns="http://www.w3.org/2000/svg"
              //     width="30"
              //     height="30"
              //     fillRule="evenodd"
              //     clipRule="evenodd"
              //     imageRendering="optimizeQuality"
              //     shapeRendering="geometricPrecision"
              //     textRendering="geometricPrecision"
              //     viewBox="0 0 512 512"
              //   >
              //     <path
              //       fillRule="nonzero"
              //       d="M484.7 256c0-63.16-25.6-120.35-66.97-161.73C376.34 52.9 319.15 27.29 256 27.29c-63.16 0-120.35 25.61-161.73 66.98C52.9 135.66 27.29 192.84 27.29 256S52.9 376.35 94.27 417.73C135.65 459.1 192.84 484.7 256 484.7c63.15 0 120.34-25.6 161.73-66.97C459.1 376.35 484.7 319.16 484.7 256zm-129.33-.38l-65.44.02v-86.06h-67.86v86.06h-65.45c-1.07 0-1.9.32-2.43.8-.35.33-.68.8-.91 1.34-.2.45-.31 1.03-.31 1.66 0 .82.29 1.67.92 2.36l100.45 102.73c.7.58 1.52.89 2.28.89.86 0 1.74-.29 2.46-.87 32.17-29.2 68.11-70.68 99.06-102.82.65-.76.96-1.55.96-2.21 0-.55-.14-1.14-.39-1.69-.22-.47-.59-.96-1.07-1.38-.58-.53-1.4-.87-2.27-.83zm-38.15-27.27h38.15c7.93.06 14.86 2.96 20.12 7.53 3.38 2.9 6.08 6.58 7.95 10.66 1.84 4.01 2.84 8.46 2.84 12.98-.01 7-2.35 14.11-7.58 20.1l-99.11 102.89a32.053 32.053 0 01-3.06 2.96c-5.83 4.83-13.01 7.19-20.12 7.13-7.2-.07-14.38-2.62-20.06-7.63-34.04-34.9-68.06-70.29-102.51-104.74-5.63-6.14-8.17-13.55-8.17-20.79 0-4.27.93-8.57 2.67-12.54 1.71-3.91 4.26-7.52 7.52-10.51 5.35-4.9 12.48-8.04 20.76-8.04h38.16v-59.79c0-7.22 2.97-13.81 7.72-18.56 4.81-4.75 11.37-7.72 18.56-7.72h69.88c7.17 0 13.74 2.97 18.51 7.73 4.8 4.82 7.77 11.38 7.77 18.55v59.79zM437.01 74.99C483.34 121.31 512 185.32 512 256c0 70.68-28.66 134.69-74.99 181.01C390.68 483.34 326.67 512 256 512c-70.68 0-134.69-28.66-181.01-74.99C28.66 390.69 0 326.68 0 256c0-70.67 28.66-134.68 74.99-181.01C121.31 28.66 185.32 0 256 0c70.67 0 134.68 28.66 181.01 74.99z"
              //     ></path>
              //   </svg>
              //   // <svg
              //   //   xmlns="http://www.w3.org/2000/svg"
              //   //   data-name="Layer 1"
              //   //   viewBox="0 0 115.4 122.88"
              //   // >
              //   //   <path d="M24.94 67.88A14.66 14.66 0 014.38 47L47.83 4.21a14.66 14.66 0 0120.56 0L111 46.15a14.66 14.66 0 01-20.54 20.91l-18-17.69-.29 59.17c-.1 19.28-29.42 19-29.33-.25l.3-58.29-18.2 17.88z"></path>
              //   // </svg>

              //   // <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="-3 0 32 32">
              //   //   <path d="M26.221 16c0-7.243-5.871-13.113-13.113-13.113S-.005 8.757-.005 16c0 7.242 5.871 13.113 13.113 13.113S26.221 23.242 26.221 16zM1.045 16c0-6.652 5.412-12.064 12.064-12.064S25.173 9.348 25.173 16s-5.411 12.064-12.064 12.064C6.457 28.064 1.045 22.652 1.045 16z"></path>
              //   //   <path d="M18.746 15.204l.742-.742-6.379-6.379-6.378 6.379.742.742 5.112-5.112v12.727h1.049V10.092z"></path>
              //   // </svg>
              //   // <rect x={5} y={5} width={10} height={10} />
              //   // <img src="/elements/tether-seeklogo.com.svg" width={12} height={12} alt="icon" />
              // }
              x={Number(candlestickChartWidth) - 120}
              style={{
                fill: LINE_GRAPH_STROKE_COLOR.DEFAULT,
                fontSize: 12,
                fontFamily: 'barlow',

                // backgroundImage: 'linear-gradient(90deg, #000000 0%, #000000 100%)',
                // opacity: 0.5,
              }}
              backgroundStyle={{
                fill: LINE_GRAPH_STROKE_COLOR.LONG,
              }} // Info: sets the background style
              // backgroundStyle={{fill: LINE_GRAPH_STROKE_COLOR.LONG}} // Info: sets the background style
              backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}} // Info: sets the background padding
              // backgroundPadding={30}
            />
          }
        />
      </VictoryChart>
    ) : (
      <p>Loading</p>
    );

  return (
    <>
      <div className="-ml-5" style={{width: '70%'}}>
        {/* TODO: (20230310 - Shirley) SVG location 
          <Lottie className="latestPrice" animationData={spotAnimation} /> 
          <div ref={lottieContainerRef} className="z-50 w-50px text-cuteBlue1">
          <p>lottie</p>
          {View}
        </div>{' '} */}

        {isDisplayedCharts}
      </div>
    </>
  );
}

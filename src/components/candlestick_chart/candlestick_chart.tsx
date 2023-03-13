import React, {useState, useContext, useEffect, useRef} from 'react';
import Lottie, {useLottie} from 'lottie-react';
import spotAnimation from '../../../public/animation/circle.json';
import {
  EXAMPLE_BLUE_COLOR,
  LIGHT_GRAY_COLOR,
  LINE_GRAPH_STROKE_COLOR,
  TRADING_CHART_BORDER_COLOR,
  TypeOfPnLColorHex,
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
    y: userOpenPrice + 10,
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

  /* TODO: (20230310 - Shirley) finish the lottie animation on charts
  // Info: Use useRef to reference the SVG element, the Lottie container element, and the Lottie animation object
  const svgRef = useRef<SVGSVGElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const lottieAnimationRef = useRef<Animation>();
  const [options, setOptions] = useState<any>({
    container: lottieContainerRef.current as Element,
    // renderer: svgRef.current as SVGElement,
    loop: true,
    autoplay: true,
    // import spotAnimation from '../../../public/animation/circle.json';

     // animationData: spotAnimation,
     animationData: require('../../../public/animation/circle.json'),
   })

   useEffect(() => {
     // !toCandlestickChartDataRef.current &&
     // toCandlestickChartDataRef.current?.length === 0
     // [important to fix bug] Check if the candlestick chart data is empty
     if (!toCandlestickChartDataRef.current) return;

     // Use the useRef hooks to access the current values of the SVG element and the Lottie container element
     const svgElement = svgRef.current;
     // const lottieContainerElement = lottieContainerRef.current;

     // console.log('toCandlestickChartData', toCandlestickChartData);

     // Check if the SVG element (THE candlestick chart) exists
     if (svgElement) {
       // Get the data for the latest candlestick
       const latestCandle =
         toCandlestickChartDataRef.current[toCandlestickChartDataRef.current.length - 2];
       const {x, high, low} = latestCandle;
       if (high === null || low === null) {
         console.log('high or low is null', {high, low});
         return;
       }

       console.log('last candle', latestCandle);

       const xTime = x.getTime();

       // Calculate the x and y coordinates of the top of the latest candlestick relative to the SVG element
       const rect = svgElement?.getBoundingClientRect();
       console.log('rect', rect);
       if (!rect) return;

       const gElements = svgElement.querySelectorAll('g'); // select all <g> elements within the SVG
       const lastGElement = gElements[gElements.length - 2]; // select the last <g> element
       console.log('g in candlestick chart', gElements);
       console.log('last g in candlestick chart', lastGElement);

       // Calculate the x and y coordinates of the top of the latest candlestick relative to the SVG element
       const xCoord = rect.x + ((xTime - 1) / toCandlestickChartDataRef.current.length) * rect.width; // calculate the x coordinate of the latest candle
       const yCoord = rect.y + (1 - high / (rect.height - rect.y)) * rect.height; // calculate the y coordinate of the top of the latest candle

       console.log('x, y coordiante', xCoord, yCoord);

       // If the Lottie container element exists, set its position to the calculated x and y coordinates
       const lottieContainerElement = lottieContainerRef.current;
       if (lottieContainerElement) {
         lottieContainerElement.style.position = 'absolute';
         lottieContainerElement.style.left = `${xCoord}px`;
         lottieContainerElement.style.top = `${yCoord}px`;
       }

       console.log(
         'lottie coord',
         lottieContainerElement?.style.left,
         lottieContainerElement?.style.top
       );
     }

     // const options = {
     //   container: lottieContainerRef.current as Element,
     //   // renderer: svgRef.current as SVGElement,
     //   loop: true,
     //   autoplay: true,
     //   // import spotAnimation from '../../../public/animation/circle.json';

     //   animationData: spotAnimation,
     // };

     // const {View} = useLottie(options);

     // lottieAnimationRef.current = View

     // lottie.loadAnimation({
     //   container: lottieContainerElement as Element,
     //   renderer: 'svg',
     //   loop: true,
     //   autoplay: true,
     //   animationData: require('./path/to/lottie/animation.json')
     // });

     // Use a cleanup function to destroy the Lottie animation object when the component unmounts
     // return () => {
     //   if (lottieAnimationRef.current) {
     //     lottieAnimationRef.current.destroy();
     //   }
     // };
   }, [marketCtx.candlestickChartData]);

   const options = {
     container: lottieContainerRef.current as Element,
     // renderer: svgRef.current as SVGElement,
     loop: true,
     autoplay: true,
     // import spotAnimation from '../../../public/animation/circle.json';

     // animationData: spotAnimation,
     animationData: require('../../../public/animation/circle.json'),
   };

   console.log('options', options);

   const {View} = useLottie(options);
   console.log('before `isDisplayedCharts`, candle Ref:', candlestickChartDataRef.current); // undefined
   console.log('before `isDisplayedCharts` , market Ctx:', marketCtx.candlestickChartData); // null
   console.log(
     'before `isDisplayedCharts` , trimmed market Ctx:',
     trimCandlestickData({data: marketCtx?.candlestickChartData ?? [], requiredDataNum: 30})
   );

   console.log('candlestickChartDataRef length', candlestickChartDataRef.current?.length);
*/

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
        <VictoryAxis offsetX={Number(candlestickChartWidth) - 50} dependentAxis />

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

        {/* TODO: User open position line on charts (20230310 - Shirley) 
        <VictoryLine
          style={{
            data: {stroke: EXAMPLE_BLUE_COLOR, strokeWidth: 1},
            // parent: {border: '1px solid #ccc'},
          }}
          // data={userOpenPriceLine}
          data={new Array(30)
            .fill(0)
            .map((v, index) => {
              return {
                x: new Date(new Date().getTime() - index * 1000),
                y: 10000,
              };
            })
            .reverse()}
        />
        */}

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
          // animate={{
          //   duration: 1000,
          // }}
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
              }}
              backgroundStyle={{fill: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME}} // Info: sets the background style
              backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}} // Info: sets the background padding
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
        {/* TODO: (20230310 - Shirley) SVG location 
         <svg ref={svgRef} /> 
         <svg ref={svgRef} width={800} height={30} fill="#c43a31">
          <rect width={800} height={30} fill="#c43a31" />
        </svg> 
         <svg>
          <defs>
            <linearGradient id="radial_gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stop-color="#190b28" />
              <stop offset="25%" stop-color="#190b28" />
              <stop offset="25%" stop-color="#434238" />
              <stop offset="50%" stop-color="#434238" />
              <stop offset="50%" stop-color="#334110" />
              <stop offset="75%" stop-color="#334110" />
              <stop offset="75%" stop-color="#524800" />
              <stop offset="100%" stop-color="#524800" />
            </linearGradient>
          </defs>
        </svg> 
        */}
      </div>
    </>
  );
}

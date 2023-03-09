/*eslint-disable no-console */
import React, {useState, useContext, useEffect, useRef} from 'react';
import Lottie, {useLottie} from 'lottie-react';
import spotAnimation from '../../../public/animation/circle.json';

// import dynamic from 'next/dynamic';
// import ApexCharts, {ApexOptions} from 'apexcharts';
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
import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import useStateRef from 'react-usestateref';
import {VictoryThemeDefinition} from 'victory-core/lib/victory-theme/types';
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

// const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ITradingChartGraphProps {
  strokeColor: string[];
  candlestickOn: boolean;
  lineGraphOn: boolean;
  // dataArray: number[];
  candlestickChartWidth: string;
  // annotatedValue: number;
  candlestickChartHeight: string;
  // ref?: React.RefObject<HTMLDivElement>;
  // positionDisplayingState: boolean;
}

export interface ILineChartData {
  x: Date;
  y: number | null;
}

// export const getDummyLineData = (n: number) => {
//   const now = new Date().getTime();
//   const nowSecond = now - (now % 1000);

//   const data: ILineChartData[] = new Array(n).fill(0).map((v, i) => {
//     // const y = Math.random() * 100;
//     const y = randomFloatFromInterval(100, 6000, 2);
//     const result: ILineChartData = {
//       x: new Date(nowSecond - (n - i) * 1000),
//       y,
//     };
//     return result;
//   });

//   // add null data
//   const nullDataCount = Math.ceil(n / 1000);
//   for (let i = 0; i < nullDataCount; i++) {
//     // const randomIndex = randomIntFromInterval(0, n - 1);
//     data.push({
//       x: new Date(nowSecond + (n - i) * 1000),
//       y: null,
//     });
//   }

//   return data;
// };

// export const getDummyHorizontalLineData = (n: number) => {
//   const now = new Date().getTime();
//   const nowSecond = now - (now % 1000);

//   const data: ILineChartData[] = new Array(n).fill(0).map((v, i) => ({
//     x: new Date(nowSecond - (n - i) * 1000),
//     y: 5500,
//   }));

//   // // add null data
//   // const nullDataCount = Math.ceil((y / 14) * 5);
//   // for (let i = 0; i < nullDataCount; i++) {
//   //   const randomIndex = randomIntFromInterval(0, y - 1);
//   //   data[randomIndex].y = null;
//   // }

//   return data;
// };

// const dummyLineData = getDummyLineData(50);

// const dummyHorizontalLineData = getDummyHorizontalLineData(80);

export const updateDummyCandlestickChartData = (data: ICandlestickData[]): ICandlestickData[] => {
  const chartBlank = 1.68;
  const dummyDataSize = 80;
  const unitOfLive = 1000;

  const originalData = [...data];
  const lastTime = originalData[originalData.length - 2]?.x.getTime() as number;
  const lastPoint = originalData[originalData.length - 2]?.y[3] as number;

  // Generate new data
  const newTime = lastTime + unitOfLive;

  // console.log('new point in update func', newPoint);

  const newYs: (number | null)[] = new Array(4).fill(0).map(v => {
    const rnd = Math.random() / 1.2;
    const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
    const price = lastPoint * ts;

    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });

  const newCandlestickData: ICandlestickData = {
    x: new Date(),
    y: newYs,
  };

  // Add new data and remove the first element
  const withoutFirst = originalData.slice(1); // remove the first element
  const withoutLast = withoutFirst.slice(0, withoutFirst.length - 1); // remove the last element
  const withNewData = withoutLast.concat(newCandlestickData); // add new data to end
  const withNullData = withNewData.concat({x: new Date(), y: [null, null, null, null]}); // add null data to end

  return withNullData;

  // newData.pop(); // remove null data

  // newData.shift();

  // newData.push(newCandlestickData);
  // newData.push({
  //   x: new Date(),
  //   y: [null, null, null, null],
  // }); // add null data back

  // return newData;
};

/**
 *
 * @param
 * @returns `candlestickData`- dataObject:nullObject = 9:5
 */

export default function CandlestickChart({
  strokeColor,
  candlestickOn,
  lineGraphOn,
  candlestickChartWidth,
  candlestickChartHeight,
  // ref
  ...otherProps
}: ITradingChartGraphProps) {
  const marketCtx = useContext(MarketContext);
  // const candlestickChartRef = useRef<HTMLDivElement>(null);
  const candlestickChartDataFromCtx =
    marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  const isCandlestickDataEmpty = candlestickChartDataFromCtx.length === 0;

  const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useStateRef<
    ICandlestickData[] | []
  >(candlestickChartDataFromCtx);

  // const [toCandlestickChartData, setToCandlestickChartData, toCandlestickChartDataRef] =
  //   useStateRef<
  //     {
  //       x: Date;
  //       open: number | null;
  //       high: number | null;
  //       low: number | null;
  //       close: number | null;
  //     }[]
  //   >([]);
  // // console.log('after declaration of toCandlestickChartData', toCandlestickChartDataRef.current);

  // // () =>
  // // candlestickChartDataFromCtx?.map(data => ({
  // //   x: data.x,
  // //   open: data.y[0],
  // //   high: data.y[1],
  // //   low: data.y[2],
  // //   close: data.y[3],
  // //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  // // }))

  // const [toLineChartData, setToLineChartData, toLineChartDataRef] = useStateRef<
  //   {
  //     x: Date;
  //     y: number | null;
  //   }[]
  // >(() =>
  //   candlestickChartDataFromCtx.map((data, i) => ({
  //     x: data.x,
  //     y: data.y[3],
  //   }))
  // );

  // const [toLatestPriceLineData, setToLatestPriceLineData, toLatestPriceLineDataRef] = useStateRef<
  //   | {
  //       x: Date;
  //       y: number | null;
  //     }[]
  //   | undefined
  // >();

  // useEffect(() => {
  //   if (marketCtx.candlestickChartData === null) return;

  //   console.log('update candlestick chart data');

  // FIXME: It will update the chart data, but sometimes get NaN
  //   const setStateInterval = setInterval(() => {
  //     // setCandlestickChartData(updateDummyCandlestickChartData(candlestickChartDataRef.current));
  //     const updatedCandlestickChartData = updateDummyCandlestickChartData(
  //       candlestickChartDataRef.current
  //     );
  //     const toCandlestickChartData = updatedCandlestickChartData?.map(data => ({
  //       x: data.x,
  //       open: data.y[0],
  //       high: data.y[1],
  //       low: data.y[2],
  //       close: data.y[3],
  //       // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  //     }));
  //     console.log(
  //       'to candlestick chart data',
  //       toCandlestickChartData[toCandlestickChartData.length - 2]
  //     );
  //     // setToCandlestickChartData(toCandlestickChartDataTemp);
  //     setToCandlestickChartData(toCandlestickChartData);

  //     const toLineChartData = updatedCandlestickChartData.map((data, i) => ({
  //       x: data.x,
  //       y: data.y[3],
  //     }));
  //     setToLineChartData(toLineChartData);

  //     const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  //     const toLatestPriceLineData = toLineChartData?.map(data => ({
  //       x: data?.x,
  //       y: latestPrice,
  //     }));

  //     setToLatestPriceLineData(toLatestPriceLineData);
  //   }, 1000 * 10);

  //   return () => {
  //     clearInterval(setStateInterval);
  //   };
  // }, []);

  // TODO: to be continued
  // useEffect(() => {
  //   // const toCandlestickChartData = candlestickChartDataFromCtx?.map(data => ({
  //   //   x: data.x,
  //   //   open: data.y[0],
  //   //   high: data.y[1],
  //   //   low: data.y[2],
  //   //   close: data.y[3],
  //   //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  //   // }));
  //   // setToCandlestickChartData(toCandlestickChartData);

  //   // const toLineChartData = candlestickChartDataFromCtx.map((data, i) => ({
  //   //   x: data.x,
  //   //   y: data.y[3],
  //   // }));
  //   // setToLineChartData(toLineChartData);

  //   // const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  //   // const toLastestPriceHorizontalLineData = toLineChartData?.map(data => ({
  //   //   x: data?.x,
  //   //   y: latestPrice,
  //   // }));
  //   // setToLatestPriceLineData(toLastestPriceHorizontalLineData);

  //   setCandlestickChartData(
  //     marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : []
  //   );

  //   console.log('useEffect');
  // }, [marketCtx.candlestickChartData]);

  // const toCandlestickChartData = candlestickChartDataFromCtx?.map(data => ({
  //   x: data.x,
  //   open: data.y[0],
  //   high: data.y[1],
  //   low: data.y[2],
  //   close: data.y[3],
  //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  // }));
  // // setToCandlestickChartData(toCandlestickChartDataTemp);

  // const toLineChartData = candlestickChartDataFromCtx.map((data, i) => ({
  //   x: data.x,
  //   y: data.y[3],
  // }));
  // // setToLineChartData(toLineChartDataTemp);

  // const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  // const toLatestPriceLineData = toLineChartData?.map(data => ({
  //   x: data?.x,
  //   y: latestPrice,
  // }));

  // // setToLatestPriceLineData(toLatestPriceLineDataTemp);

  // const {candlestickChartData} = marketCtx;

  // console.log('candleData from market ctx', candlestickChartDataFromCtx);

  const updatedCandleData = !isCandlestickDataEmpty
    ? updateDummyCandlestickChartData(candlestickChartDataFromCtx)
    : [];

  // console.log('updatedCandleData', updatedCandleData);

  const toLineChartData = candlestickChartDataFromCtx.map((data, i) => ({
    x: data.x,
    y: data.y[3],
  }));

  const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  const toLastestPriceHorizontalLineData = toLineChartData?.map(data => ({
    x: data?.x,
    y: latestPrice,
  }));

  // // TODO: Make sure the OHLC order is correct
  const toCandlestickChartData = candlestickChartDataFromCtx?.map(data => ({
    x: data.x,
    open: data.y[0],
    high: data.y[1],
    low: data.y[2],
    close: data.y[3],
    // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  }));

  const chartTheme: VictoryThemeDefinition = {
    axis: {
      style: {
        tickLabels: {
          // this changed the color of my numbers to white
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
    // area: {
    //   style: {
    //   },
    // },
  };

  // TODO: #WI find the max number in the data array
  // const maxNumber = lineDataFetchedFromContext?.reduce((acc, curr) => {
  //   if (curr.y && curr.y > acc) {
  //     return curr.y;
  //   }
  //   return acc;
  // }, 0);

  // TODO: #WII find the max number in the data array
  // const candlestickData = marketCtx.candlestickChartData;
  // const maxNumber = candlestickData?.reduce((max, item) => {
  //   const maxInY = item.y.reduce((maxY, number) => {
  //     return number > maxY ? number : maxY;
  //   }, 0);
  //   return maxInY > max ? maxInY : max;
  // }, 0);

  // const rawCandleData =
  //   marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  // TODO: the max and min should be responsive to the candlestick data
  const ys = candlestickChartDataFromCtx.flatMap(d => d.y.filter(y => y !== null)) as number[];

  // console.log('ys', ys);

  // const maxNumber = ys.reduce((acc, curr) => {
  //   if (curr.y && curr.y > acc) {
  //     return curr.y;
  //   }

  //   return acc;
  // }, 0);

  const maxNumber = ys.length > 0 ? Math.max(...ys) : null;
  const minNumber = ys.length > 0 ? Math.min(...ys) : null;

  // const largestY = ys && ys.length > 0 ? Math.max(...ys) : undefined;
  // const largestY = ys && ys.reduce((acc, val) => val > acc ? val : acc, -Infinity);

  // const largestY = data.reduce((maxY, candlestick) => {
  //   const currentMaxY = Math.max(...candlestick.y);
  //   return currentMaxY > maxY ? currentMaxY : maxY;
  // }, -Infinity);
  // console.log(largestY);

  // console.log('max number', maxNumber);
  // console.log('min number', minNumber);

  // Use useRef to reference the SVG element, the Lottie container element, and the Lottie animation object
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
  });

  useEffect(() => {
    if (toCandlestickChartData.length === 0) return;

    // Use the useRef hooks to access the current values of the SVG element and the Lottie container element
    const svgElement = svgRef.current;
    // const lottieContainerElement = lottieContainerRef.current;

    console.log('toCandlestickChartData', toCandlestickChartData);

    // Check if the SVG element (THE candlestick chart) exists
    if (svgElement) {
      // Get the data for the latest candlestick
      const latestCandle = toCandlestickChartData[toCandlestickChartData.length - 2];
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
      const xCoord = rect.x + ((xTime - 1) / toCandlestickChartData.length) * rect.width; // calculate the x coordinate of the latest candle
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

  // const options = {
  //   container: lottieContainerRef.current as Element,
  //   // renderer: svgRef.current as SVGElement,
  //   loop: true,
  //   autoplay: true,
  //   // import spotAnimation from '../../../public/animation/circle.json';

  //   // animationData: spotAnimation,
  //   animationData: require('../../../public/animation/circle.json'),
  // };

  // console.log('options', options);

  // const {View} = useLottie(options);

  const isDisplayedCharts =
    !marketCtx.candlestickChartData !== null ? (
      <VictoryChart
        // containerComponent={
        // <VictoryZoomContainer />
        // <VictoryVoronoiContainer
        //   labels={({datum}) =>
        //     `${timestampToString(datum.x / 1000).time}, ${Math.round(datum.y)}`
        //   }
        // />
        // // TODO: useful tool
        // <VictoryCursorContainer
        //   // style={{stopColor: '#fff', grid: '#fff', stroke: '#fff', fill: '#fff'}}
        //   cursorLabelComponent={
        //     // <VictoryGroup color="#fff">
        //     //   <Line style={{fill: '#fff'}} />
        //     <VictoryLabel
        //       style={{
        //         fill: LIGHT_GRAY_COLOR,
        //         // cursor: LIGHT_GRAY_COLOR,
        //         stopOpacity: 0.5,
        //         stopColor: LIGHT_GRAY_COLOR,
        //         strokeOpacity: 0.5,
        //         fontSize: 12,
        //         background: '#000',
        //         backgroundColor: '#000',
        //       }}
        //       // backgroundComponent={
        //       //   <rect
        //       //     style={{
        //       //       fill: '#fff',
        //       //       stroke: '#fff',
        //       //       strokeWidth: 1,
        //       //       fillOpacity: 0.5,
        //       //       strokeOpacity: 0.5,
        //       //     }}
        //       //   />
        //       // }
        //     />
        //     // </VictoryGroup>
        //   }
        //   cursorLabel={({datum}) => `(${timestampToString(datum.x / 1000).time}, ${datum.y})`}
        //   // cursorLabel={({datum}) =>
        //   //   `${timestampToString(datum.x / 1000).time}, ${Math.round(datum.y)}`
        //   // }
        // />
        // }
        theme={chartTheme}
        minDomain={{y: minNumber !== null ? minNumber * 0.9 : undefined}}
        maxDomain={{y: maxNumber !== null ? maxNumber * 1.1 : undefined}} // TODO: measure the biggest number to decide the y-axis
        // domainPadding={{x: 1}}
        width={Number(candlestickChartWidth)}
        height={Number(candlestickChartHeight)}
        // containerComponent={
        //   <VictoryVoronoiContainer
        //     voronoiDimension="x"
        //     labels={({datum}) =>
        //       `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
        //     }
        //     labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
        //   />
        // }
      >
        {/* <VictoryLabel
        x={25}
        y={24}
        style={{stroke: EXAMPLE_BLUE_COLOR}}
        text={`${(d: any) => d.datum}`}
      /> */}
        <VictoryAxis
          // width={Number(candlestickChartWidth)}
          // scale={{x: 'auto'}}
          // scale={{x: 'linear', y: 'log'}}
          scale={{x: 'time'}}
          style={{
            axis: {stroke: 'none'},
            // ticks: {color: 'white'},
            // axisLabel: {fontColor: 'white'},
            // tickLabels: {fontColor: 'white'},
          }}
          tickFormat={t => ` ${timestampToString(t / 1000).time}`}
        />
        <VictoryAxis
          // axisLabelComponent={<VictoryLabel dy={-20} />}
          // offsetX={600}
          offsetX={Number(candlestickChartWidth) - 50}
          dependentAxis
          // tickLabelComponent={<VictoryLabel verticalAnchor="start" textAnchor="start" x={0} />}
        />
        {/* <rect cx={10} cy={20} width={20} height={10} fill="#c43a31" /> */}

        {candlestickOn && (
          <VictoryCandlestick
            animate={{
              onExit: {
                duration: 300,
                before(datum, index, data) {
                  return {y: datum._y1, _y1: datum._y0};
                },
              },
            }}
            style={{
              data: {
                // fill: '#c43a31',
                // fill: 'none',
                fillOpacity: 1,
                // stroke: '#c43a31',
                // VictoryCandlestickStyleInterface["data"]
                stroke: (d: any) =>
                  d.close > d.open ? TypeOfPnLColorHex.LOSS : TypeOfPnLColorHex.PROFIT,

                strokeWidth: 1,
                strokeOpacity: 0.5,
                textDecorationColor: 'white',
              },
            }}
            // style={{close: {stroke: 'black'}, open: {stroke: 'black'}}}
            // labelOrientation={{
            //   close: 'right',
            //   open: 'right',
            //   high: 'top',
            //   low: 'bottom',
            // }}
            // padding={{top: 0, bottom: 0, left: 20, right: 0}}
            // candleWidth={10}
            candleRatio={0.5}
            candleColors={{
              positive: TypeOfPnLColorHex.PROFIT,
              negative: TypeOfPnLColorHex.LOSS,
            }}
            data={marketCtx.candlestickChartData ? toCandlestickChartData : []}
            // data={toCandlestickChartDataRef.current ?? []}
            // openLabels
            // openLabelComponent={<VictoryTooltip pointerLength={10} />}

            labels={({datum}) =>
              `O: ${datum.open} H: ${datum.high} L: ${datum.low} C: ${datum.close}`
            }
            labelComponent={
              <VictoryTooltip
                // backgroundStyle={{fill: '#000000'}}
                cornerRadius={0}
                // center={{x: 50, y: 0}}
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

                  // it works but it's not as designed
                  // fill: (d: any) =>
                  //   d.datum.close > d.datum.open
                  //     ? TypeOfPnLColorHex.PROFIT
                  //     : TypeOfPnLColorHex.LOSS,
                  // padding: 8,
                  // letterSpacing: 0.5,
                }}
                pointerLength={0}
                pointerWidth={0}
              />
            }

            // containerComponent={
            //   <VictoryVoronoiContainer
            //     voronoiDimension="x"
            //     labels={({datum}) =>
            //       `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
            //     }
            //     labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
            //   />
            // }

            // events={[
            //   {
            //     target: 'data',
            //     eventHandlers: {
            //       onMouseOver: () => ({
            //         // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
            //         target: 'openLabels',
            //         mutation: () => ({active: true}),
            //       }),
            //       onMouseOut: () => ({
            //         // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
            //         target: 'openLabels',
            //         mutation: () => ({active: false}),
            //       }),
            //     },
            //   },
            // ]}
          />
        )}

        {lineGraphOn && (
          <VictoryLine
            animate={{
              onEnter: {
                duration: 300,
                before(datum, index, data) {
                  return {y: datum._y1, _y1: datum._y0};
                },
              },
            }}
            style={{
              data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
              // parent: {border: '1px solid #ccc'},
            }}
            // events={{
            //   () => {console.log('hi')}
            //   // onClick: (evt) => alert(`(${evt.clientX}, ${evt.clientY})`)
            // }}
            // events={[
            //   {
            //     target: 'data',
            //     eventHandlers: {
            //       // onClick: () => {
            //       //   console.log('line graph');
            //       // },
            //       // NOT working in line graph
            //       // onMouseOver: () => ({
            //       //   target: 'data',
            //       //   mutation: () => ({active: true}),
            //       // }),
            //       // onMouseOut: () => ({
            //       //   target: 'data',
            //       //   mutation: () => ({active: false}),
            //       // }),
            //     },
            //   },
            // ]}
            // data={toLineChartDataRef.current ?? []}
            data={toLineChartData ? [...toLineChartData] : []}
          />
        )}

        {/* {!candlestickOn && !lineGraphOn && (
      <VictoryLine
        style={{
          data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
          // parent: {border: '1px solid #ccc'},
        }}
        data={lastestPriceHorizontalLineData}
      />
    )} */}

        <VictoryLine
          animate={{
            onExit: {
              duration: 300,
              before(datum, index, data) {
                return {y: datum._y1, _y1: datum._y0};
              },
            },
          }}
          style={{
            data: {stroke: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME, strokeWidth: 1},
          }}
          data={toLastestPriceHorizontalLineData}
          // data={toLatestPriceLineDataRef.current ?? []}
          // labels={({datum}) => `${datum.y}`}
          // // labels={`${toLastestPriceHorizontalLineData[0]?.y ?? 0}`} // It's deprecated
          // labelComponent={
          //   <VictoryLabel
          //     x={Number(candlestickChartWidth) - 50}
          //     y={Number(candlestickChartHeight) - 100}
          //     // datum={{x: new Date()}}
          //     style={{fill: '#fff', strokeWidth: 1}}
          //   />
          // }
        />
        {/* <VictoryLabel
          textAnchor="end"
          // text={datum => `${datum.y}`}
          text={toLastestPriceHorizontalLineData[0]?.y ?? 0}
          x={Number(candlestickChartWidth)}
          y={Number(candlestickChartHeight) - 100}
          style={{fill: '#fff', strokeWidth: 0.01}}
        /> */}
        <VictoryScatter
          data={toLastestPriceHorizontalLineData}
          style={{
            data: {
              fill: ({datum}) =>
                datum.x ===
                toLastestPriceHorizontalLineData[toLastestPriceHorizontalLineData.length - 1].x
                  ? 'transparent'
                  : 'transparent',
              // stroke: (d: any) => (d.y > 0 ? 'green' : 'red'),
            },
          }}
          labels={({datum}) =>
            datum.x ===
            toLastestPriceHorizontalLineData[toLastestPriceHorizontalLineData.length - 1].x
              ? `${datum.y}`
              : ``
          }
          // labels={`${toLastestPriceHorizontalLineData[0]?.y ?? 0}`} // It's deprecated
          labelComponent={
            <VictoryLabel
              x={Number(candlestickChartWidth) - 25}
              // y={Number(candlestickChartHeight) - 100}
              // datum={{x: new Date()}}
              style={{fill: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME, fontSize: 12}}
            />
          }

          // data={{
          //   // x: toCandlestickChartData[toCandlestickChartData.length - 1].x,
          //   // x: 'Thu Mar 09 2023 21:02:29 GMT+0800 (Taipei Standard Time)',
          //   x: 500,
          //   y: toLastestPriceHorizontalLineData[0]?.y ?? 0,
          // }}
        />
      </VictoryChart>
    ) : (
      <p>Loading</p>
    );

  return (
    <>
      {/* w-2/3 xl:w-4/5 */}
      {/* TODO: Temporary adjustment of chart size */}
      <div className="-ml-5" style={{width: '70%'}}>
        {/* <div ref={lottieContainerRef} /> */}
        {/* <div ref={lottieContainerRef} className="z-50 w-50px text-cuteBlue1">
          <p>lottie</p>
          {View}
        </div>{' '} */}
        {isDisplayedCharts}
        {/* <svg ref={svgRef} /> */}
        {/* <svg ref={svgRef} width={800} height={30} fill="#c43a31">
          <rect width={800} height={30} fill="#c43a31" />
        </svg> */}
        {/* <svg>
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
        </svg> */}
      </div>
    </>
  );
}

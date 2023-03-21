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
import {
  getNowSeconds,
  randomFloatFromInterval,
  randomIntFromInterval,
  timestampToString,
} from '../../lib/common';
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
import {UserContext} from '../../contexts/user_context';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {POSITION_PRICE_RENEWAL_INTERVAL_SECONDS} from '../../constants/config';

interface ITradingChartGraphProps {
  strokeColor: string[];
  candlestickOn: boolean;
  lineGraphOn: boolean;
  showPositionLabel: boolean;
  candlestickChartWidth: string;
  candlestickChartHeight: string;
}

interface VictoryThemeDefinition {
  axis: {
    style: {
      tickLabels: {
        fill: string;
        fontSize: number;
        fontFamily: string;
        padding: number;
      };
      axis: {
        stroke: string;
      };
      grid: {
        stroke: string;
      };
    };
  };
  line: {
    style: {
      data: {
        stroke: string;
        strokeWidth: number;
      };
    };
  };
}

export interface ILineChartData {
  x: Date;
  y: number | null;
}

export interface IHorizontalLineData {
  x: Date;
  y: number;
}

export interface IProcessCandlestickData {
  data: ICandlestickData[];
  requiredDataNum: number;
}

export interface ITrimDataProps {
  // data: ICandlestickData[];
  data: any[];
  requiredDataNum: number;
}

export const updateDummyCandlestickChartData = (data: ICandlestickData[]): ICandlestickData[] => {
  const n = 80;
  const chartBlank = 1.68;
  const dummyDataSize = 80;
  const unitOfLive = 1000;

  const now = new Date().getTime();

  const origin = [...data].slice(1);

  const count = countNullArrays(origin);

  /* Till: (20230329 - Shirley)
   const originWithoutNull = originalData.slice(0, -count);
   */
  const originWithoutNull = origin.filter(obj => !obj.y.includes(null));

  const lastTime = originWithoutNull[originWithoutNull.length - 1]?.x.getTime() as number;
  const lastPoint = originWithoutNull[originWithoutNull.length - 1]?.y[3] as number;

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

export function trimData({data, requiredDataNum}: ITrimDataProps) {
  const latestData = data.slice(-requiredDataNum);
  if (latestData === undefined || latestData.length === 0) return;

  const trimmedData = latestData;

  return trimmedData;
}

// TODO: (20230315 - Shirley) FIXME: Dangerous workaround when the Ctx data isn't fetched, but the VictoryLabel needs the data
const TEMP_BASELINE = 2000;

export default function CandlestickChart({
  strokeColor,
  candlestickOn,
  lineGraphOn,
  showPositionLabel,
  candlestickChartWidth,
  candlestickChartHeight,
  ...otherProps
}: ITradingChartGraphProps) {
  const marketCtx = useContext(MarketContext);
  const appCtx = useContext(AppContext);
  const globalCtx = useContext(GlobalContext);
  const userCtx = useContext(UserContext);

  const candlestickChartDataFromCtx =
    marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  const NULL_ARRAY_NUM = 1;

  const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useStateRef<
    ICandlestickData[] | undefined
  >(() =>
    trimData({
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
      const trimmedData = trimData({
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

  const [toLineChartData, setToLineChartData, toLineChartDataRef] = useStateRef<ILineChartData[]>(
    () =>
      candlestickChartDataFromCtx.map((data, i) => ({
        x: data.x,
        y: data.y[3],
      }))
  );

  const [toLatestPriceLineData, setToLatestPriceLineData, toLatestPriceLineDataRef] = useStateRef<
    ILineChartData[]
  >(
    candlestickChartDataFromCtx.length > 0
      ? [
          {
            x: candlestickChartDataFromCtx[0]?.x,
            y: candlestickChartDataFromCtx[candlestickChartDataFromCtx.length - 2]?.y[3],
          }, // Starting time and price
          {
            x: candlestickChartDataFromCtx[candlestickChartDataFromCtx.length - 1]?.x,
            y: candlestickChartDataFromCtx[candlestickChartDataFromCtx.length - 2]?.y[3],
          }, // Ending time and price
        ]
      : [
          {x: new Date(new Date().getTime() - 10), y: TEMP_BASELINE},
          // {x: new Date(), y: 2000},
        ]
  );

  // Till: (20230315 - Shirley)
  // const toLatestPriceLineData = toLineChartData?.map(data => ({
  //   x: data?.x,
  //   y: latestPrice,
  // }));

  // Till: (20230315 - Shirley) the user open price example line
  // const userOpenPrice = randomIntFromInterval(minNumber ?? 100, maxNumber ?? 1000);
  // const userOpenPriceLine = toLatestPriceLineData?.map(data => ({
  //   x: data?.x,
  //   y: TEMP_BASELINE,
  // }));

  const toOpenPriceLineData = (
    dateLine: ILineChartData[],
    openPrice: number
  ): IHorizontalLineData[] => {
    return [
      {x: dateLine[0].x, y: openPrice},
      {x: dateLine[dateLine.length - 1].x, y: openPrice}, //dateLine[dateLine.length - 1].y
    ];
  };

  const openPriceLine: null | JSX.Element[] = showPositionLabel
    ? userCtx.openCFDs.map((cfd, index) => (
        <VictoryLine
          key={cfd.id}
          style={{
            data: {
              stroke:
                cfd.pnl.type === ProfitState.PROFIT
                  ? LINE_GRAPH_STROKE_COLOR.PROFIT
                  : LINE_GRAPH_STROKE_COLOR.LOSS,
              strokeWidth: 1,
              strokeDasharray: '2,2',
            },
          }}
          data={
            // TODO: (20230315 - Shirley) remove the `TEMP`
            toOpenPriceLineData(toLatestPriceLineData, cfd.openPrice)
          }
        />
      ))
    : null;

  const openPriceScatter = showPositionLabel
    ? userCtx.openCFDs.map((cfd, index) => {
        const symbol = cfd.typeOfPosition === TypeOfPosition.BUY ? '⤊' : '⤋';
        return (
          <VictoryScatter
            key={cfd.id}
            style={{data: {fill: 'transparent'}, labels: {background: 'transparent'}}}
            // TODO: (20230315 - Shirley) remove the `TEMP`
            data={toOpenPriceLineData(toLatestPriceLineData, cfd.openPrice)}
            labels={({datum}) =>
              datum.x === toLatestPriceLineData[toLatestPriceLineData.length - 1].x
                ? ` ${symbol} Position $${datum.y.toLocaleString(
                    UNIVERSAL_NUMBER_FORMAT_LOCALE
                  )}　Close`
                : ``
            }
            labelComponent={
              <VictoryLabel
                className="hover:cursor-pointer hover:opacity-80"
                events={{
                  onClick: e => {
                    // Till: (20230329 - Shirley)  // console.log(e.clientX, e.clientY);
                    globalCtx.dataPositionClosedModalHandler({
                      openCfdDetails: cfd,
                      latestProps: {
                        renewalDeadline: getNowSeconds() + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
                        latestClosedPrice:
                          cfd.typeOfPosition === TypeOfPosition.BUY
                            ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
                            : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 9999999,
                      },
                    });
                    globalCtx.visiblePositionClosedModalHandler();
                  },
                }}
                x={Number(candlestickChartWidth) - 110}
                style={{
                  fill: LINE_GRAPH_STROKE_COLOR.DEFAULT,
                  fontSize: 10,
                  fontFamily: 'barlow',
                }}
                backgroundStyle={{
                  fill:
                    cfd.pnl.type === ProfitState.PROFIT
                      ? LINE_GRAPH_STROKE_COLOR.PROFIT
                      : LINE_GRAPH_STROKE_COLOR.LOSS,
                }}
                backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}}
              />
            }
          />
        );
      })
    : null;

  // Info: (20230315 - Shirley) the max and min shouldn't be responsive to the candlestick data
  const candles = candlestickChartDataFromCtx.flatMap(d => d.y.filter(y => y !== null)) as number[];
  const positions = userCtx.openCFDs.map(cfd => cfd.openPrice);
  const ys = [...candles, ...positions];
  const maxNumber = ys.length > 0 ? Math.max(...ys) : null;
  const minNumber = ys.length > 0 ? Math.min(...ys) : null;

  useEffect(() => {
    if (!appCtx.isInit) return;
    if (marketCtx.candlestickChartData === null) return;

    if (!toCandlestickChartDataRef.current) {
      setCandlestickChartData(() =>
        trimData({data: marketCtx?.candlestickChartData ?? [], requiredDataNum: 30})
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

    if (!toLatestPriceLineDataRef.current) {
      const trimmedData = trimData({
        data: marketCtx?.candlestickChartData ?? [],
        requiredDataNum: 30,
      });

      setToLatestPriceLineData(
        trimmedData
          ? [
              {x: trimmedData[0].x, y: trimmedData[trimmedData?.length - 1].y[3]}, // Info: (20230315 - Shirley) Starting time and price
              {
                x: trimmedData[trimmedData.length - 1]?.x,
                y: trimmedData[trimmedData?.length - 1].y[3],
              }, // Info: (20230315 - Shirley) Ending time and price
            ]
          : []
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

      // TODO: (20230313 - Shirley) Sometimes, the candlestick overlays with another candlestick
      // console.log('data put into chart', toCandlestickChartDataRef.current);
      // console.log('market Ctx', marketCtx.candlestickChartData);
      // console.log('market Ctx sliced', marketCtx.candlestickChartData?.slice(-30));
      // console.log('market Ctx stringified', JSON.stringify(marketCtx.candlestickChartData));

      setToCandlestickChartData(toCandlestickChartData);

      const toLineChartData = updatedCandlestickChartData.map((data, i) => ({
        x: data.x,
        y: data.y[3],
      }));
      setToLineChartData(toLineChartData);

      const latestPrice = toLineChartData?.[toLineChartData.length - NULL_ARRAY_NUM - 1]?.y;
      const toLatestPriceLineData = [
        {x: updatedCandlestickChartData[0]?.x, y: latestPrice}, // Info: (20230315 - Shirley) Starting time and price
        {
          x: updatedCandlestickChartData[updatedCandlestickChartData.length - 1]?.x,
          y: latestPrice,
        }, // Info: (20230315 - Shirley) Ending time and price
      ];

      setToLatestPriceLineData(toLatestPriceLineData);
    }, 1000 * 1);

    return () => {
      clearInterval(setStateInterval);
    };
  }, [marketCtx.candlestickChartData]);

  const chartTheme: VictoryThemeDefinition = {
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

  // Till: (20230329 - Shirley)
  // console.log('before isDisplayedCharts, marketCtx', candlestickChartDataFromCtx);
  // console.log('before isDisplayedCharts, latest price', toLatestPriceLineDataRef.current);
  // console.log('before isDisplayedCharts, candle', toCandlestickChartDataRef.current);
  // console.log('before isDisplayedCharts, line', toLineChartDataRef.current);

  const isDisplayedCharts =
    candlestickChartDataRef.current && candlestickChartDataRef.current?.length > 0 ? (
      <VictoryChart
        theme={chartTheme}
        minDomain={{y: minNumber !== null ? minNumber * 0.7 : undefined}} // Info: it's NOT `undefined` because there's context data before it renders (20230315 - Shirley)
        maxDomain={{y: maxNumber !== null ? maxNumber * 1.3 : undefined}} // TODO: (20230315 - Shirley)  measure the biggest number to decide the y-axis
        // Till: (20230329 - Shirley)  // domainPadding={{x: 1}}
        width={Number(candlestickChartWidth)}
        height={Number(candlestickChartHeight)}
        /* Till: (20230329 - Shirley)
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
        {/* Till: (20230329 - Shirley) 
        <VictoryLabel
        x={25}
        y={24}
        style={{stroke: EXAMPLE_BLUE_COLOR}}
        text={`${(d: any) => d.datum}`}
      /> */}
        <VictoryAxis
          // Till: (20230329 - Shirley) // scale={{x: 'time'}}
          style={{
            axis: {stroke: 'none'},
          }}
          tickFormat={t => ` ${timestampToString(t / 1000).time}`}
        />
        <VictoryAxis
          tickLabelComponent={<VictoryLabel dx={45} />}
          offsetX={Number(candlestickChartWidth) - 50}
          dependentAxis
          // TODO: (20230327 - Shirley) // tickValues={[minNumber, maxNumber]}
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

        {toLatestPriceLineDataRef.current ? (
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
              labels: {
                opacity: 0.5,
                fill: 'transparent',
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
                backgroundStyle={{fill: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME}}
                backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}}
              />
            }
          />
        ) : null}

        {openPriceLine}
        {openPriceScatter}
      </VictoryChart>
    ) : (
      <p>Loading</p>
    );

  return (
    <>
      <div className="-ml-5 w-full lg:w-7/10">
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

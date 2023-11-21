/** Info: (20230329 - Shirley)
 * Draw a live candlestick chart with Tradingview Lightweight Charts Library
 * 1. Initial job (Specify the data spec)
 * 1.1 setup chart container and chart options with window size
 * 1.2 fetch candlestick chart data from market context
 * 1.3 data cleaning (Filter the data with the data spec)
 * 1.4 draw candlestick chart with data
 * 2. Periodically job
 * 2.1 renew chart with candlestick chart data in marketcontext is updated
 * 2.2 data cleaning
 * 2.3 draw candlestick chart with data
 */

import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  createChart,
  ColorType,
  CandlestickData,
  UTCTimestamp,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  IPriceLine,
  LogicalRange,
  LogicalRangeChangeEventHandler,
} from 'lightweight-charts';
import {LINE_GRAPH_STROKE_COLOR} from '../../constants/display';
import {MarketContext} from '../../contexts/market_context';
import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import useStateRef from 'react-usestateref';
import {TimeSpanUnion, getTime} from '../../constants/time_span_union';
import {useMarketStore} from '../../contexts/market_store_context';
import {useStore} from 'zustand';

interface ITradingChartGraphProps {
  candleSize: number;
  strokeColor: string[];
  candlestickOn: boolean;
  lineGraphOn: boolean;
  showPositionLabel: boolean;
  candlestickChartWidth: number;
  candlestickChartHeight: string;
}

interface IOHLCInfo {
  open: number;
  high: number;
  low: number;
  close: number;
}

// Info: Get candlestick data from market context, check the data format and merge with `initData` (20230411 - Shirley)
const candlestickDataCleaning = (dataArray: CandlestickData[]) => {
  const data = [...dataArray];

  return data;
};

interface IChartSpecProps {
  timespan: number;
  dataSize: number;
  chartHeight: number;
  chartWidth: number;
}

interface ICustomizedLocalizationOptions {
  locale: string;
  dateFormat: string;
}

// ToDo: 從 props 拿資料；圖表樣式、長寬、時間區間、資料數量
const createSpec = ({timespan, dataSize, chartHeight, chartWidth}: IChartSpecProps) => {
  const locale: ICustomizedLocalizationOptions = {
    locale: 'zh-TW',
    dateFormat: 'yyyy-MM-dd',
  };

  const timeScale = {
    timeVisible: true,
    secondsVisible: true,
    fixLeftEdge: true,
    rightOffset: 12,
  };

  const chartOptions = {
    width: chartWidth,
    height: chartHeight,
    layout: {
      fontSize: 12,
      fontFamily: 'barlow, sans-serif',
      background: {type: ColorType.Solid, color: LINE_GRAPH_STROKE_COLOR.BLACK},
      textColor: LINE_GRAPH_STROKE_COLOR.LIGHT_GRAY,
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        visible: false,
      },
    },

    handleScale: {
      pinch: true,
      mouseWheel: true,
      axisDoubleClickReset: true,
      axisPressedMouseMove: false,
    },
    crosshair: {
      mode: 0,
      vertLine: {
        color: LINE_GRAPH_STROKE_COLOR.WHITE,
      },
      horzLine: {
        color: LINE_GRAPH_STROKE_COLOR.WHITE,
      },
    },
    timeScale,
    localization: locale,
  };

  const getLastTime = () => {
    const now = new Date().getTime();
    return now - (now % timespan);
  };

  const firstTime = (getLastTime() - (dataSize - 1) * timespan) / 1000;

  return {firstTime, chartOptions};
};

const filterCandlestickData = ({
  dataArray,
  startTime,
  endTime,
}: {
  dataArray: CandlestickData[];
  startTime: number;
  endTime?: number;
}) => {
  const data = [...dataArray];

  const result = data.filter(d => {
    const rs = endTime
      ? Number(d.time) >= startTime && Number(d.time) <= endTime
      : Number(d.time) >= startTime;
    return rs;
  });

  return result;
};

const tuningTimezone = (time: number) => {
  // Info: Get the timezone of the client browser (20230410 - Shirley )
  const tzOffset = new Date().getTimezoneOffset() * 60;
  const result = time - tzOffset;
  return result;
};

const tuningTzCandlestickData = (data: CandlestickData) => {
  const time = tuningTimezone(Number(data.time));
  return {...data, time};
};

const tuningTzCandlestickDataArray = (dataArray: CandlestickData[]) => {
  const data = [...dataArray];

  const result = data.map(tuningTzCandlestickData);

  return result;
};

const toCandlestickData = (data: ICandlestickData): CandlestickData => {
  return {
    time: (data.x.getTime() / 1000) as UTCTimestamp,
    open: data.y.open || 0,
    high: data.y.high || 0,
    low: data.y.low || 0,
    close: data.y.close || 0,
  };
};

// Info: 從外面傳進來的參數: 1.timespan 2.style of chart (20231106 - Shirley)
export default function CandlestickChart({
  candleSize,
  candlestickChartWidth,
}: ITradingChartGraphProps) {
  const marketStore = useMarketStore();
  // TODO: if marketStore is null, throw Alert (20231120 - Shirley)
  if (!marketStore) throw new Error('Missing BearContext.Provider in the tree');
  const [timeSpan, selectTimeSpanHandler] = useStore(marketStore, s => [
    s.timeSpan,
    s.selectTimeSpanHandler,
  ]);

  const subTimeSpan = marketStore.subscribe(
    (state, prev) => {
      // eslint-disable-next-line no-console
      console.log('subTimeSpan state', state, 'prev', prev);
    }
    // s => s.timeSpan,
    // timeSpan => {
    //   console.log('timeSpan', timeSpan);
    // }
  );

  subTimeSpan();

  // eslint-disable-next-line no-console
  console.log('timeSpan in CandlestickChart', timeSpan);

  setTimeout(() => {
    selectTimeSpanHandler(TimeSpanUnion._30m);
    // eslint-disable-next-line no-console
    console.log('timespan after call handler in CandlestickChart', timeSpan);
  }, 5000);

  const marketCtx = useContext(MarketContext);

  const [ohlcInfo, setOhlcInfo] = useState<IOHLCInfo>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cursorStyle, setCursorStyle, cursorStyleRef] = useStateRef<
    'hover:cursor-crosshair' | 'hover:cursor-pointer'
  >('hover:cursor-crosshair');

  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi;
  let candlestickSeries: ISeriesApi<'Candlestick'>;
  let customPriceLine: IPriceLine;
  let tuned: CandlestickData[];

  // const width =
  //   globalCtx.layoutAssertion === LayoutAssertion.DESKTOP
  //     ? globalCtx.width * 0.6 - 2000 / globalCtx.width + (globalCtx.width - 1150) * 0.5
  //     : globalCtx.width * 0.9;

  // const width =

  const displayedOHLC =
    ohlcInfo.close !== 0 ? (
      <p className="text-sm text-lightGray">
        O：{ohlcInfo.open} &nbsp;&nbsp;&nbsp;H：{ohlcInfo.high} &nbsp;&nbsp;&nbsp;L：{ohlcInfo.low}{' '}
        &nbsp;&nbsp;&nbsp;C：{ohlcInfo.close}
      </p>
    ) : null;

  const {firstTime, chartOptions} = createSpec({
    dataSize: candleSize,
    timespan: getTime(marketCtx.timeSpan),
    chartWidth: candlestickChartWidth, // ToDo: candlestickChartWidth
    chartHeight: 300, // ToDo: candlestickChartHeight
  });

  const crosshairMoveHandler = (param: MouseEventParams) => {
    if (param.point === undefined || param.time === undefined) {
      return;
    }

    if (param.seriesData) {
      param.seriesData.forEach(series => {
        const candle = series as CandlestickData;
        setOhlcInfo({
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        });
      });
    }

    // ToDo: [time->price point] when hovering over the label of open position, change the cursor (20230413 - Shirley)
    // if (param.time === (((tuned[tuned.length - 1].time as number) + 1) as UTCTimestamp)) {
    //   setCursorStyle('hover:cursor-pointer');
    //   return;
    // }
    // setCursorStyle('hover:cursor-crosshair');
  };

  const updatePriceLine = (lastClosePrice: number) => {
    customPriceLine.applyOptions({
      price: lastClosePrice,
    });
  };

  // TODO: to show the number (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const priceRangeChangeHandler = (newVisibleLogicalRange: LogicalRange) => {
    const lastData = tuned[tuned.length - 1] as CandlestickData;

    updatePriceLine(lastData?.close);
  };

  // TODO: feat: open price line (20231106 - Shirley)
  // const openPriceLine = () => {
  //   // ToDo: get the open position from user context (20230411 - Shirley)
  //   const numOfPosition = 1;
  //   for (let i = 0; i < numOfPosition; i++) {
  //     const price = i === 0 ? 1705 : 2500 - 1 * i;
  //     const color = i === 0 ? LINE_GRAPH_STROKE_COLOR.UP : LINE_GRAPH_STROKE_COLOR.DOWN;

  //     const lineSeries = chart.addLineSeries({
  //       color: color,
  //       lineWidth: 1,
  //       lineStyle: LineStyle.Solid,
  //       priceLineStyle: LineStyle.Solid,
  //       crosshairMarkerVisible: false,
  //       lastValueVisible: false,
  //       title: `Position: ${roundToDecimalPlaces(price, 2)}　Close`,
  //       baseLineVisible: true,
  //     });

  //     if (!lineSeries || !tuned || tuned.length === 0) return;

  //     try {
  //       const time = [
  //         (tuned[0]?.time as number) - 1,
  //         (tuned[tuned.length - 1]?.time as number) + 1,
  //       ];
  //       lineSeries.setData([
  //         {
  //           time: time[0] as UTCTimestamp,
  //           value: price,
  //         },
  //         {
  //           time: time[1] as UTCTimestamp,
  //           value: price,
  //         },
  //       ]);
  //     } catch (err) {
  //       // Info: Catch the error and do nothing (20230411 - Shirley)
  //     }

  //     // ToDo: When clicking, pop up the position closed modal with position information (20230411 - Shirley)
  //     // ToDo: unsubscribe the event listener (20230411 - Shirley)
  //     chart.subscribeClick((param: MouseEventParams) => {
  //       // Info: Get the clicked point (20230411 - Shirley)
  //       const point = param?.point;

  //       if (point === undefined) return;

  //       globalCtx.visiblePositionClosedModalHandler();

  //       // ToDo: (lottie) Get the time value from the clicked point (20230411 - Shirley)
  //       // const time = chart.timeScale().coordinateToTime(point.x);
  //     });
  //   }
  // };

  const fetchCandlestickData = () => {
    const originRaw = marketCtx.candlestickChartData?.map(toCandlestickData) ?? [];
    const raw = originRaw.sort((a, b) => Number(a.time) - Number(b.time));
    const cleanedData = candlestickDataCleaning(raw);
    const filtered = filterCandlestickData({dataArray: cleanedData, startTime: firstTime});
    const result = tuningTzCandlestickDataArray(filtered) as CandlestickData[];
    return result;
  };

  const drawChart = () => {
    if (chartContainerRef.current) {
      // Info: Get data and draw the chart
      tuned = fetchCandlestickData();
      chart = createChart(chartContainerRef.current, chartOptions);

      candlestickSeries = chart.addCandlestickSeries({
        // ToDo: `createSpec` 可以讀外面的參數，但這邊直接拿createSpec
        upColor: LINE_GRAPH_STROKE_COLOR.UP,
        downColor: LINE_GRAPH_STROKE_COLOR.DOWN,
        borderVisible: false,
        wickUpColor: LINE_GRAPH_STROKE_COLOR.UP,
        wickDownColor: LINE_GRAPH_STROKE_COLOR.DOWN,
      });
      candlestickSeries.setData(tuned);

      chart.timeScale().fitContent();

      customPriceLine = candlestickSeries.createPriceLine({
        price: 0,
        color: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME,
        axisLabelVisible: true,
        axisLabelTextColor: LINE_GRAPH_STROKE_COLOR.WHITE,
        axisLabelColor: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME,
      });

      // Info: Create a custom price line
      candlestickSeries.applyOptions({
        lastValueVisible: false,
      });

      // ToDo: [Workaround] without subscription, the price line won't be drawn (20230411 - Shirley)
      chart
        .timeScale()
        .subscribeVisibleLogicalRangeChange(
          priceRangeChangeHandler as LogicalRangeChangeEventHandler
        );

      // TODO: for observation (20230607 - Shirley)
      // longShortPriceLine();

      // Info: Draw the open price line (20230411 - Shirleey)
      // openPriceLine();

      // Info: OHLC hovered information (20230411 - Shirleey)
      chart.subscribeCrosshairMove(crosshairMoveHandler);

      return () => {
        try {
          chart.unsubscribeCrosshairMove(crosshairMoveHandler);
          chart
            .timeScale()
            .unsubscribeVisibleLogicalRangeChange(
              priceRangeChangeHandler as LogicalRangeChangeEventHandler
            );
          chart.remove();
        } catch (err) {
          // Info: (20230406 - Shirley) do nothing
        }
      };
    }
  };

  useEffect(() => {
    return drawChart();
  }, [marketCtx.candlestickChartData]);

  return (
    <>
      <div className="-mb-8 mt-5 lg:-mt-8 lg:mb-5 lg:ml-5">{displayedOHLC}</div>
      <div className="">
        <div ref={chartContainerRef} className={`${cursorStyleRef.current}`}></div>
      </div>
    </>
  );
}

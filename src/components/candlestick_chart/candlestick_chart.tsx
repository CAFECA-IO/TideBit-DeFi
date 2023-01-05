import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {TRADING_CHART_BORDER_COLOR, PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from 'react-icons/bs';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
  // dataArray: number[];
  candlestickChartWidth: string;
  // annotatedValue: number;
  candlestickChartHeight: string;
}

const dummyChartData = (n = 50) => {
  const now = new Date().getTime();
  const nowSecond = now - (now % 1000);
  let point = 1288.4;
  let lastPrice = 0;
  const data = new Array(n).fill(0).map((v, i) => {
    const y: [...(number | null)[]] = new Array(4).fill(0).map(v => {
      const rnd = Math.random() / 1.2;
      const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
      const price = point * ts;

      const prettyPrice = Math.trunc(price * 100) / 100;
      lastPrice = price;
      return prettyPrice;
    });
    point = lastPrice;

    const result = {
      x: new Date(nowSecond - (n - i) * 1000),
      y,
    };
    return result;
  });
  const addition = n / 10;

  // null data
  data.push({
    x: new Date(nowSecond + 10000),
    y: [null, null, null, null],
  });

  return data;
};

/**
 *
 * @param
 * @returns `candlestickData`- dataObject:nullObject = 9:5
 */

export default function CandlestickChart({
  strokeColor,
  candlestickChartWidth,
  candlestickChartHeight,
  ...otherProps
}: ILineGraphProps): JSX.Element {
  const anotherSampleData = [1230, 1272, 1120, 1265, 1342, 1299];
  // const CANDLESTICK_CHART_BORDER_COLOR = '#8B8E91';

  const candlestickData = dummyChartData(100);
  // console.log('data length', candlestickData.length);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 0,

      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },

      // dropShadow: {
      //   enabled: true,
      //   top: 0,
      //   left: 0,
      //   blur: 3,
      //   opacity: 0.5,
      // },
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          candlestick: {
            width: '1000',
          },
        },
      },
    ],
    title: {
      text: '',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      show: false,
      // show: true,
      // yaxis: {
      //   lines: {show: false},
      // },
      // xaxis: {
      //   lines: {show: false},
      // },
      // padding: {
      //   right: 300,
      // },
    },

    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        show: true,
        align: 'center',
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      opposite: true,
      axisBorder: {
        show: true,
        color: TRADING_CHART_BORDER_COLOR,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: 'dark',
    },

    plotOptions: {
      candlestick: {
        colors: {
          upward: PROFIT_LOSS_COLOR_TYPE.profit,
          downward: PROFIT_LOSS_COLOR_TYPE.loss,
        },
        wick: {
          useFillColor: true,
        },
      },
    },

    // markers: {
    //   discrete: [
    //     {
    //       seriesIndex: 0,
    //       dataPointIndex: dataArray.length - 1,
    //       size: 1,
    //       strokeColor: strokeColor[0],
    //       shape: 'circle',
    //     },
    //   ],
    // },
    // grid: {
    //   show: true,
    //   borderColor: strokeColor[0],
    //   strokeDashArray: 5,
    //   position: 'back',
    // },
    // forecastDataPoints: {
    //   count: 2,
    //   fillOpacity: 0.5,
    //   dashArray: 2,
    // },
    annotations: {
      position: 'back',
      yaxis: [
        {
          y: 6610,
          strokeDashArray: 3,
          borderColor: PROFIT_LOSS_COLOR_TYPE.loss,
          width: '100%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 10,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: PROFIT_LOSS_COLOR_TYPE.loss,
              padding: {
                right: 23,
              },
            },
            text: `Position $6660 Close`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
        {
          y: 6585,
          strokeDashArray: 3,
          borderColor: PROFIT_LOSS_COLOR_TYPE.profit,
          width: '100%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 10,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: PROFIT_LOSS_COLOR_TYPE.profit,
              padding: {
                right: 23,
              },
            },
            text: `Position $6760 Close`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
        {
          y: 6606,
          strokeDashArray: 0,
          borderColor: PROFIT_LOSS_COLOR_TYPE.tidebitTheme,
          width: '105%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 55,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: PROFIT_LOSS_COLOR_TYPE.tidebitTheme,
              padding: {
                left: -15,
                right: 20,
              },
            },
            text: `$6606`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
      ],
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
        data: [...candlestickData],
      },
    ],
  });

  return (
    <div>
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="candlestick"
        width={candlestickChartWidth}
        height={candlestickChartHeight}
      />
    </div>
  );
}

import React, {useState, useContext, useEffect} from 'react';
import dynamic from 'next/dynamic';
import ApexCharts, {ApexOptions} from 'apexcharts';
import {TRADING_CHART_BORDER_COLOR, TypeOfPnLColorHex} from '../../constants/display';
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from 'react-icons/bs';
import {MarketContext, MarketProvider} from '../../contexts/market_context';

// import ReactApexChart from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
  // dataArray: number[];
  candlestickChartWidth: string;
  // annotatedValue: number;
  candlestickChartHeight: string;
  // positionDisplayingState: boolean;
}

const chartBlank = 1.68;
const dummyDataSize = 80;
const unitOfLive = 1000;

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
  // const {showPositionOnChart, positionInfoOnChart, candlestickChartIdHandler} =
  //   useContext(MarketContext);
  const marketCtx = useContext(MarketContext);

  // console.log('position context info in candlestick chart', positionInfoOnChart);

  // console.log('in candlestick chart, showPositionOnChart:', showPositionOnChart);

  const anotherSampleData = [1230, 1272, 1120, 1265, 1342, 1299];

  // const candlestickData = dummyChartData(dummyDataSize);
  // console.log('data length', candlestickData.length);

  // console.log('positionDisplayingState', positionDisplayingState);
  // const [showPosition, setShowPosition] = useState<boolean>(positionDisplayingState);

  // console.log('showPositionOnChart in chart component', showPositionOnChart);

  // let data = '';

  const chartOptionsWithPositionLabel: ApexOptions = {
    chart: {
      // id: candlestickChartIdHandler(id),
      id: 'candles',
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
          upward: TypeOfPnLColorHex.PROFIT,
          downward: TypeOfPnLColorHex.LOSS,
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
      // position: 'back',
      yaxis: [
        {
          y: 1800,
          strokeDashArray: 3,
          borderColor: TypeOfPnLColorHex.LOSS,
          width: '100%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 2,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.LOSS,
              padding: {
                right: 10,
              },
            },
            text: `Position $1800 Close`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
        {
          y: 3500,
          strokeDashArray: 3,
          borderColor: TypeOfPnLColorHex.PROFIT,
          width: '100%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 2,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.PROFIT,
              padding: {
                right: 10,
              },
            },
            text: `Position $3500 Close`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
        {
          y: 3000,
          strokeDashArray: 0,
          borderColor: TypeOfPnLColorHex.TIDEBIT_THEME,
          width: '105%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 42,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.TIDEBIT_THEME,
              padding: {
                left: -5,
                right: 20,
              },
            },
            text: `$3000`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
      ],
    },
  };

  const chartOptionsWithoutPositionLabel: ApexOptions = {
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
          upward: TypeOfPnLColorHex.PROFIT,
          downward: TypeOfPnLColorHex.LOSS,
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
      // position: 'back',
      yaxis: [
        {
          y: 3000,
          strokeDashArray: 0,
          borderColor: TypeOfPnLColorHex.TIDEBIT_THEME,
          width: '105%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 42,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.TIDEBIT_THEME,
              padding: {
                left: -5,
                right: 20,
              },
            },
            text: `$3000`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
      ],
    },
  };

  // const displayedPosition = chartOptionsWithPositionLabel;

  // const displayedPosition = showPositionOnChart
  //   ? chartOptionsWithPositionLabel
  //   : chartOptionsWithoutPositionLabel;

  // console.log('showPosition state:', showPositionOnChart);
  // console.log('display option:', displayedPosition.annotations.yaxis[0].label.text);

  const [dataSample, setDataSample] = useState({
    options: chartOptionsWithPositionLabel,
    toolbar: {
      show: false,
      enabled: false,
    },
    series: [
      {
        name: 'series-1',
        data: [],
      },
    ],
  });

  // useEffect(() => {
  //   // let chart = new ApexCharts(el, options);
  //   ApexCharts.exec('candles', 'updateOptions', displayedPosition);
  // }, [showPositionOnChart]);

  // useEffect(() => {
  //   setDataSample({
  //     options: displayedPosition,
  //     toolbar: {show: false, enabled: false},
  //     series: [
  //       {
  //         name: 'series-1',
  //         data: [...candlestickData],
  //       },
  //     ],
  //   });
  // }, []);

  // setDataSample({
  //   options: displayedPosition,
  // });

  // const displayedChart = showPositionOnChart ? () : ()

  return (
    <div>
      <Chart
        options={dataSample.options}
        series={[
          {
            name: 'series-1',
            data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
          },
        ]}
        type="candlestick"
        width={candlestickChartWidth}
        height={candlestickChartHeight}
      />
      {/* <MarketContext.Consumer>
        {({showPositionOnChart}) => {
          console.log('showPositionOnChart in chart rendering: ', showPositionOnChart);
          return (
            <Chart
              options={dataSample.options}
              series={dataSample.series}
              type="candlestick"
              width={candlestickChartWidth}
              height={candlestickChartHeight}
            />
          );
        }}
      </MarketContext.Consumer> */}
    </div>
  );
}

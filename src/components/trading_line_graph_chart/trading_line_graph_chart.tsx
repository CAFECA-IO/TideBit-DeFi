import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {
  TRADING_CHART_BORDER_COLOR,
  INVISIBLE_STROKE_COLOR,
  OPEN_POSITION_LINE_LABEL_POSITION,
  PROFIT_LOSS_COLOR_TYPE,
} from '../../constants/display';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
  // dataArray: (number | null)[];
  dataArray: {x: Date; y: (number | null)[]}[];
  lineGraphWidth: string;
  lineGraphHeight: string;
  annotatedValue: number;
}

export default function TradingLineGraphChart({
  strokeColor,
  dataArray,
  lineGraphWidth,
  lineGraphHeight,
  annotatedValue,
  ...otherProps
}: ILineGraphProps): JSX.Element {
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
    markers: {
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: dataArray.length - 1,
          size: 1,
          strokeColor: strokeColor[0],
          shape: 'circle',
        },
      ],
    },

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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      colors: strokeColor,
      width: 3,
      // lineCap: 'round',
    },
    xaxis: {
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: {
        show: true,
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      type: 'datetime',
    },
    yaxis: {
      axisBorder: {show: true, color: TRADING_CHART_BORDER_COLOR},
      axisTicks: {show: false},
      labels: {
        show: true,
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      opposite: true,
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: 'dark',
      x: {
        show: true,
      },
    },
    // Horizontal dash line
    // annotations: {
    //   position: 'front',
    //   yaxis: [
    //     {
    //       y: 1320,
    //       strokeDashArray: 3,
    //       borderColor: PROFIT_LOSS_COLOR_TYPE.loss,
    //       width: '100%',
    //       fillColor: '#ffffff',

    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 10,
    //         style: {
    //           color: '#ffffff',
    //           fontSize: '12px',
    //           background: PROFIT_LOSS_COLOR_TYPE.loss,
    //           // padding: {
    //           //   right: 23,
    //           // },
    //         },
    //         text: `Position $6660 Close`,
    //         borderWidth: 20,
    //       },

    //       offsetX: 0,
    //     },
    //     {
    //       y: 1295,
    //       strokeDashArray: 3,
    //       borderColor: PROFIT_LOSS_COLOR_TYPE.profit,
    //       width: '100%',
    //       fillColor: '#ffffff',

    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 10,
    //         style: {
    //           color: '#ffffff',
    //           fontSize: '12px',
    //           background: PROFIT_LOSS_COLOR_TYPE.profit,
    //           // padding: {
    //           //   right: 23,
    //           // },
    //         },
    //         text: `Position $6760 Close`,
    //         borderWidth: 20,
    //       },

    //       offsetX: 0,
    //     },
    //     {
    //       y: 1240,
    //       strokeDashArray: 0,
    //       borderColor: PROFIT_LOSS_COLOR_TYPE.tidebitTheme,
    //       width: '105%',
    //       fillColor: '#ffffff',

    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 55,
    //         style: {
    //           color: '#ffffff',
    //           fontSize: '12px',
    //           background: PROFIT_LOSS_COLOR_TYPE.tidebitTheme,
    //           // padding: {
    //           //   left: -15,
    //           //   right: 20,
    //           // },
    //         },
    //         text: `$6606`,
    //         borderWidth: 20,
    //       },

    //       offsetX: 0,
    //     },
    //   ],
    // },
  };

  const [dataSample, setDataSample] = useState({
    options: chartOptions,
    toolbar: {
      show: false,
      enabled: false,
    },
    series: [
      {
        name: 'price',
        data: [...dataArray],
      },
    ],
  });

  return (
    <div className="">
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="line"
        width={lineGraphWidth}
        height={lineGraphHeight}
      />
    </div>
  );
}

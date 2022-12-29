import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {INVISIBLE_STROKE_COLOR} from '../../constants/display';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
  dataArray: number[];
  lineGraphWidth: string;
  annotatedValue: number;
}
// sampleArray = [42, 50, 45, 55, 49, 52, 48],
// sampleArray = [30, 72, 85, 65, 42, 99, 67, 55, 49, 32, 48, 20],

export default function PositionLineGraph({
  strokeColor,
  dataArray,
  lineGraphWidth,
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
      width: 1.2,
      // lineCap: 'round',
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
    // Horizontal line overlaid by another component
    // annotations: {
    //   position: 'front',
    //   yaxis: [
    //     {
    //       y: annotatedValue,
    //       strokeDashArray: 5,
    //       borderColor: strokeColor[0],
    //       width: '150%',
    //       fillColor: '#ffffff',
    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 10,
    //         style: {
    //           color: '#ffffff',
    //           background: strokeColor[0],
    //           // padding: {
    //           //   left: 0,
    //           //   right: 0,
    //           //   top: 0,
    //           //   bottom: 10,
    //           // },
    //         },
    //         text: `$ ${annotatedValue.toString()}`,
    //         borderWidth: 20,
    //       },
    //       offsetX: -10,
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
        name: 'series-1',
        data: [...dataArray],
      },
    ],
  });

  return (
    <div className="w-full">
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="line"
        width={lineGraphWidth}
      />
    </div>
  );
}

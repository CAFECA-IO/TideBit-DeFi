import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {OPEN_POSITION_LINE_LABEL_POSITION} from '../../constants/display';

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
    // Horizontal dash line
    annotations: {
      position: 'front',
      yaxis: [
        {
          y: annotatedValue,
          strokeDashArray: 5,
          borderColor: strokeColor[0],
          width: '150%',
          fillColor: '#ffffff',
          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: OPEN_POSITION_LINE_LABEL_POSITION,
            style: {
              color: '#ffffff',
              background: strokeColor[0],
              // cssClass: 'apexchartHorizontalLine',
            },
            text: `$ ${annotatedValue.toString()}`,
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
        data: [...dataArray],
      },
    ],
  });

  return (
    <div className="apexchartHorizontalLine">
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="line"
        width={lineGraphWidth}
      />
    </div>
  );
}

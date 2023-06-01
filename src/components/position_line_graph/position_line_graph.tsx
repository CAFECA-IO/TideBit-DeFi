import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {OPEN_POSITION_LINE_LABEL_POSITION} from '../../constants/display';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
  dataArray: number[];
  lineGraphWidth: string;
  annotatedValue: number;
  annotatedString: string;
}

export default function PositionLineGraph({
  strokeColor,
  dataArray,
  lineGraphWidth,
  annotatedValue,
  annotatedString,
}: ILineGraphProps): JSX.Element {
  const yaxisMax =
    Math.max(...dataArray) > annotatedValue ? Math.max(...dataArray) : annotatedValue;
  const yaxisMin =
    Math.min(...dataArray) < annotatedValue ? Math.min(...dataArray) : annotatedValue;

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      zoom: {enabled: false},
      foreColor: '#373d3f',
      toolbar: {show: false},
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
    dataLabels: {enabled: false},
    stroke: {
      curve: 'straight',
      colors: strokeColor,
      width: 1.2,
    },
    xaxis: {
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: {show: false},
      type: 'numeric',
    },
    yaxis: {
      max: yaxisMax,
      min: yaxisMin,
      forceNiceScale: true,
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: {show: false},
    },
    grid: {show: false},
    tooltip: {enabled: false},
    /* Info: (20230601 - Julian) Horizontal dash line */
    annotations: {
      yaxis: [
        {
          y: annotatedValue,
          strokeDashArray: 5,
          borderColor: strokeColor[1],
          width: '150%',
          fillColor: strokeColor[2],
          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: OPEN_POSITION_LINE_LABEL_POSITION,
            style: {
              color: strokeColor[2],
              background: strokeColor[1],
            },
            text: annotatedString,
            borderWidth: 20,
          },

          offsetX: 0,
        },
      ],
    },
  };

  const dataSample = {
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
  };

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

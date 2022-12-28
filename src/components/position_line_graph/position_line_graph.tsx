import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
  dataArray: number[];
  lineGraphWidth: string;
}
// sampleArray = [42, 50, 45, 55, 49, 52, 48],
// sampleArray = [30, 72, 85, 65, 42, 99, 67, 55, 49, 32, 48, 20],

export default function PositionLineGraph({
  strokeColor = ['#E86D6D'],
  dataArray = [30, 72, 85, 65, 42, 99, 67, 55, 49, 32, 48, 20],
  lineGraphWidth = '150',
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

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      colors: strokeColor,
      width: 1.2,
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
    <div>
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="line"
        width={lineGraphWidth}
      />
    </div>
  );
}

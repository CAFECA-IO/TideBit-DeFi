import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor?: string[];
  sampleArray?: number[];
  lineGraphWidth?: string;
}

export default function LineGraph({
  strokeColor = ['#3CC8C8'],
  sampleArray = [42, 50, 45, 55, 49, 52, 48],
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
      curve: 'smooth',
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
        data: [...sampleArray],
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

import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {TRADING_CHART_BORDER_COLOR} from '../../constants/display';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ILineGraphProps {
  strokeColor: string[];
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      colors: strokeColor,
      width: 3,
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
  };

  const dataSample = {
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
  };

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

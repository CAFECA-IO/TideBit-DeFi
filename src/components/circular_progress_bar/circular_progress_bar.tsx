import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ICircularProgressBarProps {
  percentage: number[];
  progressBarColor: string[];
  label: string[];
}
const testPercent = [(20 / 24) * 100];
const CircularProgressBar = ({
  percentage = testPercent,
  progressBarColor = ['#E86D6D'],
  label = ['11 H'],
}: ICircularProgressBarProps) => {
  const chartOptions: ApexOptions = {
    series: percentage,
    colors: progressBarColor,
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '40%',
          margin: 10,
        },
        track: {
          background: '#404A55',
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: '12px',
            offsetY: 4,
          },
          value: {
            show: false,
          },
        },
      },
    },
    labels: label,
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    yaxis: {
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: {
        show: false,
      },
    },
  };

  return (
    <div>
      <Chart
        options={chartOptions}
        height={'100'}
        series={chartOptions.series}
        type={'radialBar'}
      />
    </div>
  );
};

export default CircularProgressBar;

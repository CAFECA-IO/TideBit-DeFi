import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ICircularProgressBarProps {
  // percentage?: number[];
  progressBarColor: string[];
  // label?: string[];
  numerator: number;
  denominator: number;
  circularBarSize?: string;
}

const CircularProgressBar = ({
  numerator,
  denominator,
  progressBarColor,
  circularBarSize,
}: ICircularProgressBarProps) => {
  const percentage = [(numerator / denominator) * 100];
  const label = [`${numerator} H`];

  const chartOptions: ApexOptions = {
    series: percentage,
    colors: progressBarColor,
    chart: {
      height: 0,
      type: 'radialBar',
      // events: {
      //   mouseMove: function (event, chartContext, config) {
      //     console.log('mouse move in');
      //     label = [`100 H`];
      //   },
      //   mouseLeave: function (event, chartContext, config) {
      //     console.log('mouse leave');
      //     chartOptions.labels = label;
      //   },
      // },
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
        height={circularBarSize}
        series={chartOptions.series}
        type={'radialBar'}
      />
    </div>
  );
};

export default CircularProgressBar;

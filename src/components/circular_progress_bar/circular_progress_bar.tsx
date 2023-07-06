import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ICircularProgressBarProps {
  label?: string[];
  showLabel?: boolean;
  // percentage?: number[];
  progressBarColor: string[];
  numerator: number;
  denominator: number;
  hollowSize: string;
  circularBarSize: string;
  clickHandler?: () => void;
  className?: string;
}

const CircularProgressBar = ({
  label,
  showLabel,
  numerator,
  denominator,
  progressBarColor,
  hollowSize,
  circularBarSize,
  clickHandler,
  className,
}: ICircularProgressBarProps) => {
  const percentage = [(numerator / denominator) * 100];

  const chartOptions: ApexOptions = {
    series: percentage,
    colors: progressBarColor,
    chart: {
      height: 0,
      type: 'radialBar',
      // Till: (20230330 - Shirley)
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
          size: `${hollowSize}`,
          margin: 10,
        },
        track: {
          background: '#404A55',
        },
        dataLabels: {
          show: showLabel,
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
    labels: showLabel && label ? label : [],
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
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
  };

  return (
    <>
      <div onClick={clickHandler} className={className}>
        <Chart
          options={chartOptions}
          height={circularBarSize}
          series={chartOptions.series}
          type={'radialBar'}
        />
      </div>
    </>
  );
};

export default CircularProgressBar;

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { getCssVariable, numberWithCommas } from '@/lib/utils/common';

// Info: (20251230 - Julian) 動態載入，避免 SSR 錯誤
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LABEL_COLOR_PROPERTY = '--color-text-neutral-primary';
const FILL_COLORS_PROPERTIES = [
  '--color-surface-support-strong-maple',
  '--color-surface-support-strong-taro',
  '--color-surface-support-strong-rose',
  '--color-surface-support-strong-green',
  '--color-surface-support-strong-indigo',
  '--color-surface-support-strong-pink',
  '--color-surface-support-strong-baby',
];
const EMPTY_FILL_COLOR_PROPERTY = '--color-loading-indicator-surface-base';

enum HoleSize {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
  NONE = 'none',
}

interface IPieChartProps {
  labels: string[];
  series: number[];
  hole?: HoleSize;
}

const PieChart: React.FC<IPieChartProps> = ({ labels, series, hole = HoleSize.LARGE }) => {
  // Info: (20251230 - Julian) 取得標籤顏色
  const labelColor = getCssVariable(LABEL_COLOR_PROPERTY);

  // Info: (20251230 - Julian) 取得填充顏色
  const fillColors = labels.map((label, index) => {
    if (label === 'empty') {
      // Info: (20251230 - Julian) 空白項目使用特定顏色
      return getCssVariable(EMPTY_FILL_COLOR_PROPERTY);
    } else {
      // Info: (20251230 - Julian) 用模數運算取得顏色索引，確保不會超出陣列範圍
      const targetIndex = index % FILL_COLORS_PROPERTIES.length;
      // Info: (20251230 - Julian) 根據項目的數量，取出對應的顏色
      return getCssVariable(FILL_COLORS_PROPERTIES[targetIndex]);
    }
  });

  // Info: (20251230 - Julian) 內圈空白處的佔比
  const donutSize =
    hole === HoleSize.LARGE
      ? '75%'
      : hole === HoleSize.MEDIUM
        ? '50%'
        : hole === HoleSize.SMALL
          ? '25%'
          : '0%';

  // Info: (20251230 - Julian) 計算百分比
  function calculatePercentage(val: number) {
    const totalValue = series.reduce((acc, val) => acc + val, 0);
    const percentage = ((val / totalValue) * 100).toFixed(0);
    return `${percentage}%`;
  }

  // Info: (20251230 - Julian) 由於 Tailwind CSS 無法直接使用變數作為 class 名稱，所以先用這個方式處理
  function GetTooltipBgColor(token: string) {
    switch (token) {
      case '#9b8afb':
        return 'bg-[#9b8afb]';
      case '#fd6f8e':
        return 'bg-[#fd6f8e]';
      case '#ff883e':
        return 'bg-[#ff883e]';
      case '#6cdea0':
        return 'bg-[#6cdea0]';
      case '#8098f9':
        return 'bg-[#8098f9]';
      case '#f670c7':
        return 'bg-[#f670c7]';
      case '#53b1fd':
        return 'bg-[#53b1fd]';
      default:
        return '';
    }
  }

  // Info: (20251230 - Julian) 自訂提示框樣式
  function getCustomTooltip({
    series,
    seriesIndex,
    w,
  }: {
    series: number[];
    seriesIndex: number;
    w: { config: { labels: string[]; fill: { colors: string[] } } };
  }) {
    const label = w.config.labels ? w.config.labels[seriesIndex] : '';
    const value = series[seriesIndex];
    const fillColors = w.config.fill.colors[seriesIndex];
    const bgColor = GetTooltipBgColor(fillColors);

    // Info: (20251230 - Julian) 不顯示空白項目的提示框
    if (label === 'empty') {
      return '';
    }

    return `
      <div class="${bgColor} arrow_box flex flex-col items-center whitespace-nowrap px-spacing-lv-4 py-spacing-lv-2 text-xs">
      <p>${label}</p>
      <p class="font-bold">${numberWithCommas(value)}</p>
      </div>
      `;
  }

  // Info: (20251230 - Julian) 圖表配置項目
  const options: ApexOptions = {
    labels, // Info: (20251230 - Julian) 設定標籤
    stroke: { show: false }, // Info: (20251230 - Julian) 取消邊框
    dataLabels: { enabled: false }, // Info: (20251230 - Julian) 取消顯示數據標籤
    fill: { colors: fillColors }, // Info: (20251230 - Julian) 設定圈圈的填充顏色
    tooltip: {
      enabled: true,
      custom: getCustomTooltip,
    },
    plotOptions: {
      pie: {
        expandOnClick: false, // Info: (20251230 - Julian) 點擊不放大
        donut: {
          size: donutSize, // Info: (20251230 - Julian) 內圈空白處的佔比
          background: 'transparent',
          // Info: (20251230 - Julian) 內圈的標籤設定
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: '36px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              color: labelColor,
              offsetY: 14,
              formatter: calculatePercentage,
            },
          },
        },
      },
    },
  };

  return (
    <div id="chart">
      <Chart options={options} series={series} type="donut" width={400} height={400} />
    </div>
  );
};

const BudgetPieChart: React.FC = () => {
  // Info: (20251230 - Julian) 總預算
  const totalBudget = 146000;
  // Info: (20251230 - Julian) 計算空白的數據
  const emptyBudget = totalBudget - (23000 + 35000 + 51000 + 12000);

  // Info: (20251230 - Julian) 圖表標籤和數據
  const data = [
    { label: 'Product Development', value: 23000 },
    { label: 'Marketing & Promotion', value: 35000 },
    { label: 'Operations & Staffing', value: 51000 },
    { label: 'Legal & Compliance', value: 12000 },
    { label: 'empty', value: emptyBudget },
  ];

  // Info: (20251230 - Julian) 分別抽出標籤和數據
  const labels = data.map((item) => item.label);
  const series = data.map((item) => item.value);

  return <PieChart labels={labels} series={series} />;
};

export default BudgetPieChart;

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { getCssVariable, numberWithCommas } from '@/lib/utils/common';
import { IChartData } from '@/interfaces/chart';
import ProgressBar, { ProgressBarColor, ProgressBarSize } from '@/components/common/progress_bar';

// Info: (20251230 - Julian) 動態載入，避免 SSR 錯誤
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Info: (20251231 - Julian) 定義顏色變數
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
  data: IChartData[];
  size?: number;
  hole?: HoleSize;
  isShowLegend?: boolean;
}

interface IPieChartLegendProps {
  label: string;
  color: string;
  value: number;
}

const PieChartLegend: React.FC<IPieChartLegendProps> = ({ label, color, value }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-xs">
        <div className="flex items-center gap-4px px-4px">
          <div style={{ backgroundColor: color }} className="m-2 size-2 rounded-full"></div>
          <p className="font-medium text-text-neutral-secondary">{label}</p>
        </div>
        <div className="pl-32px font-semibold text-text-neutral-primary">
          NT$ {numberWithCommas(value)}
        </div>
      </div>
      <ProgressBar
        size={ProgressBarSize.XS}
        color={ProgressBarColor.PRIMARY}
        percentage={30}
        notPadding
      />
    </div>
  );
};

const PieChart: React.FC<IPieChartProps> = ({
  data,
  size = 200,
  hole = HoleSize.LARGE,
  isShowLegend = false,
}) => {
  // Info: (20251230 - Julian) 分別抽出標籤和數據
  const labels = data.map((item) => item.label);
  const series = data.map((item) => item.value);

  // Info: (20251230 - Julian) 取得標籤顏色
  const labelColor = getCssVariable(LABEL_COLOR_PROPERTY);

  // Info: (20251230 - Julian) 計算總值
  const totalValue = series.reduce((acc, val) => acc + val, 0);
  // Info: (20251231 - Julian) 計算去除空白項目的總值
  const valueWithoutEmpty = totalValue - (data.find((item) => item.label === 'empty')?.value || 0);
  // Info: (20251231 - Julian) 計算去除空白項目的百分比
  const donutPercentage = ((valueWithoutEmpty / totalValue) * 100).toFixed(0);

  // Info: (20251230 - Julian) 根據標籤和索引取得填充顏色
  function getFillColor(label: string, index: number): string {
    if (label === 'empty') {
      // Info: (20251230 - Julian) 空白項目的圓餅顏色使用特定顏色
      return getCssVariable(EMPTY_FILL_COLOR_PROPERTY);
    } else {
      // Info: (20251230 - Julian) 用模數運算取得顏色索引，確保不會超出陣列範圍
      const targetIndex = index % FILL_COLORS_PROPERTIES.length;
      // Info: (20251230 - Julian) 根據項目的數量，取出對應的顏色
      return getCssVariable(FILL_COLORS_PROPERTIES[targetIndex]);
    }
  }

  // Info: (20251230 - Julian) 取得圓餅填充顏色
  const pieColors = labels.map((label, index) => getFillColor(label, index));

  // Info: (20251230 - Julian) 內圈空白處的佔比
  const donutSize =
    hole === HoleSize.LARGE
      ? '75%'
      : hole === HoleSize.MEDIUM
        ? '50%'
        : hole === HoleSize.SMALL
          ? '25%'
          : '0%';

  // Info: (20251231 - Julian) 是否顯示內圈標籤
  const isShowLabel = hole === HoleSize.LARGE;

  // Info: (20251230 - Julian) 計算百分比
  function calculatePercentage(val: number) {
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
    const colors = w.config.fill.colors[seriesIndex];
    const bgColor = GetTooltipBgColor(colors);
    const percentage = ((value / totalValue) * 100).toFixed(0);

    // Info: (20251230 - Julian) 不顯示空白項目的提示框
    if (label === 'empty') {
      return '';
    }

    return `
        <div class="${bgColor} arrow_box flex flex-col items-center whitespace-nowrap px-spacing-lv-4 py-spacing-lv-2 text-xs">
        <p>${label}</p>
        <p class="font-bold">
        ${numberWithCommas(value)}
        <span class="text-sm">${percentage}%</span>
        </p>
        </div>
        `;
  }

  // Info: (20251230 - Julian) 圖表配置項目
  const options: ApexOptions = {
    chart: {
      type: 'pie',
      parentHeightOffset: 0, // Info: (20251230 - Julian) 取消高度偏移
    },
    labels, // Info: (20251230 - Julian) 設定標籤
    stroke: { show: false }, // Info: (20251230 - Julian) 取消邊框
    dataLabels: { enabled: false }, // Info: (20251230 - Julian) 取消顯示數據標籤
    fill: { colors: pieColors }, // Info: (20251230 - Julian) 設定圓餅的填充顏色
    // Info: (20251231 - Julian) 游標懸浮於區塊上時顯示的提示框
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
            show: isShowLabel,
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
            total: {
              show: isShowLabel,
              fontSize: '36px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              color: labelColor,
              formatter: () => `${donutPercentage}%`,
            },
          },
        },
      },
    },
    // Info: (20260102 - Julian) 不顯示預設圖例
    legend: { show: false },
  };

  // Info: (20260102 - Julian) 顯示圖例
  const displayLegend =
    isShowLegend &&
    data
      .filter((item) => item.label !== 'empty')
      .map((d, index) => (
        <PieChartLegend
          key={d.label}
          label={d.label}
          color={getFillColor(d.label, index)}
          value={d.value}
        />
      ));

  return (
    <div className="flex w-full justify-center gap-24px">
      <div id="chart">
        <Chart options={options} series={series} type="donut" width={size} height={size} />
      </div>

      <div id="legend" className="flex flex-col gap-spacing-lv-0">
        {displayLegend}
      </div>
    </div>
  );
};

export default PieChart;

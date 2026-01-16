'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { getCssVariable, getBgColor, getPieChartFillColor } from '@/lib/utils/chart';
import { numberWithCommas } from '@/lib/utils/common';
import { IBudgetBreakdown } from '@/interfaces/funding';
import { PIE_CHART_LABEL_COLOR_PROPERTY } from '@/constants/display';
import PieChartLegend from '@/components/common/pie_chart_legend';

// Info: (20260116 - Julian) 動態載入，避免 SSR 錯誤
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IBudgetPieChartProps {
  total: number;
  data: IBudgetBreakdown[];
  size: number;
}

const OpenBudgetPieChart: React.FC<IBudgetPieChartProps> = ({ total, data, size }) => {
  // Info: (20260116 - Julian) 分別抽出標籤和數據
  const labels = data.map((item) => item.title);
  const series = data.map((item) => item.totalAmount);

  // Info: (20260116 - Julian) 取得圓餅填充顏色
  const pieColors = labels.map((label, index) => getPieChartFillColor(label, index));

  // Info: (20260116 - Julian) 取得標籤顏色
  const labelColor = getCssVariable(PIE_CHART_LABEL_COLOR_PROPERTY);

  // Info: (20260116 - Julian) 計算百分比
  function calculatePercentage(val: number) {
    const percentage = ((val / total) * 100).toFixed(0);
    return `${percentage}%`;
  }

  // Info: (20260116 - Julian) 自訂提示框樣式
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
    const bgColor = getBgColor(colors);
    const percentage = ((value / total) * 100).toFixed(0);

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

  // Info: (20260116 - Julian) 圖表配置項目
  const options: ApexOptions = {
    chart: {
      type: 'pie',
      parentHeightOffset: 0, // Info: (20260116 - Julian) 取消高度偏移
    },
    labels, // Info: (20260116 - Julian) 設定標籤
    stroke: { show: false }, // Info: (20260116 - Julian) 取消邊框
    dataLabels: { enabled: false }, // Info: (20260116 - Julian) 取消顯示數據標籤
    fill: { colors: pieColors }, // Info: (20260116 - Julian) 設定圓餅的填充顏色
    // Info: (20260116 - Julian) 游標懸浮於區塊上時顯示的提示框
    tooltip: {
      enabled: true,
      custom: getCustomTooltip,
    },
    plotOptions: {
      pie: {
        expandOnClick: false, // Info: (20260116 - Julian) 點擊不放大
        donut: {
          size: '75%', // Info: (20260116 - Julian) 內圈空白處的佔比
          background: 'transparent',
          // Info: (20260116 - Julian) 內圈的標籤設定
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
            total: { show: false },
          },
        },
      },
    },
    // Info: (20260102 - Julian) 不顯示預設圖例
    legend: { show: false },
  };

  // Info: (20260102 - Julian) 顯示圖例
  const displayLegend = data.map((d, index) => (
    <PieChartLegend
      key={d.title}
      label={d.title}
      color={getPieChartFillColor(d.title, index)}
      value={d.totalAmount}
    />
  ));

  return (
    <div className="flex w-full justify-center gap-x-spacing-lv-8">
      <div id="chart">
        <Chart options={options} series={series} type="donut" width={size} height={size} />
      </div>

      <div
        id="legend"
        className="grid w-full grid-flow-col grid-rows-5 gap-x-spacing-lv-8 gap-y-spacing-lv-6"
      >
        {displayLegend}
      </div>
    </div>
  );
};

export default OpenBudgetPieChart;

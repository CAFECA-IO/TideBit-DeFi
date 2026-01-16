'use client';

import React from 'react';
import { IFundingBudgetSummary } from '@/interfaces/funding';
import { IChartData } from '@/interfaces/chart';
import PieChart from '@/components/common/pie_chart';

interface IBudgetPieChartProps {
  budgetSummary: IFundingBudgetSummary;
  size: number;
  isLegendLineBreak?: boolean;
}

const CloseBudgetPieChart: React.FC<IBudgetPieChartProps> = ({
  budgetSummary,
  size,
  isLegendLineBreak = false,
}) => {
  const { remainAmount, breakdown } = budgetSummary;

  // Info: (20251230 - Julian) 實際支出部分
  const expensePart = breakdown.map((item) => {
    // Info: (20260108 - Julian) 計算已使用預算之百分比，並取整數
    const usedPercentage = Math.round((item.usedAmount / item.totalAmount) * 100) ?? 0;

    return {
      label: item.title,
      value: item.totalAmount,
      legendPercentage: usedPercentage,
    };
  });

  // Info: (20251230 - Julian) 剩餘部分
  const emptyPart = { label: 'empty', value: remainAmount, legendPercentage: 0 };

  // Info: (20251230 - Julian) 組合圖表數據
  const data: IChartData[] = [...expensePart, emptyPart];

  return <PieChart data={data} size={size} isLegendLineBreak={isLegendLineBreak} />;
};

export default CloseBudgetPieChart;

'use client';

import React from 'react';
import { IFundingBudgetSummary } from '@/interfaces/funding';
import { IChartData } from '@/interfaces/chart';
import PieChart from '@/components/common/pie_chart';

interface IBudgetPieChartProps {
  budgetSummary: IFundingBudgetSummary;
}

const BudgetPieChart: React.FC<IBudgetPieChartProps> = ({ budgetSummary }) => {
  const { remainAmount, breakdown } = budgetSummary;

  // Info: (20251230 - Julian) 實際支出部分
  const expensePart = breakdown.map((item) => ({
    label: item.title,
    value: item.amount,
  }));

  // Info: (20251230 - Julian) 剩餘部分
  const emptyPart = { label: 'empty', value: remainAmount };

  // Info: (20251230 - Julian) 組合圖表數據
  const data: IChartData[] = [...expensePart, emptyPart];

  return <PieChart data={data} size={150} isShowLegend />;
};

export default BudgetPieChart;

import React from 'react';
import { numberWithCommas } from '@/lib/utils/common';
import ProgressBar, { ProgressBarColor, ProgressBarSize } from '@/components/common/progress_bar';

interface IPieChartLegendProps {
  label: string;
  color: string;
  value: number;
  percentage?: number;
}

const PieChartLegend: React.FC<IPieChartLegendProps> = ({ label, color, value, percentage }) => {
  const isShowProgressBar = percentage && (
    <ProgressBar
      size={ProgressBarSize.XS}
      color={ProgressBarColor.PRIMARY}
      percentage={percentage}
      notPadding
    />
  );

  return (
    <div id="legend" className="flex flex-col">
      <div className="flex flex-col text-xs">
        <div className="flex items-center gap-4px px-4px">
          <div style={{ backgroundColor: color }} className="m-2 size-2 rounded-full"></div>
          <p className="font-medium text-text-neutral-secondary">{label}</p>
        </div>
        <div className="pl-32px font-semibold text-text-neutral-primary">
          NT$ {numberWithCommas(value)}
        </div>
      </div>
      {isShowProgressBar}
    </div>
  );
};

export default PieChartLegend;

'use client';

import React, { useState } from 'react';
import { mockFundingIntroduction } from '@/interfaces/funding';
import { MarkdownContent } from '@/components/common/markdown_content';

enum FundingDetailTab {
  INTRODUCTION = 'Introduction',
  NEWS = 'News',
  FINANCIAL_REPORT = 'Financial Report',
  BUDGET_ALLOCATION = 'Budget Allocation',
}

interface IFundingDetailTabsProps {
  fundingId: string;
}

const FundingDetailTabs: React.FC<IFundingDetailTabsProps> = () => {
  const [currentTab, setCurrentTab] = useState<FundingDetailTab>(FundingDetailTab.INTRODUCTION);

  // ToDo: (20260102 - Julian) Get real data from API
  const introductionData = mockFundingIntroduction.introduction;

  const displayedTabs = Object.keys(FundingDetailTab).map((title) => {
    const titleKey = title as keyof typeof FundingDetailTab;
    const titleValue = FundingDetailTab[titleKey];

    const isActive = currentTab === titleValue;
    const onClick = () => setCurrentTab(titleValue);

    return (
      <button
        type="button"
        key={title}
        onClick={onClick}
        className={`${
          isActive
            ? 'border-tabs-surface-active-neutral bg-tabs-surface-active-neutral'
            : 'border-tabs-outline-default bg-tabs-surface-default'
        } cursor-pointer rounded-t-radius-m border px-spacing-lv-6 py-spacing-lv-3 text-center text-tabs-text-active-neutral`}
      >
        {titleValue}
      </button>
    );
  });

  const introductionContent = <MarkdownContent content={introductionData} />;
  const newsContent = <div>News Content</div>;
  const financialReportContent = <div>Financial Report Content</div>;
  const budgetAllocationContent = <div>Budget Allocation Content</div>;

  const displayedContent =
    currentTab === FundingDetailTab.INTRODUCTION
      ? introductionContent
      : currentTab === FundingDetailTab.NEWS
        ? newsContent
        : currentTab === FundingDetailTab.FINANCIAL_REPORT
          ? financialReportContent
          : budgetAllocationContent;

  return (
    <div className="flex flex-col p-spacing-lv-8">
      {/* Info: (20260102 - Julian) Detail Tab Header */}
      <div className="grid grid-cols-4">{displayedTabs}</div>
      {/* Info: (20260102 - Julian) Detail Tab Content */}
      <div className="rounded-b-radius-m bg-surface-neutral-container-lv1 px-spacing-lv-8 py-spacing-lv-6 text-text-neutral-primary">
        {displayedContent}
      </div>
    </div>
  );
};

export default FundingDetailTabs;

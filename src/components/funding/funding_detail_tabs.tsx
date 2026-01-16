'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockFundingIntroduction } from '@/interfaces/funding';
import { MarkdownContent } from '@/components/common/markdown_content';
import NewsItem from '@/components/news/news_item';
import { mockNews } from '@/interfaces/news';
import { mockFundingDetail } from '@/interfaces/funding';
import Pagination, { PaginationType } from '@/components/common/pagination';
import CloseBudgetPieChart from '@/components/funding/close_budget_pie_chart';

enum FundingDetailTab {
  INTRODUCTION = 'Introduction',
  NEWS = 'News',
  FINANCIAL_REPORT = 'Financial Report',
  BUDGET_ALLOCATION = 'Budget Allocation',
}

enum ReportTab {
  BALANCE_SHEET = 'Balance Sheet',
  INCOME_STATEMENT = 'Income Statement',
  CASH_FLOW_STATEMENT = 'Cash Flow Statement',
  PROFITABILITY_ANALYSIS = 'Profitability Analysis',
}

interface IFundingDetailTabsProps {
  fundingId: string;
}

const FundingDetailTabs: React.FC<IFundingDetailTabsProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Info: (20260108 - Julian) 定義 page 參數名稱
  const newsParamsName = 'news_page';
  const reportParamsName = 'report_page';

  // Info: (20260112 - Julian) 從 URL 參數取得 page
  // const newsPage = searchParams.get(newsParamsName) ?? '1';
  // const newsPageNum = Number(newsPage);
  const reportPage = searchParams.get(reportParamsName) ?? '1';
  const reportPageNum = Number(reportPage);

  const [currentTab, setCurrentTab] = useState<FundingDetailTab>(FundingDetailTab.INTRODUCTION);
  // const [currentNewsPage, setCurrentNewsPage] = useState<number>(newsPageNum);
  const [currentReportTab, setCurrentReportTab] = useState<ReportTab>(ReportTab.BALANCE_SHEET);
  const [currentReportPage, setCurrentReportPage] = useState<number>(reportPageNum);

  // ToDo: (20260102 - Julian) Get real data from API
  const introductionData = mockFundingIntroduction.introduction;
  const newsData = mockNews;
  const totalPages = 100;
  const { budgetSummary } = mockFundingDetail;

  // Info: (20260108 - Julian) 點擊按鈕時更新當前頁面，並寫入 URL 參數
  const selectNewsPage = (page: number) => {
    // Info: (20260108 - Julian) 保留現有 query
    const params = new URLSearchParams(searchParams);
    params.set(newsParamsName, page.toString());
    // Info: (20260108 - Julian) 更新 URL
    router.push(`?${params.toString()}`);
  };
  const selectReportPage = (page: number) => {
    setCurrentReportPage(page);
  };

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
        } rounded-t-radius-m border-l border-t px-spacing-lv-6 py-spacing-lv-3 text-center text-tabs-text-active-neutral last:border-r`}
      >
        {titleValue}
      </button>
    );
  });

  // Info: (20260108 - Julian) 介紹
  const introductionContent = <MarkdownContent content={introductionData} />;

  // Info: (20260108 - Julian) 最新消息
  const newsList = newsData.map((news) => <NewsItem key={news.id} news={news} />);
  const newsContent = (
    <div className="px-spacing-lv-8 pb-spacing-lv-6 pt-spacing-lv-8">
      <div className="flex flex-col gap-spacing-lv-4 px-spacing-lv-8">
        {newsList}
        <Pagination
          paramsName={newsParamsName}
          totalPages={totalPages}
          selectPage={selectNewsPage}
          paginationType={PaginationType.NUMERIC}
        />
      </div>
    </div>
  );

  const reportTab = Object.keys(ReportTab).map((report) => {
    const reportKey = report as keyof typeof ReportTab;
    const reportValue = ReportTab[reportKey];

    const isActive = currentReportTab === reportValue;
    const onClick = () => setCurrentReportTab(reportValue);

    return (
      <button
        type="button"
        key={reportKey}
        onClick={onClick}
        className={`${
          isActive
            ? 'border-tabs-outline-active bg-tabs-surface-active-primary text-tabs-text-active-on-primary'
            : 'border-tabs-outline-default bg-tabs-surface-default text-tabs-text-default hover:bg-tabs-surface-hover-neutral hover:text-tabs-text-hover-neutral'
        } border-y border-l px-spacing-lv-6 py-spacing-lv-3 text-base font-semibold last:border-r`}
      >
        {reportValue}
      </button>
    );
  });

  // Info: (20260112 - Julian) 財務報告
  const financialReportContent = (
    <div className="flex flex-col items-center gap-spacing-lv-8 px-spacing-lv-6 py-spacing-lv-8">
      <div className="grid w-full grid-cols-4">{reportTab}</div>
      {/* ToDo: (20260112 - Julian) Develop Report PDF Viewer */}
      <div className="flex h-[1200px] w-[800px] flex-col bg-pink-300 p-5">
        <p>Financial Report Content - {currentReportTab}</p>
        <p>Now showing page {currentReportPage}.</p>
      </div>
      <Pagination
        paramsName="report_page"
        paginationType={PaginationType.TEXT}
        selectPage={selectReportPage}
        totalPages={totalPages}
      />
    </div>
  );

  const budgetAllocationContent = (
    <CloseBudgetPieChart budgetSummary={budgetSummary} size={180} isLegendLineBreak />
  );

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

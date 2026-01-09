'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockFundingIntroduction } from '@/interfaces/funding';
import { MarkdownContent } from '@/components/common/markdown_content';
import NewsItem from '@/components/news/news_item';
import { mockNews } from '@/interfaces/news';
import Pagination, { PaginationType } from '@/components/common/pagination';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Info: (20260108 - Julian) 定義 page 參數名稱
  const pageParamsName = 'news_page';

  // ToDo: (20260108 - Julian) 從 URL 參數取得 page 與 keyword
  // const page = searchParams.get(pageParamsName) ?? '1';
  // const pageNum = Number(page) ?? 1;

  const [currentTab, setCurrentTab] = useState<FundingDetailTab>(FundingDetailTab.INTRODUCTION);
  // const [currentNewsPage, setCurrentNewsPage] = useState<number>(pageNum);

  // ToDo: (20260102 - Julian) Get real data from API
  const introductionData = mockFundingIntroduction.introduction;
  const newsData = mockNews;
  const totalPages = 100;

  // Info: (20260108 - Julian) 點擊按鈕時更新當前頁面，並寫入 URL 參數
  const selectPage = (page: number) => {
    // Info: (20260108 - Julian) 保留現有 query
    const params = new URLSearchParams(searchParams);
    params.set(pageParamsName, page.toString());
    // Info: (20260108 - Julian) 更新 URL
    router.push(`?${params.toString()}`);
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
        } cursor-pointer rounded-t-radius-m border px-spacing-lv-6 py-spacing-lv-3 text-center text-tabs-text-active-neutral`}
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
      <div className="flex flex-col gap-spacing-lv-4 px-spacing-lv-8">{newsList}</div>
      <Pagination
        paramsName={pageParamsName}
        totalPages={totalPages}
        selectPage={selectPage}
        paginationType={PaginationType.NUMERIC}
      />
    </div>
  );

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

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { numberWithCommas } from '@/lib/utils/common';

export enum PaginationType {
  NUMERIC = 'Numeric',
  NUMERIC_EXPANSION = 'NumericExpansion',
  TEXT = 'Text',
  INPUT = 'Input',
}

interface IPaginationProps {
  selectPage: (page: number) => void;
  totalPages: number;
  paramsName: string;
  paginationType: PaginationType;
  totalItems?: number;
}

const Pagination: React.FC<IPaginationProps> = ({
  selectPage,
  totalPages,
  totalItems = 0,
  paginationType,
  paramsName,
}) => {
  // Info: (20260108 - Julian) 取得 URL 參數
  const searchParams = useSearchParams();
  // Info: (20260108 - Julian) 從 URL 參數取得當前頁碼，預設為 1
  const activePage = Number(searchParams.get(paramsName)) || 1;

  // Info: (20260108 - Julian) 管理輸入框的頁碼狀態
  const [pageInput, setPageInput] = useState<number>(activePage);

  // Info: (20260108 - Julian) 當 activePage 改變時，更新輸入框的值
  useEffect(() => {
    setPageInput(activePage);
  }, [activePage]);

  // Info: (20260108 - Julian) 建立一個包含所有頁碼的陣列
  const pagesArr = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Info: (20260108 - Julian) 判斷是否顯示某頁碼
  const shouldShowPageNumber = (page: number) => {
    // Info: (20260108 - Julian) 總是顯示第一頁和最後一頁
    if (page === 1 || page === totalPages) return true;
    // Info: (20260108 - Julian) 在前 5 頁或後 5 頁時顯示所有這些頁碼
    if (activePage <= 2) {
      return page <= 5;
    }
    if (activePage > totalPages - 3) {
      return page > totalPages - 5;
    }
    // Info: (20260108 - Julian) 其他情況下顯示當前頁面前後兩頁
    return page >= activePage - 2 && page <= activePage + 2;
  };

  // Info: (20260108 - Julian) 處理輸入框變更
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Info: (20260108 - Julian) 限制輸入值在 1 到 totalPages 範圍內
    const availablePage = Math.min(Math.max(1, value), totalPages);
    setPageInput(availablePage);
  };

  // Info: (20260108 - Julian) 離開輸入框時，跳轉頁面
  const handlePageInputBlur = () => {
    selectPage(pageInput);
  };

  // Info: (20260108 - Julian) 按下 Enter 鍵時，跳轉頁面
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      selectPage(pageInput);
    }
  };

  // Info: (20260108 - Julian) 防止輸入框滾動改變數值
  const handlePageScroll = (e: React.UIEvent<HTMLInputElement>) => {
    e.currentTarget.scrollTop = 0;
  };

  // Info: (20260108 - Julian) 輸入框樣式
  const displayedPageInput = (
    <div className="flex size-44px flex-col items-center justify-center rounded-radius-xs border border-text-field-outline-default bg-text-field-surface-default">
      <input
        type="number"
        value={pageInput}
        min={0}
        max={totalPages}
        onChange={handlePageInputChange}
        onBlur={handlePageInputBlur}
        onKeyDown={handlePageInputKeyDown}
        onScroll={handlePageScroll}
        className="w-30px bg-transparent text-center font-medium text-text-field-text-active outline-none"
      />
    </div>
  );

  // Info: (20260108 - Julian) 數列 "1 2 ... 5 6 7 ... 99 100" 樣式
  const numericPages = pagesArr.map((page) => {
    let pageBtn;
    if (shouldShowPageNumber(page)) {
      pageBtn = (
        <li key={page} className="flex items-center">
          <button
            onClick={() => selectPage(page)}
            className={`flex size-40px items-center justify-center rounded-full ${
              activePage === page
                ? 'bg-pagination-active text-pagination-text-active'
                : 'text-pagination-text-default hover:bg-pagination-hover'
            }`}
          >
            {page}
          </button>
        </li>
      );
    } else if (
      page === activePage - 3 ||
      page === activePage + 3 ||
      (activePage <= 2 && page === 6) ||
      (activePage > totalPages - 3 && page === totalPages - 5)
    ) {
      // Info: (20260108 - Julian) 只在當前頁面前後第三頁顯示省略號
      pageBtn = (
        <li key={page} className="flex items-center">
          <div className="flex size-40px items-center justify-center rounded-full">...</div>
        </li>
      );
    }

    return pageBtn;
  });

  // Info: (20260108 - Julian) 文字 "Page X of Y" 樣式
  const textPages = (
    <div className="text-sm font-semibold text-pagination-text-default">
      Page {activePage} of {totalPages}
    </div>
  );

  // Info: (20260108 - Julian) 輸入框 "X / Y" 樣式
  const inputPages = (
    <div className="flex items-center gap-spacing-lv-2">
      {displayedPageInput}
      <p className="text-sm font-semibold text-pagination-text-default">/ {totalPages}</p>
    </div>
  );

  // Info: (20260108 - Julian) 上一頁按鈕
  const previousBtn = (
    <button
      onClick={() => selectPage(activePage - 1)}
      // Info: (20260108 - Julian) 總頁數為 0 或 當前頁數為第一頁時，按鈕 disabled
      disabled={totalPages === 0 || activePage === 1 ? true : false}
      className="flex size-40px items-center justify-center text-base text-pagination-text-default hover:text-pagination-text-active disabled:text-pagination-text-disable"
    >
      <RiArrowLeftSLine size={20} />
    </button>
  );

  // Info: (20260108 - Julian) 下一頁按鈕
  const nextBtn = (
    <button
      onClick={() => selectPage(activePage + 1)}
      // Info: (20260108 - Julian) 總頁數為 0 或 當前頁數為最後一頁時，按鈕 disabled
      disabled={totalPages === 0 || activePage === totalPages ? true : false}
      className="flex size-40px items-center justify-center text-base text-pagination-text-default hover:text-pagination-text-active disabled:text-pagination-text-disable"
    >
      <RiArrowRightSLine size={20} />
    </button>
  );

  // Info: (20260108 - Julian) 顯示總項目數
  const isShowTotalItems = totalItems > 0 && (
    <p className="text-sm font-normal text-pagination-text-default">
      Total {numberWithCommas(totalItems)} items
    </p>
  );

  const isShowExpand = paginationType === PaginationType.NUMERIC_EXPANSION && (
    <div className="flex items-center gap-spacing-lv-2 text-sm font-semibold text-pagination-text-default">
      <p>Go to</p>
      {displayedPageInput}
      <p>Page</p>
    </div>
  );

  // Info: (20260108 - Julian) 顯示指定樣式
  const displayPages =
    paginationType === PaginationType.NUMERIC || paginationType === PaginationType.NUMERIC_EXPANSION
      ? numericPages
      : paginationType === PaginationType.TEXT
        ? textPages
        : inputPages;

  return (
    <div className="flex flex-col items-center gap-spacing-lv-2">
      <div className="mt-10 flex items-center">
        {/* Info: (20260108 - Julian) 分頁 */}
        <ul className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium">
          <li>{previousBtn}</li>
          {displayPages}
          <li>{nextBtn}</li>
        </ul>
        {/* Info: (20260108 - Julian) */}
        {isShowExpand}
      </div>
      {/* Info: (20260108 - Julian) 總項目數 */}
      {isShowTotalItems}
    </div>
  );
};

export default Pagination;

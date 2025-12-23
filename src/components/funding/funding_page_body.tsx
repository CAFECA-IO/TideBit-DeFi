'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown } from 'react-icons/fa6';
import { LuUserRound, LuBuilding2 } from 'react-icons/lu';
import FundingTicket from '@/components/funding/funding_ticket';
import Layout from '@/components/common/layout';
import { Button } from '@/components/common/button';
import Slider from '@/components/common/slider';
import SearchBar from '@/components/common/search_bar';
import NumericInput from '@/components/common/numeric_input';
import { mockFundingItems } from '@/interfaces/funding';
import { FundingStatus } from '@/constants/funding';

import useOuterClick from '@/lib/hooks/use_outer_click';

// ToDo: (20251219 - Julian) 須確認排序項目
enum FundingSort {
  UPLOAD_DATE = 'Upload Date',
  POPULARITY = 'Popularity',
  ENDING_SOON = 'Ending Soon',
}

const FundingPageBody: React.FC = () => {
  const priceRanges = [10, 25, 50, 75, 100]; // Info: (20251222 - Julian) 查詢價格範圍選項
  const industryOptions = ['All Industry', 'Technology', 'Health', 'Finance', 'Education']; // Info: (20251222 - Julian) 產業選項，須確認

  const [activeTab, setActiveTab] = useState<FundingStatus>(FundingStatus.ON_GOING);
  const [activeSort, setActiveSort] = useState<FundingSort>(FundingSort.UPLOAD_DATE);
  // ToDo: (20251222 - Julian) For API connection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activePriceRange, setActivePriceRange] = useState<number>(priceRanges[0]);
  const [activeIndustry, setActiveIndustry] = useState<string>(industryOptions[0]);
  const [keyword, setKeyword] = useState<string>('');

  const tabOptions = Object.values(FundingStatus);
  const sortOptions = Object.values(FundingSort);

  const {
    targetRef: industryDropdownRef,
    componentVisible: isIndustryDropdownOpen,
    setComponentVisible: setIsIndustryDropdownOpen,
  } = useOuterClick<HTMLDivElement>(false);

  const toggleIndustryDropdown = () => setIsIndustryDropdownOpen((prev) => !prev);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const selectPrice = (value: number) => {
    setActivePriceRange(value);
  };

  const switchSort = () => {
    setActiveSort((prevSort) => {
      // Info: (20251219 - Julian) 切換到下一個排序選項，若到最後一個則回到第一個
      const currentIndex = sortOptions.indexOf(prevSort);
      const nextIndex = (currentIndex + 1) % sortOptions.length;
      return sortOptions[nextIndex];
    });
  };

  const displayedTabs = tabOptions.map((status) => {
    const isActive = status === activeTab;
    const switchTab = () => setActiveTab(status);

    return (
      <Button
        type="button"
        key={status}
        onClick={switchTab}
        variant={isActive ? 'underlineActive' : 'underlineDefault'}
        rounded="top"
      >
        {status}
      </Button>
    );
  });

  const sortSwitcher = (
    <button
      type="button"
      onClick={switchSort}
      className="flex items-center gap-spacing-lv-2 rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-4 py-spacing-lv-2 font-medium text-text-field-text-active hover:border-text-field-outline-focused"
    >
      <LuUserRound size={20} />
      <p>{activeSort}</p>
    </button>
  );

  const displayedFundingList = mockFundingItems.map((item) => (
    <FundingTicket key={item.id} data={item} />
  ));

  return (
    <Layout className="flex flex-col">
      {/* Info: (20251219 - Julian) Funding Page Header */}
      <div className="flex items-end justify-between gap-spacing-lv-7 p-spacing-lv-8">
        <div className="flex flex-col gap-spacing-lv-0 whitespace-nowrap font-semibold text-text-neutral-primary">
          <h1 className="text-3xl">
            <span className="text-text-brand-primary">TideBit</span> Fuels the Future for Startup
          </h1>
          <p className="text-base">
            Your investment helps real companies take root, grow, and thrive.
          </p>
        </div>
        <div>
          <Image src="/elements/funding_banner.png" width={374} height={143} alt="funding_banner" />
        </div>
      </div>

      <div className="mx-auto">
        <NumericInput />
      </div>

      {/* Info: (20251219 - Julian) Funding Filter Section */}
      <div className="flex items-center gap-spacing-lv-8 px-spacing-lv-8 py-spacing-lv-5">
        {/* Info: (20251222 - Julian) Price Range */}
        <Slider label="Price" options={priceRanges} selectOption={selectPrice} />

        {/* Info: (20251222 - Julian) Industry Dropdown */}
        <div ref={industryDropdownRef} className="relative flex flex-col items-center">
          {/* Info: (20251222 - Julian) Button */}
          <div
            onClick={toggleIndustryDropdown}
            className="flex w-full items-center rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default py-spacing-lv-3 text-text-field-text-active hover:cursor-pointer hover:border-text-field-outline-focused hover:bg-text-field-surface-addon"
          >
            <div className="pl-spacing-lv-6 pr-spacing-lv-4">
              <LuBuilding2 size={24} />
            </div>
            <div className="w-140px whitespace-nowrap px-spacing-lv-6 font-medium">
              {activeIndustry}
            </div>
            <div className="pl-spacing-lv-4 pr-spacing-lv-6">
              <FaChevronDown size={24} />
            </div>
          </div>
          {/* Info: (20251222 - Julian) Dropdown Menu */}
          <div
            className={`${
              isIndustryDropdownOpen
                ? 'visible translate-y-0 opacity-100'
                : 'invisible -translate-y-12 opacity-0'
            } absolute top-14 z-dropmenu flex w-full flex-col rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default py-spacing-lv-3 text-text-field-text-active shadow-md transition-all duration-150 ease-in-out`}
          >
            {industryOptions.map((industry) => (
              <div
                key={industry}
                onClick={() => {
                  setActiveIndustry(industry);
                  setIsIndustryDropdownOpen(false);
                }}
                className="px-spacing-lv-6 py-spacing-lv-3 hover:cursor-pointer hover:bg-text-field-surface-addon"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>

        {/* Info: (20251222 - Julian) Search Bar */}
        <SearchBar value={keyword} onChange={handleKeywordChange} />
      </div>

      {/* Info: (20251219 - Julian) Funding Tab */}
      <div className="flex items-end justify-between px-spacing-lv-8 py-spacing-lv-5">
        {/* Info: (20251219 - Julian) Tab */}
        <div className="grid grid-cols-3 gap-spacing-lv-2 py-spacing-lv-3">{displayedTabs}</div>
        {/* Info: (20251219 - Julian) Sorting */}
        {sortSwitcher}
      </div>

      {/* Info: (20251219 - Julian) Funding List */}
      <div className="grid grid-cols-2 justify-items-center gap-spacing-lv-7 p-2 px-spacing-lv-8 pb-spacing-lv-8">
        {displayedFundingList}
      </div>
    </Layout>
  );
};

export default FundingPageBody;

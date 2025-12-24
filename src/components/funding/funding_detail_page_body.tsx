'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiLock } from 'react-icons/fi';
import { mockFundingItems } from '@/interfaces/funding';
import { numberWithCommas } from '@/lib/utils/common';
import Layout from '@/components/common/layout';
import Breadcrumb from '@/components/common/breadcrumb';
import { Button } from '@/components/common/button';
import OnGoingFundingStat from '@/components/funding/ongoing_funding_stat';
import NumericInput from '@/components/common/numeric_input';

interface IFundingDetailPageBodyProps {
  fundingId: string;
}

const FundingDetailPageBody: React.FC<IFundingDetailPageBodyProps> = ({ fundingId }) => {
  // ToDo: (20251224 - Julian) Get real data from API
  const data = mockFundingItems.find((item) => item.id === fundingId);

  // ToDo: (20251224 - Julian) Constant
  const homeLink = `/funding`;
  const depositLink = `/`;

  // ToDo: (20260102 - Julian) 用於投資金額輸入框
  const [fundingValue, setFundingValue] = useState<number>(1);

  const saveFundingValue = (value: number) => {
    setFundingValue(value);
  };

  // Info: (20251224 - Julian) 若找不到對應的 fundingId，顯示錯誤訊息
  if (!data) {
    return (
      <Layout className="flex min-h-screen flex-col items-center justify-center gap-spacing-lv-4 p-spacing-lv-10 text-text-neutral-primary">
        <h2 className="text-4xl font-bold">Funding item not found.</h2>
        <Link href={homeLink} className="text-xl text-link-default hover:text-link-hover">
          Back to Funding Page
        </Link>
      </Layout>
    );
  }

  const { title, coverImageId, companyName, industry, tokenPrice, tokenName, isLocked } = data;

  // ToDo: (20251224 - Julian) Get real data from API
  const availableBalance = 500000;
  const totalCost = fundingValue * tokenPrice;

  // Info: (20251224 - Julian) 用於 Breadcrumb
  const breadcrumbData = [
    { title: 'Crowdfunding', link: '/funding' },
    { title: title, link: '' },
  ];

  const header = (
    <div className="flex flex-col gap-spacing-lv-6 px-spacing-lv-8 pb-spacing-lv-6 pt-spacing-lv-8">
      <div className="flex items-center gap-8px">
        <Link
          href={homeLink}
          className="p-spacing-lv-4 text-button-neutral-outline-on-neutral-default"
        >
          <FaArrowLeft size={36} />
        </Link>
        <h1 className="text-3xl font-semibold text-text-neutral-primary">{title}</h1>
      </div>
      {/* Info: (20251224 - Julian) Breadcrumb */}
      <Breadcrumb data={breadcrumbData} />
    </div>
  );

  // ToDo: (20251224 - Julian) upcoming info, success info, failed info
  const fundingDetail = (
    <div className="flex flex-1 flex-col gap-spacing-lv-6 py-spacing-lv-8 pl-spacing-lv-6 pr-spacing-lv-8">
      {/* Info: (20251224 - Julian) Token Price and Industry */}
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-spacing-lv-4">
          <div className="flex items-end gap-spacing-lv-0 text-text-neutral-primary">
            <p className="text-5xl font-extrabold">${tokenPrice}</p>
            <p className="text-xs font-normal">/{tokenName}</p>
          </div>
          {isLocked && (
            <div className="shrink-0 text-icon-neutral-primary">
              <FiLock size={24} />
            </div>
          )}
        </div>
        <div className="rounded-radius-rounded bg-badge-brand-secondary px-spacing-lv-2 py-spacing-lv-0 text-xs font-bold text-badge-brand-on-secondary">
          {industry}
        </div>
      </div>
      {/* Info: (20251224 - Julian) Title and Company Name */}
      <div className="flex flex-col gap-spacing-lv-0 py-spacing-lv-3">
        <p className="text-xl font-bold text-text-neutral-primary">{title}</p>
        <p className="text-xs font-normal text-text-neutral-tertiary">{companyName}</p>
      </div>
      {/* Info: (20251224 - Julian) Funding Stat */}
      <div className="flex flex-col gap-spacing-lv-0">
        <OnGoingFundingStat data={data} />
      </div>
      {/* Info: (20251224 - Julian) Funding Value */}
      <div className="flex flex-col">
        <div className="flex items-stretch justify-between py-spacing-lv-4">
          <p className="text-text-field-text-label">
            Available: {numberWithCommas(availableBalance)} TWD
          </p>
          <Link href={depositLink} className="text-link-default hover:text-link-hover">
            Not enough TWD?
          </Link>
        </div>
        <NumericInput
          saveNumberValue={saveFundingValue}
          defaultValue={1}
          plusValue={1000}
          minusValue={1000}
          minValue={1}
        />
      </div>
      {/* Info: (20251224 - Julian) Total Value */}
      <div className="flex justify-between text-lg font-bold text-text-neutral-primary">
        <p>Total</p>
        <p>{numberWithCommas(totalCost)} TWD</p>
      </div>
      {/* Info: (20251224 - Julian) Commit Order Button */}
      <Button type="button">Commit Order</Button>
    </div>
  );

  const content = (
    <div className="flex">
      {/* Info: (20251224 - Julian) Cover Image */}
      <div className="size-600px relative shrink-0">
        <Image src={coverImageId} fill objectFit="cover" alt="cover" />
      </div>
      {/* Info: (20251224 - Julian) Funding Detail */}
      {fundingDetail}
    </div>
  );

  return (
    <Layout className="flex flex-col">
      {/* Info: (20251224 - Julian) Page Header */}
      {header}
      {/* Info: (20251224 - Julian) Page Content */}
      {content}
    </Layout>
  );
};

export default FundingDetailPageBody;

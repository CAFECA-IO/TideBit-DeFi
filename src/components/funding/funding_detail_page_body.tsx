'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { mockFundingItems } from '@/interfaces/funding';
import Layout from '@/components/common/layout';
import Breadcrumb from '@/components/common/breadcrumb';

interface IFundingDetailPageBodyProps {
  fundingId: string;
}

const FundingDetailPageBody: React.FC<IFundingDetailPageBodyProps> = ({ fundingId }) => {
  const data = mockFundingItems.find((item) => item.id === fundingId);

  const homeLink = `/funding`;

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

  const { title } = data;

  const breadcrumbData = [
    { title: 'Crowdfunding', link: '/funding' },
    { title: title, link: '' },
  ];

  return (
    <Layout className="flex flex-col">
      {/* Info: (20251224 - Julian) Page Header */}
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
      {/* Info: (20251224 - Julian) Page Content */}
      <div className="flex">
        <div className="shrink-0"></div>
        <div className="flex flex-col gap-spacing-lv-6 py-spacing-lv-8 pl-spacing-lv-6 pr-spacing-lv-8"></div>
      </div>
    </Layout>
  );
};

export default FundingDetailPageBody;

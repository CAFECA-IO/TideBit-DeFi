'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaXTwitter } from 'react-icons/fa6';
import { FiEye, FiFacebook, FiLinkedin, FiLink } from 'react-icons/fi';
import { LuShare2 } from 'react-icons/lu';
import { IoLogoReddit } from 'react-icons/io5';
import Layout from '@/components/common/layout';
import Breadcrumb from '@/components/common/breadcrumb';
import { MarkdownContent } from '@/components/common/markdown_content';
import { TBD_URL } from '@/constants/url';
import { mockFundingItems } from '@/interfaces/funding';
import { mockNews } from '@/interfaces/news';
import { numberWithCommas, timestampToString } from '@/lib/utils/common';
import { DEFAULT_PIC_URL } from '@/constants/display';

interface IFundingNewsPageBodyProps {
  fundingId: string;
  newsId: string;
}

// Info: (20260109 - Julian) 分享按鈕設定
const shareConfig = [
  {
    name: 'Facebook',
    icon: <FiFacebook size={24} />,
    shareUrl: '',
  },
  {
    name: 'Twitter/X',
    icon: <FaXTwitter size={24} />,
    shareUrl: '',
  },
  {
    name: 'LinkedIn',
    icon: <FiLinkedin size={24} />,
    shareUrl: '',
  },
  {
    name: 'Reddit',
    icon: <IoLogoReddit size={24} />,
    shareUrl: '',
  },
  {
    name: 'Copy Link',
    icon: <FiLink size={24} />,
    shareUrl: '',
  },
];

const FundingNewsPageBody: React.FC<IFundingNewsPageBodyProps> = ({ fundingId, newsId }) => {
  // ToDo: (20260109 - Julian) Get real data from API
  const fundingData = mockFundingItems.find((item) => item.id === fundingId);
  const newsData = mockNews.find((item) => item.id === newsId);

  // Info: (20260109 - Julian) 若找不到對應資料，顯示錯誤訊息
  if (!(fundingData && newsData)) {
    return (
      <Layout className="flex min-h-screen flex-col items-center justify-center gap-spacing-lv-4 p-spacing-lv-10 text-text-neutral-primary">
        <h2 className="text-4xl font-bold">News not found.</h2>
        <Link href={TBD_URL.FUNDING} className="text-xl text-link-default hover:text-link-hover">
          Back to Funding Page
        </Link>
      </Layout>
    );
  }

  const { title: newsTitle, imageId, publicTimestamp, viewCount, shareCount, content } = newsData;

  const imageSrc = imageId ?? DEFAULT_PIC_URL;

  // Info: (20260109 - Julian) Funding Links
  const fundingLink = `${TBD_URL.FUNDING}/${fundingId}`;

  // Info: (20260109 - Julian) 用於 Breadcrumb
  const breadcrumbData = [
    { title: 'Crowdfunding', link: TBD_URL.FUNDING },
    { title: fundingData.title, link: fundingLink },
    { title: 'News', link: `${TBD_URL.FUNDING}/${fundingId}/news/${newsId}` },
  ];

  const header = (
    <div className="flex flex-col gap-spacing-lv-6 px-spacing-lv-8 pb-spacing-lv-6 pt-spacing-lv-8">
      <div className="flex items-center gap-8px">
        <Link
          href={fundingLink}
          className="p-spacing-lv-4 text-button-neutral-outline-on-neutral-default"
        >
          <FaArrowLeft size={36} />
        </Link>
        <h1 className="text-3xl font-semibold text-text-neutral-primary">News</h1>
      </div>
      {/* Info: (20260109 - Julian) Breadcrumb */}
      <Breadcrumb data={breadcrumbData} />
    </div>
  );

  const shareButtons = shareConfig.map((share) => (
    <button
      key={share.name}
      type="button"
      className="size-36px p-spacing-lv-0 text-button-neutral-outline-on-neutral-default hover:text-button-neutral-outline-on-neutral-hover"
    >
      {share.icon}
    </button>
  ));

  const body = (
    <div className="flex flex-col gap-spacing-lv-6 px-spacing-lv-13 py-spacing-lv-8">
      {/* Info: (20260109 - Julian) News Image */}
      <div className="relative h-450px w-full shrink-0">
        <Image src={imageSrc} fill objectFit="cover" alt="news_image" />
      </div>
      {/* Info: (20260109 - Julian) News Title */}
      <div className="flex flex-col gap-spacing-lv-2">
        <div className="flex items-center justify-between text-xs text-text-neutral-tertiary">
          <p className="font-normal">{timestampToString(publicTimestamp).dateWithDash}</p>
          <div className="flex items-center gap-spacing-lv-2 font-medium">
            {/* Info: (20260109 - Julian) 瀏覽數 */}
            <div className="flex items-center gap-spacing-lv-0">
              <FiEye size={16} />
              <p>{numberWithCommas(viewCount)}</p>
            </div>
            {/* Info: (20260109 - Julian) 分享數 */}
            <div className="flex items-center gap-spacing-lv-0">
              <LuShare2 size={16} />
              <p>{numberWithCommas(shareCount)}</p>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-text-neutral-primary">{newsTitle}</h1>
      </div>
      {/* Info: (20260109 - Julian) News Content */}
      <MarkdownContent content={content} />
      {/* Info: (20260109 - Julian) News Footer */}
      <div className="flex items-center justify-between gap-spacing-lv-4">
        <Link href={fundingLink}>
          <button
            type="button"
            className="flex items-center gap-spacing-lv-2 font-semibold text-button-neutral-outline-on-neutral-default hover:text-button-neutral-outline-on-neutral-hover"
          >
            <FaArrowLeft size={24} />
            <p>Back</p>
          </button>
        </Link>
        <div className="flex items-center gap-spacing-lv-2 text-text-neutral-tertiary">
          <p className="text-xs font-normal">Share to</p>
          <div className="flex items-center">{shareButtons}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout className="flex flex-col">
      {/* Info: (20260109 - Julian) Header */}
      {header}
      {/* Info: (20260109 - Julian) News Body */}
      {body}
    </Layout>
  );
};

export default FundingNewsPageBody;

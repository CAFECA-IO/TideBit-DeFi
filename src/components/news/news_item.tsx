'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { INewsBrief } from '@/interfaces/news';
import { timestampToString } from '@/lib/utils/common';
import { DEFAULT_PIC_URL } from '@/constants/display';

interface INewsItemProps {
  news: INewsBrief;
}

const NewsItem: React.FC<INewsItemProps> = ({ news }) => {
  const { id, imageId, title, excerpt, publicTimestamp } = news;

  const pathname = usePathname();

  const newsLink = pathname + `/news/${id}`; // ToDo: (20260108 - Julian) URL 有可能變動
  const imageUrl = imageId ?? DEFAULT_PIC_URL;
  const publicDate = timestampToString(publicTimestamp).dateString;

  return (
    <Link href={newsLink} className="flex items-center overflow-hidden rounded-radius-m">
      {/* Info: (20260108 - Julian) 新聞圖片 */}
      <div className="relative h-132px w-200px shrink-0">
        <Image src={imageUrl} fill objectFit="cover" alt="news_thumbnail" />
      </div>
      {/* Info: (20260108 - Julian) 新聞內容 */}
      <div className="flex flex-col gap-8px p-spacing-lv-4">
        <div className="flex flex-col gap-spacing-lv-0">
          <h2 className="text-base font-semibold text-text-neutral-primary">{title}</h2>
          <p className="line-clamp-2 text-xs font-normal text-text-neutral-secondary">{excerpt}</p>
        </div>
        <p className="text-xs font-normal text-text-neutral-tertiary">{publicDate}</p>
      </div>
    </Link>
  );
};

export default NewsItem;

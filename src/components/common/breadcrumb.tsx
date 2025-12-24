'use client';

import React from 'react';
import Link from 'next/link';

interface IBreadcrumbProps {
  data: {
    title: string;
    link: string;
  }[];
}

const Breadcrumb: React.FC<IBreadcrumbProps> = ({ data }) => {
  const crumbs = data.map((item, index) => {
    // Info: (20251224 - Julian) 最後一項不需要連結
    const isLast = index === data.length - 1;

    return isLast ? (
      <p key={index} className="text-breadcrumb-text-current">
        {item.title}
      </p>
    ) : (
      <React.Fragment key={index}>
        <Link
          href={item.link}
          className="text-breadcrumb-text-default hover:text-breadcrumb-text-on-hover"
        >
          {item.title}
        </Link>
        <span className="text-breadcrumb-outline-divider">/</span>
      </React.Fragment>
    );
  });

  return <div className="flex items-center gap-spacing-lv-0 text-sm font-semibold">{crumbs}</div>;
};

export default Breadcrumb;

import Image from 'next/image';
import React from 'react';
import {IBriefNewsItem} from '../../interfaces/tidebit_defi_background/brief_news_item';
import {timestampToString} from '../../lib/common';

const NewsItem = ({id, timestamp, title: heading, content, img, ...otherProps}: IBriefNewsItem) => {
  const overallWidth = 'mx-20';

  const displayedHeading = <div className="">{heading}</div>;

  const displayedContent = content;

  const displayedImg = img ? (
    <Image src={img} alt="news" width={900} height={500} />
  ) : (
    <img
      className="rounded object-cover object-center"
      alt="news"
      src="https://dummyimage.com/200x115"
    />
  );

  const displayedTime = timestampToString(timestamp);

  return (
    <>
      <section className={`${overallWidth} mt-10`}>
        <div className="mx-auto flex flex-col items-center px-0 py-0 lg:flex-row">
          <div className="mb-2 flex max-w-3xs justify-center md:mb-0 lg:mb-10 lg:justify-start">
            {displayedImg}
          </div>
          <div className="flex flex-col items-center text-center lg:grow lg:items-start lg:pl-7 lg:text-left">
            <div className="flex w-full items-center justify-center lg:-mt-10 lg:justify-between">
              <h1 className="text-lg text-lightWhite">{displayedHeading}</h1>
            </div>

            <p className="mb-1 mr-5 w-3/4 text-xs leading-relaxed">{displayedContent}</p>
            <p className="mb-12 flex text-xs text-lightGray lg:hidden">{displayedTime.date}</p>
          </div>
          <p className="mb-10 hidden w-40 text-sm text-lightGray lg:flex">{displayedTime.date}</p>
        </div>
        <div className="border-b border-dashed border-white/50"></div>
      </section>
    </>
  );
};

export default NewsItem;

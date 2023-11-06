import Image from 'next/image';
import React from 'react';
import {IBriefNewsItem} from '../../interfaces/tidebit_defi_background/brief_news_item';
import {timestampToString} from '../../lib/common';
import Link from 'next/link';

const CryptoNewsItem = ({id: id, timestamp, title: heading, content, img}: IBriefNewsItem) => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';

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
      <section className={`${overallWidth}`}>
        <Link href={`/news/${id}`}>
          <div className="mx-auto flex flex-col items-center px-0 py-0 lg:flex-row">
            <div className="mb-2 flex max-w-3xs justify-center md:mb-0 lg:mb-10 lg:justify-start">
              {displayedImg}
            </div>
            <div className="flex flex-col items-center text-center lg:grow lg:items-start lg:pl-7 lg:text-left">
              <div className="mt-3 mb-3 flex w-full items-center justify-between">
                <h1 className="w-full justify-center text-lg text-lightWhite lg:w-4/5">
                  {displayedHeading}
                </h1>
                <p className="mr-5 hidden text-sm text-lightGray lg:flex">{displayedTime.date}</p>
              </div>

              <p className="text-xs lg:mr-5 lg:mb-12">{displayedContent}</p>
              <p className="mt-3 mb-10 flex text-xs text-lightGray lg:hidden">
                {displayedTime.date}
              </p>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
};

export default CryptoNewsItem;

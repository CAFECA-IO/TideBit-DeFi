import Image from 'next/image';
import React from 'react';

interface INewsItemProps {
  heading?: string;
  highlight?: string;
  content?: string;
  img?: string;
}

const CryptoNewsItem = ({heading, highlight, content, img, ...otherProps}: INewsItemProps) => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';

  const displayedHeading = highlight ? (
    <div className="">
      {heading} <span className="text-tidebitTheme">{highlight}</span>
    </div>
  ) : (
    <div className="">{heading}</div>
  );

  const displayedContent = content
    ? content
    : `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
    accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea`;

  const displayedImg = img ? (
    <Image src={img} alt="news" width={900} height={500} />
  ) : (
    <img
      className="rounded object-cover object-center"
      alt="news"
      src="https://dummyimage.com/200x115"
    />
  );

  return (
    <>
      <section className={`${overallWidth}`}>
        <div className="mx-auto flex flex-col items-center px-0 py-0 lg:flex-row">
          <div className="mb-2 flex w-2/5 justify-center md:mb-0 lg:mb-10 lg:justify-start">
            {displayedImg}
          </div>
          <div className="flex flex-col items-center text-center lg:grow lg:items-start lg:pl-7 lg:text-left">
            <h1 className="mt-3 mb-3 text-lg text-lightWhite">
              {displayedHeading}
              {/* Add news title here */}
              {/* <br className="hidden lg:inline-block" />
              readymade gluten */}
            </h1>
            <p className="mb-12 text-xs leading-relaxed">
              {displayedContent}
              {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea */}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CryptoNewsItem;

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
    <div className="font-bold">
      {heading} <span className="text-tidebitTheme">{highlight}</span>
    </div>
  ) : (
    <div className="font-bold">{heading}</div>
  );

  const displayedContent = content
    ? content
    : `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
    accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea`;

  const displayedImg = img ? (
    <Image src={img} alt="news" width={400} height={230} />
  ) : (
    <img
      className="rounded object-cover object-center"
      alt="news"
      src="https://dummyimage.com/200x115"
    />
  );

  return (
    <>
      {/* Desktop */}
      <section className={`${overallWidth}`}>
        <div className="mx-auto flex flex-col items-center px-0 py-0 lg:flex-row">
          <div className="mb-10 flex w-2/5 justify-center md:mb-0 lg:justify-start">
            {displayedImg}
          </div>
          <div className="flex flex-col items-center text-center lg:grow lg:items-start lg:pl-7 lg:text-left">
            <h1 className="mt-6 mb-2 text-lg font-medium text-lightWhite">
              {displayedHeading}
              {/* Add news title here */}
              {/* <br className="hidden lg:inline-block" />
              readymade gluten */}
            </h1>
            <p className="mb-8 text-xs leading-relaxed">
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

import React from 'react';
import Image from 'next/image';

interface HeroReverseProps {
  heading?: string | JSX.Element;
  highlight?: string;
  content?: string;
  img?: string;
}

const HeroReverse = ({heading, highlight, content, img}: HeroReverseProps) => {
  const displayedHeading = highlight ? (
    <div className="font-bold">
      {heading} <span className="text-tidebitTheme">{highlight}</span>
    </div>
  ) : (
    <div className="font-bold">{heading}</div>
  );

  const displayedContent = content
    ? content
    : `Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant
cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote
bag selvage hot chicken authentic tumeric truffaut hexagon try-hard
chambray.`;

  const displayedImg = img ? (
    <Image src={img} alt="hero" width={976} height={588} />
  ) : (
    <Image
      className="rounded object-cover object-center"
      alt="hero"
      src="https://dummyimage.com/500x400"
    />
  );

  const desktopVersionBreakpoint = 'hidden lg:flex';
  const mobileVersionBreakpoint = 'flex lg:hidden';

  return (
    <>
      {/* Info: Desktop (20230922 - Shirley) */}
      <section
        className={`${desktopVersionBreakpoint} container mx-auto justify-center bg-black text-gray-400`}
      >
        <div className="flex flex-col items-center lg:flex-row">
          <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">{displayedImg}</div>

          <div className="mt-1 flex max-w-xl flex-col items-center justify-center text-center sm:text-start md:mt-10 md:w-1/2 md:items-start md:pl-16 md:text-left lg:mt-0 lg:pl-8 xl:mt-10 xl:ml-20 mr-10">
            <h1 className="mb-8 text-3xl font-medium text-white sm:text-4xl md:text-center">
              {displayedHeading}
            </h1>
            <p className="mb-8 text-lg leading-10">{displayedContent}</p>
          </div>
        </div>
      </section>

      {/* Info: Mobile (20230922 - Shirley) */}
      <section
        className={`${mobileVersionBreakpoint} container mx-auto w-screen justify-center bg-black text-gray-400`}
      >
        <div className="flex flex-col items-center">
          <div className="mb-10 w-2/3">{displayedImg}</div>

          <div className="mx-4 mt-5 flex max-w-lg flex-col items-center justify-center text-center align-baseline xs:mt-10 sm:mt-14">
            <h1 className="mx-auto mb-5 text-center text-2xl font-medium text-white sm:text-4xl">
              {displayedHeading}
            </h1>
            <p className="mb-8 text-center text-sm leading-8 md:text-xl md:leading-10">
              {displayedContent}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroReverse;

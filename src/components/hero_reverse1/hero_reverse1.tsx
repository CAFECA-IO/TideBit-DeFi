import React from 'react';
import Image from 'next/image';

interface HeroReverse1Props {
  heading?: string | JSX.Element;
  highlight?: string;
  content?: string;
  img?: string;
}

// ml-20 & mr-40 are used to center the content
const HeroReverse1 = ({heading, highlight, content, img}: HeroReverse1Props) => {
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
    <Image src={img} width={1366} height={930} alt="picture" />
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
        className={`${desktopVersionBreakpoint} container mx-auto w-screen justify-center bg-black text-gray-400`}
      >
        <div className="flex flex-col items-center lg:flex-row">
          <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">{displayedImg}</div>

          <div className="mt-1 flex max-w-md flex-col items-center text-center md:mt-10 md:w-1/2 lg:mt-0 lg:items-start lg:pl-8 lg:text-left xl:mt-5 xl:ml-20">
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
          <div className="mb-0 w-5/6">{displayedImg}</div>

          <div className="mx-4 mt-0 flex max-w-lg flex-col items-center justify-center text-center align-baseline">
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

export default HeroReverse1;

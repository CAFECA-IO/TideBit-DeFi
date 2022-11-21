import React from 'react';

// ml-20 & mr-40 are used to center the content
const HeroReverse = ({heading, highlight, content, img, ...otherProps}) => {
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
    img
  ) : (
    <img
      className="rounded object-cover object-center"
      alt="hero"
      src="https://dummyimage.com/500x400"
    />
  );

  return (
    <section className="container mx-auto flex w-screen justify-center bg-black text-gray-400">
      <div className="flex flex-col items-center pb-24 md:flex-row">
        <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">{displayedImg}</div>

        <div className="mt-5 flex max-w-xl flex-col items-center text-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:mt-0 lg:pl-24 xl:ml-20">
          <h1 className="mb-4 text-3xl font-medium text-white sm:text-4xl md:text-center">
            {displayedHeading}
          </h1>
          <p className="mb-8 text-lg leading-10">{displayedContent}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroReverse;

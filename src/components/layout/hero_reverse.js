import React from 'react';

// ml-20 & mr-40 are used to center the content
const HeroReverse = ({heading, content, ...otherProps}) => {
  const displayedHeading = heading ? (
    heading
  ) : (
    <div>
      Before they sold out
      <span className="flex">NO parameter in</span>
    </div>
  );

  const displayedContent = content
    ? content
    : `Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant
cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote
bag selvage hot chicken authentic tumeric truffaut hexagon try-hard
chambray.`;

  return (
    <section className=" bg-black text-gray-400">
      <div className="container mx-auto flex flex-col items-center px-5 pb-24 md:flex-row">
        <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
          <img
            className="rounded object-cover object-center"
            alt="hero"
            src="https://dummyimage.com/500x400"
          />
        </div>
        <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:flex-grow lg:pl-24 xl:ml-20">
          <h1 className=" mb-4 text-3xl font-medium text-white sm:text-3xl md:text-center">
            {displayedHeading}
          </h1>
          <p className="mb-8 leading-relaxed">{displayedContent}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroReverse;

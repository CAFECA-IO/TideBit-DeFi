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
    <Image src={img} alt={`${heading} image`} fill style={{objectFit: 'contain'}} />
  ) : (
    <Image
      className="rounded object-cover object-center"
      alt="hero image"
      src="https://dummyimage.com/500x400"
    />
  );

  return (
    <section className="flex flex-col items-center lg:flex-row gap-10 container mx-auto justify-center bg-black text-gray-400 py-10 lg:py-20">
      <div className="relative w-9/10 lg:w-1/2 max-w-lg h-230px lg:h-350px">{displayedImg}</div>

      <div className="flex max-w-xl flex-col gap-y-2 lg:gap-y-10 justify-center w-4/5 lg:w-1/2 lg:px-10 lg:items-start items-center text-center lg:text-left">
        <h1 className="font-bold text-white text-2xl lg:text-4xl">{displayedHeading}</h1>
        <p className="text-sm lg:text-lg leading-8 lg:leading-10">{displayedContent}</p>
      </div>
    </section>
  );
};

export default HeroReverse;

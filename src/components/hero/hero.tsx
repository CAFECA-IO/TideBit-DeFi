import React from 'react';
import Image from 'next/image';

interface HeroProps {
  heading?: string | JSX.Element;
  content?: string;
  img: string;
}

const Hero = ({heading, content, img}: HeroProps): JSX.Element => {
  const displayedHeading = heading ? heading : `Moon hashtag pop-up try-hard offal truffaut`;

  const displayedContent = content
    ? content
    : `Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar neutra sustainable fingerstache kickstarter.`;

  const displayedImg = (
    <Image src={img} alt={`${heading} image`} fill style={{objectFit: 'contain'}} />
  );

  return (
    <section className="flex flex-col-reverse items-center lg:flex-row gap-10 container mx-auto justify-center bg-black text-gray-400 py-10 lg:py-20">
      <div className="flex max-w-xl flex-col gap-y-2 lg:gap-y-10 justify-center w-4/5 lg:px-10 lg:items-start items-center text-center lg:text-left">
        <h1 className="font-bold text-white text-2xl lg:text-4xl">{displayedHeading}</h1>
        <p className="text-sm lg:text-lg leading-8 lg:leading-10">{displayedContent}</p>
      </div>

      <div className="relative w-9/10 lg:w-1/2 max-w-lg h-230px lg:h-350px">{displayedImg}</div>
    </section>
  );
};

export default Hero;

import React from 'react';

const Hero = ({heading, content, img, ...otherProps}) => {
  const displayedHeading = heading
    ? heading
    : `
Moon hashtag pop-up try-hard offal truffaut
`;

  const displayedContent = content
    ? content
    : `Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar
neutra sustainable fingerstache kickstarter.`;

  const displayedImg = img ? (
    img
  ) : (
    <img
      className="h-full w-full object-cover object-center"
      src="https://dummyimage.com/600x300"
      alt="stats"
    />
  );

  return (
    <section className="container mx-auto flex w-screen justify-center bg-black text-gray-400">
      <div className="flex flex-col items-center pb-24 md:flex-row">
        <div className="mt-1 flex max-w-xl flex-col items-center text-center sm:text-start md:mr-32 md:mt-10 md:w-2/5 md:items-start md:pl-16 md:text-left lg:mt-0 lg:pl-8 xl:mt-5 xl:ml-20">
          <h1 className="mb-8 text-3xl font-medium text-white sm:text-4xl md:text-center">
            {displayedHeading}
          </h1>
          <p className="mb-8 text-lg leading-10">{displayedContent}</p>
        </div>

        <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">{displayedImg}</div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';

const Hero = ({heading, content, ...otherProps}) => {
  return (
    <section className="body-font bg-black text-gray-400">
      <div className="container mx-auto flex flex-wrap px-10 py-24 xl:px-20">
        <div className="-mx-4 mt-auto mb-auto flex flex-wrap content-start sm:w-2/3 sm:pr-10 lg:w-1/2">
          <div className="mb-6 w-full px-4 sm:p-4">
            <h1 className="title-font mb-2 text-xl font-medium text-white">
              {heading
                ? heading
                : `
              Moon hashtag pop-up try-hard offal truffaut
              `}
            </h1>
            <div className="leading-relaxed">
              {content
                ? content
                : `Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar
							neutra sustainable fingerstache kickstarter.`}
            </div>
          </div>
        </div>
        <div className="mt-6 w-full overflow-hidden rounded-lg sm:mt-0 sm:w-1/3 lg:w-1/2">
          <img
            className="h-full w-full object-cover object-center"
            src="https://dummyimage.com/600x300"
            alt="stats"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';

// ml-20 & mr-40 are used to center the content
const HeroReverse = ({heading, content, ...otherProps}) => {
  return (
    <section className="text-gray-400 bg-black body-font">
      <div className="container mx-auto flex px-5 pb-24 md:flex-row flex-col items-center">
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:mb-0 mb-10">
          <img
            className="object-cover object-center rounded"
            alt="hero"
            src="https://dummyimage.com/500x400"
          />
        </div>
        <div className="xl:ml-20 lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="md:text-center title-font sm:text-3xl text-3xl mb-4 font-medium text-white">
            {heading ? (
              heading
            ) : (
              <div>
                Before they sold out
                <span className="flex">NO parameter in</span>
              </div>
            )}
          </h1>
          <p className="mb-8 leading-relaxed">
            {content
              ? content
              : `Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant
						cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote
						bag selvage hot chicken authentic tumeric truffaut hexagon try-hard
						chambray.`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroReverse;

import React from 'react';

const Banner = () => {
  return (
    <section className="text-gray-400 bg-black body-font">
      <div className="mx-auto flex flex-col px-5 py-24 justify-center items-center">
        <img
          className="w-screen h-1/6 mb-10 object-cover object-center rounded"
          alt="hero"
          src="https://dummyimage.com/1741x619"
        />
      </div>
    </section>
  );
};

export default Banner;

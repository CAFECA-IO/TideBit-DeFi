import React from 'react';

const Banner = () => {
  return (
    <section className="body-font bg-black text-gray-400">
      <div className="mx-auto flex flex-col items-center justify-center px-5 py-24">
        <img
          className="mb-10 h-1/6 w-screen rounded object-cover object-center"
          alt="hero"
          src="https://dummyimage.com/1741x619"
        />
      </div>
    </section>
  );
};

export default Banner;

import React from 'react';

const CryptoSummary = () => {
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';

  return (
    <>
      <div className="flex-col justify-start">
        {' '}
        <h1 className="text-start text-xl text-lightWhite">About</h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
      </div>
    </>
  );
};

export default CryptoSummary;

import React from 'react';
import Image from 'next/image';

const ReserveRatio = () => {
  return (
    <section>
      <div className="mb-40 items-center text-2xl font-medium text-white xs:text-3xl sm:text-4xl">
        <div className="flex items-center justify-center">
          <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
          <h1 className="mx-1 text-center xl:w-1/2">
            Latest
            <span className="text-tidebitTheme"> reserve ratio</span> of TideBit holdings
          </h1>
          <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
        </div>
      </div>

      <div className="relative">
        <div>
          {/* background image */}
          <Image
            className="w-full"
            src="/elements/group_15244.svg"
            width={1252}
            height={879}
            alt="picture"
          />
        </div>
      </div>
    </section>
  );
};

export default ReserveRatio;

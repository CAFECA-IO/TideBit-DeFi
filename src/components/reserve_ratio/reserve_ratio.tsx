import React from 'react';
import Image from 'next/image';

const ReserveRatio = () => {
  return (
    <section className="relative">
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
    </section>
  );
};

export default ReserveRatio;

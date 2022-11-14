import React from 'react';
import Link from 'next/link';

const tideLink = ({content = '', ...otherProps}) => {
  return (
    <Link
      href={`${otherProps.href}`}
      className={`${otherProps?.className} hover:text-cyan-300 hover:cursor-pointer`}
    >
      {content}
    </Link>
  );
};

export default tideLink;

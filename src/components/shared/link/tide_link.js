import React from 'react';
import Link from 'next/link';

const TideLink = ({content = '', ...otherProps}) => {
  return (
    <Link
      href={`${otherProps.href}`}
      className={`${otherProps?.className} hover:cursor-pointer hover:text-cyan-300`}
    >
      {content}
    </Link>
  );
};

export default TideLink;

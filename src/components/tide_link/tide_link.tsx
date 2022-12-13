import React from 'react';
import Link from 'next/link';

// type LinkProps = {
//   content?: JSX.Element | string;
//   target?: string;
//   htmlref?: string;
//   href?: string;
//   className?: string;
// };

// const TideLink: FC<LinkProps> = ({content = '', ...otherProps}) => {
//   return (
//     <Link
//       href={`${otherProps.href}`}
//       className={`${otherProps?.className} hover:cursor-pointer hover:text-tidebitTheme`}
//     >
//       {content}
//     </Link>
//   );
// };

interface TideLinkProps {
  content?: JSX.Element | string;
  target?: string;
  htmlref?: string;
  href?: string;
  className?: string;
}

const TideLink = ({content = '', ...otherProps}: TideLinkProps): JSX.Element => {
  return (
    <Link
      href={`${otherProps.href}`}
      className={`${otherProps?.className} hover:cursor-pointer hover:text-tidebitTheme`}
    >
      {content}
    </Link>
  );
};

export default TideLink;

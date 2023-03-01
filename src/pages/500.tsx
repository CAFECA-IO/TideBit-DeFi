import React from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '../../public/animation/oops.json';
import NavBar from '../components/nav_bar/nav_bar';

// function Error({statusCode}: any) {
//   return (
//     <div>
//       <NavBar />
//       <Lottie animationData={errorAnimation} />
//     </div>
//   );
// }

// Error.getInitialProps = ({res, err}: any) => {
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
//   return {statusCode};
// };

// export default Error;

const Custom500 = () => {
  return (
    <div>
      <NavBar />
      <Lottie animationData={errorAnimation} />
    </div>
  );
};

export default Custom500;

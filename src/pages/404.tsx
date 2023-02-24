import React from 'react';
import Lottie from 'lottie-react';
import notFoundAnimation from '../../public/animation/404.json';
import NavBar from '../components/nav_bar/nav_bar';

const Custom404 = () => {
  return (
    <div>
      <NavBar />
      <Lottie animationData={notFoundAnimation} />
    </div>
  );
};

export default Custom404;

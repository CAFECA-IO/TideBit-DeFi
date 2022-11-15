import React from 'react';
import TideButton from '../shared/button/tide_button';

const ConnectButton = props => {
  // const { className, ...otherProps } = props;
  return <TideButton content="Wallet Connect" isFocus={false} className={props?.className} />;
};

export default ConnectButton;

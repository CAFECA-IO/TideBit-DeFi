// export const delayedProcessModalDisappear = ({setProcessModalVisible = () => {}}) => {
//   setTimeout(() => setProcessModalVisible(false), 1000);
// };

export const DELAYED_HIDDEN_SECONDS = 1000;

export const TRADING_INPUT_STEP = 0.01;

export const PROFIT_LOSS_COLOR_TYPE = {
  profit: '#1AE2A0',
  loss: '#E86D6D',
};

export const TRANSACTION_TYPE = {
  long: {
    title: 'Up',
    subtitle: '(Buy)',
  },
  short: {
    title: 'Down',
    subtitle: '(Sell)',
  },
};

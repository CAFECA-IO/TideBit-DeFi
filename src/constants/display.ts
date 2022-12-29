// export const delayedProcessModalDisappear = ({setProcessModalVisible = () => {}}) => {
//   setTimeout(() => setProcessModalVisible(false), 1000);
// };

export const DELAYED_HIDDEN_SECONDS = 1000;

export const TRADING_INPUT_STEP = 0.01;

export const PROFIT_LOSS_COLOR_TYPE = {
  profit: '#1AE2A0',
  loss: '#E86D6D',
  tidebitTheme: '#29C1E1',
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

// Used to display dash line on `open position item` but failed
export const INVISIBLE_STROKE_COLOR = {
  dark: '#161719',
  sample: '#A5C4F3',
  transparent: '#A16171900',
};

export const TRADING_CHART_SWITCH_BUTTON_SIZE = 30;

export const OPEN_POSITION_LINE_GRAPH_WIDTH = '150';
export const OPEN_POSITION_LINE_LABEL_POSITION = 100;

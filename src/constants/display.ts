// export const delayedProcessModalDisappear = ({setProcessModalVisible = () => {}}) => {
//   setTimeout(() => setProcessModalVisible(false), 1000);
// };

export interface IDEV_TOAST_CONFIG {
  position: string;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  progress: undefined;
  theme: string;
}

export const DEV_TOAST_CONFIG = {
  position: 'bottom-left',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: 'dark',
};

export const DELAYED_HIDDEN_SECONDS = 1000;

export const TRADING_INPUT_STEP = 0.01;

export const PROFIT_LOSS_COLOR_TYPE = {
  profit: '#17BF88',
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

export const TRADING_CHART_BORDER_COLOR = '#8B8E91';

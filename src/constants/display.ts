// export const delayedProcessModalDisappear = ({setProcessModalVisible = () => {}}) => {
//   setTimeout(() => setProcessModalVisible(false), 1000);
// };

export const LAYOUT_BREAKPOINT = 1024;

export const INITIAL_POSITION_LABEL_DISPLAYED_STATE = true;

export interface ICRYPTO_CARD_COLORS {
  owner: string;
  starColor: string;
  gradientColor: string;
}

export const CRYPTO_CARD_COLORS = [
  {
    owner: 'ETH',
    starColor: 'text-bluePurple',
    gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
  },
  {
    owner: 'BTC',
    starColor: 'text-lightOrange',
    gradientColor: 'border-lightOrange/50 bg-black from-lightOrange/50 to-black',
  },
  {
    owner: 'LTC',
    starColor: 'text-lightGray2',
    gradientColor: 'border-lightGray2/50 bg-black from-lightGray2/50 to-black',
  },
  {
    owner: 'MATIC',
    starColor: 'text-lightPurple',
    gradientColor: 'border-lightPurple/50 bg-black from-lightPurple/50 to-black',
  },
  {
    owner: 'BNB',
    starColor: 'text-lightYellow',
    gradientColor: 'border-lightYellow/50 bg-black from-lightYellow/50 to-black',
  },
  {
    owner: 'SOL',
    starColor: 'text-lightPurple2',
    gradientColor: 'border-lightPurple2/50 from-lightPurple2/50 to-black',
  },
  {
    owner: 'SHIB',
    starColor: 'text-lightRed1',
    gradientColor: 'border-lightRed1/50 from-lightRed1/50 to-black',
  },
  {
    owner: 'DOT',
    starColor: 'text-lightPink',
    gradientColor: 'border-lightPink/50 from-lightPink/50 to-black',
  },
  {
    owner: 'ADA',
    starColor: 'text-lightGreen1',
    gradientColor: 'border-lightGreen1/50 from-lightGreen1/50 to-black',
  },
  {
    owner: 'AVAX',
    starColor: 'text-lightRed2',
    gradientColor: 'border-lightRed2/50 from-lightRed2/50 to-black',
  },
  {
    owner: 'Dai',
    starColor: 'text-lightOrange1',
    gradientColor: 'border-lightOrange1/50 from-lightOrange1/50 to-black',
  },
  {
    owner: 'MKR',
    starColor: 'text-lightGreen3',
    gradientColor: 'border-lightGreen3/50 from-lightGreen3/50 to-black',
  },
  {
    owner: 'XRP',
    starColor: 'text-lightGray4',
    gradientColor: 'border-lightGray4/50 from-lightGray4/50 to-black',
  },
  {
    owner: 'DOGE',
    starColor: 'text-lightYellow1',
    gradientColor: 'border-lightYellow1/50 from-lightYellow1/50 to-black',
  },
  {
    owner: 'UNI',
    starColor: 'text-lightPink1',
    gradientColor: 'border-lightPink1/50 from-lightPink1/50 to-black',
  },
  {
    owner: 'Flow',
    starColor: 'text-lightGreen4',
    gradientColor: 'border-lightGreen4/50 from-lightGreen4/50 to-black',
  },
];

export const TIDEBIT_BUTTON_CONFIG =
  'rounded px-5 py-2 text-base transition-all hover:opacity-90 text-white bg-tidebitTheme';

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

// export const delayedProcessModalDisappear = ({setProcessModalVisible = () => {}}) => {
//   setTimeout(() => setProcessModalVisible(false), 1000);
// };

import {Badges} from './badges';

// TODO: for future use, to leverage i18n needs to notice the `provider` range
export const UNIVERSAL_NUMBER_FORMAT_LOCALE = 'en-US';

export const TRANSFER_OPTIONS = [
  {label: 'USDT', content: 'Tether'},
  {label: 'ETH', content: 'ETH'},
  {label: 'BTC', content: 'BTC'},
  {label: 'USDC', content: 'USD Coin'},
  {label: 'DAI', content: 'DAI'},
  {label: 'BNB', content: 'BNB'},
  {label: 'BCH', content: 'BCH'},
  {label: 'LTC', content: 'LTC'},
  {label: 'ETC', content: 'ETC'},
  {label: 'USX', content: 'USX'},
  {label: 'NEO', content: 'NEO'},
  {label: 'EOS', content: 'EOS'},
];

export const BADGE_LIST = [
  {
    name: Badges.DAILY_TOP_20,
    title: 'LEADERBOARD_PAGE.BADGE_DAILY_TOP_20_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_DAILY_TOP_20_DESCRIPTION',
    icon: '/badges/daily_20@2x.png',
    iconSkeleton: '/badges/daily_20.svg',
  },
  {
    name: Badges.WEEKLY_TOP_20,
    title: 'LEADERBOARD_PAGE.BADGE_WEEKLY_TOP_20_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_WEEKLY_TOP_20_DESCRIPTION',
    icon: '/badges/weekly_20@2x.png',
    iconSkeleton: '/badges/weekly_20.svg',
  },
  {
    name: Badges.MONTHLY_TOP_20,
    title: 'LEADERBOARD_PAGE.BADGE_MONTHLY_TOP_20_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_MONTHLY_TOP_20_DESCRIPTION',
    icon: '/badges/monthly_20@2x.png',
    iconSkeleton: '/badges/monthly_20.svg',
  },
  {
    name: Badges.SHARING,
    title: 'LEADERBOARD_PAGE.BADGE_SHARING_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_SHARING_DESCRIPTION',
    icon: '/badges/sharing_badge@2x.png',
    iconSkeleton: '/badges/sharing_badge.svg',
  },
  {
    name: Badges.LINKED,
    title: 'LEADERBOARD_PAGE.BADGE_LINKED_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_LINKED_DESCRIPTION',
    icon: '/badges/linked_badge@2x.png',
    iconSkeleton: '/badges/linked_badge.svg',
  },
  {
    name: Badges.DEPOSIT,
    title: 'LEADERBOARD_PAGE.BADGE_DEPOSIT_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_DEPOSIT_DESCRIPTION',
    icon: '/badges/deposit_badge@2x.png',
    iconSkeleton: '/badges/deposit_badge.svg',
  },
  {
    name: Badges.BACHELOR,
    title: 'LEADERBOARD_PAGE.BADGE_BACHELOR_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_BACHELOR_DESCRIPTION',
    icon: '/badges/bachelor_badge@2x.png',
    iconSkeleton: '/badges/bachelor_badge.svg',
  },
  {
    name: Badges.MASTER,
    title: 'LEADERBOARD_PAGE.BADGE_MASTER_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_MASTER_DESCRIPTION',
    icon: '/badges/master_badge@2x.png',
    iconSkeleton: '/badges/master_badge.svg',
  },
  {
    name: Badges.DOCTOR,
    title: 'LEADERBOARD_PAGE.BADGE_DOCTOR_TITLE',
    description: 'LEADERBOARD_PAGE.BADGE_DOCTOR_DESCRIPTION',
    icon: '/badges/doctor_badge@2x.png',
    iconSkeleton: '/badges/doctor_badge.svg',
  },
];

export const LAYOUT_BREAKPOINT = 1024;

export const INITIAL_POSITION_LABEL_DISPLAYED_STATE = true;

export interface ICRYPTO_CARD_COLORS {
  label: string;
  starColor: string;
  gradientColor: string;
}

export const CRYPTO_CARD_COLORS = [
  {
    label: 'ETH',
    starColor: 'text-bluePurple',
    gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
  },
  {
    label: 'BTC',
    starColor: 'text-lightOrange',
    gradientColor: 'border-lightOrange/50 bg-black from-lightOrange/50 to-black',
  },
  {
    label: 'LTC',
    starColor: 'text-lightGray2',
    gradientColor: 'border-lightGray2/50 bg-black from-lightGray2/50 to-black',
  },
  {
    label: 'MATIC',
    starColor: 'text-lightPurple',
    gradientColor: 'border-lightPurple/50 bg-black from-lightPurple/50 to-black',
  },
  {
    label: 'BNB',
    starColor: 'text-lightYellow',
    gradientColor: 'border-lightYellow/50 bg-black from-lightYellow/50 to-black',
  },
  {
    label: 'SOL',
    starColor: 'text-lightPurple2',
    gradientColor: 'border-lightPurple2/50 from-lightPurple2/50 to-black',
  },
  {
    label: 'SHIB',
    starColor: 'text-lightRed1',
    gradientColor: 'border-lightRed1/50 from-lightRed1/50 to-black',
  },
  {
    label: 'DOT',
    starColor: 'text-lightPink',
    gradientColor: 'border-lightPink/50 from-lightPink/50 to-black',
  },
  {
    label: 'ADA',
    starColor: 'text-lightGreen1',
    gradientColor: 'border-lightGreen1/50 from-lightGreen1/50 to-black',
  },
  {
    label: 'AVAX',
    starColor: 'text-lightRed2',
    gradientColor: 'border-lightRed2/50 from-lightRed2/50 to-black',
  },
  {
    label: 'Dai',
    starColor: 'text-lightOrange1',
    gradientColor: 'border-lightOrange1/50 from-lightOrange1/50 to-black',
  },
  {
    label: 'MKR',
    starColor: 'text-lightGreen3',
    gradientColor: 'border-lightGreen3/50 from-lightGreen3/50 to-black',
  },
  {
    label: 'XRP',
    starColor: 'text-lightGray4',
    gradientColor: 'border-lightGray4/50 from-lightGray4/50 to-black',
  },
  {
    label: 'DOGE',
    starColor: 'text-lightYellow1',
    gradientColor: 'border-lightYellow1/50 from-lightYellow1/50 to-black',
  },
  {
    label: 'UNI',
    starColor: 'text-lightPink1',
    gradientColor: 'border-lightPink1/50 from-lightPink1/50 to-black',
  },
  {
    label: 'Flow',
    starColor: 'text-lightGreen4',
    gradientColor: 'border-lightGreen4/50 from-lightGreen4/50 to-black',
  },
];

export const TIDEBIT_BUTTON_CONFIG =
  'rounded px-5 py-2 text-base transition-all hover:opacity-90 text-white bg-tidebitTheme';

export const DELAYED_HIDDEN_SECONDS = 1000;

export const INPUT_VALIDATION_DELAY = 500;

export const TRADING_INPUT_STEP = 0.01;

export const TypeOfPnLColorHex = {
  PROFIT: '#17BF88',
  LOSS: '#E86D6D',
  TIDEBIT_THEME: '#29C1E1',
  EQUAL: '#8B8E91',
  LIQUIDATION: '#F8E71C',
};

export const TypeOfPnLColor = {
  PROFIT: 'text-lightGreen5',
  LOSS: 'text-lightRed',
  EQUAL: 'text-lightWhite',
};

export const TypeOfBorderColor = {
  PROFIT: 'border-lightGreen5',
  LOSS: 'border-lightRed',
  EQUAL: 'border-lightWhite',
};

export const TypeOfTransaction = {
  LONG: {
    TITLE: 'Up',
    SUBTITLE: '(Buy)',
  },
  SHORT: {
    TITLE: 'Down',
    SUBTITLE: '(Sell)',
  },
};

// Used to display dash line on `open position item` but failed
export const InvisibleStrokeColor = {
  DARK: '#161719',
  SAMPLE: '#A5C4F3',
  TRANSPARENT: '#A16171900',
};

export const SKELETON_DISPLAY_TIME = 1000;

export const TRADING_CHART_SWITCH_BUTTON_SIZE = 30;

export const OPEN_POSITION_LINE_GRAPH_WIDTH = '180';
export const OPEN_POSITION_LINE_LABEL_POSITION = 100;

export const TRADING_CHART_BORDER_COLOR = '#8B8E91';

export const EXAMPLE_BLUE_COLOR = '#92c5f7';

export const LIGHT_GRAY_COLOR = '#8B8E91';

export const LINE_GRAPH_STROKE_COLOR = {
  WHITE: '#FFFFFF',
  UP: '#17BF88',
  DOWN: '#E86D6D',
  TIDEBIT_THEME: '#29C1E1',
  LIGHT_GRAY: '#8B8E91',
  BLACK: '#000000',
};

export const MODAL_BUTTON_STYLE = {
  SOLID:
    'rounded border-0 whitespace-nowrap bg-tidebitTheme text-sm text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray',
  HOLLOW:
    'whitespace-nowrap rounded border border-tidebitTheme text-sm text-white transition-colors duration-300 focus:outline-none disabled:bg-lightGray',
};

export const DEFAULT_USER_AVATAR = '/leaderboard/default_avatar.svg';

export const DEFAULT_SELL_PRICE = 0;
export const DEFAULT_BUY_PRICE = 9999999999;
export const DEFAULT_LEVERAGE = 1;
export const DEFAULT_USER_BALANCE = 0;
export const DEFAULT_SPREAD = 0.001;
export const DEFAULT_EXPIRY_DATE = 1;
export const WIDTH_OF_SHARING_RECORD = 900;
export const BG_WIDTH_OF_SHARING_RECORD = 1200;
export const HEIGHT_OF_SHARING_RECORD = 600;
export const BG_HEIGHT_OF_SHARING_RECORD = 630;
export const DEFAULT_PRICE_CHANGE = 0;
export const DEFAULT_FLUCTUATION = 0;
export const DEFAULT_BALANCE = 0;
export const DEFAULT_PNL_DATA = {amount: {type: '', value: 0}, percentage: {type: '', value: 0}};
export const DEFAULT_INTEREST_RATE = 0;
export const DEFAULT_BEDGES = [
  {name: Badges.DAILY_TOP_20, receiveTime: 0, badgeId: ''},
  {name: Badges.WEEKLY_TOP_20, receiveTime: 0, badgeId: ''},
  {name: Badges.MONTHLY_TOP_20, receiveTime: 0, badgeId: ''},
  {name: Badges.SHARING, receiveTime: 0, badgeId: ''},
  {name: Badges.LINKED, receiveTime: 0, badgeId: ''},
  {name: Badges.DEPOSIT, receiveTime: 0, badgeId: ''},
  {name: Badges.BACHELOR, receiveTime: 0, badgeId: ''},
  {name: Badges.MASTER, receiveTime: 0, badgeId: ''},
  {name: Badges.DOCTOR, receiveTime: 0, badgeId: ''},
];

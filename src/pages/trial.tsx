import CryptoCard from '../components/card/crypto_card';
import OpenPositionItem from '../components/open_position_item/open_position_item';
import TrialComponent from '../components/trial_component/trial_component';
import TickerSelectorBox from '../components/ticker_selector_box/ticker_selector_box';
import useOuterClick from '../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import PositionLineGraph from '../components/position_line_graph/position_line_graph';
import RippleButton from '../components/ripple_button/ripple_button';
import TradingLineGraphChart from '../components/trading_line_graph_chart/trading_line_graph_chart';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Trial = () => {
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);

  // const tickerBoxClickHandler = () => {
  //   setTickerBoxVisible(!tickerBoxVisible);
  // };

  const notifyFunction = () => {
    const text = `Hello World`;
    return toast.info(`${text}`, {
      position: 'bottom-left',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'dark',
    });
  };

  // const flowTest = (
  //   <>
  //     <button
  //       data-tooltip-target="tooltip-top"
  //       data-tooltip-placement="top"
  //       type="button"
  //       className="mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mb-0"
  //     >
  //       Tooltip top
  //     </button>
  //     <div
  //       id="tooltip-top"
  //       role="tooltip"
  //       className="invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm dark:bg-gray-700"
  //     >
  //       Tooltip on top
  //       <div className="" data-popper-arrow></div>
  //     </div>
  //   </>
  // );

  // const rippleEffect = (
  //   <div className="flex justify-center space-x-2">
  //     <button
  //       type="button"
  //       data-mdb-ripple="true"
  //       data-mdb-ripple-color="light"
  //       className="inline-block rounded bg-blue-500 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
  //     >
  //       Button
  //     </button>
  //   </div>
  // );

  const TRADING_CRYPTO_DATA = [
    {
      currency: 'ETH',
      chain: 'Ethereum',
      star: true,
      starred: false,
      starColor: 'text-bluePurple',
      // getStarredStateCallback: getEthStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
      tokenImg: '/elements/group_2371.svg',
    },
    {
      currency: 'BTC',
      chain: 'Bitcoin',
      star: true,
      starred: false,
      starColor: 'text-lightOrange',
      // getStarredStateCallback: getBtcStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightOrange/50 bg-black from-lightOrange/50 to-black',
      tokenImg: '/elements/group_2372.svg',
    },
    {
      currency: 'LTC',
      chain: 'Litecoin',
      star: true,
      starred: false,
      starColor: 'text-lightGray2',
      // getStarredStateCallback: getLtcStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGray2/50 bg-black from-lightGray2/50 to-black',
      tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
    },
    {
      currency: 'MATIC',
      chain: 'Polygon',
      star: true,
      starred: false,
      starColor: 'text-lightPurple',
      // getStarredStateCallback: getMaticStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPurple/50 bg-black from-lightPurple/50 to-black',
      tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
    },
    {
      currency: 'BNB',
      chain: 'BNB',
      star: true,
      starred: false,
      starColor: 'text-lightYellow',
      // getStarredStateCallback: getBnbStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightYellow/50 bg-black from-lightYellow/50 to-black',
      tokenImg: '/elements/group_2374.svg',
    },
    {
      currency: 'SOL',
      chain: 'Solana',
      star: true,
      starred: false,
      starColor: 'text-lightPurple2',
      // getStarredStateCallback: getSolStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPurple2/50 from-lightPurple2/50 to-black',
      tokenImg: '/elements/group_2378.svg',
    },
    {
      currency: 'SHIB',
      chain: 'Shiba Inu',
      star: true,
      starred: false,
      starColor: 'text-lightRed1',
      // getStarredStateCallback: getShibStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightRed1/50 from-lightRed1/50 to-black',
      tokenImg: '/elements/group_2381.svg',
    },
    {
      currency: 'DOT',
      chain: 'Polkadot',
      star: true,
      starred: false,
      starColor: 'text-lightPink',
      // getStarredStateCallback: getDotStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPink/50 from-lightPink/50 to-black',
      tokenImg: '/elements/group_2385.svg',
    },
    {
      currency: 'ADA',
      chain: 'Cardano',
      star: true,
      starred: false,
      starColor: 'text-lightGreen1',
      // getStarredStateCallback: getAdaStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGreen1/50 from-lightGreen1/50 to-black',
      tokenImg: '/elements/group_2388.svg',
    },
    {
      currency: 'AVAX',
      chain: 'Avalanche',
      star: true,
      starred: false,
      starColor: 'text-lightRed2',
      // getStarredStateCallback: getAvaxStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightRed2/50 from-lightRed2/50 to-black',
      tokenImg: '/elements/group_2391.svg',
    },
    {
      currency: 'Dai',
      chain: 'Dai',
      star: true,
      starred: false,
      starColor: 'text-lightOrange1',
      // getStarredStateCallback: getDaiStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightOrange1/50 from-lightOrange1/50 to-black',
      tokenImg: '/elements/layer_x0020_1.svg',
    },
    {
      currency: 'MKR',
      chain: 'Maker',
      star: true,
      starred: false,
      starColor: 'text-lightGreen3',
      // getStarredStateCallback: getMkrStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGreen3/50 from-lightGreen3/50 to-black',
      tokenImg: '/elements/layer_2.svg',
    },
    {
      currency: 'XRP',
      chain: 'XRP',
      star: true,
      starred: false,
      starColor: 'text-lightGray4',
      // getStarredStateCallback: getXrpStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGray4/50 from-lightGray4/50 to-black',
      tokenImg: '/elements/group_2406.svg',
    },
    {
      currency: 'DOGE',
      chain: 'Dogecoin',
      star: true,
      starred: false,
      starColor: 'text-lightYellow1',
      // getStarredStateCallback: getDogeStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightYellow1/50 from-lightYellow1/50 to-black',
      tokenImg: '/elements/layer_2-1.svg',
    },
    {
      currency: 'UNI',
      chain: 'Uniswap',
      star: true,
      starred: false,
      starColor: 'text-lightPink1',
      // getStarredStateCallback: getUniStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPink1/50 from-lightPink1/50 to-black',
      tokenImg: '/elements/uniswap-uni-logo.svg',
    },
    {
      currency: 'Flow',
      chain: 'Flow',
      star: true,
      starred: false,
      starColor: 'text-lightGreen4',
      // getStarredStateCallback: getFlowStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGreen4/50 from-lightGreen4/50 to-black',
      tokenImg: '/elements/layer_2_1_.svg',
    },
  ];

  // const ALL_TRADING_CRYPTO_DATA_COMPONENTS = TRADING_CRYPTO_DATA.map((cryptoCard, index) => {
  //   return {
  //     label: cryptoCard.currency,
  //     content: (
  //       <CryptoCard
  //         key={index}
  //         star={cryptoCard.star}
  //         starColor={cryptoCard.starColor}
  //         starred={cryptoCard.starred}
  //         getStarredState={cryptoCard.getStarredStateCallback}
  //         chain={cryptoCard.chain}
  //         currency={cryptoCard.currency}
  //         price={cryptoCard.price}
  //         fluctuating={cryptoCard.fluctuating}
  //         gradientColor={cryptoCard.gradientColor}
  //         tokenImg={cryptoCard.tokenImg}
  //       />
  //     ),
  //   };
  // });
  const forCryptoCard = TRADING_CRYPTO_DATA.map((cryptoCard, index) => {
    return (
      <CryptoCard
        key={cryptoCard.currency}
        lineGraphProps={{
          lineGraphWidth: '150',
          lineGraphWidthMobile: '100',
          strokeColor: ['#627eea'],
          dataArray: [42, 50, 45, 55, 49, 52, 48, 68, 48, 20],
        }}
        star={cryptoCard.star}
        starColor={cryptoCard.starColor}
        starred={cryptoCard.starred}
        chain={cryptoCard.chain}
        currency={cryptoCard.currency}
        price={cryptoCard.price}
        fluctuating={cryptoCard.fluctuating}
        gradientColor={cryptoCard.gradientColor}
        tokenImg={cryptoCard.tokenImg}
      />
    );
  });

  return (
    <>
      {/* flex h-screen w-full items-center justify-center */}
      <div className="w-full space-y-10 p-10">
        {forCryptoCard}
        <TrialComponent />

        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
        <button
          onClick={notifyFunction}
          className="h-120px w-200px rounded border-0.5px border-lightGreen4/50 bg-lightGreen4 bg-gradient-to-b from-lightGreen4/50 to-black p-0 px-5 text-lightGreen4 opacity-90 shadow-lg"
        >
          Notify!
        </button>

        {/* <p className="text-lightGreen4">Hee</p> */}

        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
          limit={10}
        />
      </div>
    </>
  );
};

export default Trial;

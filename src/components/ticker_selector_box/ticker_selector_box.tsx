import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import Link from 'next/link';
import {useState} from 'react';
import CryptoCard from '../card/crypto_card';

interface ITickerSelectorBox {
  tickerSelectorBoxRef: React.RefObject<HTMLDivElement>;
  tickerSelectorBoxVisible: boolean;
  tickerSelectorBoxClickHandler: () => void;
}

// type ICryptoCardData = {
//   [key: string]: boolean | Horse;
// };

// const conforms: OnlyBoolsAndHorses = {
//   del: true,
//   rodney: false,
// };

// FIXME: no JSX in props
interface ICryptoCardData {
  currency: string;
  chain: string;
  star: boolean;
  starred: boolean;
  starColor: string;
  getStarredStateCallback: (bool: boolean) => void;
  price: number;
  fluctuating: number;
  gradientColor: string;
  tokenImg: string;
}

interface ICryptoCardDataArray {
  [index: number]: ICryptoCardData;
  // element: ICryptoCardData;
}

const TickerSelectorBox = ({
  tickerSelectorBoxRef: tickerSelectorBoxRef,
  tickerSelectorBoxVisible: tickerSelectorBoxVisible,
  tickerSelectorBoxClickHandler: tickerSelectorBoxClickHandler,
}: ITickerSelectorBox) => {
  // {name: '', component: ()}
  const defaultFavCrypto = [
    {
      label: '',
      content: <></>,
    },
  ];

  /**
   * {
    currency: string;
    chain: string;
    star: boolean;
    starred: boolean;
    starColor: string;
    getStarredStateCallback: (bool: boolean) => void;
    price: number;
    fluctuating: number;
    gradientColor: string;
    // tokenComponent: JSX.Element;
    tokenImg: string;
  }

   */

  const TRADING_CRYPTO_DATA: ICryptoCardData[] = [
    {
      currency: 'ETH',
      chain: 'Ethereum',
      star: true,
      starred: true,
      starColor: 'text-bluePurple',
      getStarredStateCallback: getEthStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
      tokenImg: '/elements/group_2371.svg',
    },
    {
      currency: 'BTC',
      chain: 'Bitcoin',
      star: true,
      starred: true,
      starColor: 'text-lightOrange',
      getStarredStateCallback: getBtcStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightOrange/50 bg-black from-lightOrange/50 to-black',
      tokenImg: '/elements/group_2372.svg',
    },
    {
      currency: 'LTC',
      chain: 'Litecoin',
      star: true,
      starred: true,
      starColor: 'text-lightGray2',
      getStarredStateCallback: getLtcStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGray2/50 bg-black from-lightGray2/50 to-black',
      tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
    },
    {
      currency: 'MATIC',
      chain: 'Polygon',
      star: true,
      starred: true,
      starColor: 'text-lightPurple',
      getStarredStateCallback: getMaticStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPurple/60 bg-black from-lightPurple/60 to-black',
      tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
    },
    {
      currency: 'BNB',
      chain: 'BNB',
      star: true,
      starred: true,
      starColor: 'text-lightYellow',
      getStarredStateCallback: getBnbStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightYellow/60 bg-black from-lightYellow/50 to-black',
      tokenImg: '/elements/group_2374.svg',
    },
    {
      currency: 'SOL',
      chain: 'Solana',
      star: true,
      starred: true,
      starColor: 'text-lightPurple2',
      getStarredStateCallback: getSolStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPurple2/60 from-lightPurple2/60 to-black',
      tokenImg: '/elements/group_2378.svg',
    },
    {
      currency: 'SHIB',
      chain: 'Shiba Inu',
      star: true,
      starred: true,
      starColor: 'text-lightRed1',
      getStarredStateCallback: getShibStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightRed1/50 from-lightRed1/50 to-black',
      tokenImg: '/elements/group_2381.svg',
    },
    {
      currency: 'DOT',
      chain: 'Polkadot',
      star: true,
      starred: true,
      starColor: 'text-lightPink',
      getStarredStateCallback: getDotStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPink/60 from-lightPink/60 to-black',
      tokenImg: '/elements/group_2385.svg',
    },
    {
      currency: 'ADA',
      chain: 'Cardano',
      star: true,
      starred: true,
      starColor: 'text-lightGreen1',
      getStarredStateCallback: getAdaStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGreen1/60 from-lightGreen1/60 to-black',
      tokenImg: '/elements/group_2388.svg',
    },
    {
      currency: 'AVAX',
      chain: 'Avalanche',
      star: true,
      starred: true,
      starColor: 'text-lightRed2',
      getStarredStateCallback: getAvaxStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightRed2/50 from-lightRed2/50 to-black',
      tokenImg: '/elements/group_2391.svg',
    },
    {
      currency: 'Dai',
      chain: 'Dai',
      star: true,
      starred: true,
      starColor: 'text-lightOrange1',
      getStarredStateCallback: getDaiStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightOrange1/50 from-lightOrange1/50 to-black',
      tokenImg: '/elements/layer_x0020_1.svg',
    },
    {
      currency: 'MKR',
      chain: 'Maker',
      star: true,
      starred: true,
      starColor: 'text-lightGreen3',
      getStarredStateCallback: getMkrStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGreen3/50 from-lightGreen3/50 to-black',
      tokenImg: '/elements/layer_2.svg',
    },
    {
      currency: 'XRP',
      chain: 'XRP',
      star: true,
      starred: true,
      starColor: 'text-lightGray4',
      getStarredStateCallback: getXrpStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGray4/50 from-lightGray4/50 to-black',
      tokenImg: '/elements/group_2406.svg',
    },
    {
      currency: 'DOGE',
      chain: 'Dogecoin',
      star: true,
      starred: true,
      starColor: 'text-lightYellow1',
      getStarredStateCallback: getDogeStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightYellow1/50 from-lightYellow1/50 to-black',
      tokenImg: '/elements/layer_2-1.svg',
    },
    {
      currency: 'UNI',
      chain: 'Uniswap',
      star: true,
      starred: true,
      starColor: 'text-lightPink1',
      getStarredStateCallback: getUniStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightPink1/50 from-lightPink1/50 to-black',
      tokenImg: '/elements/uniswap-uni-logo.svg',
    },
    {
      currency: 'Flow',
      chain: 'Flow',
      star: true,
      starred: true,
      starColor: 'text-lightGreen4',
      getStarredStateCallback: getFlowStarred,
      price: 1288.4,
      fluctuating: 1.14,
      gradientColor: 'border-lightGreen4/50 from-lightGreen4/50 to-black',
      tokenImg: '/elements/layer_2_1_.svg',
    },
  ];

  const TRADING_CRYPTO_DATA_COMPONENTS = TRADING_CRYPTO_DATA.map((cryptoCard, index) => {
    return {
      label: cryptoCard.currency,
      content: (
        <CryptoCard
          key={index}
          star={cryptoCard.star}
          starColor={cryptoCard.starColor}
          starred={cryptoCard.starred}
          getStarredState={cryptoCard.getStarredStateCallback}
          chain={cryptoCard.chain}
          currency={cryptoCard.currency}
          price={cryptoCard.price}
          fluctuating={cryptoCard.fluctuating}
          gradientColor={cryptoCard.gradientColor}
          tokenImg={cryptoCard.tokenImg}
        />
      ),
    };
  });

  // console.log('components:', TRADING_CRYPTO_DATA_COMPONENTS);

  // const allCryptoCards = [
  //   {
  //     label: 'ETH',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-bluePurple"
  //         starred={true}
  //         getStarredState={getEthStarred}
  //         className="mt-4 ml-4"
  //         chain="Ethereum"
  //         currency="ETH"
  //         price={1288.4}
  //         fluctuating={1.14}
  //         gradientColor="border-bluePurple/50 bg-black from-bluePurple/50 to-black"
  //        tokenImg="/elements/group_2371.svg" alt="eth" width={40} height={40} />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'BTC',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightOrange"
  //         starred={true}
  //         getStarredState={getBtcStarred}
  //         chain="Bitcoin"
  //         currency="BTC"
  //         price={19848.8}
  //         gradientColor="border-lightOrange/50 bg-black from-lightOrange/50 to-black"
  //         fluctuating={3.46}
  //        tokenImg="/elements/group_2372.svg" width={40} height={40} />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'LTC',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightGray2"
  //         starred={true}
  //         chain="Litecoin"
  //         currency="LTC"
  //         price={54.57}
  //         fluctuating={-3.46}
  //         gradientColor="border-lightGray2/50 bg-black from-lightGray2/50 to-black"
  //         tokenComponent={
  //           <img src="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg" alt="litecoin" />
  //         }
  //       />
  //     ),
  //   },
  //   {
  //     label: 'MATIC',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightPurple"
  //         starred={true}
  //         chain="Polygon"
  //         currency="MATIC"
  //         price={0.82}
  //         fluctuating={-6.23}
  //         gradientColor="border-lightPurple/60 bg-black from-lightPurple/60 to-black"
  //         tokenComponent={
  //           <img src="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg" alt="polygon" />
  //         }
  //       />
  //     ),
  //   },
  //   {
  //     label: 'BNB',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightYellow"
  //         starred={true}
  //         chain="BNB"
  //         currency="BNB"
  //         price={274.54}
  //         fluctuating={-6.23}
  //         gradientColor="border-lightYellow/60 bg-black from-lightYellow/50 to-black"
  //        tokenImg="/elements/group_2374.svg" alt="bnb" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'SOL',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightPurple2"
  //         starred={true}
  //         chain="Solana"
  //         currency="SOL"
  //         price={28.41}
  //         fluctuating={1.14}
  //         gradientColor="border-lightPurple2/60 from-lightPurple2/60 to-black"
  //        tokenImg="/elements/group_2378.svg" alt="solana" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'SHIB',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightRed1"
  //         starred={true}
  //         chain="Shiba Inu"
  //         currency="SHIB"
  //         price={0.0000099}
  //         fluctuating={-3.46}
  //         gradientColor="border-lightRed1/50 from-lightRed1/50 to-black"
  //        tokenImg="/elements/group_2381.svg" alt="shiba inu" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'DOT',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightPink"
  //         starred={true}
  //         chain="Polkadot"
  //         currency="DOT"
  //         price={5.92}
  //         fluctuating={3.46}
  //         gradientColor="border-lightPink/60 from-lightPink/60 to-black"
  //        tokenImg="/elements/group_2385.svg" alt="polkadot" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'ADA',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightGreen1"
  //         starred={true}
  //         chain="Cardano"
  //         currency="ADA"
  //         price={0.3611}
  //         fluctuating={1.14}
  //         gradientColor="border-lightGreen1/60 from-lightGreen1/60 to-black"
  //        tokenImg="/elements/group_2388.svg" alt="cardano" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'AVAX',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightRed2"
  //         starred={true}
  //         chain="Avalanche"
  //         price={15.77}
  //         currency="AVAX"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightRed2/50 from-lightRed2/50 to-black"
  //        tokenImg="/elements/group_2391.svg" alt="avax" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'Dai',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightOrange1"
  //         starred={true}
  //         chain="Dai"
  //         price={15.77}
  //         currency="Dai"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightOrange1/50 from-lightOrange1/50 to-black"
  //        tokenImg="/elements/layer_x0020_1.svg" alt="dai" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'MKR',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightGreen3"
  //         starred={true}
  //         chain="Maker"
  //         price={15.77}
  //         currency="MKR"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightGreen3/50 from-lightGreen3/50 to-black"
  //        tokenImg="/elements/layer_2.svg" alt="Maker" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'XRP',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightGray4"
  //         starred={true}
  //         chain="XRP"
  //         price={15.77}
  //         currency="XRP"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightGray4/50 from-lightGray4/50 to-black"
  //        tokenImg="/elements/group_2406.svg" alt="XRP" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'DOGE',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightYellow1"
  //         starred={true}
  //         chain="Dogecoin"
  //         price={15.77}
  //         currency="DOGE"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightYellow1/50 from-lightYellow1/50 to-black"
  //        tokenImg="/elements/layer_2-1.svg" alt="DOGE" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'UNI',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightPink1"
  //         starred={true}
  //         chain="Uniswap"
  //         price={15.77}
  //         currency="UNI"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightPink1/50 from-lightPink1/50 to-black"
  //        tokenImg="/elements/uniswap-uni-logo.svg" alt="Uniswap" />}
  //       />
  //     ),
  //   },
  //   {
  //     label: 'FLOW',
  //     content: (
  //       <CryptoCard
  //         star={true}
  //         starColor="text-lightGreen4"
  //         starred={true}
  //         chain="Flow"
  //         price={15.77}
  //         currency="FLOW"
  //         fluctuating={-6.23}
  //         gradientColor="border-lightGreen4/50 from-lightGreen4/50 to-black"
  //        tokenImg="/elements/layer_2_1_.svg" alt="avax" />}
  //       />
  //     ),
  //   },
  // ];

  const allCryptoCardsObject = {
    'ETH': (
      <CryptoCard
        star={true}
        starColor="text-bluePurple"
        starred={true}
        getStarredState={getEthStarred}
        className="mt-4 ml-4"
        chain="Ethereum"
        currency="ETH"
        price={1288.4}
        fluctuating={1.14}
        gradientColor="border-bluePurple/50 bg-black from-bluePurple/50 to-black"
        tokenImg="/elements/group_2371.svg"
      />
    ),
    'BTC': (
      <CryptoCard
        star={true}
        starColor="text-lightOrange"
        starred={true}
        getStarredState={getBtcStarred}
        chain="Bitcoin"
        currency="BTC"
        price={19848.8}
        gradientColor="border-lightOrange/50 bg-black from-lightOrange/50 to-black"
        fluctuating={3.46}
        tokenImg="/elements/group_2372.svg"
      />
    ),
    'LTC': (
      <CryptoCard
        star={true}
        starColor="text-lightGray2"
        starred={true}
        chain="Litecoin"
        currency="LTC"
        price={54.57}
        fluctuating={-3.46}
        gradientColor="border-lightGray2/50 bg-black from-lightGray2/50 to-black"
        tokenImg="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg"
      />
    ),
    'MATIC': (
      <CryptoCard
        star={true}
        starColor="text-lightPurple"
        starred={true}
        chain="Polygon"
        currency="MATIC"
        price={0.82}
        fluctuating={-6.23}
        gradientColor="border-lightPurple/60 bg-black from-lightPurple/60 to-black"
        tokenImg="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg"
      />
    ),
    'BNB': (
      <CryptoCard
        star={true}
        starColor="text-lightYellow"
        starred={true}
        chain="BNB"
        currency="BNB"
        price={274.54}
        fluctuating={-6.23}
        gradientColor="border-lightYellow/60 bg-black from-lightYellow/50 to-black"
        tokenImg="/elements/group_2374.svg"
      />
    ),
    'SOL': (
      <CryptoCard
        star={true}
        starColor="text-lightPurple2"
        starred={true}
        chain="Solana"
        currency="SOL"
        price={28.41}
        fluctuating={1.14}
        gradientColor="border-lightPurple2/60 from-lightPurple2/60 to-black"
        tokenImg="/elements/group_2378.svg"
      />
    ),
    'SHIB': (
      <CryptoCard
        star={true}
        starColor="text-lightRed1"
        starred={true}
        chain="Shiba Inu"
        currency="SHIB"
        price={0.0000099}
        fluctuating={-3.46}
        gradientColor="border-lightRed1/50 from-lightRed1/50 to-black"
        tokenImg="/elements/group_2381.svg"
      />
    ),
    'DOT': (
      <CryptoCard
        star={true}
        starColor="text-lightPink"
        starred={true}
        chain="Polkadot"
        currency="DOT"
        price={5.92}
        fluctuating={3.46}
        gradientColor="border-lightPink/60 from-lightPink/60 to-black"
        tokenImg="/elements/group_2385.svg"
      />
    ),
    'ADA': (
      <CryptoCard
        star={true}
        starColor="text-lightGreen1"
        starred={true}
        chain="Cardano"
        currency="ADA"
        price={0.3611}
        fluctuating={1.14}
        gradientColor="border-lightGreen1/60 from-lightGreen1/60 to-black"
        tokenImg="/elements/group_2388.svg"
      />
    ),
    'AVAX': (
      <CryptoCard
        star={true}
        starColor="text-lightRed2"
        starred={true}
        chain="Avalanche"
        price={15.77}
        currency="AVAX"
        fluctuating={-6.23}
        gradientColor="border-lightRed2/50 from-lightRed2/50 to-black"
        tokenImg="/elements/group_2391.svg"
      />
    ),
    'Dai': (
      <CryptoCard
        star={true}
        starColor="text-lightOrange1"
        starred={true}
        chain="Dai"
        price={15.77}
        currency="Dai"
        fluctuating={-6.23}
        gradientColor="border-lightOrange1/50 from-lightOrange1/50 to-black"
        tokenImg="/elements/layer_x0020_1.svg"
      />
    ),
    'MKR': (
      <CryptoCard
        star={true}
        starColor="text-lightGreen3"
        starred={true}
        chain="Maker"
        price={15.77}
        currency="MKR"
        fluctuating={-6.23}
        gradientColor="border-lightGreen3/50 from-lightGreen3/50 to-black"
        tokenImg="/elements/layer_2.svg"
      />
    ),
    'XRP': (
      <CryptoCard
        star={true}
        starColor="text-lightGray4"
        starred={true}
        chain="XRP"
        price={15.77}
        currency="XRP"
        fluctuating={-6.23}
        gradientColor="border-lightGray4/50 from-lightGray4/50 to-black"
        tokenImg="/elements/group_2406.svg"
      />
    ),
    'DOGE': (
      <CryptoCard
        star={true}
        starColor="text-lightYellow1"
        starred={true}
        chain="Dogecoin"
        price={15.77}
        currency="DOGE"
        fluctuating={-6.23}
        gradientColor="border-lightYellow1/50 from-lightYellow1/50 to-black"
        tokenImg="/elements/layer_2-1.svg"
      />
    ),
    'UNI': (
      <CryptoCard
        star={true}
        starColor="text-lightPink1"
        starred={true}
        chain="Uniswap"
        price={15.77}
        currency="UNI"
        fluctuating={-6.23}
        gradientColor="border-lightPink1/50 from-lightPink1/50 to-black"
        tokenImg="/elements/uniswap-uni-logo.svg"
      />
    ),
    'FLOW': (
      <CryptoCard
        star={true}
        starColor="text-lightGreen4"
        starred={true}
        chain="Flow"
        price={15.77}
        currency="FLOW"
        fluctuating={-6.23}
        gradientColor="border-lightGreen4/50 from-lightGreen4/50 to-black"
        tokenImg="/elements/layer_2_1_.svg"
      />
    ),
  };

  const [activeTab, setActiveTab] = useState('All');

  const [ethStarred, setEthStarred] = useState(false);
  const [btcStarred, setBtcStarred] = useState(false);
  const [ltcStarred, setLtcStarred] = useState(false);
  const [maticStarred, setMaticStarred] = useState(false);
  const [bnbStarred, setBnbStarred] = useState(false);
  const [solStarred, setSolStarred] = useState(false);
  const [shibStarred, setShibStarred] = useState(false);
  const [dotStarred, setDotStarred] = useState(false);
  const [adaStarred, setAdaStarred] = useState(false);
  const [avaxStarred, setAvaxStarred] = useState(false);
  const [daiStarred, setDaiStarred] = useState(false);
  const [mkrStarred, setMkrStarred] = useState(false);
  const [xrpStarred, setXrpStarred] = useState(false);
  const [dogeStarred, setDogeStarred] = useState(false);
  const [uniStarred, setUniStarred] = useState(false);
  const [flowStarred, setFlowStarred] = useState(false);

  const [favorites, setFavorites] = useState<{label: string; content: JSX.Element}[]>([]);

  const [searches, setSearches] = useState<string[]>([]);
  const baseFavoriteArray = ['BTC', 'DOGE', 'MKR'];
  // baseFavoriteArray= ['BTC', 'ETH', 'ADA', 'DOGE', 'XRP', 'DOT', 'UNI', 'FLOW', 'DAI', 'MKR', 'AVAX', 'SOL', 'BNB', 'MATIC', 'LTC', 'SHIB']
  // ['BTC', 'ETH', 'ADA', 'DOGE', 'XRP', 'DOT', 'UNI']

  const favoritesHandler = (cryptoClicked: string) => {
    // console.log('`favorite` object entries', Object.entries(favorites));
    // console.log(
    //   'all entries `TRADING_CRYPTO_DATA_COMPONENTS`[0] ',
    //   Object.entries(TRADING_CRYPTO_DATA_COMPONENTS)[0]
    // );
    // console.log(
    //   'all entries `TRADING_CRYPTO_DATA_COMPONENTS` ',
    //   Object.entries(TRADING_CRYPTO_DATA_COMPONENTS)
    // );
    // setFavorites([
    //   ...favorites,
    //   {label: cryptoClicked, content: Object.entries(TRADING_CRYPTO_DATA_COMPONENTS)[0]},
    // ]);
    // Avoid repeated favorites
    // if (!Object.entries(favorites)[0].includes(cryptoClicked)) {
    //   setFavorites([...favorites, {label:cryptoClicked, content: Object.keys(TRADING_CRYPTO_DATA_COMPONENTS)});
    //   // setFavorites([...favorites, [cryptoClicked]: allCryptoCardsObject[cryptoClicked]);
    // }
  };

  // const favoritesHandler = (cryptoClicked: string) => {
  //   // Avoid repeated favorites
  //   if (!favorites.includes(cryptoClicked)) {
  //     setFavorites([...favorites, cryptoClicked]);
  //     //  setFavorites(favorites => [...favorites, card]);
  //   } else {
  //     setFavorites(favorites.filter(favorite => favorite !== cryptoClicked));
  //   }
  // };

  //   const favoritesHandler = (cryptoClicked: string) => {
  // if (!Object.entries(favorites).includes(cryptoClicked)) {
  //       setFavorites([...favorites, [cryptoClicked]: allCryptoCardsObject[cryptoClicked]);
  // }
  //   }

  function getEthStarred(bool: boolean) {
    setEthStarred(bool);
    favoritesHandler('ETH');
    // setFavorites(previous => [...previous, {label: 'ETH', content: allCryptoCardsObject['ETH']}]);
    // favoritesHandler('ETH');

    // if (bool) {
    //   favoritesHandler('ETH');
    // }
    // setFavorites(previous => [...previous, 'ETH']);
    // console.log('string clicked: ', 'ETH');
    // console.log('favorites: ', favorites);
    // console.log('eth starred: ', bool);
  }

  function getBtcStarred(bool: boolean) {
    setBtcStarred(bool);
    favoritesHandler('BTC');
    // console.log('string clicked:', 'BTC');
    // console.log('favorites: ', favorites);
  }

  function getLtcStarred(bool: boolean) {
    setLtcStarred(bool);
  }

  function getMaticStarred(bool: boolean) {
    setMaticStarred(bool);
  }

  function getBnbStarred(bool: boolean) {
    setBnbStarred(bool);
  }

  function getSolStarred(bool: boolean) {
    setSolStarred(bool);
  }

  function getShibStarred(bool: boolean) {
    setShibStarred(bool);
  }

  function getDotStarred(bool: boolean) {
    setDotStarred(bool);
  }

  function getAdaStarred(bool: boolean) {
    setAdaStarred(bool);
  }

  function getAvaxStarred(bool: boolean) {
    setAvaxStarred(bool);
  }

  function getDaiStarred(bool: boolean) {
    setDaiStarred(bool);
  }

  function getMkrStarred(bool: boolean) {
    setMkrStarred(bool);
  }

  function getXrpStarred(bool: boolean) {
    setXrpStarred(bool);
  }

  function getDogeStarred(bool: boolean) {
    setDogeStarred(bool);
  }

  function getUniStarred(bool: boolean) {
    setUniStarred(bool);
  }

  function getFlowStarred(bool: boolean) {
    setFlowStarred(bool);
  }

  const allTabClickHandler = () => {
    setActiveTab('All');
  };

  const favoriteTabClickHandler = () => {
    setActiveTab('Favorite');
  };

  // const currentTab = activeTab === 'Trade' ? <TradeTab /> : <PositionTab />;

  // const favoriteCryptoCards = (
  //   <ul>
  //     {favoriteCryptocurrencies.map(cryptocurrency => (
  //       <li key={cryptocurrency}>{cryptocurrency}</li>
  //     ))}
  //   </ul>
  // );

  const activeAllTabStyle =
    activeTab == 'All' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const activeFavoriteTabStyle =
    activeTab == 'Favorite' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  // const displayedFavorites = favorites.map(favorite => favorite.content);
  const displayedFavorites = TRADING_CRYPTO_DATA_COMPONENTS.filter(
    (cryptoCard: {label: string; content: JSX.Element}) => {
      for (let j = 0; j < baseFavoriteArray.length; j++) {
        if (cryptoCard.label === baseFavoriteArray[j]) {
          return cryptoCard.label === baseFavoriteArray[j];
        }
      }
    }
  ).map((cryptoCard: {label: string; content: JSX.Element}, index) => {
    // if (cryptoCard.content.props.starred !== true) return <></>;
    if (index === 0) {
      return (
        <div key={index} className="mt-4 ml-4">
          {cryptoCard.content}
        </div>
      );
    }
    return <div key={index}>{cryptoCard.content}</div>;
  });

  // console.log('displayedFavorites', displayedFavorites);

  const displayedAllCryptoCards = (
    <>
      <CryptoCard
        star={true}
        starColor="text-bluePurple"
        starred={false}
        getStarredState={getEthStarred}
        className="mt-4 ml-4"
        chain="Ethereum"
        currency="ETH"
        price={1288.4}
        fluctuating={1.14}
        gradientColor="border-bluePurple/50 bg-black from-bluePurple/50 to-black"
        tokenImg="/elements/group_2371.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightOrange"
        starred={false}
        getStarredState={getBtcStarred}
        chain="Bitcoin"
        currency="BTC"
        price={19848.8}
        gradientColor="border-lightOrange/50 bg-black from-lightOrange/50 to-black"
        fluctuating={3.46}
        tokenImg="/elements/group_2372.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightGray2"
        starred={false}
        chain="Litecoin"
        currency="LTC"
        price={54.57}
        fluctuating={-3.46}
        gradientColor="border-lightGray2/50 bg-black from-lightGray2/50 to-black"
        tokenImg="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightPurple"
        starred={false}
        chain="Polygon"
        currency="MATIC"
        price={0.82}
        fluctuating={-6.23}
        gradientColor="border-lightPurple/60 bg-black from-lightPurple/60 to-black"
        tokenImg="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightYellow"
        starred={false}
        chain="BNB"
        currency="BNB"
        price={274.54}
        fluctuating={-6.23}
        gradientColor="border-lightYellow/60 bg-black from-lightYellow/50 to-black"
        tokenImg="/elements/group_2374.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightPurple2"
        starred={false}
        chain="Solana"
        currency="SOL"
        price={28.41}
        fluctuating={1.14}
        gradientColor="border-lightPurple2/60 from-lightPurple2/60 to-black"
        tokenImg="/elements/group_2378.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightRed1"
        starred={false}
        chain="Shiba Inu"
        currency="SHIB"
        price={0.0000099}
        fluctuating={-3.46}
        gradientColor="border-lightRed1/50 from-lightRed1/50 to-black"
        tokenImg="/elements/group_2381.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightPink"
        starred={false}
        chain="Polkadot"
        currency="DOT"
        price={5.92}
        fluctuating={3.46}
        gradientColor="border-lightPink/60 from-lightPink/60 to-black"
        tokenImg="/elements/group_2385.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightGreen1"
        starred={false}
        chain="Cardano"
        currency="ADA"
        price={0.3611}
        fluctuating={1.14}
        gradientColor="border-lightGreen1/60 from-lightGreen1/60 to-black"
        tokenImg="/elements/group_2388.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightRed2"
        starred={false}
        chain="Avalanche"
        price={15.77}
        currency="AVAX"
        fluctuating={-6.23}
        gradientColor="border-lightRed2/50 from-lightRed2/50 to-black"
        tokenImg="/elements/group_2391.svg"
      />

      <CryptoCard
        star={true}
        starColor="text-lightOrange1"
        starred={false}
        chain="Dai"
        price={15.77}
        currency="Dai"
        fluctuating={-6.23}
        gradientColor="border-lightOrange1/50 from-lightOrange1/50 to-black"
        tokenImg="/elements/layer_x0020_1.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightGreen3"
        starred={false}
        chain="Maker"
        price={15.77}
        currency="MKR"
        fluctuating={-6.23}
        gradientColor="border-lightGreen3/50 from-lightGreen3/50 to-black"
        tokenImg="/elements/layer_2.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightGray4"
        starred={false}
        chain="XRP"
        price={15.77}
        currency="XRP"
        fluctuating={-6.23}
        gradientColor="border-lightGray4/50 from-lightGray4/50 to-black"
        tokenImg="/elements/group_2406.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightYellow1"
        starred={false}
        chain="Dogecoin"
        price={15.77}
        currency="DOGE"
        fluctuating={-6.23}
        gradientColor="border-lightYellow1/50 from-lightYellow1/50 to-black"
        tokenImg="/elements/layer_2-1.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightPink1"
        starred={false}
        chain="Uniswap"
        price={15.77}
        currency="UNI"
        fluctuating={-6.23}
        gradientColor="border-lightPink1/50 from-lightPink1/50 to-black"
        tokenImg="/elements/uniswap-uni-logo.svg"
      />
      <CryptoCard
        star={true}
        starColor="text-lightGreen4"
        starred={false}
        chain="Flow"
        price={15.77}
        currency="FLOW"
        fluctuating={-6.23}
        gradientColor="border-lightGreen4/50 from-lightGreen4/50 to-black"
        tokenImg="/elements/layer_2_1_.svg"
      />
    </>
  );

  // displayedFavorites
  // TRADING_CRYPTO_DATA_COMPONENTS
  const displayedCryptoCards = activeTab === 'All' ? displayedAllCryptoCards : displayedFavorites;

  const searchIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24.984" viewBox="0 0 25 24.984">
      <g id="search" transform="translate(-5.993 -2.299)">
        <path
          id="Path_25775"
          data-name="Path 25775"
          d="M24.934,19.358a10.589,10.589,0,1,0-1.867,1.866l.057.06,5.61,5.611a1.323,1.323,0,1,0,1.872-1.872l-5.611-5.61q-.029-.029-.06-.056Zm-2.745-12.1a7.934,7.934,0,1,1-11.221,0,7.933,7.933,0,0,1,11.221,0Z"
          fill="#f2f2f2"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );

  const tabPart = (
    <>
      <div className="z-10 hidden w-1200px flex-wrap border-gray-200 text-center text-sm font-medium text-gray-400 xl:flex">
        <div className="pr-1">
          <button
            type="button"
            className={`${activeAllTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            onClick={allTabClickHandler}
          >
            All
          </button>
        </div>
        <div className="">
          <button
            type="button"
            onClick={favoriteTabClickHandler}
            className={`${activeFavoriteTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Favorite
          </button>
        </div>
        {/* <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Top
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Storage
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            DeFi
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Grayscale
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            GameFi
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Blockchain
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Layer 2
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-40px py-2 hover:cursor-pointer`}
          >
            Polkadot
          </button>
        </div> */}
      </div>
    </>
  );

  const isDisplayedTickerSelectorBox = tickerSelectorBoxVisible ? (
    <>
      <div className="fixed inset-0 z-50 hidden items-center justify-center overflow-x-auto overflow-y-auto outline-none backdrop-blur-sm focus:outline-none xl:flex">
        <div
          className="relative my-6 mx-auto min-w-fit"
          id="tickerSelectorModal"
          ref={tickerSelectorBoxRef}
        >
          {/* tab section */}
          <div className="">{tabPart}</div>
          {/* ticker cards section */}
          {/*content & panel*/}
          <div className="flex h-640px w-1200px flex-col rounded rounded-t-none border-0 bg-darkGray shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}

            {/* ----- body ----- */}
            {/* search section */}
            {/* <div>
              <div className="flex h-10 w-200px items-center justify-end rounded-md bg-darkGray2">
                {searchIcon}
              </div>
              <input
                placeholder="Email Address"
                type="text"
                id="email"
                name="email"
                className="block w-full rounded border border-white bg-darkGray py-1 px-3 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray"
              />
            </div> */}

            {/* `border border-gray-300` for input border */}
            <div className="relative mr-60px mt-5 mb-5">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center"></div>
              <input
                type="search"
                id="default-search"
                className="absolute right-0 block w-430px rounded-full bg-darkGray2 p-3 pl-10 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
                placeholder="Search Cryptocurrencies"
                required
              />
              <button
                type="button"
                className="absolute right-0 top-1 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-gray-700/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
              >
                {searchIcon}
              </button>
              {/* <button
                type="submit"
                className="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
              >
                Search
              </button> */}
            </div>

            {/* Card section */}
            <div className="flex flex-auto flex-col items-center pt-10">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <div className="flex w-full items-center justify-center">
                    {/* 多出來的高度不會出現y卷軸 */}
                    <div className="mb-5 grid grid-cols-5 space-y-4 space-x-4 overflow-x-hidden overflow-y-clip">
                      {displayedCryptoCards}
                      {/* <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedTickerSelectorBox}</div>;
};

export default TickerSelectorBox;

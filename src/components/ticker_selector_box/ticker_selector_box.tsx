import {ToastContainer, toast, ToastOptions, useToast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DEV_TOAST_CONFIG, PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';

import {useContext, useEffect, useState, useMemo} from 'react';
import CryptoCard, {ILineGraphProps} from '../card/crypto_card';

import {
  MarketContext,
  IMarketContext,
  IMarketProvider,
  ITickerData,
} from '../../lib/contexts/market_context';
import {UserContext, IUserContext} from '../../lib/contexts/user_context';

// TODO: useContext
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
  lineGraphProps: ILineGraphProps;
}

interface ICryptoCardDataArray {
  [index: number]: ICryptoCardData;
}

interface IToastType {
  // type: 'info' | 'success' | 'warning' | 'error' | 'default';
  message: string;
}

const TickerSelectorBox = ({
  tickerSelectorBoxRef: tickerSelectorBoxRef,
  tickerSelectorBoxVisible: tickerSelectorBoxVisible,
  tickerSelectorBoxClickHandler: tickerSelectorBoxClickHandler,
}: ITickerSelectorBox) => {
  const emitToast = ({message}: IToastType) => {
    return toast.info(`${message}`, {
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

  // // TODO: fix trial
  // const defaultFavCrypto = [
  //   {
  //     label: '',
  //     content: <></>,
  //   },
  // ];

  const {availableTickers} = useContext<IMarketContext>(MarketContext);
  const {user} = useContext(UserContext) as IUserContext;

  const [activeTab, setActiveTab] = useState('All');

  // const cryptoCards = useMemo(() => {
  //   if (activeTab === 'All') {
  //     return allCards;
  //   } else {
  //     return favorites;
  //   }
  // }, [activeTab, allCards, favorites]);

  // // TODO: fix trial
  // const cryptoCardsData = availableTickers?.map((each, index) => {
  //   return {
  //     ...each,
  //     getStarredStateCallback: (bool: boolean) => {
  //       // console.log(each.currency, 'clicked');
  //       // favoriteTickersHandler(each.currency);
  //     },
  //   };
  // });

  const cryptoCardsData = availableTickers
    ? availableTickers?.map((each, index) => {
        const addCallbackFunc = {
          ...each,
          getStarredStateCallback: (bool: boolean) => {
            // console.log(each.currency, 'clicked');
            // favoriteTickersHandler(each.currency);
          },
        };
        return addCallbackFunc;
      })
    : [];

  const favoriteTabCardsData = user?.favoriteTickers
    ?.filter(item => item.starred)
    ?.map((each, index) => {
      const addCallbackFunc = {
        ...each,
        getStarredStateCallback: (bool: boolean) => {
          // console.log(each.currency, 'clicked');
          // favoriteTickersHandler(each.currency);
        },
      };
      return addCallbackFunc;
    });

  const [favoritesSearches, setFavoritesSearches] = useState<string>();

  const [filteredFavorites, setFilteredFavorites] = useState<ICryptoCardData[] | undefined>(
    favoriteTabCardsData
  );

  const [searches, setSearches] = useState<string>();

  // TODO: fix trial
  const [filteredCards, setFilteredCards] = useState<ICryptoCardData[]>(cryptoCardsData);

  // const [filteredCards, setFilteredCards] = useState<ICryptoCardData[] | null>(cryptoCardsData);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value.toLocaleLowerCase();
    setSearches(searchString);

    // // 這樣寫，會顯示上一步的搜尋結果
    // const newSearchResult = TRADING_CRYPTO_DATA.filter(each => {
    //   return each.chain.toLocaleLowerCase().includes(searches || '');
    // });
    // setFilteredCards(newSearchResult);
  };

  // const testResult =

  // 搜尋完後關掉 ticker box 會顯示剛剛的搜尋結果但是input是空的 => input value={searches}
  useEffect(() => {
    if (activeTab === 'All') {
      const newSearchResult = cryptoCardsData.filter(each => {
        const result =
          each.chain.toLocaleLowerCase().includes(searches || '') ||
          each.currency.toLocaleLowerCase().includes(searches || '');
        return result;
      });

      setFilteredCards(newSearchResult);
    } else if (activeTab === 'Favorite') {
      const newSearchResult = favoriteTabCardsData?.filter(each => {
        const result =
          each.chain.toLocaleLowerCase().includes(searches || '') ||
          each.currency.toLocaleLowerCase().includes(searches || '');
        return result;
      });

      setFilteredFavorites(newSearchResult);
    }
  }, [searches, activeTab]);

  // console.log('newSearchResult:', newSearchResult);

  // const favoritesHandler = (index: number, bool: boolean) => {
  //   TRADING_CRYPTO_DATA[index].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // };

  // function getEthStarred(bool: boolean) {
  //   emitToast({message: 'ETH star clicked'});
  //   favoriteTickersHandler('ETH');
  //   // console.log(user && user[0].favoriteTickers);

  //   // TRADING_CRYPTO_DATA[0].starred = bool;
  //   TRADING_CRYPTO_DATA.find(each => each.currency === 'ETH')!.starred = bool;
  //   // console.log(
  //   //   'eth clicked',
  //   //   TRADING_CRYPTO_DATA.find(each => each.currency === 'ETH')
  //   // );

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  //   // user[0].favoriteTickers.find(each => each === 'ETH') ? user[0].favoriteTickers.splice(user[0].favoriteTickers.indexOf('ETH'), 1) : user[0].favoriteTickers.push('ETH');
  //   // if (user) {
  //   //   user[0].favoriteTickers.filter(each => each !== 'ETH');
  //   //   setUser(user.filter(attribute => attribute.favoriteTickers.filter(item => item !== 'ETH')));
  //   //   console.log(user[0].favoriteTickers);
  //   // }
  // }
  // // console.log('after clicking star:', user && user[0].favoriteTickers);

  // function getBtcStarred(bool: boolean) {
  //   emitToast({message: 'BTC star clicked'});
  //   favoriteTickersHandler('BTC');
  //   // console.log('user data: ', user[0]);

  //   TRADING_CRYPTO_DATA[1].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getLtcStarred(bool: boolean) {
  //   emitToast({message: 'LTC star clicked'});
  //   favoriteTickersHandler('LTC');

  //   TRADING_CRYPTO_DATA[2].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getMaticStarred(bool: boolean) {
  //   favoriteTickersHandler('MATIC');

  //   TRADING_CRYPTO_DATA[3].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getBnbStarred(bool: boolean) {
  //   favoriteTickersHandler('BNB');

  //   TRADING_CRYPTO_DATA[4].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getSolStarred(bool: boolean) {
  //   favoriteTickersHandler('SOL');

  //   TRADING_CRYPTO_DATA[5].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getShibStarred(bool: boolean) {
  //   favoriteTickersHandler('SHIB');

  //   TRADING_CRYPTO_DATA[6].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getDotStarred(bool: boolean) {
  //   favoriteTickersHandler('DOT');

  //   TRADING_CRYPTO_DATA[7].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getAdaStarred(bool: boolean) {
  //   favoriteTickersHandler('ADA');

  //   TRADING_CRYPTO_DATA[8].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getAvaxStarred(bool: boolean) {
  //   favoriteTickersHandler('AVAX');

  //   TRADING_CRYPTO_DATA[9].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getDaiStarred(bool: boolean) {
  //   favoriteTickersHandler('Dai');

  //   TRADING_CRYPTO_DATA[10].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getMkrStarred(bool: boolean) {
  //   favoriteTickersHandler('MKR');

  //   TRADING_CRYPTO_DATA[11].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getXrpStarred(bool: boolean) {
  //   favoriteTickersHandler('XRP');

  //   TRADING_CRYPTO_DATA[12].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getDogeStarred(bool: boolean) {
  //   favoriteTickersHandler('DOGE');

  //   TRADING_CRYPTO_DATA[13].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getUniStarred(bool: boolean) {
  //   favoriteTickersHandler('UNI');

  //   TRADING_CRYPTO_DATA[14].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  // function getFlowStarred(bool: boolean) {
  //   favoriteTickersHandler('Flow');

  //   TRADING_CRYPTO_DATA[15].starred = bool;

  //   setFavorites(() => {
  //     return TRADING_CRYPTO_DATA.filter(each => each.starred);
  //   });
  // }

  const allTabClickHandler = () => {
    setActiveTab('All');
  };

  const favoriteTabClickHandler = () => {
    setActiveTab('Favorite');
  };

  const activeAllTabStyle =
    activeTab == 'All' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const activeFavoriteTabStyle =
    activeTab == 'Favorite' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  // const cryptoCardData = {
  //   key: 0,
  //   currency: 'ETH',
  //   chain: 'Ethereum',
  //   star: true,
  //   starred: false,
  //   starColor: 'text-bluePurple',
  //   // getStarredStateCallback: getEthStarred,
  //   price: 1288.4,
  //   fluctuating: 1.14,
  //   gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
  //   tokenImg: '/elements/group_2371.svg',
  // };

  const displayedAllCryptoCards = filteredCards
    // .filter(each => {
    //   if (!availableTickers) return;

    //   // // TODO: Displaying the favorite tickers on all tab
    //   // if (user && user[0].favoriteTickers) {
    //   //   for (let i = 0; i < user[0].favoriteTickers.length; i++) {
    //   //     return user[0].favoriteTickers.find((fav: ITickerData) => fav.currency === each.currency);
    //   //     // if (each.currency === user[0].favoriteTickers.find((each: ICryptoCardData) => each)) {
    //   //     //   each.starred = true;
    //   //     //   return each;
    //   //     // }
    //   //   }
    //   // }

    //   // for (let i = 0; i < availableTickers.length; i++) {
    //   //   if (each.currency === (availableTickers && availableTickers[i])) {
    //   //     return each;
    //   //   }
    //   // }
    // })
    // TODO: fix trial
    ?.map((cryptoCard, i) => {
      if (i === 0) {
        return (
          <CryptoCard
            key={cryptoCard.currency}
            className="mt-4 ml-4"
            lineGraphProps={cryptoCard.lineGraphProps}
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
        );
      }

      return (
        <CryptoCard
          key={cryptoCard.currency}
          className="mt-1"
          lineGraphProps={cryptoCard.lineGraphProps}
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
      );
    });

  const displayedFavorites = filteredFavorites?.map((cryptoCard, i) => {
    if (cryptoCard.starred !== true) return;
    if (i === 0) {
      return (
        <CryptoCard
          key={cryptoCard.currency}
          className="mt-4 ml-4"
          lineGraphProps={cryptoCard.lineGraphProps}
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
      );
    }

    return (
      <CryptoCard
        key={cryptoCard.currency}
        className="mt-1"
        lineGraphProps={cryptoCard.lineGraphProps}
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
    );
  });

  // const displayedFavorites = filteredCards
  //   ?.filter(cryptoCard => {
  //     if (!user || !user.favoriteTickers) return;
  //     if (cryptoCard.starred !== true) return;

  //     // for (let i = 0; i < user[0].favoriteTickers.length; i++) {
  //     //   if (cryptoCard.currency === user[0].favoriteTickers[i]) {
  //     //     cryptoCard.starred = true;
  //     //     return [cryptoCard];
  //     //   }
  //     // }
  //   })
  //   ?.map((cryptoCard, i) => {
  //     if (cryptoCard.starred !== true) return;
  //     if (i === 0) {
  //       return (
  //         <CryptoCard
  //           key={i}
  //           className="mt-4 ml-4"
  //           lineGraphProps={cryptoCard.lineGraphProps}
  //           star={cryptoCard.star}
  //           starColor={cryptoCard.starColor}
  //           starred={true}
  //           getStarredState={cryptoCard.getStarredStateCallback}
  //           chain={cryptoCard.chain}
  //           currency={cryptoCard.currency}
  //           price={cryptoCard.price}
  //           fluctuating={cryptoCard.fluctuating}
  //           gradientColor={cryptoCard.gradientColor}
  //           tokenImg={cryptoCard.tokenImg}
  //         />
  //       );
  //     }

  //     return (
  //       <CryptoCard
  //         key={i}
  //         lineGraphProps={cryptoCard.lineGraphProps}
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
  //     );
  //   });

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
        {user ? (
          <div className="">
            <button
              type="button"
              onClick={favoriteTabClickHandler}
              className={`${activeFavoriteTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            >
              Favorite
            </button>
          </div>
        ) : (
          <></>
        )}

        {/* Other tabs */}
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
                value={searches}
                className="absolute right-0 block w-430px rounded-full bg-darkGray2 p-3 pl-10 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
                placeholder="Search Cryptocurrencies"
                required
                onChange={onSearchChange}
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

  return (
    <div>
      {isDisplayedTickerSelectorBox}
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
  );
};

export default TickerSelectorBox;

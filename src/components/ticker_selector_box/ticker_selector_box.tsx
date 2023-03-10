import {ToastContainer, toast, ToastOptions, useToast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CRYPTO_CARD_COLORS} from '../../constants/display';

import {useContext, useEffect, useState} from 'react';
import CryptoCard from '../crypto_card/crypto_card';
import {useTranslation} from 'next-i18next';
import {MarketContext, IMarketContext} from '../../contexts/market_context';
import {UserContext, IUserContext} from '../../contexts/user_context';
import {ILineGraphProps, ITickerData} from '../../interfaces/tidebit_defi_background/ticker_data';
import {useRouter} from 'next/router';
import eventEmitter, {ClickEvent} from '../../constants/tidebit_event';

type TranslateFunction = (s: string) => string;

// TODO: useContext
interface ITickerSelectorBox {
  tickerSelectorBoxRef: React.RefObject<HTMLDivElement>;
  tickerSelectorBoxVisible: boolean;
  tickerSelectorBoxClickHandler: () => void;
}

interface ICryptoCardData {
  currency: string;
  chain: string;
  star: boolean;
  starred: boolean;
  price: number;
  fluctuating: number;
  tokenImg: string;
  lineGraphProps: ILineGraphProps;

  // getStarredStateCallback: (bool: boolean) => void;

  starColor?: string;
  gradientColor?: string;
}

const TickerSelectorBox = ({
  tickerSelectorBoxRef: tickerSelectorBoxRef,
  tickerSelectorBoxVisible: tickerSelectorBoxVisible,
  tickerSelectorBoxClickHandler: tickerSelectorBoxClickHandler,
}: ITickerSelectorBox) => {
  const marketCtx = useContext<IMarketContext>(MarketContext);
  const userCtx = useContext(UserContext) as IUserContext;

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const router = useRouter();

  const [activeTab, setActiveTab] = useState('All');

  // const cryptoCards = useMemo(() => {
  //   if (activeTab === 'All') {
  //     return allCards;
  //   } else {
  //     return favorites;
  //   }
  // }, [activeTab, allCards, favorites]);

  const cardClickHandler = (route: string) => {
    tickerSelectorBoxClickHandler();
    routing(route);

    eventEmitter.emit(ClickEvent.TICKER_CHANGED, () => {
      // console.log('event emitted');
      return;
    });
  };

  const routing = (currency: string) => {
    const base = currency.toLocaleLowerCase();
    router.push(`/trade/cfd/${base}usdt`);
    // console.log(`/trade/cfd/${base}usdt`);
  };

  const convertTickersToCryptoCardsData = (availableTickers: ITickerData[]) => {
    const cryptoCardsData: ICryptoCardData[] = availableTickers?.map((each, index) => {
      const color = CRYPTO_CARD_COLORS.find(i => i.label === each.currency);
      const addCallbackFunc: ICryptoCardData = {
        ...each,
        // getStarredStateCallback: (bool: boolean) => {
        //   // `bool` 是從 Crypto Card 得到的最新的 starred 狀態，each.starred只是從 availableTickers 得到的初始 starred 狀態
        //   // console.log('if starred: ', each.starred, 'boolean: ', bool);
        //   if (bool) {
        //     userCtx.addFavorites(each.currency);
        //   } else {
        //     userCtx.removeFavorites(each.currency);
        //   }
        //   // console.log(each.currency, 'clicked');
        // },
        starColor: color?.starColor,
        gradientColor: color?.gradientColor,
      };
      return addCallbackFunc;
    });
    return cryptoCardsData;
  };

  // const addCallbackToCryptoCardsData = availableTickers?.map((each, index) => {
  //   const addCallbackFunc = {
  //     ...each,
  //     getStarredStateCallback: (bool: boolean) => {
  //       // `bool` 是從 Crypto Card 得到的最新的 starred 狀態，each.starred只是從 availableTickers 得到的初始 starred 狀態
  //       // console.log('if starred: ', each.starred, 'boolean: ', bool);
  //       if (bool) {
  //         addFavorites(each.currency);
  //       } else {
  //         removeFavorites(each.currency);
  //       }
  //       // console.log(each.currency, 'clicked');
  //     },
  //   };
  //   return addCallbackFunc;
  // });

  // const cryptoCardsData: ICryptoCardData[] = addCallbackToCryptoCardsData
  //   // .filter(item => CRYPTO_CARD_COLORS.some(i => i.label === item.currency))
  //   ?.map((each, index) => {
  //     const color = CRYPTO_CARD_COLORS.find(i => i.label === each.currency);
  //     return {
  //       ...each,
  //       starColor: color?.starColor,
  //       gradientColor: color?.gradientColor,
  //     };
  //   });

  // const cryptoCardsData: ICryptoCardData[] = convertTickersToCryptoCardsData(availableTickers);

  // console.log('cryptoCardsData in ticker selector box: ', cryptoCardsData);

  // const favoriteTabCardsData = cryptoCardsData.filter(cryptoCardData => cryptoCardData.starred);

  // const [favoritesSearches, setFavoritesSearches] = useState<string>();

  const [filteredFavorites, setFilteredFavorites] = useState<ICryptoCardData[] | undefined>(
    undefined
  );

  const [searches, setSearches] = useState<string>();

  const [filteredCards, setFilteredCards] = useState<ICryptoCardData[]>([]);

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

  useEffect(() => {
    const cryptoCardsData = convertTickersToCryptoCardsData(marketCtx.listAvailableTickers());
    // const updatedCard = {...cryptoCardsData, starred: false};
    // Log in and log out will clear the star
    const allCardsData = userCtx.enableServiceTerm
      ? cryptoCardsData
      : cryptoCardsData.map(card => ({...card, starred: false}));
    setFilteredCards(allCardsData);
    const favoriteTabCardsData = cryptoCardsData.filter(cryptoCardData => cryptoCardData.starred);
    setFilteredFavorites(favoriteTabCardsData);
  }, [userCtx.favoriteTickers, userCtx.enableServiceTerm]);

  useEffect(() => {
    const cryptoCardsData = convertTickersToCryptoCardsData(marketCtx.listAvailableTickers());
    if (activeTab === 'All') {
      const newSearchResult = cryptoCardsData.filter(each => {
        const result =
          each.chain.toLocaleLowerCase().includes(searches || '') ||
          each.currency.toLocaleLowerCase().includes(searches || '');
        return result;
      });

      setFilteredCards(newSearchResult);
    } else if (activeTab === 'Favorite') {
      const newSearchResult = cryptoCardsData?.filter(each => {
        const result =
          each.starred &&
          (each.chain.toLocaleLowerCase().includes(searches || '') ||
            each.currency.toLocaleLowerCase().includes(searches || ''));
        return result;
      });

      setFilteredFavorites(newSearchResult);
    }
  }, [searches, activeTab]);

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
    ?.map((cryptoCard, i) => {
      if (i === 0) {
        return (
          <CryptoCard
            key={cryptoCard.currency}
            cardClickHandler={() => cardClickHandler(cryptoCard.currency)}
            className="mt-4 ml-4"
            lineGraphProps={cryptoCard.lineGraphProps}
            star={cryptoCard.star}
            starColor={cryptoCard.starColor}
            starred={cryptoCard.starred}
            // getStarredState={cryptoCard.getStarredStateCallback}
            chain={cryptoCard.chain}
            currency={cryptoCard.currency}
            price={cryptoCard.price}
            fluctuating={cryptoCard.fluctuating}
            gradientColor={cryptoCard?.gradientColor ?? ''}
            tokenImg={cryptoCard.tokenImg}
          />
        );
      }

      return (
        <CryptoCard
          key={cryptoCard.currency}
          // cardClickHandler={() => {
          //   tickerSelectorBoxClickHandler();
          //   routing(cryptoCard.currency);
          // }}
          cardClickHandler={() => cardClickHandler(cryptoCard.currency)}
          className="mt-0"
          lineGraphProps={cryptoCard.lineGraphProps}
          star={cryptoCard.star}
          starColor={cryptoCard.starColor}
          starred={cryptoCard.starred}
          // getStarredState={cryptoCard.getStarredStateCallback}
          chain={cryptoCard.chain}
          currency={cryptoCard.currency}
          price={cryptoCard.price}
          fluctuating={cryptoCard.fluctuating}
          gradientColor={cryptoCard?.gradientColor ?? ''}
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
          // cardClickHandler={() => {
          //   tickerSelectorBoxClickHandler();
          //   routing(cryptoCard.currency);
          // }}
          cardClickHandler={() => cardClickHandler(cryptoCard.currency)}
          className="mt-4 ml-4"
          lineGraphProps={cryptoCard.lineGraphProps}
          star={cryptoCard.star}
          starColor={cryptoCard.starColor}
          starred={cryptoCard.starred}
          // getStarredState={cryptoCard.getStarredStateCallback}
          chain={cryptoCard.chain}
          currency={cryptoCard.currency}
          price={cryptoCard.price}
          fluctuating={cryptoCard.fluctuating}
          gradientColor={cryptoCard?.gradientColor ?? ''}
          tokenImg={cryptoCard.tokenImg}
        />
      );
    }

    return (
      <CryptoCard
        key={cryptoCard.currency}
        cardClickHandler={() => cardClickHandler(cryptoCard.currency)}
        // cardClickHandler={() => {
        //   tickerSelectorBoxClickHandler();
        //   routing(cryptoCard.currency);
        // }}
        className="mt-0"
        lineGraphProps={cryptoCard.lineGraphProps}
        star={cryptoCard.star}
        starColor={cryptoCard.starColor}
        starred={cryptoCard.starred}
        // getStarredState={cryptoCard.getStarredStateCallback}
        chain={cryptoCard.chain}
        currency={cryptoCard.currency}
        price={cryptoCard.price}
        fluctuating={cryptoCard.fluctuating}
        gradientColor={cryptoCard?.gradientColor ?? ''}
        tokenImg={cryptoCard.tokenImg}
      />
    );
  });

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
      <div className="z-10 hidden w-1200px flex-wrap border-gray-200 text-center text-sm font-medium text-gray-400 lg:flex">
        <div className="pr-1">
          <button
            type="button"
            className={`${activeAllTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            onClick={allTabClickHandler}
          >
            {t('trade_page.TickerSelectorTab_All')}
          </button>
        </div>
        {userCtx.enableServiceTerm ? (
          <div className="">
            <button
              type="button"
              onClick={favoriteTabClickHandler}
              className={`${activeFavoriteTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            >
              {t('trade_page.TickerSelectorTab_Favorite')}
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
      <div className="fixed inset-0 z-50 hidden items-center justify-center overflow-x-auto overflow-y-auto outline-none backdrop-blur-sm focus:outline-none lg:flex">
        {/* The position of the box */}
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

  return <div>{isDisplayedTickerSelectorBox}</div>;
};

export default TickerSelectorBox;

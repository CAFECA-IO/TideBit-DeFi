import {ToastContainer, toast, ToastOptions, useToast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CRYPTO_CARD_COLORS} from '../../constants/display';
import {CgSearch} from 'react-icons/cg';
import {useContext, useEffect, useState} from 'react';
import CryptoCard from '../crypto_card/crypto_card';
import {useTranslation} from 'next-i18next';
import {MarketContext, IMarketContext} from '../../contexts/market_context';
import {UserContext, IUserContext} from '../../contexts/user_context';
import {ILineGraphProps, ITickerData} from '../../interfaces/tidebit_defi_background/ticker_data';
import {useRouter} from 'next/router';
import {ClickEvent} from '../../constants/tidebit_event';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;

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
  const notificationCtx = useContext(NotificationContext);

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const router = useRouter();

  const [activeTab, setActiveTab] = useState('All');

  const cardClickHandler = (route: string) => {
    tickerSelectorBoxClickHandler();
    routing(route);

    notificationCtx.emitter.emit(ClickEvent.TICKER_CHANGED, () => {
      return;
    });
  };

  const routing = (currency: string) => {
    const base = currency.toLocaleLowerCase();
    router.push(`/trade/cfd/${base}usdt`);
  };

  const convertTickersToCryptoCardsData = (availableTickers: ITickerData[]) => {
    const cryptoCardsData: ICryptoCardData[] = availableTickers?.map((each, index) => {
      const color = CRYPTO_CARD_COLORS.find(i => i.label === each.currency);
      const addCallbackFunc: ICryptoCardData = {
        ...each,
        starColor: color?.starColor,
        gradientColor: color?.gradientColor,
      };
      return addCallbackFunc;
    });
    return cryptoCardsData;
  };

  const [filteredFavorites, setFilteredFavorites] = useState<ICryptoCardData[] | undefined>(
    undefined
  );

  const [searches, setSearches] = useState<string>();

  const [filteredCards, setFilteredCards] = useState<ICryptoCardData[]>([]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value.toLocaleLowerCase();
    setSearches(searchString);
  };

  useEffect(() => {
    if (tickerSelectorBoxVisible) {
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
    }
  }, [tickerSelectorBoxVisible, searches, activeTab, marketCtx.availableTickers]);

  const allTabClickHandler = () => {
    setActiveTab('All');
  };

  const favoriteTabClickHandler = () => {
    setActiveTab('Favorite');
  };

  const activeAllTabStyle =
    activeTab == 'All' ? 'bg-darkGray1 text-lightWhite' : 'bg-darkGray5 text-lightGray';

  const activeFavoriteTabStyle =
    activeTab == 'Favorite' ? 'bg-darkGray1 text-lightWhite' : 'bg-darkGray5 text-lightGray';

  const displayedAllCryptoCards = filteredCards?.map((cryptoCard, i) => {
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
        className="mt-0"
        lineGraphProps={cryptoCard.lineGraphProps}
        star={cryptoCard.star}
        starColor={cryptoCard.starColor}
        starred={cryptoCard.starred}
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
          cardClickHandler={() => cardClickHandler(cryptoCard.currency)}
          className="mt-4 ml-4"
          lineGraphProps={cryptoCard.lineGraphProps}
          star={cryptoCard.star}
          starColor={cryptoCard.starColor}
          starred={cryptoCard.starred}
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
        className="mt-0"
        lineGraphProps={cryptoCard.lineGraphProps}
        star={cryptoCard.star}
        starColor={cryptoCard.starColor}
        starred={cryptoCard.starred}
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

  const tabPart = (
    <>
      <div className="z-10 hidden w-90vw max-w-1200px flex-wrap border-gray-200 text-center text-sm font-medium text-gray-400 lg:flex">
        <div className="pr-1">
          <button
            type="button"
            className={`${activeAllTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            onClick={allTabClickHandler}
          >
            {t('TRADE_PAGE.TICKER_SELECTOR_TAB_ALL')}
          </button>
        </div>
        {userCtx.enableServiceTerm ? (
          <div className="">
            <button
              type="button"
              onClick={favoriteTabClickHandler}
              className={`${activeFavoriteTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            >
              {t('TRADE_PAGE.TICKER_SELECTOR_TAB_FAVORITE')}
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
          <div className="mx-auto flex h-640px w-90vw max-w-1200px flex-col rounded rounded-t-none border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}

            {/* ----- body ----- */}

            {/* `border border-gray-300` for input border */}
            <div className="relative mr-60px mt-5 mb-5">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center"></div>
              <input
                type="search"
                value={searches}
                className="absolute right-0 block w-430px rounded-full bg-darkGray2 p-3 pl-10 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
                placeholder={t('TRADE_PAGE.TICKER_SELECTOR_TAB_SEARCH_PLACEHOLDER')}
                required
                onChange={onSearchChange}
              />
              <button
                type="button"
                className="absolute right-0 top-px rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-gray-700/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
              >
                <CgSearch size={30} />
              </button>
            </div>

            {/* Card section */}
            <div className="flex flex-auto flex-col items-center pt-10">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <div className="flex w-full items-center justify-center">
                    {/* 多出來的高度不會出現y卷軸 */}
                    <div className="mb-5 grid grid-cols-4 space-y-4 space-x-4 overflow-x-hidden overflow-y-clip xl:grid-cols-5">
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

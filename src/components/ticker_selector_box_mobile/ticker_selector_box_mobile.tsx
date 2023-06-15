import {CRYPTO_CARD_COLORS} from '../../constants/display';
import {ImCross} from 'react-icons/im';
import {CgSearch} from 'react-icons/cg';
import {useContext, useEffect, useState} from 'react';
import CryptoCard from '../crypto_card/crypto_card';
import {MarketContext, IMarketContext} from '../../contexts/market_context';
import {UserContext, IUserContext} from '../../contexts/user_context';
import {useTranslation} from 'next-i18next';
import {ILineGraphProps, ITickerData} from '../../interfaces/tidebit_defi_background/ticker_data';
import {useRouter} from 'next/router';
import {ClickEvent} from '../../constants/tidebit_event';
import {NotificationContext} from '../../contexts/notification_context';
import {ICurrency} from '../../constants/currency';

type TranslateFunction = (s: string) => string;

interface ITickerSelectorBox {
  tickerSelectorBoxRef: React.RefObject<HTMLDivElement>;
  tickerSelectorBoxVisible: boolean;
  tickerSelectorBoxClickHandler: () => void;
}

interface ICryptoCardData {
  currency: ICurrency;
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

const TickerSelectorBoxMobile = ({
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
  const [menuOpen, setMenuOpen] = useState(false);

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
    const cryptoCardsData: ICryptoCardData[] = availableTickers?.map(each => {
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
            each.chain?.toLocaleLowerCase().includes(searches || '') ||
            each.currency?.toLocaleLowerCase().includes(searches || '');
          return result;
        });

        setFilteredCards(newSearchResult);
      } else if (activeTab === 'Favorite') {
        const newSearchResult = cryptoCardsData?.filter(each => {
          const result =
            each.starred &&
            (each.chain?.toLocaleLowerCase().includes(searches || '') ||
              each.currency?.toLocaleLowerCase().includes(searches || ''));
          return result;
        });

        setFilteredFavorites(newSearchResult);
      }
    }
  }, [tickerSelectorBoxVisible, searches, activeTab, marketCtx.listAvailableTickers()]);

  const allTabClickHandler = () => {
    setMenuOpen(false);
    setActiveTab('All');
  };

  const favoriteTabClickHandler = () => {
    setMenuOpen(false);
    setActiveTab('Favorite');
  };

  const dropdownMenuClickHandler = () => setMenuOpen(!menuOpen);

  const displayedAllCryptoCards = filteredCards?.map((cryptoCard, i) => {
    if (i === 0) {
      return (
        <CryptoCard
          key={cryptoCard.currency}
          cardClickHandler={() => cardClickHandler(cryptoCard.currency)}
          className="mt-4 ml-4"
          lineGraphProps={cryptoCard.lineGraphProps}
          star={true}
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
        star={true}
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
          star={true}
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
        star={true}
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

  const dropdownMenuText =
    activeTab === 'All'
      ? t('TRADE_PAGE.TICKER_SELECTOR_TAB_ALL')
      : t('TRADE_PAGE.TICKER_SELECTOR_TAB_FAVORITE');

  const tabPart = (
    <>
      <div className="mt-10 flex h-48px flex-col rounded-lg bg-darkGray8 text-base font-medium text-lightWhite">
        <button
          className="flex w-full items-center justify-between px-5 py-3 text-left"
          onClick={dropdownMenuClickHandler}
        >
          {dropdownMenuText}

          <div
            className={`h-10px w-10px border-b-2 border-r-2 border-lightWhite transition-all duration-200 ${
              menuOpen ? '-rotate-45' : 'rotate-45'
            }`}
          ></div>
        </button>

        <div
          className={`z-60 flex w-full flex-col bg-darkGray8 shadow-lg shadow-black/30 transition-all duration-200 ${
            menuOpen ? 'overflow-visible opacity-100' : 'overflow-hidden opacity-0'
          }`}
        >
          <button
            type="button"
            className={`inline-block px-5 py-3 text-left hover:cursor-pointer`}
            onClick={allTabClickHandler}
          >
            {t('TRADE_PAGE.TICKER_SELECTOR_TAB_ALL')}
          </button>

          {userCtx.enableServiceTerm ? (
            <button
              type="button"
              onClick={favoriteTabClickHandler}
              className={`inline-block px-5 py-3 text-left hover:cursor-pointer`}
            >
              {t('TRADE_PAGE.TICKER_SELECTOR_TAB_FAVORITE')}
            </button>
          ) : (
            <></>
          )}
          {/* Info: (20230427 - Julian) Other tabs */}
        </div>
      </div>
    </>
  );

  const isDisplayedTickerSelectorBox = tickerSelectorBoxVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* Info: (20230427 - Julian) The position of the box */}
        <div
          className="relative mx-auto my-10px min-w-fit"
          id="tickerSelectorModal"
          ref={tickerSelectorBoxRef}
        >
          {/* Info: (20230427 - Julian) ticker cards section */}
          <div className="flex h-95vh w-90vw flex-col items-center rounded-xl border-0 bg-darkGray1 px-4 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/* Info: (20230427 - Julian) header */}
            <button
              className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
              onClick={tickerSelectorBoxClickHandler}
            >
              <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                <ImCross />
              </span>
            </button>

            {/* Info: (20230427 - Julian) ----- body ----- */}

            {/* Info: (20230427 - Julian) tab section */}
            <div className="w-full">{tabPart}</div>

            <div className="relative mt-10 flex w-full">
              <input
                type="search"
                value={searches}
                className="block w-full rounded-full bg-darkGray2 p-3 pl-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
                placeholder={t('TRADE_PAGE.TICKER_SELECTOR_TAB_SEARCH_PLACEHOLDER')}
                required
                onChange={onSearchChange}
              />
              <button
                type="button"
                className="absolute top-0 right-0 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-gray-700/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
              >
                <CgSearch size={30} />
              </button>
            </div>

            {/* Info: (20230427 - Julian) Card section */}
            <div className="mt-10 flex h-7/10 flex-auto flex-col items-center justify-start sm:h-3/4">
              <div className="mb-5 mr-4 grid h-full auto-rows-min grid-cols-2 space-y-4 space-x-4 overflow-y-auto overflow-x-hidden md:grid-cols-3">
                {displayedCryptoCards}
              </div>
            </div>
            {/* Info: (20230427 - Julian) footer */}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedTickerSelectorBox}</div>;
};

export default TickerSelectorBoxMobile;

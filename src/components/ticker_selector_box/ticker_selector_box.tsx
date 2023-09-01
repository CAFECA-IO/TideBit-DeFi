import {CRYPTO_CARD_COLORS} from '../../constants/display';
import {CgSearch} from 'react-icons/cg';
import {useContext, useEffect, useMemo, useState} from 'react';
import CryptoCard from '../crypto_card/crypto_card';
import {useTranslation} from 'next-i18next';
import {MarketContext, IMarketContext} from '../../contexts/market_context';
import {UserContext, IUserContext} from '../../contexts/user_context';
import {ILineGraphProps, ITickerData} from '../../interfaces/tidebit_defi_background/ticker_data';
import {useRouter} from 'next/router';
import {ClickEvent} from '../../constants/tidebit_event';
import {NotificationContext} from '../../contexts/notification_context';
import {ICurrency} from '../../constants/currency';
import {ImCross} from 'react-icons/im';
import {LayoutAssertion} from '../../constants/layout_assertion';
import {useGlobal} from '../../contexts/global_context';

type TranslateFunction = (s: string) => string;

interface ITickerSelectorBox {
  tickerSelectorBoxRef: React.RefObject<HTMLDivElement>;
  tickerSelectorBoxVisible: boolean;
  tickerSelectorBoxClickHandler: () => void;
}

export interface ICryptoCardData {
  instId: string;
  currency: ICurrency;
  name: string;
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
  const globalCtx = useGlobal();

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

  const routing = (instId: string) => {
    const base = instId.toLocaleLowerCase();
    router.push(`/trade/cfd/${base}`);
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

  const [availableTickers, setAvailableTickers] = useState(marketCtx.listAvailableTickers());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setAvailableTickers(marketCtx.listAvailableTickers());
  }, [marketCtx]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value.toLocaleLowerCase();
    setSearches(searchString);
  };

  useEffect(() => {
    if (tickerSelectorBoxVisible) {
      const cryptoCardsData = convertTickersToCryptoCardsData(availableTickers);
      if (activeTab === 'All') {
        const newSearchResult = cryptoCardsData.filter(each => {
          const result =
            each.name?.toLocaleLowerCase().includes(searches || '') ||
            each.currency?.toLocaleLowerCase().includes(searches || '');
          return result;
        });

        setFilteredCards(newSearchResult);
      } else if (activeTab === 'Favorite') {
        const newSearchResult = cryptoCardsData?.filter(each => {
          const result =
            each.starred &&
            (each.name?.toLocaleLowerCase().includes(searches || '') ||
              each.currency?.toLocaleLowerCase().includes(searches || ''));
          return result;
        });

        setFilteredFavorites(newSearchResult);
      }
    }
  }, [tickerSelectorBoxVisible, searches, activeTab, availableTickers]);

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
          cardClickHandler={() => cardClickHandler(cryptoCard.instId)}
          className="mt-4 ml-4"
          instId={cryptoCard.instId}
          lineGraphProps={cryptoCard.lineGraphProps}
          star={true}
          starColor={cryptoCard.starColor}
          starred={cryptoCard.starred}
          chain={cryptoCard.name}
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
        cardClickHandler={() => cardClickHandler(cryptoCard.instId)}
        className="mt-0"
        instId={cryptoCard.instId}
        lineGraphProps={cryptoCard.lineGraphProps}
        star={true}
        starColor={cryptoCard.starColor}
        starred={cryptoCard.starred}
        chain={cryptoCard.name}
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
          cardClickHandler={() => cardClickHandler(cryptoCard.instId)}
          className="mt-4 ml-4"
          instId={cryptoCard.instId}
          lineGraphProps={cryptoCard.lineGraphProps}
          star={true}
          starColor={cryptoCard.starColor}
          starred={cryptoCard.starred}
          chain={cryptoCard.name}
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
        cardClickHandler={() => cardClickHandler(cryptoCard.instId)}
        className="mt-0"
        instId={cryptoCard.instId}
        lineGraphProps={cryptoCard.lineGraphProps}
        star={true}
        starColor={cryptoCard.starColor}
        starred={cryptoCard.starred}
        chain={cryptoCard.name}
        currency={cryptoCard.currency}
        price={cryptoCard.price}
        fluctuating={cryptoCard.fluctuating}
        gradientColor={cryptoCard?.gradientColor ?? ''}
        tokenImg={cryptoCard.tokenImg}
      />
    );
  });

  const displayedCryptoCards = activeTab === 'All' ? displayedAllCryptoCards : displayedFavorites;

  const dropdownMenuClickHandler = () => setMenuOpen(!menuOpen);

  const dropdownMenuText =
    activeTab === 'All'
      ? t('TRADE_PAGE.TICKER_SELECTOR_TAB_ALL')
      : t('TRADE_PAGE.TICKER_SELECTOR_TAB_FAVORITE');

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

  const tabPartMobile = (
    <>
      <div
        onClick={dropdownMenuClickHandler}
        className="mt-10 flex h-48px flex-col rounded-lg bg-darkGray8 text-base font-medium text-lightWhite"
      >
        <button className="flex w-full items-center justify-between px-5 py-3 text-left">
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
      <div className="fixed inset-0 z-80 hidden items-center justify-center overflow-x-auto overflow-y-auto outline-none backdrop-blur-sm focus:outline-none lg:flex">
        <div
          className="relative my-6 mx-auto min-w-fit"
          id="tickerSelectorModal"
          ref={tickerSelectorBoxRef}
        >
          {/* Info: tab section (20230620 - Shirley) */}
          <div className="">{tabPart}</div>

          {/* Info: ticker cards section (20230620 - Shirley) */}
          <div className="mx-auto flex h-640px w-90vw max-w-1200px flex-col rounded rounded-t-none border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/* Info: ----- body ----- (20230620 - Shirley) */}

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

            {/* Info: Card section (20230620 - Shirley) */}
            <div className="flex flex-auto flex-col items-center pt-10">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <div className="flex w-full items-center justify-center">
                    {/* Info: 多出來的高度不會出現y卷軸 (20230620 - Shirley) */}
                    <div className="mb-5 grid grid-cols-4 space-y-4 space-x-4 overflow-x-hidden overflow-y-clip xl:grid-cols-5">
                      {displayedCryptoCards}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  const isDisplayedTickerSelectorBoxMobile = tickerSelectorBoxVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
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
            <div className="w-full">{tabPartMobile}</div>

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
            <div className="mt-10 flex h-7/10 flex-auto flex-col items-center justify-center md:justify-start sm:h-3/4">
              <div className="mb-5 mr-2 grid h-full auto-rows-min grid-cols-2 space-y-4 space-x-2 md:space-x-4 overflow-y-auto overflow-x-hidden md:grid-cols-3">
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

  const desktopLayout = <>{isDisplayedTickerSelectorBox}</>;

  const mobileLayout = <>{isDisplayedTickerSelectorBoxMobile}</>;

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <div>{displayedLayout}</div>;
};

export default TickerSelectorBox;

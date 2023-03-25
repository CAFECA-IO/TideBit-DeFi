import {useState, Dispatch, SetStateAction, useCallback} from 'react';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import Image from 'next/image';
import DatePicker from '../date_picker/date_picker';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface IReceiptSearchProps {
  filteredTradingType: string;
  setFilteredTradingType: Dispatch<SetStateAction<string>>;
  searches: string;
  setSearches: Dispatch<SetStateAction<string>>;
}

const ReceiptSearch = ({
  filteredTradingType,
  setFilteredTradingType,
  searches,
  setSearches,
}: IReceiptSearchProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const currentDate = new Date();

  const [tradingTypeMenuOpen, setTradingTypeMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dateStart, setDateStart] = useState(
    new Date(
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} 08:00:00`
    )
  );
  const [dateEnd, setDateEnd] = useState(
    new Date(
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} 08:00:00`
    )
  );
  const [tickersSettings, setTickersSettings] = useState(null);

  const tradingTypeMenuText =
    filteredTradingType === OrderType.DEPOSIT
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')
      : filteredTradingType === OrderType.WITHDRAW
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_WITHDRAW')
      : filteredTradingType === OrderState.OPENING
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')
      : filteredTradingType === OrderState.CLOSED
      ? t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')
      : t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE');

  const dropMenuItemStyle = 'inline-block px-5 py-3 w-full text-left hover:cursor-pointer';

  const tradingTypeMenuClickHandler = () => {
    setTradingTypeMenuOpen(!tradingTypeMenuOpen);
  };

  const depositButtonClickHandler = () => {
    setFilteredTradingType(OrderType.DEPOSIT);
    setTradingTypeMenuOpen(false);
  };

  const withdrawButtonClickHandler = () => {
    setFilteredTradingType(OrderType.WITHDRAW);
    setTradingTypeMenuOpen(false);
  };

  const openPositionButtonClickHandler = () => {
    setFilteredTradingType(OrderState.OPENING);
    setTradingTypeMenuOpen(false);
  };

  const closePositionButtonClickHandler = () => {
    setFilteredTradingType(OrderState.CLOSED);
    setTradingTypeMenuOpen(false);
  };

  const allButtonClickHandler = () => {
    setFilteredTradingType('');
    setTradingTypeMenuOpen(false);
  };

  /* Todo: (20230316 - Julian) dateUpdateHandler #289 
  const dateStartUpdateHandler = useCallback(
    async (date:any) => {
      const newPage = 1;
      setPage(newPage);
      setIsLoading(true);
      setDateStart(date);
      const end = dateEnd.toISOString().substring(0, 10);
      const start = date.toISOString().substring(0, 10);
      let tickerSetting = tickersSettings[filterExchange][filterTicker];
      if (tickerSetting.source === SupportedExchange.OKEX) {
        const result = await storeCtx.getOuterTradesProfits({
          ticker: filterTicker,
          exchange: tickerSetting.source,
          start,
          end,
        });
        if (result.chartData) setChartData(result.chartData);
        else setChartData({ data: {}, xaxisType: "string" });
        setProfits(result.profits);
      }
      const trades = await getVouchers({
        ticker: filterTicker,
        exchange: tickerSetting.source,
        start,
        end,
        offset: 0,
        limit: limit,
      });
      if (tickerSetting.source === SupportedExchange.TIDEBIT) {
        if (trades.chartData) setChartData(trades.chartData);
        else setChartData({ data: {}, xaxisType: "string" });
        setProfits(trades.profits);
      }
      filter(trades, {});
      setIsLoading(false);
    },
    [
      dateEnd,
      filter,
      filterExchange,
      filterTicker,
      getVouchers,
      limit,
      storeCtx,
      tickersSettings,
    ]
  ); */

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value.toLocaleLowerCase();
    setSearches(searchString);
  };

  const displayedFilterBar = (
    <div className="hidden space-x-10 text-lightWhite sm:flex">
      {/* Info: (20230316 - Julian) Trading Type Dropdown Menu */}
      <div className="flex flex-col items-start">
        {t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')}
        <div className="relative mt-2 w-160px">
          <button
            className={`flex w-full items-center justify-between px-5 py-3 text-left text-lightGray4 transition-all duration-200 ease-in-out hover:cursor-pointer ${
              tradingTypeMenuOpen ? 'bg-darkGray2' : 'bg-darkGray7'
            }`}
            onClick={tradingTypeMenuClickHandler}
          >
            {tradingTypeMenuText}
            <span
              className={`absolute right-4 h-10px w-10px border-b-2 border-r-2 border-lightWhite transition-all duration-200 ease-in-out ${
                tradingTypeMenuOpen ? '-rotate-45' : 'rotate-45'
              }`}
            ></span>
          </button>

          {/* Info: (20230316 - Julian) Dropdown parts */}
          <div
            className={`absolute w-full flex-col items-start bg-darkGray2 transition-all duration-200 ease-in-out ${
              tradingTypeMenuOpen ? 'flex opacity-100' : 'hidden opacity-0'
            }`}
          >
            <button className={`${dropMenuItemStyle}`} onClick={allButtonClickHandler}>
              {t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_ALL')}
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={depositButtonClickHandler}>
              {t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')}
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={withdrawButtonClickHandler}>
              {t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_WITHDRAW')}
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={openPositionButtonClickHandler}>
              {t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')}
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={closePositionButtonClickHandler}>
              {t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')}
            </button>
          </div>
        </div>
      </div>

      {/* Info: (20230316 - Julian) Date Picker */}
      <div className="flex flex-col items-start">
        {t('MY_ASSETS_PAGE.RECEIPT_SECTION_DATE_TITLE')}
        {/* ToDo: (20230316 - Julian) DatePicker */}
        <div className="mt-2 flex items-center space-x-2">
          <DatePicker
            minDate={new Date(1)}
            /* setDate={dateStartUpdateHandler} */ maxDate={new Date(10)}
          />
          <p>{t('MY_ASSETS_PAGE.RECEIPT_SECTION_DATE_TO')}</p>
          <label>DatePicker</label>
        </div>
      </div>
    </div>
  );

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

  const displayedSearchBar = (
    <div className="relative w-300px">
      <input
        type="search"
        //value={searches}
        className="block w-full rounded-full bg-darkGray7 p-3 pl-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
        placeholder="Search"
        required
        onChange={onSearchChange}
      />
      <button
        type="button"
        className="absolute top-px right-1 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-gray-700/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
      >
        {searchIcon}
      </button>
    </div>
  );

  const displayedTicker = (
    <div className="flex items-center space-x-2">
      <Image
        src="/elements/tether-seeklogo.com.svg"
        width={50}
        height={50}
        alt="tether-seeklogo.com.svg"
      />
      <div className="flex flex-col items-start">
        <p className="text-xl">Tether</p>
        <p className="text-lg">USDT</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center sm:items-stretch">
      {displayedTicker}
      <div className="flex items-center justify-between py-6">
        {displayedFilterBar}
        {displayedSearchBar}
      </div>
    </div>
  );
};

export default ReceiptSearch;

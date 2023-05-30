import {useState, Dispatch, SetStateAction, useCallback} from 'react';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {CgSearch} from 'react-icons/cg';
import Image from 'next/image';
import DatePicker from '../date_picker/date_picker';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface IReceiptSearchProps {
  filteredTradingType: string;
  setFilteredTradingType: Dispatch<SetStateAction<string>>;
  setSearches: Dispatch<SetStateAction<string>>;
  filteredDate: string[];
  setFilteredDate: Dispatch<SetStateAction<string[]>>;
}

const currentDate = new Date();

const ReceiptSearch = ({
  filteredTradingType,
  setFilteredTradingType,
  setSearches,
  filteredDate,
  setFilteredDate,
}: IReceiptSearchProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [tradingTypeMenuOpen, setTradingTypeMenuOpen] = useState(false);
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
  //const [tickersSettings, setTickersSettings] = useState(null);

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

  /* Todo: (20230412 - Julian)
   * date to timestamp #289 */
  const dateStartUpdateHandler = useCallback(
    async (date: Date) => {
      setDateStart(date);
      const end = dateEnd.toISOString().substring(0, 10);
      const start = date.toISOString().substring(0, 10);

      setFilteredDate([start, end]);
    },
    [dateEnd, filteredDate]
  );

  const dateEndUpdateHandler = useCallback(
    async (date: Date) => {
      setDateEnd(date);
      const end = date.toISOString().substring(0, 10);
      const start = dateStart.toISOString().substring(0, 10);

      setFilteredDate([start, end]);
    },
    [dateStart, filteredDate]
  );

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
      {/*       <div className="flex flex-col items-start">
        {t('MY_ASSETS_PAGE.RECEIPT_SECTION_DATE_TITLE')}
        <div className="mt-2 flex items-center space-x-2">
          <DatePicker date={dateStart} setDate={dateStartUpdateHandler} maxDate={dateEnd} />
          <p>{t('MY_ASSETS_PAGE.RECEIPT_SECTION_DATE_TO')}</p>
          <DatePicker date={dateEnd} setDate={dateEndUpdateHandler} minDate={dateStart} />
        </div>
      </div> */}
    </div>
  );

  const displayedSearchBar = (
    <div className="relative w-300px">
      <input
        type="search"
        className="block w-full rounded-full bg-darkGray7 p-3 pl-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
        placeholder={t('MY_ASSETS_PAGE.RECEIPT_SECTION_SEARCH_PLACEHOLDER')}
        required
        onChange={onSearchChange}
      />
      <button
        type="button"
        className="absolute right-1 top-0 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white hover:text-gray-700/80 focus:outline-none focus:ring-0 focus:ring-blue-300"
      >
        <CgSearch size={30} />
      </button>
    </div>
  );

  const displayedTicker = (
    <div className="flex items-center space-x-2">
      <Image src="/asset_icon/usdt.svg" width={50} height={50} alt="USDT_icon" />
      <div className="flex flex-col items-start">
        <p className="text-xl">Tether</p>
        <p className="text-lg">USDT</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center sm:items-stretch">
      {/* displayedTicker */}
      <div className="flex items-center justify-between py-6">
        {displayedFilterBar}
        {displayedSearchBar}
      </div>
    </div>
  );
};

export default ReceiptSearch;

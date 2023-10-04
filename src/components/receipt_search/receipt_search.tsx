import {useState, Dispatch, SetStateAction, useCallback, useEffect} from 'react';
import {OrderType} from '../../constants/order_type';
import {OrderState} from '../../constants/order_state';
import {CgSearch} from 'react-icons/cg';
import DatePicker from '../date_picker/date_picker';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface IReceiptSearchProps {
  filteredTradingType: string;
  setFilteredTradingType: Dispatch<SetStateAction<string>>;
  setSearches: Dispatch<SetStateAction<string>>;
  filteredDate: {startTimeStamp: number; endTimeStamp: number};
  setFilteredDate: Dispatch<SetStateAction<{startTimeStamp: number; endTimeStamp: number}>>;
}

const currentDate = new Date();
const endDate =
  new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime() /
  1000;
const startDate = endDate - 86400 * 7;

const ReceiptSearch = ({
  filteredTradingType,
  setFilteredTradingType,
  setSearches,
  filteredDate,
  setFilteredDate,
}: IReceiptSearchProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [tradingTypeMenuOpen, setTradingTypeMenuOpen] = useState(false);
  const [dateStart, setDateStart] = useState(startDate);
  const [dateEnd, setDateEnd] = useState(endDate);

  // Info: (20230921 - Julian) Set default date to today
  useEffect(() => {
    setFilteredDate({
      startTimeStamp: startDate,
      endTimeStamp: endDate,
    });
  }, []);

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

  const dateStartUpdateHandler = useCallback(
    async (date: number) => {
      setDateStart(date);
      setFilteredDate({
        startTimeStamp: date,
        endTimeStamp: dateEnd,
      });
    },
    [dateEnd, filteredDate]
  );

  const dateEndUpdateHandler = useCallback(
    async (date: number) => {
      setDateEnd(date);
      setFilteredDate({
        startTimeStamp: dateStart,
        endTimeStamp: date,
      });
    },
    [dateStart, filteredDate]
  );

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value.toLocaleLowerCase();
    setSearches(searchString);
  };

  return (
    <div className="flex flex-col items-center sm:items-stretch">
      <div className="mb-12 grid w-full grid-cols-1 grid-rows-1 items-end gap-y-2 lg:grid-cols-4 lg:grid-rows-2">
        {/* Info: (20230921 - Julian) ------------- Text Row ------------- */}
        {/* Info: (20230921 - Julian) Trading Type Title */}
        <p className="hidden lg:block">{t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')}</p>
        {/* Info: (20230921 - Julian) Date Title */}
        <p className="hidden lg:block">{t('MY_ASSETS_PAGE.RECEIPT_SECTION_DATE_TITLE')}</p>
        {/* Info: (20230921 - Julian) Search Title (No text) */}
        <p className="col-span-2 hidden lg:block"></p>
        {/* Info: (20230921 - Julian) ------------- Function Row ------------- */}
        {/* Info: (20230921 - Julian) Trading Type Dropdown Menu */}
        <div className="relative mt-2 hidden w-160px lg:block">
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
        {/* Info: (20230921 - Julian) Date Picker */}
        <div className="mt-2 hidden items-center space-x-2 lg:flex">
          <DatePicker date={dateStart} setDate={dateStartUpdateHandler} maxDate={dateEnd} />
          <p>{t('MY_ASSETS_PAGE.RECEIPT_SECTION_DATE_TO')}</p>
          <DatePicker date={dateEnd} setDate={dateEndUpdateHandler} minDate={dateStart} />
        </div>
        {/* Info: (20230921 - Julian) Search Bar */}
        <div className="relative w-full lg:col-span-2 lg:ml-auto lg:w-300px">
          <input
            type="search"
            className="block w-full rounded-full bg-darkGray7 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
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
      </div>
    </div>
  );
};

export default ReceiptSearch;

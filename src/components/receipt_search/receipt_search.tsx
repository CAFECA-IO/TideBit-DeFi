import {useState} from 'react';
import Image from 'next/image';

/* ToDo: (20230316 - Julian) i18n */
const ReceiptSearch = () => {
  const [filteredTradingType, setFilteredTradingType] = useState('');
  const [tradingTypeMenuOpen, setTradingTypeMenuOpen] = useState(false);

  const tradingTypeMenuText =
    filteredTradingType === 'DEPOSIT'
      ? 'Deposit'
      : filteredTradingType === 'WITHDRAW'
      ? 'Withdraw'
      : filteredTradingType === 'OPEN_CFD'
      ? 'Open Position'
      : filteredTradingType === 'CLOSE_CFD'
      ? 'Close Position'
      : 'Trading Type';

  const dropMenuItemStyle = 'inline-block px-5 py-3 text-left hover:cursor-pointer';

  const tradingTypeMenuClickHandler = () => {
    setTradingTypeMenuOpen(!tradingTypeMenuOpen);
  };

  const depositButtonClickHandler = () => {
    setFilteredTradingType('DEPOSIT');
    setTradingTypeMenuOpen(false);
  };

  const withdrawButtonClickHandler = () => {
    setFilteredTradingType('WITHDRAW');
    setTradingTypeMenuOpen(false);
  };

  const openPositionButtonClickHandler = () => {
    setFilteredTradingType('OPEN_CFD');
    setTradingTypeMenuOpen(false);
  };

  const closePositionButtonClickHandler = () => {
    setFilteredTradingType('CLOSE_CFD');
    setTradingTypeMenuOpen(false);
  };

  /* ToDo: (20230316 - Julian) 錢包地址、金額，開票 */
  const displayedFilterBar = (
    <div className="hidden space-x-10 text-lightWhite sm:flex">
      {/* Info: (20230316 - Julian) Trading Type Dropdown Menu */}
      <div className="flex flex-col items-start">
        Trading Type
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
            <button className={`${dropMenuItemStyle}`} onClick={depositButtonClickHandler}>
              Deposit
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={withdrawButtonClickHandler}>
              Withdraw
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={openPositionButtonClickHandler}>
              Open Position
            </button>
            <button className={`${dropMenuItemStyle}`} onClick={closePositionButtonClickHandler}>
              Close Position
            </button>
          </div>
        </div>
      </div>

      {/* Info: (20230316 - Julian) Date Picker */}
      <div className="flex flex-col items-start">
        Date
        {/* ToDo: (20230316 - Julian) DatePicker */}
        <div className="mt-2 flex items-center space-x-2">
          <label>DatePicker</label>
          <p>TO</p>
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
        //onChange={onSearchChange}
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

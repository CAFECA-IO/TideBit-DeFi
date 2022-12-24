import {useState} from 'react';
import TradeTab from '../trade_tab/trade_tab';
import PositionTab from '../position_tab/position_tab';

const OrderSection = () => {
  const [activeTab, setActiveTab] = useState('Trade');

  const tradeTabClickHandler = () => {
    setActiveTab('Trade');
  };

  const positionTabClickHandler = () => {
    setActiveTab('Position');
  };

  const currentTab = activeTab === 'Trade' ? <TradeTab /> : <PositionTab />;

  const activeTradeTabStyle =
    activeTab == 'Trade' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const activePositionTabStyle =
    activeTab == 'Position' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <>
      <div className="z-10 flex flex-wrap border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="pr-1">
          <button
            type="button"
            className={`${activeTradeTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={tradeTabClickHandler}
          >
            Trade
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Position
          </button>
        </div>
      </div>
    </>
  );

  const displayedTab = (
    <>
      {/* tab section */}
      <div className="fixed top-70px right-0">{tabPart}</div>

      {/* trade or position section */}
      {currentTab}
    </>
  );
  return <>{displayedTab}</>;
};

export default OrderSection;

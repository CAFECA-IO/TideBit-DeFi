import {useContext, useState} from 'react';
import TradeTab from '../trade_tab/trade_tab';
import PositionTab from '../position_tab/position_tab';
import TradeSuspendedTab from '../trade_suspended_tab/trade_suspended_tab';
import TradeVisitorTab from '../trade_visitor_tab/trade_visitor_tab';
import {UserContext, IUserContext} from '../../lib/contexts/user_context';
import {MarketContext, IMarketContext} from '../../lib/contexts/market_context';
import PositionVisitorTab from '../position_visitor_tab/position_visitor_tab';

const OrderSection = () => {
  const {user} = useContext(UserContext);
  const {isCFDTradable} = useContext(MarketContext);

  const [activeTab, setActiveTab] = useState('Trade');

  // const [suspendTrade, setSuspendTrade] = useState(false);
  // const [dUser, setDUser] = useState(false);

  const tradeTabClickHandler = () => {
    setActiveTab('Trade');
  };

  const positionTabClickHandler = () => {
    setActiveTab('Position');
  };

  // TODO: position tab without login
  // const displayedPositionTab = user ? <PositionTab /> : <>need to login</>;

  const currentTab =
    activeTab === 'Position' ? (
      user ? (
        <PositionTab />
      ) : (
        <PositionVisitorTab />
      )
    ) : !isCFDTradable ? (
      <TradeSuspendedTab />
    ) : !user ? (
      <TradeVisitorTab />
    ) : (
      <TradeTab />
    );

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

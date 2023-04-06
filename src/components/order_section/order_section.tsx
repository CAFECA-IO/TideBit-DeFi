import {useContext, useState} from 'react';
import TradeTab from '../trade_tab/trade_tab';
import PositionTab from '../position_tab/position_tab';
import TradeSuspendedTab from '../trade_suspended_tab/trade_suspended_tab';
import TradeVisitorTab from '../trade_visitor_tab/trade_visitor_tab';
import {UserContext, IUserContext} from '../../contexts/user_context';
import {MarketContext, IMarketContext} from '../../contexts/market_context';
import PositionVisitorTab from '../position_visitor_tab/position_visitor_tab';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const OrderSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
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

  const currentTab =
    activeTab === 'Position' ? (
      userCtx.enableServiceTerm ? (
        <PositionTab />
      ) : (
        <PositionVisitorTab />
      )
    ) : !isCFDTradable ? (
      <TradeSuspendedTab />
    ) : !userCtx.enableServiceTerm ? (
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
      <div className="z-10 flex w-320px border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="mr-3px w-full">
          <button
            type="button"
            className={`${activeTradeTabStyle} inline-block w-full rounded-t-2xl px-60px py-2 hover:cursor-pointer`}
            onClick={tradeTabClickHandler}
          >
            {t('TRADE_PAGE.TRADE_TAB')}
          </button>
        </div>
        <div className="w-full">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block w-full rounded-t-2xl px-60px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            {t('TRADE_PAGE.POSITION_TAB')}
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

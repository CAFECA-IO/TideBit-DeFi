import {useContext, useState} from 'react';
import TradeTab from '../trade_tab/trade_tab';
import PositionTab from '../position_tab/position_tab';
import TradeSuspendedTab from '../trade_suspended_tab/trade_suspended_tab';
import TradeVisitorTab from '../trade_visitor_tab/trade_visitor_tab';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import PositionVisitorTab from '../position_visitor_tab/position_visitor_tab';
import {useTranslation} from 'next-i18next';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';
import {useGlobal} from '../../contexts/global_context';
import {LayoutAssertion} from '../../constants/layout_assertion';

type TranslateFunction = (s: string) => string;

export enum POSITION_TAB {
  OPEN = 'OPEN',
  HISTORY = 'HISTORY',
}

export enum ORDER_SECTION_TAB {
  TRADE = 'TRADE',
  POSITION = 'POSITION',
}

interface IOrderSection {
  hideOpenLineGraph?: boolean;
}

const OrderSection = (props: IOrderSection) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {isCFDTradable} = useContext(MarketContext);

  const [activeTab, setActiveTab] = useState(ORDER_SECTION_TAB.TRADE);

  const [positionActiveTab, setPositionActiveTab] = useState(POSITION_TAB.OPEN);
  const [showPositionMenu, setShowPositionMenu] = useState(false);

  const subMenuClickHandler = () => {
    setShowPositionMenu(!showPositionMenu);
  };

  const openTabClickHandler = () => {
    setPositionActiveTab(POSITION_TAB.OPEN);
  };

  const historyTabClickHandler = () => {
    setPositionActiveTab(POSITION_TAB.HISTORY);
  };

  const tradeTabClickHandler = () => {
    setActiveTab(ORDER_SECTION_TAB.TRADE);
  };

  const positionTabClickHandler = () => {
    setActiveTab(ORDER_SECTION_TAB.POSITION);
  };

  const currentTab =
    activeTab === ORDER_SECTION_TAB.POSITION ? (
      userCtx.enableServiceTerm ? (
        <PositionTab
          showSubMenu={showPositionMenu}
          subMenuClickHandler={subMenuClickHandler}
          activePositionTabMobile={positionActiveTab}
          openTabClickHandler={openTabClickHandler}
          historyTabClickHandler={historyTabClickHandler}
          hideOpenLineGraph={props?.hideOpenLineGraph}
        />
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

  const tradeTabStyle =
    activeTab == ORDER_SECTION_TAB.TRADE
      ? 'bg-darkGray7 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';
  const positionTabStyle =
    activeTab == ORDER_SECTION_TAB.POSITION
      ? 'bg-darkGray7 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const openTabStyle =
    positionActiveTab == POSITION_TAB.OPEN
      ? 'bg-darkGray8 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';
  const historyTabStyle =
    positionActiveTab == POSITION_TAB.HISTORY
      ? 'bg-darkGray8 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <>
      <div className="z-10 flex w-320px border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="mr-3px w-full">
          <button
            type="button"
            className={`${tradeTabStyle} inline-block w-full rounded-t-2xl px-40px py-2 hover:cursor-pointer`}
            onClick={tradeTabClickHandler}
          >
            {t('TRADE_PAGE.TRADE_TAB')}
          </button>
        </div>
        <div className="w-full">
          <button
            type="button"
            className={`${positionTabStyle} inline-block w-full rounded-t-2xl px-40px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            {t('TRADE_PAGE.POSITION_TAB')}
          </button>
        </div>
      </div>
    </>
  );

  const displayedPositionSubTab = showPositionMenu ? (
    <div
      className={`flex items-center ${'h-76px w-280px'} bg-darkGray transition-all duration-300`}
    >
      <ul className="ml-5 flex basis-full items-center text-center text-sm font-medium">
        <li className="w-full">
          <button
            onClick={openTabClickHandler}
            className={`${openTabStyle} inline-block w-full rounded-md px-7 py-3`}
          >
            {t('TRADE_PAGE.POSITION_TAB_OPEN')}
          </button>
        </li>
        <li className="ml-1 w-full">
          <button
            onClick={historyTabClickHandler}
            className={`${historyTabStyle} inline-block w-full rounded-md px-7 py-3`}
          >
            {t('TRADE_PAGE.POSITION_TAB_HISTORY')}
          </button>
        </li>
      </ul>
    </div>
  ) : (
    <TradeTab />
  );

  const displayedMobileTab = userCtx.enableServiceTerm ? (
    <div className="flex items-center">
      {displayedPositionSubTab}
      <div className="ml-4">
        <PositionTab
          showSubMenu={showPositionMenu}
          subMenuClickHandler={subMenuClickHandler}
          activePositionTabMobile={positionActiveTab}
          openTabClickHandler={openTabClickHandler}
          historyTabClickHandler={historyTabClickHandler}
          hideOpenLineGraph={props?.hideOpenLineGraph}
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="mr-10 text-center text-sm text-lightGray">
        {t('TRADE_PAGE.WALLET_CONNECT_DESCRIPTION_MOBILE')}
      </div>

      <WalletConnectButton className="px-5 py-2" />
    </div>
  );

  const desktopLayout = (
    <>
      <div className="fixed top-70px right-0">{tabPart}</div>
      {currentTab}
    </>
  );

  const mobileLayout = (
    <div
      className={`z-10 ${'h-76px'} fixed bottom-0 flex w-screen basis-full items-center justify-center bg-darkGray px-5 py-3`}
    >
      {displayedMobileTab}
    </div>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <>{displayedLayout}</>;
};

export default OrderSection;

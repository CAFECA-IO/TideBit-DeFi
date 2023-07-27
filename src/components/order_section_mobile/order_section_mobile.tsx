import {useContext, useState} from 'react';
import {UserContext} from '../../contexts/user_context';
import PositionTabMobile from '../position_tab_mobile/position_tab_mobile';
import TradeTabMobile from '../trade_tab_mobile/trade_tab_mobile';
import {useTranslation} from 'next-i18next';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';

type TranslateFunction = (s: string) => string;

const OrderSectionMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  const [positionActiveTab, setPositionActiveTab] = useState('Open');
  const [showPositionMenu, setShowPositionMenu] = useState(false);

  const activeOpenTabStyle =
    positionActiveTab == 'Open' ? 'bg-darkGray8 text-lightWhite' : 'bg-darkGray6 text-lightGray';
  const activeHistoryTabStyle =
    positionActiveTab == 'History' ? 'bg-darkGray8 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const openTabClickHandler = () => {
    setPositionActiveTab('Open');
  };

  const historyTabClickHandler = () => {
    setPositionActiveTab('History');
  };

  const displayedPositionSubTab = showPositionMenu ? (
    <div
      className={`flex items-center ${'h-76px w-280px'} bg-darkGray transition-all duration-300`}
    >
      <ul className="ml-5 flex basis-full items-center text-center text-sm font-medium">
        <li className="w-full">
          <button
            onClick={openTabClickHandler}
            className={`${activeOpenTabStyle} inline-block w-full rounded-md px-7 py-3`}
          >
            {t('TRADE_PAGE.POSITION_TAB_OPEN')}
          </button>
        </li>
        <li className="ml-1 w-full">
          <button
            onClick={historyTabClickHandler}
            className={`${activeHistoryTabStyle} inline-block w-full rounded-md px-7 py-3`}
          >
            {t('TRADE_PAGE.POSITION_TAB_HISTORY')}
          </button>
        </li>
      </ul>
    </div>
  ) : (
    <TradeTabMobile />
  );

  const displayedTab = userCtx.enableServiceTerm ? (
    <div className="flex items-center">
      {displayedPositionSubTab}
      <div className="ml-4">
        <PositionTabMobile
          showSubMenu={showPositionMenu}
          setShowSubMenu={setShowPositionMenu}
          activeTab={positionActiveTab}
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

  return (
    <div
      className={`z-10 ${'h-76px'} fixed bottom-0 flex w-screen basis-full items-center justify-center bg-darkGray px-5 py-3`}
    >
      {displayedTab}
    </div>
  );
};

export default OrderSectionMobile;

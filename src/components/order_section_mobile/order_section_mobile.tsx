import {useContext} from 'react';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import TideButton from '../tide_button/tide_button';
import PositionTabMobile from '../position_tab_mobile/position_tab_mobile';
import TradeTabMobile from '../trade_tab_mobile/trade_tab_mobile';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const OrderSectionMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  const btnClickHandler = () => {
    globalCtx.visibleWalletPanelHandler();
  };

  const displayedTab = userCtx.enableServiceTerm ? (
    <>
      <TradeTabMobile />
      <PositionTabMobile />
    </>
  ) : (
    <div className="flex items-center justify-center">
      <div className="text-center text-sm text-lightGray">
        {t('TRADE_PAGE.WALLET_CONNECT_DESCRIPTION_MOBILE')}
      </div>

      <TideButton
        onClick={btnClickHandler}
        className={`ml-10 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-all hover:opacity-90`}
      >
        {t('TRADE_PAGE.WALLET_CONNECT_BUTTON')}
      </TideButton>
    </div>
  );

  return (
    <div
      className={`${'h-76px'} fixed bottom-0 flex w-screen basis-full items-center justify-center bg-darkGray py-3 px-5`}
    >
      {displayedTab}
    </div>
  );
};

export default OrderSectionMobile;

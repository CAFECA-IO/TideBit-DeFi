import React, {useContext} from 'react';
import TideButton from '../tide_button/tide_button';
import {wait} from '../../lib/common';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {UserContext} from '../../contexts/user_context';

// Info: hook can be called only in function component (20230419 - Shirley)
export const WalletConnectButton = ({className}: {className?: string}) => {
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const wallectConnectBtnClickHandler = async () => {
    globalCtx.visibleSearchingModalHandler();

    await wait(DELAYED_HIDDEN_SECONDS);

    globalCtx.eliminateAllModals();

    if (userCtx.walletExtensions.length === 0) {
      globalCtx.dataFailedModalHandler({
        modalTitle: t('WALLET_PANEL.TITLE'),
        failedTitle: t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND1'),
        failedMsg: `${t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND2')} ${t(
          'WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND3'
        )} ${t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND5')}`,
        btnMsg: t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND4'),
      });

      globalCtx.visibleFailedModalHandler();
    } else {
      globalCtx.visibleWalletPanelHandler();
    }
  };

  return (
    <TideButton
      onClick={wallectConnectBtnClickHandler}
      className={`${className} rounded border-0 bg-tidebitTheme text-base text-white transition-all duration-300 hover:bg-cyan-600`}
    >
      {t('NAV_BAR.WALLET_CONNECT')}
    </TideButton>
  );
};

export const WalletConnectMobileButton = ({className}: {className?: string}) => {
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const wallectConnectBtnClickHandler = async () => {
    globalCtx.visibleSearchingModalHandler();

    await wait(DELAYED_HIDDEN_SECONDS);

    globalCtx.eliminateAllModals();

    if (userCtx.walletExtensions.length === 0) {
      globalCtx.dataFailedModalHandler({
        modalTitle: t('WALLET_PANEL.TITLE'),
        failedTitle: t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND1'),
        failedMsg: `${t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND2')} ${t(
          'WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND3'
        )} ${t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND5')}`,
        btnMsg: t('WALLET_PANEL.WALLET_EXTENSION_NOT_FOUND4'),
      });

      globalCtx.visibleFailedModalHandler();
    } else {
      globalCtx.visibleWalletPanelHandler();
    }
  };
  return (
    <TideButton
      onClick={wallectConnectBtnClickHandler}
      className={`${className} rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-all hover:opacity-90`}
    >
      {t('TRADE_PAGE.WALLET_CONNECT_BUTTON')}
    </TideButton>
  );
};

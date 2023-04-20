import {useContext, useState} from 'react';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useTranslation} from 'react-i18next';
import {wait} from '../common';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';

const useScanProcess = () => {
  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [scanned, setScanned] = useState(false);

  const scanProcess = async () => {
    if (scanned) {
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
    } else {
      setScanned(true);
      globalCtx.visibleSearchingModalHandler();

      await wait(DELAYED_HIDDEN_SECONDS / 2);

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
    }
  };

  return {scanned, setScanned, scanProcess};
};

export default useScanProcess;

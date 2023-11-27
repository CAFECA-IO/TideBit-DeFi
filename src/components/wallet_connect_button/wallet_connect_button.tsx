import React from 'react';
import TideButton from '../tide_button/tide_button';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import useScanProcess from '../../lib/hooks/use_scan_process';

export const WalletConnectButton = ({id, className}: {id?: string; className?: string}) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {scanProcess} = useScanProcess();

  return (
    <TideButton
      id={id ?? 'WalletConnectButton'}
      onClick={scanProcess}
      className={`${className} rounded border-0 bg-tidebitTheme text-base text-white transition-all duration-300 hover:bg-cyan-600`}
    >
      {t('NAV_BAR.WALLET_CONNECT')}
    </TideButton>
  );
};

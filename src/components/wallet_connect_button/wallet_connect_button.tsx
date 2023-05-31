import React, {useContext, useEffect, useState} from 'react';
import TideButton from '../tide_button/tide_button';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import useScanProcess from '../../lib/hooks/use_scan_process';

export const WalletConnectButton = ({className}: {className?: string}) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {scanned, setScanned, scanProcess} = useScanProcess();

  return (
    <TideButton
      onClick={scanProcess}
      className={`${className} rounded border-0 bg-tidebitTheme text-base text-white transition-all duration-300 hover:bg-cyan-600`}
    >
      {t('NAV_BAR.WALLET_CONNECT')}
    </TideButton>
  );
};

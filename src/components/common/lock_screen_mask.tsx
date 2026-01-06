'use client';

import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { useIdleTimer } from '@/lib/hooks/use_idle_timer';
import { Button } from '@/components/common/button';

const LockScreenMask: React.FC = () => {
  const [isLocked, setIsLocked] = useState<boolean>(true);

  const IDLE_TIME = 5 * 60 * 1000; // Info: (20251215 - Julian) 5 分鐘

  const unlockScreen = () => setIsLocked(false);
  const lockScreen = () => setIsLocked(true);

  // Info: (20251215 - Julian) 使用 useIdleTimer 監測閒置時間，超過指定時間後鎖定螢幕
  useIdleTimer(IDLE_TIME, lockScreen);

  return (
    isLocked && (
      <div className="fixed z-lock-screen flex size-full min-h-screen w-screen flex-col items-center justify-center bg-surface-neutral-mask backdrop-blur-lg">
        <div className="flex w-250px flex-col items-center justify-center gap-50px">
          <FiLock size={80} className="text-icon-neutral-primary" />
          <Button type="button" className="w-full" onClick={unlockScreen}>
            Unlock the screen
          </Button>
        </div>
      </div>
    )
  );
};

export default LockScreenMask;

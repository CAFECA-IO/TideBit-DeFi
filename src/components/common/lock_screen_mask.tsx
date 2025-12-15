'use client';

import React, { useState, useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import { Button } from '@/components/common/button';

export function useIdleTimer(timeout = 5 * 60 * 1000, onIdle: () => void) {
  useEffect(() => {
    let timer: number;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = window.setTimeout(onIdle, timeout);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onIdle]);
}

const LockScreenMask: React.FC = () => {
  const [isLocked, setIsLocked] = useState<boolean>(true);

  // const IDLE_TIME = 5 * 60 * 1000; // Info: (20251215 - Julian) 5 分鐘
  const IDLE_TIME = 3 * 1000; // Info: (20240624 - Julian) 3 秒鐘 for demo

  const unlockScreen = () => setIsLocked(false);
  const lockScreen = () => setIsLocked(true);

  useIdleTimer(IDLE_TIME, lockScreen);

  return (
    isLocked && (
      <div className="z-lock-screen min-w-screen fixed flex size-full min-h-screen flex-col items-center justify-center bg-surface-neutral-mask backdrop-blur-lg">
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

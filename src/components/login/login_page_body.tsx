'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/common/button';

const LoginPageBody: React.FC<{ toggleTosModal: () => void }> = ({ toggleTosModal }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const [isShowLogo, setIsShowLogo] = useState<boolean>(false);

  useEffect(() => {
    if (!logoRef.current) return;
    const timer = setTimeout(() => {
      setIsShowLogo(true);
    }, 100); // Info: (20251215 - Julian) 延遲 0.1 秒顯示內容

    return () => clearTimeout(timer); // Info: (20251215 - Julian) 清除計時器以防止記憶體洩漏
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col gap-100px">
        {/* Info: (20251215 - Julian) TBD Logo */}
        <div
          ref={logoRef}
          className={`${isShowLogo ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} origin-top transition-all duration-700 ease-out`}
        >
          <div className="relative">
            {/* Info: (20251215 - Julian) Logo 光暈效果 */}
            <div className="absolute z-0 size-full rounded-radius-rounded bg-gradient-to-r from-logo-gradient-0 to-logo-gradient-100 opacity-30 blur-3xl"></div>
            {/* Info: (20251215 - Julian) Logo 圖片 */}
            <Image
              src={'/logo/tbd_large_logo.svg'}
              alt="TBD Logo"
              width={250}
              height={300}
              className="relative z-10 shrink-0"
            />
          </div>
        </div>

        {/* Info: (20251215 - Julian) Buttons */}
        <div className="flex flex-col gap-spacing-lv-0 transition-all duration-300 ease-in-out">
          <Button type="button">Login</Button>
          <Button type="button" variant="borderless" onClick={toggleTosModal}>
            I don&apos;t have an account yet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPageBody;

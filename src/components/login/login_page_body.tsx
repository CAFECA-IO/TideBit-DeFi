'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/common/button';

const LoginPageBody: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col gap-100px">
        {/* Info: (20251215 - Julian) TBD Logo */}
        <div className="shrink-0">
          <Image src={'/logo/tbd_large_logo.svg'} alt="TBD Logo" width={250} height={300} />
        </div>

        {/* Info: (20251215 - Julian) Buttons */}
        <div className="flex flex-col gap-spacing-lv-0">
          <Button type="button">Login</Button>
          <Button type="button" variant="borderless">
            I don&apos;t have an account yet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPageBody;

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { useGlobalCtx } from '@/contexts/global_context';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, sidebarToggleHandler } = useGlobalCtx();

  const header = isSidebarOpen ? (
    <div className="flex items-center justify-between">
      <Link href={'/'}>
        <Image src="/logo/horizontal_logo.svg" width={135} height={40} alt="tidebit_logo" />
      </Link>
      <button
        type="button"
        onClick={sidebarToggleHandler}
        className="p-spacing-lv-0 text-button-neutral-filled-on-neutral-default"
      >
        <TbLayoutSidebarLeftCollapse size={24} />
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={sidebarToggleHandler}
      className="p-spacing-lv-0 text-button-neutral-filled-on-neutral-default"
    >
      <TbLayoutSidebarRightCollapse size={24} />
    </button>
  );

  // ToDo: (20251219 - Julian) During Development
  const body = isSidebarOpen ? <div></div> : null;

  return (
    <div
      className={`${
        isSidebarOpen ? 'w-220px px-spacing-lv-4' : 'w-50px px-spacing-lv-2'
      } fixed z-sidebar flex h-full flex-col bg-navigation-surface-background pb-spacing-lv-2 pt-spacing-lv-7 transition-all duration-300 ease-in-out`}
    >
      {header}
      {body}
    </div>
  );
};

export default Sidebar;

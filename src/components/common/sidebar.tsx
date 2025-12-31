'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiTarget } from 'react-icons/fi';
import { IoIosList } from 'react-icons/io';
import { LuEye, LuEyeClosed, LuWallet, LuAlignHorizontalDistributeCenter } from 'react-icons/lu';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { Button } from '@/components/common/button';
import { useGlobalCtx } from '@/contexts/global_context';
import { numberWithCommas } from '@/lib/utils/common';

enum SidebarPage {
  CROWDFUNDING = 'Crowdfunding',
  TRADE = 'Trade',
  MY_WALLET = 'My Wallet',
  MY_PROJECT = 'My Project',
}

const Sidebar: React.FC = () => {
  const { isSidebarOpen, sidebarToggleHandler } = useGlobalCtx();

  const [isShowBalance, setIsShowBalance] = useState<boolean>(false);

  // ToDo: (20251219 - Julian) Get active page from router
  const [activePage, setActivePage] = useState<SidebarPage>(SidebarPage.CROWDFUNDING);

  // ToDo: (20251219 - Julian) Mock Data
  const userAvatar = '/elements/default_pic.png';
  const userName = 'John Doe';
  const twdBalance = 100000;
  const iscBalance = 2500;

  const links = Object.values(SidebarPage);

  const displayedLinks = links.map((link) => {
    const isActive = link === activePage;
    const icon =
      link === SidebarPage.CROWDFUNDING ? (
        <FiTarget size={24} />
      ) : link === SidebarPage.TRADE ? (
        <LuAlignHorizontalDistributeCenter size={24} />
      ) : link === SidebarPage.MY_WALLET ? (
        <LuWallet size={24} />
      ) : (
        <IoIosList size={24} />
      );

    const handleClick = () => setActivePage(link as SidebarPage);

    return (
      <Button
        key={link}
        type="button"
        size="sm"
        variant={isActive ? 'default' : 'defaultBorderless'}
        className="justify-start"
        onClick={handleClick}
      >
        {icon}
        <p>{link}</p>
      </Button>
    );
  });

  const displayedTwdBalance = isShowBalance ? numberWithCommas(twdBalance) : '********';
  const displayedIscBalance = isShowBalance ? numberWithCommas(iscBalance) : '********';

  const toggleHideBalance = () => setIsShowBalance((prev) => !prev);

  const header = isSidebarOpen ? (
    <div className="flex items-center justify-between">
      <Link href={'/'}>
        <Image
          src="/logo/horizontal_logo_dark.svg"
          width={135}
          height={40}
          alt="tidebit_logo"
          className="light-only" // Info: (20251231 - Julian) Light Mode Logo
        />
        <Image
          src="/logo/horizontal_logo_light.svg"
          width={135}
          height={40}
          alt="tidebit_logo"
          className="dark-only" // Info: (20251231 - Julian) Dark Mode Logo
        />
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
  const body = isSidebarOpen ? (
    <div className="flex flex-col gap-spacing-lv-6">
      {/* Info: (20251219 - Julian) User Info */}
      <div className="flex items-center gap-spacing-lv-4">
        <div className="relative size-48px shrink-0 overflow-hidden rounded-full">
          <Image src={userAvatar} fill objectFit="cover" alt="user_avatar" />
        </div>
        <p className="text-lg font-semibold text-navigation-text-default">{userName}</p>
      </div>
      {/* Info: (20251219 - Julian) Account */}
      <div className="flex items-center gap-spacing-lv-2">
        <div className="flex flex-1 items-center gap-spacing-lv-2">
          <div className="flex flex-col items-start gap-spacing-lv-2 text-sm font-semibold">
            <p className="text-text-neutral-tertiary">TWD</p>
            <p className="text-text-neutral-primary">{displayedTwdBalance}</p>
          </div>
          <div className="flex flex-col items-start gap-spacing-lv-2 text-sm font-semibold">
            <p className="text-text-neutral-tertiary">ISC</p>
            <p className="text-text-neutral-primary">{displayedIscBalance}</p>
          </div>
        </div>
        <button
          type="button"
          className="p-spacing-lv-0 text-button-neutral-outline-on-neutral-default"
          onClick={toggleHideBalance}
        >
          {isShowBalance ? <LuEyeClosed size={24} /> : <LuEye size={24} />}
        </button>
      </div>
      {/* Info: (20251219 - Julian) Links */}
      <div className="flex flex-col items-stretch gap-spacing-lv-2">{displayedLinks}</div>
    </div>
  ) : null;

  return (
    <div
      className={`${
        isSidebarOpen ? 'w-220px px-spacing-lv-4' : 'w-50px px-spacing-lv-2'
      } fixed z-sidebar flex h-full flex-col gap-spacing-lv-6 bg-navigation-surface-background pb-spacing-lv-2 pt-spacing-lv-7 transition-all duration-300 ease-in-out`}
    >
      {header}
      {body}
    </div>
  );
};

export default Sidebar;

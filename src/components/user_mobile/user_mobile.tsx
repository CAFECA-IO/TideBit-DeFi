import React, {useContext, useState} from 'react';
import Link from 'next/link';
import {UserContext} from '../../contexts/user_context';
import {ImExit} from 'react-icons/im';
import {VscAccount} from 'react-icons/vsc';
import {FaDownload, FaUpload} from 'react-icons/fa';
import {BiWallet} from 'react-icons/bi';
import {accountTruncate} from '../../lib/common';
import TideButton from '../tide_button/tide_button';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const UserMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  // hamburger animation
  const hamburgerStyles = 'block bg-lightWhite h-3px rounded-12px ease-in duration-300';
  const displayedMobileNavBarLine1 = !avatarMenuVisible
    ? 'translate-y-0 rotate-0 w-full'
    : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  const displayedMobileNavBarLine2 = !avatarMenuVisible
    ? 'translate-y-1.5 w-full opacity-100'
    : 'w-0 opacity-0';
  const displayedMobileNavBarLine3 = !avatarMenuVisible
    ? 'translate-y-3 rotate-0 w-full'
    : 'translate-y-0 origin-left w-3/4 rotate-35';

  const avatarClickHandler = () => {
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const depositClickHandler = () => {
    globalCtx.visibleDepositModalHandler();
  };

  const withdrawClickHandler = () => {
    globalCtx.visibleWithdrawalModalHandler();
  };

  const isDisplayedNavbarCover = userCtx.wallet ? (
    <div
      className={`${
        avatarMenuVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed top-0 left-0 z-60 flex h-14 w-full items-center divide-x divide-lightGray bg-darkGray px-5 pt-1`}
    >
      <div className="flex basis-full items-end">
        <div className="mr-0 flex border-r border-lightGray1 lg:hidden">
          <button
            onClick={avatarClickHandler}
            className="z-50 inline-flex items-center justify-center rounded-md p-2"
          >
            <div className="relative h-20px w-30px cursor-pointer">
              <span
                className={`${hamburgerStyles} ${displayedMobileNavBarLine1} opacity-100`}
              ></span>
              <span className={`${hamburgerStyles} ${displayedMobileNavBarLine2}`}></span>
              <span
                className={`${hamburgerStyles} ${displayedMobileNavBarLine3} opacity-100`}
              ></span>
            </div>
          </button>
        </div>

        <p className="self-center pl-5">{t('USER.PERSONAL_SETTING')}</p>
      </div>
    </div>
  ) : null;

  const isDisplayedAvatarMenu = userCtx.wallet ? (
    // Background
    <div
      id="userDropdown"
      className={`fixed top-0 left-0 z-30 flex h-screen w-full flex-col items-stretch divide-y divide-lightGray bg-darkGray px-9 pt-20 transition-all duration-300
        ${avatarMenuVisible ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      {/* Avatar Section */}
      <div className="items-center py-4 px-4 text-center text-sm text-lightGray">
        {/* Avatar */}
        <div className="relative inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
          <span className="text-5xl font-bold text-lightWhite">{username}</span>
        </div>
        {/* Account */}
        <div className="mt-2 truncate text-sm">{accountTruncate(userCtx.wallet)}</div>
      </div>

      <div className="flex justify-center">
        <ul
          className="py-1 pb-3 text-base font-normal text-gray-200"
          aria-labelledby="avatarButton"
        >
          <li>
            <Link href="/my-assets" className="block py-4 pr-4 pl-3 hover:bg-darkGray5">
              <div className="flex flex-row items-center space-x-2">
                <BiWallet />
                <p>{t('USER.ASSETS')}</p>
              </div>
            </Link>
          </li>
          <li
            onClick={depositClickHandler}
            className="block py-4 pr-4 pl-3 hover:cursor-pointer hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <FaDownload />
              <p>{t('USER.DEPOSIT')}</p>
            </div>
          </li>
          <li
            onClick={withdrawClickHandler}
            className="block py-4 pr-4 pl-3 hover:cursor-pointer hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <FaUpload />
              <p>{t('USER.WITHDRAW')}</p>
            </div>
          </li>
          <li>
            <Link href="#" className="block py-4 pr-4 pl-3 hover:bg-darkGray5">
              <div className="flex flex-row items-center space-x-2">
                <VscAccount />
                <p>{t('USER.ACCOUNT')}</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              onClick={userCtx.disconnect}
              href="#"
              className="block py-4 pr-4 pl-3 hover:bg-darkGray5"
            >
              <div className="flex flex-row items-center space-x-2">
                <ImExit />
                <p>{t('USER.DISCONNECT')}</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : null;

  const isDisplayedUserAvatar = userCtx.enableServiceTerm ? (
    <>
      <button
        onClick={avatarClickHandler}
        className="relative ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme"
      >
        <span className="text-2xl font-bold text-lightWhite">{username}</span>
      </button>
    </>
  ) : null;

  return (
    <div>
      {isDisplayedUserAvatar}
      {isDisplayedNavbarCover}
      {isDisplayedAvatarMenu}
    </div>
  );
};

export default UserMobile;

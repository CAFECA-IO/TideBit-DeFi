import React, {useContext, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ImCross, ImExit} from 'react-icons/im';
import UserOverview from '../user_overview/user_overview';
import {UserContext} from '../../contexts/user_context';
import {VscAccount} from 'react-icons/vsc';
import {FaDownload, FaUpload} from 'react-icons/fa';
import {BiWallet} from 'react-icons/bi';
import {accountTruncate} from '../../lib/common';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'next-i18next';
import {TBDURL} from '../../constants/api_request';

type TranslateFunction = (s: string) => string;

const UserMobile = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  /* Info: (20230327 - Julian) Hamburger Animation */
  const hamburgerStyles = 'opacity-100 block bg-lightWhite h-3px rounded-12px ease-in duration-300';
  const displayedMobileNavBarLine1 = !avatarMenuVisible
    ? 'translate-y-0 rotate-0 w-full'
    : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  const displayedMobileNavBarLine2 = !avatarMenuVisible ? 'translate-y-1.5 w-full' : 'w-0';
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

  const isDisplayedUserOverview = userCtx.enableServiceTerm ? (
    <UserOverview
      depositAvailable={userCtx.balance?.available ?? 0}
      marginLocked={userCtx.balance?.locked ?? 0}
      profitOrLossAmount={userCtx.balance?.PNL ?? 0}
    />
  ) : null;

  const isDisplayedNavbarCover = userCtx.wallet ? (
    <div
      className={`${
        avatarMenuVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed top-0 left-0 z-60 flex h-14 w-full items-center divide-x divide-lightGray bg-black/100 px-5 pt-1`}
    >
      <div className="relative flex basis-full items-center">
        <p className="self-center pl-5">{t('USER.PERSONAL_SETTING')}</p>

        <div className="absolute top-1 right-2 block lg:hidden">
          <ImCross onClick={avatarClickHandler} />
        </div>
      </div>
    </div>
  ) : null;

  const isDisplayedAvatarMenu = userCtx.wallet ? (
    /* ToDo: (20230327 - Julian) Fix fade in animation */
    <div
      className={`fixed left-0 ${
        avatarMenuVisible ? 'bg-darkGray/100' : 'invisible'
      } transition-all duration-300`}
    >
      <div
        id="userDropdown"
        className={`flex h-screen w-screen flex-col ${
          avatarMenuVisible ? 'visible' : 'invisible'
        } divide-y divide-lightGray px-9 pt-2`}
      >
        <div className="flex flex-col">
          {/* Info: (20230327 - Julian) Avatar Section */}
          <div className="flex w-full items-center py-4 text-center text-sm text-lightGray">
            <div className="inline-flex w-full items-center">
              {/* Info: (20230327 - Julian) Avatar */}
              <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
                <span className="text-4xl font-bold text-lightWhite">{username}</span>
              </div>
              {/* Info: (20230327 - Julian) Account */}
              <div className="ml-4 truncate text-sm">{accountTruncate(userCtx.wallet)}</div>
            </div>
            <button className="p-4">
              <Image src="/elements/edit_icon.svg" alt="edit_icon" width={25} height={25} />
            </button>
          </div>
          <div className="py-4">{isDisplayedUserOverview}</div>
        </div>

        <div className="flex justify-center">
          <ul
            className="py-1 pb-3 text-base font-normal text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <Link href={TBDURL.MY_ASSETS} className="block py-4 pr-4 pl-3 hover:bg-darkGray5">
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
    </div>
  ) : null;

  const isDisplayedUserAvatar = userCtx.enableServiceTerm ? (
    <>
      <button
        onClick={avatarClickHandler}
        className="ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme"
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

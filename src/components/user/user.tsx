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

const User = () => {
  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  const avatarClickHandler = () => {
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const isDisplayedAvatarMenu =
    userCtx.wallet && avatarMenuVisible ? (
      // Background
      <div
        id="userDropdown"
        className="avatarMenuShadow absolute top-16 right-8 z-10 w-285px divide-y divide-lightGray rounded-none bg-darkGray shadow"
      >
        {/* Avatar Section */}
        <div className="mx-3 items-center py-3 px-4 text-center text-sm text-lightGray">
          {/* Avatar */}
          <div className="relative ml-3 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
            <span className="text-5xl font-bold text-lightWhite">{username}</span>
          </div>
          {/* Account */}
          <div className="ml-4 mt-2 truncate text-sm">{accountTruncate(userCtx.wallet)}</div>
        </div>

        <ul
          className="mx-3 py-1 pb-3 text-base font-normal text-gray-200"
          aria-labelledby="avatarButton"
        >
          <li>
            <Link href="/my-assets" className="block py-2 pr-4 pl-3 hover:bg-darkGray5">
              <div className="flex flex-row items-center space-x-2">
                <BiWallet />
                <p>My Assets</p>
              </div>
            </Link>
          </li>
          <li
            onClick={() => {
              avatarClickHandler();
              globalCtx.visibleDepositModalHandler();
            }}
            className="block py-2 pr-4 pl-3 hover:cursor-pointer hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <FaDownload />
              <p>Deposit</p>
            </div>
          </li>
          <li
            onClick={() => {
              avatarClickHandler();
              globalCtx.visibleWithdrawalModalHandler();
            }}
            className="block py-2 pr-4 pl-3 hover:cursor-pointer hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <FaUpload />
              <p>Withdraw</p>
            </div>
          </li>
          <li>
            <Link href="#" className="block py-2 pr-4 pl-3 hover:bg-darkGray5">
              <div className="flex flex-row items-center space-x-2">
                <VscAccount />
                <p>My Account</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              onClick={userCtx.disconnect}
              href="#"
              className="block py-2 pr-4 pl-3 hover:bg-darkGray5"
            >
              <div className="flex flex-row items-center space-x-2">
                <ImExit />
                <p>Disconnect</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    ) : null;

  // TODO: Move to `Navbar` and `User`
  const isDisplayedUserAvatar = userCtx.enableServiceTerm ? (
    <>
      <button
        onClick={avatarClickHandler}
        className="relative ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme"
      >
        <span className="text-2xl font-bold text-lightWhite">{username}</span>
      </button>
      {isDisplayedAvatarMenu}
    </>
  ) : null;

  return (
    <div>
      {isDisplayedUserAvatar} {isDisplayedAvatarMenu}
    </div>
  );
};

export default User;

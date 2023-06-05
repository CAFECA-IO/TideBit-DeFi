import React, {useContext, useState} from 'react';
import Link from 'next/link';
import {UserContext} from '../../contexts/user_context';
import {ImExit} from 'react-icons/im';
import {VscAccount} from 'react-icons/vsc';
import {FaDownload, FaUpload} from 'react-icons/fa';
import {BiWallet} from 'react-icons/bi';
import {accountTruncate} from '../../lib/common';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'next-i18next';
import {TBDURL} from '../../constants/api_request';

type TranslateFunction = (s: string) => string;

const User = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);

  const username = userCtx.user?.address?.slice(-1).toUpperCase();

  const avatarClickHandler = () => {
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const depositClickHandler = () => {
    globalCtx.visibleDepositModalHandler();
  };

  const withdrawClickHandler = () => {
    globalCtx.visibleWithdrawalModalHandler();
  };

  const isDisplayedAvatarMenu = userCtx.user?.address ? (
    <div
      id="userDropdown"
      className={`avatarMenuShadow absolute right-8 top-16 z-10 flex w-285px flex-col ${
        avatarMenuVisible ? 'translate-y-0 opacity-100' : '-translate-y-450px opacity-0'
      } divide-y divide-lightGray rounded-none bg-darkGray shadow transition-all duration-300 ease-in`}
    >
      {/* Info: (20230327 - Julian) Avatar Section */}
      <div className="mx-3 items-center px-4 py-3 text-center text-sm text-lightGray">
        {/* Info: (20230327 - Julian) Avatar */}
        <div className="relative ml-3 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
          <span className="text-5xl font-bold text-lightWhite">{username}</span>
        </div>
        {/* Info: (20230327 - Julian) Account */}
        <div className="ml-4 mt-2 truncate text-sm">{accountTruncate(userCtx.user?.address)}</div>
      </div>

      <ul
        className="mx-3 py-1 pb-3 text-base font-normal text-gray-200"
        aria-labelledby="avatarButton"
      >
        <li>
          <button className="block w-full py-2 pl-3 pr-4 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5">
            <Link href={TBDURL.MY_ASSETS}>
              <div className="flex flex-row items-center space-x-2">
                <BiWallet />
                <p>{t('USER.ASSETS')}</p>
              </div>
            </Link>
          </button>
        </li>
        <li>
          <button
            onClick={depositClickHandler}
            className="block w-full py-2 pl-3 pr-4 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <FaDownload />
              <p>{t('USER.DEPOSIT')}</p>
            </div>
          </button>
        </li>
        <li>
          <button
            onClick={withdrawClickHandler}
            className="block w-full py-2 pl-3 pr-4 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5 disabled:opacity-30"
            disabled
          >
            <div className="flex flex-row items-center space-x-2">
              <FaUpload />
              <p>{t('USER.WITHDRAW')}</p>
            </div>
          </button>
        </li>
        <li>
          <button
            className="block w-full py-2 pl-3 pr-4 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5 disabled:opacity-30"
            disabled
          >
            {/* <Link href=""> */}
            <div className="flex flex-row items-center space-x-2">
              <VscAccount />
              <p>{t('USER.ACCOUNT')}</p>
            </div>
            {/* </Link> */}
          </button>
        </li>
        <li>
          <button
            onClick={userCtx.disconnect}
            className="block w-full py-2 pl-3 pr-4 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <ImExit />
              <p>{t('USER.DISCONNECT')}</p>
            </div>
          </button>
        </li>
      </ul>
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

  const isDisplayedCover = avatarMenuVisible ? (
    <div className="absolute left-0 top-0 h-screen w-screen" onClick={avatarClickHandler}></div>
  ) : null;

  return (
    <div>
      {isDisplayedUserAvatar}
      {isDisplayedCover}
      {isDisplayedAvatarMenu}
    </div>
  );
};

export default User;

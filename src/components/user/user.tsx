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

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  const avatarClickHandler = () => {
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const depositClickHandler = () => {
    globalCtx.visibleDepositModalHandler();
  };

  const withdrawClickHandler = () => {
    globalCtx.visibleWithdrawalModalHandler();
  };

  const isDisplayedAvatarMenu = userCtx.wallet ? (
    <div
      id="userDropdown"
      className={`avatarMenuShadow absolute top-16 right-8 -z-10 flex w-285px flex-col ${
        avatarMenuVisible ? 'translate-y-0 opacity-100' : '-translate-y-450px opacity-0'
      } divide-y divide-lightGray rounded-none bg-darkGray shadow transition-all duration-300 ease-in`}
    >
      {/* Info: (20230327 - Julian) Avatar Section */}
      <div className="mx-3 items-center py-3 px-4 text-center text-sm text-lightGray">
        {/* Info: (20230327 - Julian) Avatar */}
        <div className="relative ml-3 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
          <span className="text-5xl font-bold text-lightWhite">{username}</span>
        </div>
        {/* Info: (20230327 - Julian) Account */}
        <div className="ml-4 mt-2 truncate text-sm">{accountTruncate(userCtx.wallet)}</div>
      </div>

      <ul
        className="mx-3 py-1 pb-3 text-base font-normal text-gray-200"
        aria-labelledby="avatarButton"
      >
        <li>
          <Link href={TBDURL.MY_ASSETS} className="block py-2 pr-4 pl-3 hover:bg-darkGray5">
            <div className="flex flex-row items-center space-x-2">
              <BiWallet />
              <p>{t('USER.ASSETS')}</p>
            </div>
          </Link>
        </li>
        <li
          onClick={depositClickHandler}
          className="block py-2 pr-4 pl-3 hover:cursor-pointer hover:bg-darkGray5"
        >
          <div className="flex flex-row items-center space-x-2">
            <FaDownload />
            <p>{t('USER.DEPOSIT')}</p>
          </div>
        </li>
        <li
          onClick={withdrawClickHandler}
          className="block py-2 pr-4 pl-3 hover:cursor-pointer hover:bg-darkGray5"
        >
          <div className="flex flex-row items-center space-x-2">
            <FaUpload />
            <p>{t('USER.WITHDRAW')}</p>
          </div>
        </li>
        <li
          onClick={() => {
            globalCtx.toast({
              typeText: 'Error',
              message: 'Something went wrong.',
              type: 'error',
              isLoading: false,
              autoClose: false,
            });
          }}
        >
          <Link href="#" className="block py-2 pr-4 pl-3 hover:bg-darkGray5">
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
            className="block py-2 pr-4 pl-3 hover:bg-darkGray5"
          >
            <div className="flex flex-row items-center space-x-2">
              <ImExit />
              <p>{t('USER.DISCONNECT')}</p>
            </div>
          </Link>
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

  return (
    <div>
      {isDisplayedUserAvatar} {isDisplayedAvatarMenu}
    </div>
  );
};

export default User;

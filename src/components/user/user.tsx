import React, {useContext, useState, Dispatch, SetStateAction} from 'react';
import Link from 'next/link';
import {UserContext} from '../../contexts/user_context';
import {ImCross, ImExit} from 'react-icons/im';
import {VscAccount} from 'react-icons/vsc';
import {FaDownload, FaUpload} from 'react-icons/fa';
import {BiWallet} from 'react-icons/bi';
import {accountTruncate} from '../../lib/common';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'next-i18next';
import {TBDURL} from '../../constants/api_request';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {LayoutAssertion} from '../../constants/layout_assertion';
import UserOverview from '../user_overview/user_overview';
import Image from 'next/image';

type TranslateFunction = (s: string) => string;

interface IUserProps {
  notifyOpen?: boolean;
  setNotifyOpen?: Dispatch<SetStateAction<boolean>>;
}

const User = ({notifyOpen, setNotifyOpen}: IUserProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);

  const {
    targetRef: userRef,
    componentVisible: userVisible,
    setComponentVisible: setUserVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const username = userCtx.user?.address?.slice(-1).toUpperCase();

  const avatarClickHandler = () => setUserVisible(!userVisible);
  const avatarMobileClickHandler = () => {
    // Info: (20231019 - Julian) close notify first
    if (notifyOpen && setNotifyOpen) setNotifyOpen(false);
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const depositClickHandler = () => globalCtx.visibleDepositModalHandler();
  const withdrawClickHandler = () => globalCtx.visibleWithdrawalModalHandler();

  const isDisplayedAvatarMenu = userCtx.user?.address ? (
    <div
      id="UserAvatarMenu"
      className={`avatarMenuShadow absolute -right-2 top-16 z-10 flex w-285px flex-col ${
        userVisible ? 'translate-y-0 opacity-100' : '-translate-y-450px opacity-0'
      } divide-y divide-lightGray rounded-none bg-darkGray shadow transition-all duration-300 ease-in`}
    >
      {/* Info: (20230327 - Julian) Avatar Section */}
      <div className="mx-3 items-center px-4 py-3 text-center text-sm text-lightGray">
        {/* Info: (20230327 - Julian) Avatar */}
        <div className="relative ml-3 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
          <span className="text-5xl font-bold text-lightWhite">{username}</span>
        </div>
        {/* Info: (20230327 - Julian) Account */}
        <div className="ml-4 mt-2 truncate text-sm">
          {accountTruncate(userCtx.user?.address, 20)}
        </div>
      </div>

      <ul
        className="mx-3 py-1 pb-3 text-base font-normal text-gray-200"
        aria-labelledby="avatarButton"
      >
        <li>
          <button
            id="MyAssetsButton"
            className="block w-full py-2 pl-3 pr-4 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5"
          >
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
            id="DepositButton"
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
            id="WithdrawButton"
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
            id="AccountSettingButton"
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
            id="DisconnectButton"
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
        id="UserAvatarButton"
        onClick={avatarClickHandler}
        className="relative ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme"
      >
        <span className="text-2xl font-bold text-lightWhite">{username}</span>
      </button>
    </>
  ) : null;

  const isDisplayedUserOverviewMobile = userCtx.enableServiceTerm ? (
    <UserOverview
      depositAvailable={userCtx.userAssets?.balance?.available ?? 0}
      marginLocked={userCtx.userAssets?.balance?.locked ?? 0}
      profitOrLossAmount={userCtx.userAssets?.pnl?.cumulative?.amount?.value ?? 0}
    />
  ) : null;

  const isDisplayedNavbarCoverMobile = userCtx.user?.address ? (
    <div
      className={`${
        avatarMenuVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed left-0 top-0 z-80 flex h-14 w-full items-center divide-x divide-lightGray bg-black px-5 pt-1`}
    >
      <div className="relative flex basis-full items-center">
        <p className="self-center pl-5">{t('USER.PERSONAL_SETTING')}</p>

        <div className="absolute right-2 top-1 block hover:cursor-pointer lg:hidden">
          <ImCross onClick={avatarMobileClickHandler} />
        </div>
      </div>
    </div>
  ) : null;

  const isDisplayedAvatarMenuMobile = userCtx.user?.address ? (
    <div
      className={`fixed left-0 bg-darkGray/100 ${
        avatarMenuVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } transition-all duration-300`}
    >
      <div
        id="UserAvatarMenuMobile"
        className={`flex h-screen w-screen flex-col ${
          avatarMenuVisible ? 'visible opacity-100' : 'invisible opacity-0'
        } divide-y divide-lightGray px-9 pt-8`}
      >
        <div className="flex flex-col items-center">
          {/* Info: (20230327 - Julian) Avatar Section */}
          <div className="flex w-full max-w-350px items-center justify-between px-2 py-4 text-center text-sm text-lightGray">
            <div className="inline-flex items-center">
              {/* Info: (20230327 - Julian) Avatar */}
              <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
                <span className="text-4xl font-bold text-lightWhite">{username}</span>
              </div>
              {/* Info: (20230327 - Julian) Account */}
              <div className="ml-4 truncate text-sm">
                {accountTruncate(userCtx.user?.address, 20)}
              </div>
            </div>
            <button className="p-4">
              <Image src="/elements/edit_icon.svg" alt="edit_icon" width={25} height={25} />
            </button>
          </div>
          <div className="w-full max-w-350px py-4">{isDisplayedUserOverviewMobile}</div>
        </div>

        <div className="flex justify-center">
          <ul
            className="pb-4 pt-1 text-base font-normal text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <button className="block w-full py-4 py-4 pl-8 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5">
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
                className="block w-full py-4 pl-8 pr-10 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5"
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
                className="block w-full py-4 pl-8 pr-10 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5 disabled:opacity-30"
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
                className="block w-full py-4 pl-8 pr-10 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5 disabled:opacity-30"
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
                className="block w-full py-4 pl-8 pr-10 enabled:hover:cursor-pointer enabled:hover:bg-darkGray5"
              >
                <div className="flex flex-row items-center space-x-2">
                  <ImExit />
                  <p>{t('USER.DISCONNECT')}</p>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : null;

  const isDisplayedUserAvatarMobile = userCtx.enableServiceTerm ? (
    <>
      <button
        id="UserAvatarButtonMobile"
        onClick={avatarMobileClickHandler}
        className="ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme"
      >
        <span className="text-2xl font-bold text-lightWhite">{username}</span>
      </button>
    </>
  ) : null;

  const desktopLayout = (
    <div className="relative mx-auto max-w-1920px" ref={userRef}>
      {isDisplayedUserAvatar}
      {isDisplayedAvatarMenu}
    </div>
  );

  const mobileLayout = (
    <div>
      {isDisplayedUserAvatarMobile}
      {isDisplayedNavbarCoverMobile}
      {isDisplayedAvatarMenuMobile}
    </div>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <>{displayedLayout}</>;
};

export default User;

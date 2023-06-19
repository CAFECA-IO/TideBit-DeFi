import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import {useContext} from 'react';
import Image from 'next/image';
import version from '../../lib/version';
import useOuterClick from '../../lib/hooks/use_outer_click';
import Notification from '../notification/notification';
import I18n from '../i18n/i18n';
import UserOverview from '../user_overview/user_overview';
import {UserContext} from '../../contexts/user_context';
import User from '../user/user';
import {NotificationContext} from '../../contexts/notification_context';
import {TBDURL} from '../../constants/api_request';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';

type TranslateFunction = (s: string) => string;

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {
    targetRef: notifyRef,
    componentVisible: notifyVisible,
    setComponentVisible: setNotifyVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const sidebarOpenHandler = () => {
    setNotifyVisible(!notifyVisible);
  };

  const isDisplayedUserOverview = userCtx.enableServiceTerm ? (
    <UserOverview
      depositAvailable={userCtx.userAssets?.balance?.available ?? 0}
      marginLocked={userCtx.userAssets?.balance?.locked ?? 0}
      profitOrLossAmount={userCtx.userAssets?.pnl?.cumulative?.amount?.value ?? 0}
    />
  ) : null;

  const isDisplayedUser = userCtx.enableServiceTerm ? (
    <User />
  ) : (
    /* Info: (20230327 - Julian) show wallet panel */
    <WalletConnectButton className="mt-4 px-5 py-2 md:mt-0" />
  );

  const isDisplayedUnreadnumber =
    notificationCtx.unreadNotifications.length > 0 ? (
      <span className="absolute bottom-4 left-3 z-20 inline-flex h-4 w-4 items-center justify-center rounded-xl bg-tidebitTheme">
        <p className="text-center text-3xs">{notificationCtx.unreadNotifications.length}</p>
      </span>
    ) : null;

  const userOverviewDividerDesktop = userCtx.enableServiceTerm ? (
    <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1/50"></span>
  ) : null;

  return (
    <>
      <div className="w-full text-center lg:text-start">
        <nav className="container fixed inset-x-0 z-40 mx-auto max-w-full bg-black/100 pb-1 text-white">
          <div className="mx-auto max-w-full px-5">
            <div className="flex h-16 items-center justify-between bg-black">
              <div className="flex items-center">
                {/* Info: (20230327 - Julian) logo */}
                <Link className="shrink-0  pt-5" href="/">
                  <div className="inline-flex items-center hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative h-55px w-150px flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        src="/elements/nav_logo.svg"
                        height={50}
                        width={150}
                        alt="TideBit_logo"
                      />

                      <Image
                        className="absolute right-58px bottom-1"
                        src="/elements/beta.svg"
                        width={35}
                        height={13}
                        alt="beta"
                      />

                      <p className="absolute bottom-1 right-0 text-end text-xxs text-lightGray">
                        v {version}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Info: (20230327 - Julian) Desktop menu */}
                <div className={`hidden pb-5 text-base text-lightGray1 lg:block`}>
                  <div className="ml-10 mt-5 flex flex-1 items-center space-x-4 xl:ml-10">
                    <Image src="/elements/testnet.svg" width={80} height={25} alt="testnet" />
                    <Link
                      href={TBDURL.TRADE}
                      className="hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      {t('NAV_BAR.TRADE')}
                    </Link>
                    <Link
                      href={TBDURL.LEADERBOARD}
                      className="mr-5 hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      {t('NAV_BAR.LEADERBOARD')}
                    </Link>
                    <Link
                      href={TBDURL.COMING_SOON}
                      className="mr-5 hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      {t('NAV_BAR.SUPPORT')}
                    </Link>

                    {/* Info: (20230327 - Julian) User overview */}
                    {userOverviewDividerDesktop}
                    {isDisplayedUserOverview}
                  </div>
                </div>
              </div>
              <div className="hidden pt-3 lg:flex">
                <div className="flex items-center justify-center px-5">
                  <div>
                    <I18n />
                  </div>
                  <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>

                  <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                    {isDisplayedUnreadnumber}

                    <Image
                      src="/elements/notifications_outline.svg"
                      width={25}
                      height={25}
                      className="hover:cursor-pointer hover:text-cyan-300"
                      alt="notification icon"
                    />
                  </button>
                </div>
                <div className="mr-5 inline-flex">{isDisplayedUser}</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Info: (20230327 - Julian) Notification Sidebar */}
      <Notification notifyRef={notifyRef} componentVisible={notifyVisible} />
    </>
  );
};

export default NavBar;

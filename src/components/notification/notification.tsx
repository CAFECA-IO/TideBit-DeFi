import React, {useContext, useState, useEffect} from 'react';
import NotificationItem from '../notification_item/notification_item';
import {useGlobal} from '../../contexts/global_context';
import {NotificationContext} from '../../contexts/notification_context';
import {NotificationLevel} from '../../constants/notification_level';
import {MessageType} from '../../constants/message_type';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

interface INotificationProps {
  notifyRef?: HTMLDivElement extends HTMLElement ? React.RefObject<HTMLDivElement> : null;
  componentVisible: boolean;
}

export default function Notification({
  notifyRef,
  componentVisible,
}: INotificationProps): JSX.Element {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();

  const [readAllanim, setReadAllanim] = useState('translate-x-0 opacity-100');

  /* Info: (20230522 - Julian) 初始化完成就去抓 notificationCtx ，檢查有沒有重要通知 */
  useEffect(() => {
    notificationCtx.unreadNotifications.map(v => {
      if (v.notificationLevel === NotificationLevel.CRITICAL) {
        globalCtx.dataAnnouncementModalHandler({
          id: v.id,
          title: v.title,
          content: v.content,
          numberOfButton: 1,
          reactionOfButton: '',
          messageType: MessageType.ANNOUNCEMENT,
        });
        globalCtx.visibleAnnouncementModalHandler();
      }
    });
  }, []);

  let timer: NodeJS.Timeout;

  const readAllHandler = () => {
    clearTimeout(timer);
    setReadAllanim('translate-x-96 opacity-0');

    timer = setTimeout(notificationCtx.readAll, 500);
    return () => clearTimeout(timer);
  };

  const displayedNotificationList = notificationCtx.unreadNotifications.map((v, index) => {
    return (
      <div key={index} className={`${readAllanim} transition-all duration-300 ease-in-out`}>
        <NotificationItem
          id={v.id}
          title={v.title}
          timestamp={v.timestamp}
          duration={v.duration}
          notificationLevel={v.notificationLevel}
          isRead={v.isRead}
          content={v.content}
          public={v.public}
        />
      </div>
    );
  });

  return (
    <div className="">
      <div
        className={`pointer-events-none fixedSidebar fixed right-0 top-0 z-60 flex min-h-screen overflow-x-hidden overflow-y-hidden`}
      >
        {/* Info: (20230420 - Julian) sidebar self */}
        <div
          ref={notifyRef}
          className={`pointer-events-auto mt-60px w-screen ${`lg:w-479px`} ${
            componentVisible
              ? 'visible opacity-100 lg:translate-x-0'
              : 'invisible opacity-10 lg:translate-x-full'
          } flex flex-col bg-darkGray p-4 text-white transition-all duration-100 sm:p-5 lg:bg-darkGray/90 lg:duration-300`}
        >
          {/* Info: (20231019 - Julian) Notification Title & Read All */}
          <div className="my-4 flex items-center">
            <h1 className="hidden justify-start text-2xl font-bold lg:flex lg:w-1/2 lg:shrink-0">
              {t('NAV_BAR.NOTIFICATION_TITLE')}
            </h1>
            <div
              className="flex w-full shrink-0 justify-end text-sm text-tidebitTheme underline hover:cursor-pointer lg:w-1/2"
              onClick={readAllHandler}
            >
              {t('NAV_BAR.NOTIFICATION_READ_ALL')}
            </div>
          </div>

          {/* Info: (20230420 - Julian) Notification List */}
          <div className="flex h-80vh w-full flex-col space-y-5 overflow-y-auto overflow-x-hidden pb-40 pt-5 sm:pb-10">
            {displayedNotificationList}
          </div>
        </div>
      </div>
    </div>
  );
}

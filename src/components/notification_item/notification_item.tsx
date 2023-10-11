import React, {useState, useContext} from 'react';
import Image from 'next/image';
import {NotificationContext} from '../../contexts/notification_context';
import {useGlobal} from '../../contexts/global_context';
import {INotificationItem} from '../../interfaces/tidebit_defi_background/notification_item';
import {timestampToString} from '../../lib/common';
import {MessageType} from '../../constants/message_type';
import {NotificationLevel} from '../../constants/notification_level';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

export default function NotificationItem(notificationItem: INotificationItem) {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {id, title, content, timestamp, notificationLevel} = notificationItem;
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();

  const [itemStyle, setItemStyle] = useState('h-160px translate-x-0 opacity-100');

  const messageType =
    notificationLevel === NotificationLevel.CRITICAL
      ? MessageType.ANNOUNCEMENT
      : MessageType.NOTIFICATION;

  const displayTime = timestampToString(timestamp);

  const itemClickHandler = () => {
    globalCtx.dataAnnouncementModalHandler({
      id: id,
      title: title,
      content: content,
      numberOfButton: 1,
      reactionOfButton: '',
      messageType: messageType,
    });
    globalCtx.visibleAnnouncementModalHandler();

    /* Info:(20230522 - Julian)
     * notification -> item 被點擊後就直接設定 isRead
     * announcement -> 在 AnnouncementModal 裡設定 */
    if (messageType === MessageType.NOTIFICATION) {
      setItemStyle('h-0 translate-x-500px opacity-10');

      setTimeout(() => {
        notificationCtx.isRead(id);
      }, 500);
    }
  };

  return (
    <div
      className={`relative cursor-pointer ${itemStyle} w-full transition-all duration-100 ease-in-out lg:duration-500`}
      onClick={itemClickHandler}
    >
      <div className="flex">
        {/* Info: (20230420 - Julian) Vertical line */}
        <span className={`mx-2 h-160px w-5px shrink-0 bg-tidebitTheme`}></span>

        {/* Info: (20230420 - Julian) contain divider */}
        <div>
          {/* Info: (20230420 - Julian) Speaker & Heading & Date */}
          <div className="flex items-start">
            <Image
              className="sm:ml-8px"
              src="/elements/megaphone.svg"
              width={30}
              height={26}
              alt="megaphone icon"
            />

            <div className="relative mb-3 ml-3 basis-full text-start sm:mb-7">
              <div className="mx-auto flex justify-between">
                <div className="mr-5px line-clamp-1 text-xl text-lightWhite sm:whitespace-nowrap sm:text-2xl">
                  {t(title)}
                </div>
                <div className="whitespace-nowrap text-end text-xs text-lightGray">
                  <div>{displayTime.date}</div>
                  <div>{displayTime.time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info: (20230420 - Julian) Content */}
          <div className="mb-5 line-clamp-4 h-80px w-500px pl-12 text-xs text-lightGray">
            {t(content)}
          </div>
        </div>
      </div>

      <div className="ml-2 border-b border-lightGray"></div>
    </div>
  );
}

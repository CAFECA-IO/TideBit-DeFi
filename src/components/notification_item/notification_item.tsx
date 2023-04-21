import React from 'react';
import Image from 'next/image';
import {INotificationItem} from '../../interfaces/tidebit_defi_background/notification_item';
import {timestampToString} from '../../lib/common';

export default function NotificationItem(
  notificationItem: INotificationItem,
  itemHeight = 'h-158px'
) {
  const {title, content, timestamp} = notificationItem;

  const displayTime = timestampToString(timestamp);

  return (
    <div className="relative cursor-pointer">
      <div className="mb-0 flex pb-0">
        {/* Vertical line */}
        <span className={`mx-2 ${itemHeight} w-5px shrink-0 bg-tidebitTheme`}></span>

        {/* contain divider */}
        <div>
          {/* Speaker & Heading & Date */}
          <div className="flex items-start">
            <Image
              className="sm:ml-8px"
              src="/elements/megaphone.svg"
              width={30}
              height={26}
              alt="megaphone icon"
            />

            <div className="relative mb-3 ml-3 basis-full text-start sm:mb-7">
              <div className="flex pr-2">
                <div className="mr-5px text-xl text-lightWhite sm:whitespace-nowrap sm:text-2xl">
                  {title}
                </div>
                <div className="ml-auto whitespace-nowrap text-end text-xs text-lightGray">
                  <div>{displayTime.date}</div>
                  <div>{displayTime.time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-0 mb-5 flex w-11/12 flex-wrap pl-12 pt-0 text-xs text-lightGray">
            {content}
          </div>
        </div>
      </div>

      <span className="absolute ml-2 inline-block h-1px w-438px shrink-0 bg-lightGray"></span>
    </div>
  );
}

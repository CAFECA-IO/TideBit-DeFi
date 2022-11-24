import React from 'react';
import Image from 'next/image';
{
  /* Notification item itself */
}

export default function NotificationItem({title = '', date = '', time = '', content = ''}) {
  title = title ? title : 'Happy Birthday to TideBit';
  date = date ? date : '2022-10-05';
  time = time ? time : '14:28:38';
  content = content
    ? content
    : `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  sanctus est Lorem`;

  return (
    <div className="">
      <div className="flex">
        {/* Vertical line */}
        <span className="mx-2 inline-block h-158px w-5px shrink-0 bg-tidebitTheme"></span>
        {/* Speaker & Heading & Content & Date */}
        <div className="flex items-center">
          <Image
            className="ml-8px mb-10px flex shrink-0"
            src="/elements/megaphone.svg"
            width={30}
            height={26}
            alt="icon"
          />

          <div className="relative mt-88px ml-3 text-start">
            <div className="">
              <div className="absolute top-40px text-2xl text-lightWhite">{title}</div>
              <div className="right-20px pl-300px pt-42px pb-50px text-end text-xs text-lightGray">
                <div>{date}</div>
                <div>{time}</div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-wrap text-xs text-lightGray">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

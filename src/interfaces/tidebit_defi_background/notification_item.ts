/* eslint-disable no-console */
import {INotificationLevel, NotificationLevel} from '../../constants/notification_level';
export interface INotificationItem {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  duration: [Date, Date];
  notificationLevel: INotificationLevel;
  isRead: boolean;
}

export const dummyNotificationItem: INotificationItem = {
  id: '001',
  title: 'Happy Birthday to TideBit',
  content: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  sanctus est Lorem`,
  timestamp: Date.now(),
  duration: [new Date('2023-01-01'), new Date('2023-03-31')],
  notificationLevel: NotificationLevel.INFO,
  isRead: false,
};

export const getDummyNotifications = (numbers: number) => {
  const dummyNotificationItems: INotificationItem[] = [];
  for (let i = 0; i < numbers; i++) {
    const dummyNotificationItem: INotificationItem = {
      id: `${i}`,
      title: 'Happy Birthday to TideBit',
      content: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  sanctus est Lorem`,
      timestamp: Date.now(),
      duration: [new Date('2023-01-01'), new Date('2023-03-31')],
      notificationLevel: NotificationLevel.INFO,
      isRead: false,
    };
    dummyNotificationItems.push(dummyNotificationItem);
  }
  // console.log(`dummyNotificationItems`, dummyNotificationItems)
  return dummyNotificationItems;
};

export const dummyNotifications: INotificationItem[] = getDummyNotifications(3);

export const dummyUnReadNotifications: INotificationItem[] = dummyNotifications.filter(
  n => !n.isRead
);

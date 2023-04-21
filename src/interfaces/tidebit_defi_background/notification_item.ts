import {INotificationLevel, NotificationLevel} from '../../constants/notification_level';
export interface INotificationItem {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  duration: [number, number];
  notificationLevel: INotificationLevel;
  isRead: boolean;
  public: boolean;
}

export const dummyNotificationItem: INotificationItem = {
  id: '001',
  title: 'Happy Birthday to TideBit',
  content: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  sanctus est Lorem`,
  timestamp: Math.floor(Date.now() / 1000),
  duration: [
    Math.floor(new Date('2023-01-01').getTime() / 1000),
    Math.floor(new Date('2023-03-31').getTime() / 1000),
  ],
  notificationLevel: NotificationLevel.INFO,
  isRead: false,
  public: true,
};

export const createDummyPrivateNotificationItem = (userId: string | null, greetings: string) => {
  const dummyNotificationItem: INotificationItem = {
    id: `private-${userId}-${Date.now()}${(Math.random() * 1000).toFixed(0)}`,
    title: `Hi ${userId}, this is private notification`,
    content: `Good Day, ${greetings}`,
    timestamp: Math.floor(Date.now() / 1000),
    duration: [
      Math.floor(new Date('2023-01-01').getTime() / 1000),
      Math.floor(new Date('2023-03-31').getTime() / 1000),
    ],
    notificationLevel: NotificationLevel.INFO,
    isRead: false,
    public: false,
  };
  return dummyNotificationItem;
};

export const getDummyNotifications = (numbers: number) => {
  const dummyNotificationItems: INotificationItem[] = [];
  for (let i = 0; i < numbers; i++) {
    const dummyNotificationItem: INotificationItem = {
      id: `public-${Date.now()}-${(Math.random() * (i + 1) * 1000).toFixed(0)}`,
      title: 'Happy Birthday to TideBit',
      content: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  sanctus est Lorem`,
      timestamp: Math.floor(Date.now() / 1000),
      duration: [
        Math.floor(new Date('2023-01-01').getTime() / 1000),
        Math.floor(new Date('2023-03-31').getTime() / 1000),
      ],
      notificationLevel: NotificationLevel.INFO,
      isRead: false,
      public: true,
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

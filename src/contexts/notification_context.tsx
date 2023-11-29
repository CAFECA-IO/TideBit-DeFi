import EventEmitter from 'events';
import React, {createContext} from 'react';
import useState from 'react-usestateref';
import {TideBitEvent} from '../constants/tidebit_event';
import {
  INotificationItem,
  dummyNotifications,
  dummyUnReadNotifications,
} from '../interfaces/tidebit_defi_background/notification_item';
import {COOKIE_PERIOD_CRITICAL_ANNOUNCEMENT} from '../constants/config';
import {addDaysToDate, getCookieByName, isCookieExpired, setCookie} from '../lib/common';
import ExceptionCollectorInstance from '../lib/exception_collector';
import {CustomError, isCustomError} from '../lib/custom_error';
import {ICode, Reason} from '../constants/code';
import {IErrorSearchProps, IException} from '../constants/exception';
import {SEVEREST_EXCEPTION_LEVEL} from '../constants/display';

export interface INotificationProvider {
  children: React.ReactNode;
}

export interface INotificationContext {
  emitter: EventEmitter;
  notifications: INotificationItem[];
  unreadNotifications: INotificationItem[];
  isRead: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
  init: () => Promise<void>;
  reset: () => void;
  addException: (
    from: string,
    error: Error | CustomError,
    alternativeCode: ICode,
    severity?: string
  ) => void;
  clearException: () => void;
  removeException: (props: IErrorSearchProps, searchBy: string) => void;
  getSeverestException: () => IException[];
}

export const NotificationContext = createContext<INotificationContext>({
  emitter: new EventEmitter(),
  notifications: [],
  unreadNotifications: [],
  isRead: () => Promise.resolve(),
  readAll: () => Promise.resolve(),
  init: () => Promise.resolve(),
  reset: () => null,
  addException: () => null,
  clearException: () => null,
  removeException: () => null,
  getSeverestException: () => [],
});

export const NotificationProvider = ({children}: INotificationProvider) => {
  const emitter = React.useMemo(() => new EventEmitter(), []);
  const exceptionCollector = React.useMemo(() => ExceptionCollectorInstance, []);

  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setNotifications, notificationsRef] =
    useState<INotificationItem[]>(dummyNotifications);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unreadNotifications, setUnreadNotifications, unreadNotificationsRef] =
    useState<INotificationItem[]>(dummyUnReadNotifications);

  const getSeverestException = (): IException[] => {
    return exceptionCollector.getSeverest();
  };

  const addException = (
    from: string,
    error: Error | CustomError,
    alternativeCode: ICode,
    severity?: string
  ) => {
    const code = isCustomError(error) ? error.code : alternativeCode;
    const reason = isCustomError(error) ? Reason[error.code] : Reason[alternativeCode];
    const level =
      severity ||
      (!isCustomError(error) || (isCustomError(error) && error.code === alternativeCode)
        ? SEVEREST_EXCEPTION_LEVEL
        : undefined);

    const rs = exceptionCollector.add(
      {
        code: code,
        reason: reason,
        where: from,
        when: new Date().getTime(),
        message: (error as Error)?.message,
      },
      level
    );

    if (rs) {
      const exception = exceptionCollector.getSeverest();
      if (exception?.length > 0) {
        emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
      }
    }
  };

  const removeException = (props: IErrorSearchProps, searchBy: string) => {
    const rs = exceptionCollector.remove(props, searchBy);
    if (rs) {
      const exception = exceptionCollector.getSeverest();
      if (exception?.length > 0) {
        emitter.emit(TideBitEvent.EXCEPTION_UPDATE, exception);
      } else {
        emitter.emit(TideBitEvent.EXCEPTION_CLEARED, undefined);
      }
    }
  };

  const clearException = () => {
    exceptionCollector.reset();
    emitter.emit(TideBitEvent.EXCEPTION_CLEARED, undefined);
  };

  const isRead = async (id: string) => {
    const updatedNotifications: INotificationItem[] = [...notificationsRef.current];
    const index = updatedNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      updatedNotifications[index] = {
        ...updatedNotifications[index],
        isRead: true,
      };

      const expirationTimestamp = addDaysToDate(COOKIE_PERIOD_CRITICAL_ANNOUNCEMENT);
      setCookie(`notificationRead_${id}`, expirationTimestamp, expirationTimestamp);
    }
    emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS, updatedNotifications);
    updateNotifications(updatedNotifications);

    return;
  };

  const checkAndResetNotifications = async (): Promise<void> => {
    const updatedNotifications: INotificationItem[] = [...notificationsRef.current];
    let isUpdated = false;

    updatedNotifications.forEach(notification => {
      const cookieValue = getCookieByName(`notificationRead_${notification.id}`);
      // eslint-disable-next-line no-console
      console.log('cookieValue', cookieValue);
      if (cookieValue) {
        if (!isCookieExpired(cookieValue)) {
          notification.isRead = true;
        } else {
          notification.isRead = false;
        }
        isUpdated = true;
      }
    });

    if (isUpdated) {
      updateNotifications(updatedNotifications);
    }
  };

  const readAll = async () => {
    const updatedNotifications: INotificationItem[] = notificationsRef.current
      ? notificationsRef.current.map(n => ({
          ...n,
          isRead: true,
        }))
      : [];
    emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS, updatedNotifications);
    updateNotifications(updatedNotifications);
    return;
  };

  const updateNotifications = (notifications: INotificationItem[]) => {
    const updateNotifications: INotificationItem[] = [...notifications];
    setNotifications(updateNotifications);
    setUnreadNotifications(updateNotifications.filter(n => !n.isRead));
  };

  const init = async () => {
    checkAndResetNotifications();
    return await Promise.resolve();
  };

  const reset = () => {
    setNotifications([]);
    setUnreadNotifications([]);
    return;
  };

  // Event: Logout
  const clearPrivateNotification = () => {
    let updateNotifications: INotificationItem[] = notificationsRef.current
      ? [...notificationsRef.current]
      : [];
    let updateUnreadNotifications: INotificationItem[] = [];
    updateNotifications = updateNotifications.filter(n => n.public);
    updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
    setNotifications(updateNotifications);
    setUnreadNotifications(updateUnreadNotifications);
  };

  React.useMemo(() => emitter.on(TideBitEvent.DISCONNECTED, clearPrivateNotification), []);
  React.useMemo(
    () => emitter.on(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, updateNotifications),
    []
  );
  React.useMemo(() => emitter.on(TideBitEvent.NOTIFICATIONS, updateNotifications), []);

  const defaultValue = {
    emitter,
    notifications: notificationsRef.current,
    unreadNotifications: unreadNotificationsRef.current,
    isRead,
    readAll,
    init,
    reset,
    addException,
    clearException,
    removeException,
    getSeverestException,
  };

  return (
    <NotificationContext.Provider value={defaultValue}>{children}</NotificationContext.Provider>
  );
};

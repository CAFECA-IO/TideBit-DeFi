import React, {useContext, createContext, useEffect} from 'react';
import useState from 'react-usestateref';
import {UserContext} from './user_context';
import {MarketContext} from './market_context';
import {NotificationContext} from './notification_context';
import {WorkerContext} from './worker_context';

interface IAppProvider {
  children: React.ReactNode;
}

interface IAppContext {
  isInit: boolean;
  isStart: boolean;
  init: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  isInit: false,
  isStart: false,
  init: () => Promise.resolve(),
});

export const AppProvider = ({children}: IAppProvider) => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const [isStart, setIsStart, isStartRef] = useState<boolean>(false);
  const [notificationIsInit, setNotificationIsInit, notificationIsInitRef] =
    useState<boolean>(false);
  const [marketIsInit, setMarketIsInit, marketIsInitRef] = useState<boolean>(false);
  const [userIsInit, setUserIsInit, userIsInitRef] = useState<boolean>(false);

  const init = async () => {
    if (!isInitRef.current) {
      setIsInit(true);
      workerCtx.init();
      await userCtx.init();
      await marketCtx.init();
      await notificationCtx.init();
      if (workerCtx.worker) {
        workerCtx.worker.onmessage = event => {
          if (event.data === 'notification_init') {
            setNotificationIsInit(true);
          }
          if (event.data === 'market_init') {
            setMarketIsInit(true);
          }
          if (event.data === 'user_init') {
            setUserIsInit(true);
          }
        };
      }
    }
    return;
  };

  useEffect(() => {
    if (notificationIsInit && marketIsInit && userIsInit) {
      setIsStart(true);
    }
  }, [notificationIsInit, marketIsInit, userIsInit]);

  const defaultValue = {
    isStart: isStartRef.current,
    isInit: isInitRef.current,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};

import React, {useContext, createContext} from 'react';
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
  init: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  isInit: false,
  init: () => Promise.resolve(),
});

export const AppProvider = ({children}: IAppProvider) => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const notificationCtx = useContext(NotificationContext);
  const workerCtx = useContext(WorkerContext);
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);

  const init = async () => {
    if (!isInitRef.current) {
      setIsInit(true);
      workerCtx.init();
      await notificationCtx.init();
      await userCtx.init();
      await marketCtx.init();
    }
    return;
  };

  const defaultValue = {
    isInit: isInitRef.current,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};

// Deprecate: [debug: user login take time] (20230522 - tzuhan)
/* eslint-disable no-console */
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
      // Deprecate: [debug: user login take time] (20230522 - tzuhan)
      console.time(`AppProvider.init workerCtx.init`);
      workerCtx.init();
      console.timeEnd(`AppProvider.init workerCtx.init`);
      // Deprecate: [debug: user login take time] (20230522 - tzuhan)
      console.time(`AppProvider.init notificationCtx.init`);
      await notificationCtx.init();
      console.timeEnd(`AppProvider.init notificationCtx.init`);
      // Deprecate: [debug: user login take time] (20230522 - tzuhan)
      console.time(`AppProvider.init userCtx.init`);
      await userCtx.init();
      console.timeEnd(`AppProvider.init userCtx.init`);
      // Deprecate: [debug: user login take time] (20230522 - tzuhan)
      console.time(`AppProvider.init marketCtx.init`);
      await marketCtx.init();
      console.timeEnd(`AppProvider.init marketCtx.init`);
    }
    return;
  };

  const defaultValue = {
    isInit: isInitRef.current,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};

/* eslint-disable no-console */
import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
import {UserContext} from './user_context';
import {MarketContext} from './market_context';
import {NotificationContext} from './notification_context';

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
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const init = async () => {
    console.log(`AppProvider init is called`);
    await userCtx.init();
    await marketCtx.init();
    await notificationCtx.init();
    setIsInit(true);
    return;
  };

  const defaultValue = {
    isInit: isInitRef.current,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};

import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';

type PushTokenContextType = {
  token?: string;
};

const PushTokenContext = createContext({} as PushTokenContextType);

export const PushTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    const getToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setToken(token.data);
    };
    getToken();
  }, []);

  return <PushTokenContext.Provider value={{ token }}>{children}</PushTokenContext.Provider>;
};

export const useToken = () => {
  const { token } = useContext(PushTokenContext);
  return token;
};

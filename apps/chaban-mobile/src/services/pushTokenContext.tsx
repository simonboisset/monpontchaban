import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';

type PushTokenContextType = {
  token?: string;
  today: string;
};

const PushTokenContext = createContext({} as PushTokenContextType);

export const PushTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>();
  const [today] = useState(() => dayjs().startOf('day').toISOString());
  useEffect(() => {
    const getToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setToken(token.data);
    };
    getToken();
  }, []);

  return <PushTokenContext.Provider value={{ token, today }}>{children}</PushTokenContext.Provider>;
};

export const useToken = () => {
  const { token, today } = useContext(PushTokenContext);
  return { token, today };
};

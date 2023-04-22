import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export const useToken = () => {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    const getToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setToken(token.data);
    };
    getToken();
  }, []);

  return token;
};

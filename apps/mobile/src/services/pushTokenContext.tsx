import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '../ui/useToast';

type PushTokenContextType = {
  token?: string;
  setToken: (token: string) => void;
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

  return <PushTokenContext.Provider value={{ token, setToken }}>{children}</PushTokenContext.Provider>;
};

export const useToken = () => {
  const { token, setToken } = useContext(PushTokenContext);
  const requestToken = async () => {
    if (token) return token;
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          toast({ title: 'Vous devez autoriser les notifications pour vous inscrire' });
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setToken(token);
        return token;
      } else {
        toast({ title: 'Vous devez être sur un appareil pour vous inscrire', color: 'error' });
        return;
      }
    } catch (error) {
      toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
    }
  };
  return { token, setToken, requestToken };
};

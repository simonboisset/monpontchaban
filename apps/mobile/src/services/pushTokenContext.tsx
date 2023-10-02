import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
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
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
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
          if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          }
          const { status } = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
            },
          });
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          toast({ title: 'Vous devez autoriser les notifications pour vous inscrire' });
          return;
        }
        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
          })
        ).data;
        setToken(token);
        return token;
      } else {
        toast({ title: 'Vous devez être sur un appareil pour vous inscrire', color: 'error' });
        return;
      }
    } catch (error) {
      toast({
        title: 'Un problème est survenu, veuillez réessayer ultérieurement',
        message: `${JSON.stringify(error)}`,
      });
    }
  };
  return { token, setToken, requestToken };
};

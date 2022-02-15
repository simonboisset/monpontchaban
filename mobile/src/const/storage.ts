import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from 'sentry-expo';

const setItem = async (value: string) => {
  try {
    await AsyncStorage.setItem('enable-notifications', value);
  } catch (e) {
    Sentry.Native.captureException(e);
  }
};

const getItem = async () => {
  try {
    return AsyncStorage.getItem('enable-notifications');
  } catch (e) {
    Sentry.Native.captureException(e);
  }
};

export const storage = { setItem, getItem };

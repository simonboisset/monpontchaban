import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = async (value: string) => {
  try {
    await AsyncStorage.setItem('enable-notifications', value);
  } catch (e) {}
};

const getItem = async () => {
  try {
    return AsyncStorage.getItem('enable-notifications');
  } catch (e) {}
};

const enableNotification = async () => {
  try {
    return AsyncStorage.setItem('enable-notifications', 'true');
  } catch (e) {}
};
const desableNotification = async () => {
  try {
    return AsyncStorage.setItem('enable-notifications', 'false');
  } catch (e) {}
};
const hasNotification = async () => {
  try {
    const notification = await AsyncStorage.getItem('enable-notifications');
    return notification === 'true';
  } catch (e) {
    return false;
  }
};
const setPushTokenSent = async () => {
  try {
    return AsyncStorage.setItem('push-token-sent', 'true');
  } catch (e) {}
};
const hasPushTokenSent = async () => {
  try {
    const token = await AsyncStorage.getItem('push-token-sent');
    return token === 'true';
  } catch (e) {}
};
export const storage = {
  setItem,
  getItem,
  desableNotification,
  enableNotification,
  hasNotification,
  hasPushTokenSent,
  setPushTokenSent,
};

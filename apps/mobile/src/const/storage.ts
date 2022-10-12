import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { chabanMonitor } from 'src/monitor';
const setItem = async (value: string) => {
  try {
    await AsyncStorage.setItem('enable-notifications', value);
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] setItem', `${e}`);
  }
};

const getItem = async () => {
  try {
    return AsyncStorage.getItem('enable-notifications');
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] getItem', `${e}`);
  }
};

const enableNotification = async () => {
  try {
    return AsyncStorage.setItem('enable-notifications', 'true');
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] enableNotification', `${e}`);
  }
};
const desableNotification = async () => {
  try {
    return AsyncStorage.setItem('enable-notifications', 'false');
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] desableNotification', `${e}`);
  }
};
const hasNotification = async () => {
  try {
    const notification = await AsyncStorage.getItem('enable-notifications');
    return notification === 'true';
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] hasNotification', `${e}`);
    return false;
  }
};
const setPushTokenSent = async () => {
  try {
    return AsyncStorage.setItem('push-token-sent', 'true');
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] setPushTokenSent', `${e}`);
  }
};
const hasPushTokenSent = async () => {
  try {
    const token = await AsyncStorage.getItem('push-token-sent');
    return token === 'true';
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] getVisitor', `${e}`);
  }
};

const getVisitor = async () => {
  try {
    const visitor = await AsyncStorage.getItem('visitor');
    if (visitor) {
      return visitor;
    }
    const id = uuid.v4();
    const newVisitor = typeof id === 'string' ? id : JSON.stringify(uuid.v4());
    await AsyncStorage.setItem('visitor', newVisitor);
    return newVisitor;
  } catch (e) {
    chabanMonitor().error('[AsyncStorage] getVisitor', `${e}`);
  }
};

export const storage = {
  setItem,
  getItem,
  desableNotification,
  enableNotification,
  hasNotification,
  hasPushTokenSent,
  setPushTokenSent,
  getVisitor,
};

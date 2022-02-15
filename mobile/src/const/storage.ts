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

export const storage = { setItem, getItem };

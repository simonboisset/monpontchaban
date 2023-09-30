import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from 'react';
import { z } from 'zod';

const asyncStorageSchema = z.object({
  authToken: z.string().nullable(),
});
type ChabanAsyncStorage = z.infer<typeof asyncStorageSchema>;
const emptyValue: ChabanAsyncStorage = { authToken: null };

const useAsyncStorageContextValue = () => {
  const [asyncValue, setAsyncValue] = useState<ChabanAsyncStorage>();

  const setAsyncStorage = async (value: ChabanAsyncStorage) => {
    const valueValidated = asyncStorageSchema.parse(value);
    await SecureStore.setItemAsync('chabanStorage', JSON.stringify(valueValidated));
    setAsyncValue(valueValidated);
  };

  useEffect(() => {
    const getAsyncStorage = async (): Promise<ChabanAsyncStorage> => {
      try {
        const value = await SecureStore.getItemAsync('chabanStorage');
        if (value) {
          const valueParsed = JSON.parse(value);
          const valueValidated = asyncStorageSchema.parse(valueParsed);
          setAsyncValue(valueValidated);
          return valueValidated;
        }

        setAsyncStorage(emptyValue);
        return emptyValue;
      } catch (error) {
        await SecureStore.deleteItemAsync('chabanStorage');
        setAsyncStorage(emptyValue);
        return emptyValue;
      }
    };

    getAsyncStorage();
  }, []);

  const isInitialized = asyncValue !== undefined;

  return { asyncValue: asyncValue || emptyValue, setAsyncStorage, isInitialized };
};

const AsyncStorageContext = createContext({} as ReturnType<typeof useAsyncStorageContextValue>);

export const AsyncStorageProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useAsyncStorageContextValue();

  return <AsyncStorageContext.Provider value={value}>{children}</AsyncStorageContext.Provider>;
};

export const useAuthToken = () => {
  const { asyncValue, setAsyncStorage } = useAsyncStorageContextValue();
  const authToken = asyncValue.authToken || null;
  const setAuthToken = (token: string | null) => {
    return setAsyncStorage({ ...asyncValue, authToken: token });
  };

  return { authToken, setAuthToken };
};

export const useIsStorageInitialized = () => {
  const { isInitialized } = useAsyncStorageContextValue();
  return isInitialized;
};

export const getAuthToken = async () => {
  try {
    const value = await SecureStore.getItemAsync('chabanStorage');

    if (value) {
      const valueParsed = JSON.parse(value);
      const valueValidated = asyncStorageSchema.parse(valueParsed);
      return valueValidated.authToken;
    }
    return null;
  } catch (error) {
    await SecureStore.deleteItemAsync('chabanStorage');
    return null;
  }
};

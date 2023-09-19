import { createContext, useContext } from 'react';

type ErrorContextValue = { error: string | undefined; setError: (error: string | undefined) => void };
export const ErrorContext = createContext({} as ErrorContextValue);
export const useError = () => {
  const { error, setError } = useContext(ErrorContext);
  return { error, setError };
};

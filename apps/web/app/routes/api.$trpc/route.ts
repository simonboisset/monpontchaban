import { DataFunctionArgs } from '@remix-run/node';
import { handleRequest } from '~/domain/api.server';

export const loader = async (args: DataFunctionArgs) => {
  return handleRequest(args);
};
export const action = async (args: DataFunctionArgs) => {
  return handleRequest(args);
};

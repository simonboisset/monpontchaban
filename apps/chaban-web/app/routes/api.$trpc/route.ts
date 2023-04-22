import { ActionArgs, LoaderArgs } from '@remix-run/node';
import { handleRequest } from '~/domain/api.server';

export const loader = async (args: LoaderArgs) => {
  return handleRequest(args);
};
export const action = async (args: ActionArgs) => {
  return handleRequest(args);
};

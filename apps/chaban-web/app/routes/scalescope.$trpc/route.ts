import { ActionArgs, LoaderArgs } from '@remix-run/node';
import { handleRequestScalescope } from '~/domain/api.server';

export const loader = async (args: LoaderArgs) => {
  return handleRequestScalescope(args);
};
export const action = async (args: ActionArgs) => {
  return handleRequestScalescope(args);
};

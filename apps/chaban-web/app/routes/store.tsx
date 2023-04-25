import { LoaderArgs, redirect } from '@remix-run/node';

export const loader = async (args: LoaderArgs) => {
  const isiOS = args.request.headers.get('user-agent')?.includes('iPhone');
  if (isiOS) {
    return redirect('https://apps.apple.com/us/app/mon-pont-chaban/id6448217836');
  }

  return redirect('https://play.google.com/store/apps/details?id=com.simonboisset.monpontchaban');
};

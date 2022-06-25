import { useLoaderData } from '@remix-run/react';
import { ScreenView } from '~/components/ScreenView';
import { api } from '~/const/api';
import { filterNextBridgeEvents } from '~/const/filterNextBridgeEvents';

export const loader = async () => {
  const fetchedDatas = await api.get();
  return fetchedDatas?.filter(filterNextBridgeEvents(new Date())) || [];
};

type Data = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const datas = useLoaderData<Data>();

  return (
    <ScreenView
      datas={datas.map(({ closeAt, openAt }) => ({ closeAt: new Date(closeAt), openAt: new Date(openAt) }))}
    />
  );
}

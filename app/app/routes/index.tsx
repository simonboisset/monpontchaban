import { useLoaderData } from 'remix';
import { ScreenView } from '~/components/ScreenView';
import { api } from '~/const/api';

export const loader = async () => {
  const fetchedDatas = await api.get();
  return fetchedDatas?.filter((reccord) => reccord.openAt.getTime() > new Date().getTime()) || [];
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

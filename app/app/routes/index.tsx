import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useLoaderData } from 'remix';
import { ScreenView } from '~/components/ScreenView';
import { api } from '~/const/api';

export const loader = async () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Europe/Paris');
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

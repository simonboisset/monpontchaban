import { Alert } from '@lezo-alert/db';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { z } from 'zod';
import { managedChannelIds } from '../../config/managedChannels';
const get = async () => {
  const datas = await fetchDataToJson();
  return getBridgeLiftingsFromApi(datas);
};

export const apiBordeauxMetropole = { get };

const apiBordeauxMetropoleDataSchema = z.object({
  records: z.array(
    z.object({
      fields: z.object({
        bateau: z.string(),
        date_passage: z.string(),
        fermeture_a_la_circulation: z.string(),
        re_ouverture_a_la_circulation: z.string(),
      }),
    }),
  ),
});

type ApiBordeauxMetropoleData = z.infer<typeof apiBordeauxMetropoleDataSchema>;

export const getBridgeLiftingsFromApi = (datas: ApiBordeauxMetropoleData) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return datas.records
    .map((record) => {
      const date = record.fields.date_passage;
      const [hStart, mStart] = record.fields.fermeture_a_la_circulation.split(':').map(Number);
      const [hEnd, mEnd] = record.fields.re_ouverture_a_la_circulation.split(':').map(Number);
      if (hStart === undefined || mStart === undefined || hEnd === undefined || mEnd === undefined) {
        throw new Error('getBridgeLiftingsFromApi invalid data');
      }
      const closeAt = dayjs.tz(`${date} ${hStart}:${mStart}`, 'YYYY-MM-DD HH:mm', 'Europe/Paris').toDate();
      let openAt = dayjs.tz(`${date} ${hEnd}:${mEnd}`, 'YYYY-MM-DD HH:mm', 'Europe/Paris').toDate();

      if (dayjs(closeAt).isAfter(openAt)) {
        openAt = dayjs(openAt).add(1, 'day').toDate();
      }
      return {
        title: record.fields.bateau,
        startAt: closeAt,
        endAt: openAt,
        channelId: managedChannelIds.chaban,
      } satisfies Omit<Alert, 'id'>;
    })
    .sort((a, b) => a.startAt.getTime() - b.endAt.getTime());
};

const fetchDataToJson = async () => {
  const req = await fetch(
    'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=200&sort=-date_passage&facet=bateau',
  );
  const json = await req.json();
  const data = apiBordeauxMetropoleDataSchema.parse(json);
  return data;
};

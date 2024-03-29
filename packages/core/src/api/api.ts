import dayjs from 'dayjs';
import { BridgeEvent } from './BridgeEvent';
type Data = {
  fields: {
    date_passage: string;
    fermeture_a_la_circulation: string;
    re_ouverture_a_la_circulation: string;
  };
};
export const getBridgeEvents = (datas: Data[]): BridgeEvent[] =>
  datas
    .map((record) => {
      const date = record.fields.date_passage;
      const [hClose, mClose] = record.fields.fermeture_a_la_circulation
        .split(':')
        .map((value: string) => Number(value));
      const [hOpen, mOpen] = record.fields.re_ouverture_a_la_circulation
        .split(':')
        .map((value: string) => Number(value));

      const closeAt = dayjs(`${date}`, 'YYYY-MM-DD').toDate();
      closeAt.setHours(hClose);
      let openAt = dayjs(`${date}`, 'YYYY-MM-DD').toDate();
      openAt.setHours(hOpen);
      if (dayjs(closeAt).isAfter(openAt)) {
        openAt = dayjs(openAt).add(1, 'day').toDate();
      }
      return {
        closeAt: dayjs(closeAt.setMinutes(mClose)).toDate(),
        openAt: dayjs(openAt.setMinutes(mOpen)).toDate(),
      };
    })
    .sort((a, b) => a.closeAt.getTime() - b.closeAt.getTime());

const get = async () => {
  try {
    const req = await fetch(
      'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=200&sort=-date_passage&facet=bateau'
    );
    const datas: { records: Data[] } = await req.json();

    return getBridgeEvents(datas.records);
  } catch (error) {}
};

export const api = { get };

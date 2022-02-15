import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

type Data = {
  fields: {
    date_passage: string;
    fermeture_a_la_circulation: string;
    re_ouverture_a_la_circulation: string;
  };
};

const get = async () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  try {
    const req = await fetch(
      'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=200&sort=-date_passage&facet=bateau',
    );
    const datas: { records: Data[] } = await req.json();

    return datas.records.map((record) => {
      const date = record.fields.date_passage;
      const [hClose, mClose] = record.fields.fermeture_a_la_circulation
        .split(':')
        .map((value: string) => Number(value));
      const [hOpen, mOpen] = record.fields.re_ouverture_a_la_circulation
        .split(':')
        .map((value: string) => Number(value));

      const closeAt = dayjs(`${date}`, 'YYYY-MM-DD', 'fr').toDate();
      closeAt.setHours(hClose);
      const openAt = dayjs(`${date}`, 'YYYY-MM-DD', 'fr').toDate();
      openAt.setHours(hOpen);
      return {
        closeAt: dayjs(closeAt.setMinutes(mClose)).tz('Europe/Paris', true).toDate(),
        openAt: dayjs(openAt.setMinutes(mOpen)).tz('Europe/Paris', true).toDate(),
      };
    });
  } catch (error) {}
};

export const api = { get };

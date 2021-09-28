import axios from 'axios';
import dayjs from 'dayjs';
import * as Sentry from 'sentry-expo';

type Data = {
  fields: {
    date_passage: string;
    fermeture_a_la_circulation: string;
    re_ouverture_a_la_circulation: string;
  };
};

const get = async () => {
  try {
    const req = await axios.get(
      'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=200&sort=-date_passage&facet=bateau'
    );
    const records: Data[] = req.data.records;
    return records.map((record) => {
      const date = record.fields.date_passage;
      const [hClose, mClose] = record.fields.fermeture_a_la_circulation
        .split(':')
        .map((value: string) => Number(value));
      const [hOpen, mOpen] = record.fields.re_ouverture_a_la_circulation
        .split(':')
        .map((value: string) => Number(value));

      const closeAt = dayjs(`${date}`, 'YYYY-MM-DD', 'fr').toDate();
      closeAt.setHours(hClose);
      closeAt.setMinutes(mClose);
      const openAt = dayjs(`${date}`, 'YYYY-MM-DD', 'fr').toDate();
      openAt.setHours(hOpen);
      openAt.setMinutes(mOpen);
      return { closeAt, openAt };
    });
  } catch (error) {
    Sentry.Native.captureException(error);
  }
};

export const api = { get };

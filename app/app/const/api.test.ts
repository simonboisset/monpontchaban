import dayjs from 'dayjs';
import { api, getBridgeEvents } from './api';
import { fakeResponse } from './fakeResponse';
import { fakeResult } from './fakeResults';

describe('Api', () => {
  test('Should map data to BridgeEvents', () => {
    const data = getBridgeEvents(fakeResponse.records);
    expect(data).toEqual(fakeResult);
  });
  test('opended is after closed', () => {
    const data = getBridgeEvents(fakeResponse.records);
    data.forEach(({ openAt, closeAt }) => expect(dayjs(closeAt).isBefore(openAt)).toBe(true));
  });
  test('Should fetch data', async () => {
    //@ts-ignore
    fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(fakeResponse))));

    const data = await api.get();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=200&sort=-date_passage&facet=bateau',
    );
    expect(data).toBeDefined();
    data?.forEach(({ openAt, closeAt }) => {
      expect(dayjs(openAt).isValid()).toBe(true);
      expect(dayjs(closeAt).isValid()).toBe(true);
      expect(dayjs(closeAt).isBefore(openAt)).toBe(true);
    });
  });
});

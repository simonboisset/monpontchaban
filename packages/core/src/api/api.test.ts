import dayjs from 'dayjs';
import { describe, expect, test, vi } from 'vitest';
import { api, getBridgeEvents } from './api';
import { fakeResponse } from './fakeResponse';
import { fakeResult } from './fakeResults';

vi.mock('node-fetch', () => Promise.resolve(new Response(JSON.stringify(fakeResponse))));
describe('Api', () => {
  test('Should map data to BridgeEvents', () => {
    const data = getBridgeEvents(fakeResponse.records);
    expect(data.length).toEqual(fakeResult.length);
    expect(data[10]).toEqual(fakeResult[10]);
  });
  test('opended is after closed', () => {
    const data = getBridgeEvents(fakeResponse.records);
    data.forEach(({ openAt, closeAt }) => expect(dayjs(closeAt).isBefore(openAt)).toBe(true));
  });
  test('Should fetch data', async () => {
    const data = await api.get();

    expect(data).toBeDefined();
    data?.forEach(({ openAt, closeAt }) => {
      expect(dayjs(openAt).isValid()).toBe(true);
      expect(dayjs(closeAt).isValid()).toBe(true);
      expect(dayjs(closeAt).isBefore(openAt)).toBe(true);
    });
  });
});

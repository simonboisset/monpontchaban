import dayjs from 'dayjs';
import { describe, expect, test } from 'vitest';
import { fakeResult } from '../api/fakeResults';
import { filterNextBridgeEvents } from './filterNextBridgeEvents';

describe('Filter futur bridge events', () => {
  test('Should filter data of the day', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-11-20 08:00`, 'YYYY-MM-DD HH:mm').toDate())
    );
    expect(filteredEvents.length).toBe(2);
    expect(filteredEvents[0]).toBe(fakeResult[74]);
  });
  test('Should filter data with current event', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-11-20 23:30`, 'YYYY-MM-DD HH:mm').toDate())
    );
    expect(filteredEvents.length).toBe(2);
    expect(filteredEvents[0]).toBe(fakeResult[74]);
  });
  test('Should filter data with current event on next day', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-11-21 01:30`, 'YYYY-MM-DD HH:mm').toDate())
    );
    expect(filteredEvents.length).toBe(2);
    expect(filteredEvents[0]).toBe(fakeResult[74]);
  });
  test('Should not filter ended event', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-11-21 05:00`, 'YYYY-MM-DD HH:mm').toDate())
    );
    expect(filteredEvents.length).toBe(1);
    expect(filteredEvents[0]).toBe(fakeResult[75]);
  });
});

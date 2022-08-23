import dayjs from 'dayjs';
import { fakeResult } from './fakeResults';
import { filterNextBridgeEvents } from './filterNextBridgeEvents';

describe('Filter futur bridge events', () => {
  test('Should filter data of the day', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-02-20 22:00`, 'YYYY-MM-DD HH:mm', 'fr').toDate())
    );
    expect(filteredEvents.length).toBe(88);
    expect(filteredEvents[0]).toBe(fakeResult[1]);
  });
  test('Should filter data with current event', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-03-20 23:30`, 'YYYY-MM-DD HH:mm', 'fr').toDate())
    );
    expect(filteredEvents.length).toBe(87);
    expect(filteredEvents[0]).toBe(fakeResult[2]);
  });
  test('Should filter data with current event on next day', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-03-21 04:59`, 'YYYY-MM-DD HH:mm', 'fr').toDate())
    );
    expect(filteredEvents.length).toBe(87);
    expect(filteredEvents[0]).toBe(fakeResult[2]);
  });
  test('Should not filter ended event', () => {
    const filteredEvents = fakeResult.filter(
      filterNextBridgeEvents(dayjs(`2022-03-21 05:00`, 'YYYY-MM-DD HH:mm', 'fr').toDate())
    );
    expect(filteredEvents.length).toBe(86);
    expect(filteredEvents[0]).toBe(fakeResult[3]);
  });
});

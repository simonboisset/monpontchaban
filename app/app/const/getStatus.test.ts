import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { fakeResult } from './fakeResults';
import { getStatus } from './getStatus';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('Api', () => {
  test('Should be opened without event', () => {
    const now = dayjs(`2022-03-20 23:00`, 'YYYY-MM-DD HH:mm', 'fr').toDate();

    expect(getStatus(now, undefined, fakeResult[2].openAt)).toBe('OPEN');
    expect(getStatus(now, fakeResult[2].closeAt)).toBe('OPEN');
    expect(getStatus(now)).toBe('OPEN');
  });
  test('Should be opened before 12h before', () => {
    const now = dayjs(`2022-03-20 10:59`, 'YYYY-MM-DD HH:mm', 'fr').toDate();
    const status = getStatus(now, fakeResult[2].closeAt, fakeResult[2].openAt);
    expect(status).toBe('OPEN');
  });
  test('will be closed at 12h before', () => {
    const now = dayjs(`2022-03-20 11:00`, 'YYYY-MM-DD HH:mm', 'fr').toDate();
    const status = getStatus(now, fakeResult[2].closeAt, fakeResult[2].openAt);
    expect(status).toBe('WILL_CLOSE');
  });
  test('will be closed at 1 minute before', () => {
    const now = dayjs(`2022-03-20 22:59`, 'YYYY-MM-DD HH:mm', 'fr').toDate();
    const status = getStatus(now, fakeResult[2].closeAt, fakeResult[2].openAt);
    expect(status).toBe('WILL_CLOSE');
  });
  test('Should be closed at closed time', () => {
    const now = dayjs(`2022-03-20 23:00`, 'YYYY-MM-DD HH:mm', 'fr').toDate();
    const status = getStatus(now, fakeResult[2].closeAt, fakeResult[2].openAt);
    expect(status).toBe('CLOSED');
  });
  test('Should be closed at 1 minute before open', () => {
    const now = dayjs(`2022-03-21 04:59`, 'YYYY-MM-DD HH:mm', 'fr').toDate();
    const status = getStatus(now, fakeResult[2].closeAt, fakeResult[2].openAt);
    expect(status).toBe('CLOSED');
  });
  test('Should be opened after open time', () => {
    const now = dayjs(`2022-03-21 05:00`, 'YYYY-MM-DD HH:mm', 'fr').toDate();
    const status = getStatus(now, fakeResult[2].closeAt, fakeResult[2].openAt);
    expect(status).toBe('OPEN');
  });
});

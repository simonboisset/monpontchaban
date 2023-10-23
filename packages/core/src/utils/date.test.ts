import dayjs from 'dayjs';
import { describe, expect, test } from 'vitest';
import { isNextWeek, isThisWeek, isToday, isTomorrow } from './date';

describe('Date group', () => {
  test('Should be today', () => {
    const now = dayjs(`2023-10-18 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date = dayjs(`2023-10-18 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    expect(isToday(date, now)).toBe(true);
    expect(isTomorrow(date, now)).toBe(false);
    expect(isThisWeek(date, now)).toBe(false);
    expect(isNextWeek(date, now)).toBe(false);
  });
  test('Should be tomorrow', () => {
    const now = dayjs(`2023-10-18 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date = dayjs(`2023-10-19 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    expect(isToday(date, now)).toBe(false);
    expect(isTomorrow(date, now)).toBe(true);
    expect(isThisWeek(date, now)).toBe(false);
    expect(isNextWeek(date, now)).toBe(false);
  });
  test('Should be this week', () => {
    const now = dayjs(`2023-10-18 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date = dayjs(`2023-10-22 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    expect(isToday(date, now)).toBe(false);
    expect(isTomorrow(date, now)).toBe(false);
    expect(isThisWeek(date, now)).toBe(true);
    expect(isNextWeek(date, now)).toBe(false);
  });
  test('Should be next week', () => {
    const now = dayjs(`2023-10-18 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const now2 = dayjs(`2023-10-22 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date = dayjs(`2023-10-23 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date2 = dayjs(`2023-10-29 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    expect(isToday(date, now)).toBe(false);
    expect(isToday(date2, now)).toBe(false);
    expect(isToday(date2, now2)).toBe(false);
    expect(isTomorrow(date, now)).toBe(false);
    expect(isTomorrow(date2, now)).toBe(false);
    expect(isTomorrow(date2, now2)).toBe(false);
    expect(isThisWeek(date, now)).toBe(false);
    expect(isThisWeek(date2, now)).toBe(false);
    expect(isThisWeek(date2, now2)).toBe(false);
    expect(isNextWeek(date, now)).toBe(true);
    expect(isNextWeek(date2, now)).toBe(true);
    expect(isNextWeek(date2, now2)).toBe(true);
  });
  test('Should be after next week', () => {
    const now = dayjs(`2023-10-18 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date = dayjs(`2023-10-30 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    expect(isToday(date, now)).toBe(false);
    expect(isTomorrow(date, now)).toBe(false);
    expect(isThisWeek(date, now)).toBe(false);
    expect(isNextWeek(date, now)).toBe(false);
  });
  test('Should be next week sunday', () => {
    const now = dayjs(`2023-10-23 08:00`, 'YYYY-MM-DD HH:mm').toDate();
    const date = dayjs(`2023-11-05 23:00`, 'YYYY-MM-DD HH:mm').toDate();
    expect(isToday(date, now)).toBe(false);
    expect(isTomorrow(date, now)).toBe(false);
    expect(isThisWeek(date, now)).toBe(false);
    expect(isNextWeek(date, now)).toBe(true);
  });
});

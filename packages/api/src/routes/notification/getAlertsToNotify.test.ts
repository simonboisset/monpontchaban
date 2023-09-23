import { describe, expect, test } from 'vitest';
import { schedules } from '../../schedules';
import { getAlertsToNotify, getCurrenSchedule, getDateFromNextSchedule, getNextSchedule } from './getAlertsToNotify';

describe('Send Alerts', () => {
  test('Should get current schedule Monday at 8', () => {
    const now = new Date('2023-09-18T08:10');
    const selectedSchedules = schedules.filter((s) => s.hour === 8);
    const nextSchedule = getCurrenSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(1);
    expect(nextSchedule?.hour).toBe(8);
  });
  test('Should get current schedule Monday at 8 - 2', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules;
    const nextSchedule = getCurrenSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(1);
    expect(nextSchedule?.hour).toBe(8);
  });
  test('Should not get current schedule Monday at 8', () => {
    const now = new Date('2023-09-18T08:10');
    const selectedSchedules = schedules.filter((s) => s.hour === 9);
    const nextSchedule = getCurrenSchedule(now, selectedSchedules);
    expect(nextSchedule).toBeUndefined();
  });
  test('Should not get current schedule Monday at 8 - 3', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => s.day === 0);
    const nextSchedule = getCurrenSchedule(now, selectedSchedules);
    expect(nextSchedule).toBeUndefined();
  });
  test('Should get current schedule Monday at 8 - 4', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => s.day === 1);
    const nextSchedule = getCurrenSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(1);
    expect(nextSchedule?.hour).toBe(8);
  });
  test('Should get current schedule Monday at 8 - 5', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => s.day === 1 && s.hour === 8);
    const nextSchedule = getCurrenSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(1);
    expect(nextSchedule?.hour).toBe(8);
  });
  test('Should get next schedule Monday at 8', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => s.day === 1 && s.hour === 8);
    const nextSchedule = getNextSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(1);
    expect(nextSchedule?.hour).toBe(8);
  });
  test('Should get next schedule Monday at 9', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules;
    const nextSchedule = getNextSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(1);
    expect(nextSchedule?.hour).toBe(9);
  });
  test('Should get next schedule Monday at 9', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => s.hour === 8);
    const nextSchedule = getNextSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(2);
    expect(nextSchedule?.hour).toBe(8);
  });
  test('Should get next schedule Monday at 9', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => s.hour === 8 || s.hour === 6);
    const nextSchedule = getNextSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(2);
    expect(nextSchedule?.hour).toBe(6);
  });
  test('Should get next schedule Monday at 9', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedules = schedules.filter((s) => (s.day === 0 && s.hour === 7) || (s.day === 1 && s.hour === 8));
    const nextSchedule = getNextSchedule(now, selectedSchedules);
    expect(nextSchedule?.day).toBe(0);
    expect(nextSchedule?.hour).toBe(7);
  });
  test('Should get date from next Monday at 9', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedule = { day: 1, hour: 8, id: 0 };
    const date = getDateFromNextSchedule(selectedSchedule, now);
    expect(date).toEqual(new Date('2023-09-25T08:00'));
  });
  test('Should get date from next schedule 2', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedule = { day: 1, hour: 9, id: 0 };
    const date = getDateFromNextSchedule(selectedSchedule, now);
    expect(date).toEqual(new Date('2023-09-18T09:00'));
  });
  test('Should get date from next schedule 3', () => {
    const now = new Date('2023-09-18T08:00');
    const selectedSchedule = { day: 2, hour: 7, id: 0 };
    const date = getDateFromNextSchedule(selectedSchedule, now);
    expect(date).toEqual(new Date('2023-09-19T07:00'));
  });
  test('Should get date from next schedule 4', () => {
    const now = new Date('2023-09-18T08:09');
    const selectedSchedule = { day: 2, hour: 7, id: 0 };
    const date = getDateFromNextSchedule(selectedSchedule, now);
    expect(date).toEqual(new Date('2023-09-19T07:00'));
  });
  test('Should get alerts 1', () => {
    const now = new Date('2023-09-18T08:00');

    const alerts = [
      {
        id: '1',
        title: 'test',
        startAt: new Date('2023-09-18T08:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '2',
        title: 'test',
        startAt: new Date('2023-09-18T08:20'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '3',
        title: 'test',
        startAt: new Date('2023-09-18T09:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '4',
        title: 'test',
        startAt: new Date('2023-09-18T09:01'),
        endAt: new Date('2023-09-18T08:00'),
      },
    ];
    const selectedSchedule = schedules;
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 0);
    const alertsToNotify2 = getAlertsToNotify(now, alerts, selectedSchedule, 1);
    const ids = alertsToNotify.map(({ id }) => id);
    const id2s = alertsToNotify2.map(({ id }) => id);
    expect(ids).toContain('1');
    expect(ids).toContain('2');
    expect(ids).not.toContain('3');
    expect(id2s).not.toContain('1');
    expect(id2s).toContain('2');
    expect(id2s).toContain('3');
    expect(id2s).not.toContain('4');
  });
  test('Should get alerts 2', () => {
    const now = new Date('2023-09-18T08:00');
    const alerts = [
      {
        id: '1',
        title: 'test',
        startAt: new Date('2023-09-18T08:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '2',
        title: 'test',
        startAt: new Date('2023-09-18T12:20'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '3',
        title: 'test',
        startAt: new Date('2023-09-18T19:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '4',
        title: 'test',
        startAt: new Date('2023-09-19T12:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
    ];
    const selectedSchedule = schedules.filter((s) => s.hour === 8);
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 0);
    const alertsToNotify2 = getAlertsToNotify(now, alerts, selectedSchedule, 600);
    const ids = alertsToNotify.map(({ id }) => id);
    const id2s = alertsToNotify2.map(({ id }) => id);
    expect(ids).toContain('1');
    expect(ids).toContain('2');
    expect(ids).toContain('3');
    expect(ids).not.toContain('4');
    expect(id2s).not.toContain('1');
    expect(id2s).not.toContain('2');
    expect(id2s).toContain('3');
    expect(id2s).toContain('4');
  });
  test('Should get alerts 3', () => {
    const now = new Date('2023-09-18T08:15');
    const alerts = [
      {
        id: '1',
        title: 'test',
        startAt: new Date('2023-09-18T08:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '2',
        title: 'test',
        startAt: new Date('2023-09-18T08:20'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '3',
        title: 'test',
        startAt: new Date('2023-09-18T09:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '4',
        title: 'test',
        startAt: new Date('2023-09-18T09:01'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '5',
        title: 'test',
        startAt: new Date('2023-09-18T09:31'),
        endAt: new Date('2023-09-18T08:00'),
      },

      {
        id: '6',
        title: 'test',
        startAt: new Date('2023-09-18T09:59'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '7',
        title: 'test',
        startAt: new Date('2023-09-18T10:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '8',
        title: 'test',
        startAt: new Date('2023-09-18T10:21'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '9',
        title: 'test',
        startAt: new Date('2023-09-18T08:59'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '10',
        title: 'test',
        startAt: new Date('2023-09-18T09:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
    ];
    const selectedSchedule = schedules;
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 60);

    const ids = alertsToNotify.map(({ id }) => id);

    expect(ids).not.toContain('1');
    expect(ids).not.toContain('2');
    expect(ids).toContain('3');
    expect(ids).toContain('4');
    expect(ids).toContain('5');
    expect(ids).toContain('6');
    expect(ids).not.toContain('7');
    expect(ids).not.toContain('8');
    expect(ids).not.toContain('9');
    expect(ids).toContain('10');
  });
  test('Should get alerts of tomorrow', () => {
    const now = new Date('2023-09-18T19:15');
    const alerts = [
      {
        id: '1',
        title: 'test',
        startAt: new Date('2023-09-18T18:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '2',
        title: 'test',
        startAt: new Date('2023-09-18T20:20'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '3',
        title: 'test',
        startAt: new Date('2023-09-19T09:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '4',
        title: 'test',
        startAt: new Date('2023-09-19T20:01'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '5',
        title: 'test',
        startAt: new Date('2023-09-20T09:31'),
        endAt: new Date('2023-09-18T08:00'),
      },
    ];
    const selectedSchedule = schedules.filter((s) => s.hour === 19);
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 300);

    const ids = alertsToNotify.map(({ id }) => id);

    expect(ids).not.toContain('1');
    expect(ids).not.toContain('2');
    expect(ids).toContain('3');
    expect(ids).toContain('4');
    expect(ids).not.toContain('5');
  });
});

import { schedules } from '@chaban/core';
import { describe, expect, test } from 'vitest';
import { date } from './date';
import { getAlertsToNotify } from './getAlertsToNotify';

describe('Send Alerts', () => {
  test('Should get alerts 1', () => {
    const now = new Date('2023-09-18T08:00');
    const schedulesWithDate = schedules.map((s) => ({ ...s, date: date.getFromSchedule(s, now) }));
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
    const selectedSchedule = schedulesWithDate;
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
    const schedulesWithDate = schedules.map((s) => ({ ...s, date: date.getFromSchedule(s, now) }));
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
    const selectedSchedule = schedulesWithDate.filter((s) => s.hour === 8);
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
    const schedulesWithDate = schedules.map((s) => ({ ...s, date: date.getFromSchedule(s, now) }));
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
    const selectedSchedule = schedulesWithDate;
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
    const schedulesWithDate = schedules.map((s) => ({ ...s, date: date.getFromSchedule(s, now) }));
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
    const selectedSchedule = schedulesWithDate.filter((s) => s.hour === 19);
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 300);

    const ids = alertsToNotify.map(({ id }) => id);

    expect(ids).not.toContain('1');
    expect(ids).not.toContain('2');
    expect(ids).toContain('3');
    expect(ids).toContain('4');
    expect(ids).not.toContain('5');
  });
  test('Should get alerts of tomorrow next month', () => {
    const now = new Date('2023-09-30T20:15');
    const schedulesWithDate = schedules.map((s) => ({ ...s, date: date.getFromSchedule(s, now) }));
    const alerts = [
      {
        id: '1',
        title: 'test',
        startAt: new Date('2023-10-01T06:29'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '2',
        title: 'test',
        startAt: new Date('2023-10-02T17:34'),
        endAt: new Date('2023-09-18T08:00'),
      },
    ];
    const selectedSchedule = schedulesWithDate.filter((s) => s.hour === 20);
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 300);

    const ids = alertsToNotify.map(({ id }) => id);

    expect(ids).toContain('1');
    expect(ids).not.toContain('2');
  });
  test('Should get alerts weekly', () => {
    const now = new Date('2023-09-24T19:00');
    const schedulesWithDate = schedules.map((s) => ({ ...s, date: date.getFromSchedule(s, now) }));
    const alerts = [
      {
        id: '1',
        title: 'test',
        startAt: new Date('2023-09-24T23:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '2',
        title: 'test',
        startAt: new Date('2023-09-25T03:20'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '3',
        title: 'test',
        startAt: new Date('2023-09-27T09:00'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '4',
        title: 'test',
        startAt: new Date('2023-10-01T20:01'),
        endAt: new Date('2023-09-18T08:00'),
      },
      {
        id: '5',
        title: 'test',
        startAt: new Date('2023-10-02T03:31'),
        endAt: new Date('2023-09-18T08:00'),
      },
    ];
    const selectedSchedule = schedulesWithDate.filter((s) => s.day === 0 && s.hour === 19);
    const alertsToNotify = getAlertsToNotify(now, alerts, selectedSchedule, 300);

    const ids = alertsToNotify.map(({ id }) => id);

    expect(ids).not.toContain('1');
    expect(ids).toContain('2');
    expect(ids).toContain('3');
    expect(ids).toContain('4');
    expect(ids).not.toContain('5');
  });
});

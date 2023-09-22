import dayjs from 'dayjs';
import { describe, expect, test } from 'vitest';
import { getBridgeLiftingsFromApi } from './api';
import { fakeResponse } from './fakeResponse';
import { fakeResult } from './fakeResults';

describe('Api', () => {
  test('Should map data to BridgeEvents', () => {
    const now = new Date('2022-01-01T16:19:00.000Z');
    const data = getBridgeLiftingsFromApi(now, fakeResponse);
    expect(data.length).toEqual(fakeResult.length);
    expect(data[10].endAt).toEqual(fakeResult[10].endAt);
    expect(data[10].startAt).toEqual(fakeResult[10].startAt);
  });
  test('opended is after closed', () => {
    const now = new Date('2022-04-28T16:19:00.000Z');
    const data = getBridgeLiftingsFromApi(now, fakeResponse);
    data.forEach(({ endAt, startAt }) => expect(dayjs(startAt).isBefore(endAt)).toBe(true));
  });
});

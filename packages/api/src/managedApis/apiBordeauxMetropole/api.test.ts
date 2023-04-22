import dayjs from 'dayjs';
import {describe, expect, test} from 'vitest';
import {getBridgeLiftingsFromApi} from './api';
import {fakeResponse} from './fakeResponse';
import {fakeResult} from './fakeResults';

describe('Api', () => {
  test('Should map data to BridgeEvents', () => {
    const data = getBridgeLiftingsFromApi(fakeResponse);
    expect(data.length).toEqual(fakeResult.length);
    expect(data[10]).toEqual(fakeResult[10]);
  });
  test('opended is after closed', () => {
    const data = getBridgeLiftingsFromApi(fakeResponse);
    data.forEach(({endAt, startAt}) => expect(dayjs(startAt).isBefore(endAt)).toBe(true));
  });
});

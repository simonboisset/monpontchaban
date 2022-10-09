import { describe, expect, test } from 'vitest';
import { getPrNumberFromUrl } from './getPrNumberFromUrl';

describe('Get Pr number from url', () => {
  test('Should get Pr number from url', () => {
    const url = 'https://deploy-preview-39--pontchaban.netlify.app/my-route';
    const pr = getPrNumberFromUrl(url);
    expect(pr).toBe(39);
  });
});

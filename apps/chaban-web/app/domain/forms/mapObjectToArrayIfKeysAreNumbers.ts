import type {Data} from './mapFormData';
import {parseNumber} from './mapFormData';

export const mapObjectToArrayIfKeysAreNumbers = <T>(data: Data<T>) => {
  const keys = Object.keys(data) as (keyof Data<T>)[];
  if (!Array.isArray(data) && typeof data === 'object') {
    if (keys.every(k => parseNumber(k) !== undefined)) {
      const arrayValue: Data<T>[] = [];
      keys.map(parseNumber).sort();
      for (const k of keys) {
        let element = data[k] as any;
        if (element) {
          arrayValue.push(mapObjectToArrayIfKeysAreNumbers(element) as any);
        }
      }
      return arrayValue;
    } else {
      let res = data;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key] as any;
          if (element) {
            res[key] = mapObjectToArrayIfKeysAreNumbers(element) as any;
          }
        }
      }
      return res;
    }
  }
  return data;
};

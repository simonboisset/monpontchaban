export type Data<T> = {
  [P in keyof T]?: T[P] extends string[] ? string[] : T[P] extends Record<string, any> ? Data<T[P]> : string;
};

export const parseNumber = (value: unknown) => {
  const n = typeof value === 'string' ? (!value ? undefined : Number(value.replace(',', '.'))) : value;
  if (typeof n !== 'number' || (n !== 0 && !n)) {
    return undefined;
  }
  return n;
};

export const mapFormData = (data: Data<any>, key: string, value: string | undefined) => {
  const [firstKey, ...nestedKeys] = key.split('-');
  if (nestedKeys.length > 0) {
    if (!data[firstKey]) {
      data[firstKey] = {};
    } else if (Array.isArray(data[firstKey] && parseNumber(nestedKeys[0]) === undefined)) {
      throw new Error('[Get form data] Value is Array but key is not a number.');
    }

    mapFormData(data[firstKey] as Data<any>, nestedKeys.join('-'), value);
  } else {
    if (!data[firstKey]) {
      data[firstKey] = value;
    }
  }
};

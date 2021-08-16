export const objectMap = <T,>(object: { [id: string]: T }, callback: (value: T, id: string) => void) => {
  const values = Object.values(object);
  const keys = Object.keys(object);
  return values.map((v, index) => callback(v, keys[index]));
};

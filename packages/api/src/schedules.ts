export type Schedule = {
  id: number;
  day: number;
  hour: number;
};

const getSchedules = () => {
  const res: Schedule[] = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      res.push({ id: res.length, day: i, hour: j });
    }
  }
  return res;
};

export const schedules: Schedule[] = getSchedules();

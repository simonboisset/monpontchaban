import { prisma } from '@chaban/db';
import { createProcedure } from '../../config/api';
import { apiBordeauxMetropole } from '../../managedApis';
import { isCron } from '../context';

export const getApiData = createProcedure.use(isCron).mutation(async () => {
  return saveApiData();
});

export const saveApiData = async () => {
  const data = await apiBordeauxMetropole.get();
  const now = new Date();

  await prisma.alert.deleteMany({ where: { endAt: { gt: now } } });
  await prisma.$transaction(data.map((d) => prisma.alert.create({ data: d })));

  return data;
};

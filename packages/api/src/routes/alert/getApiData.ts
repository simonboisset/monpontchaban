import { prisma } from '@lezo-alert/db';
import { createProcedure } from '../../config/api';
import { managedChannelIds } from '../../config/managedChannels';
import { apiBordeauxMetropole } from '../../managedApis';
import { isCron } from '../context';

export const getApiData = createProcedure.use(isCron).mutation(async () => {
  const chabanChannel = await prisma.channel.findUnique({ where: { id: managedChannelIds.chaban } });
  if (!chabanChannel) {
    const newChabanChannel = await prisma.channel.create({ data: { name: 'Pont Chaban-Delmas' } });
    console.info(`Created channel: ${newChabanChannel.name} id: ${newChabanChannel.id}`);
    return;
  }
  const data = await apiBordeauxMetropole.get();
  const now = new Date();

  await prisma.alert.deleteMany({ where: { channelId: managedChannelIds.chaban, endAt: { gt: now } } });
  await prisma.$transaction(data.map((d) => prisma.alert.create({ data: d })));

  return data;
});

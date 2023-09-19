import { prisma } from '@chaban/db';
import { createProcedure } from '../../config/api';
import { isCron } from '../context';
import { CODE_EXPIRATION_TIME } from './requestAuthenticationCode';

export const deleteExpiredUserCodes = createProcedure.use(isCron).mutation(async () => {
  const expirationTime = new Date(Date.now() - CODE_EXPIRATION_TIME);

  const unregisterUserDeleted = await prisma.user.deleteMany({
    where: { code: { type: 'REGISTER', createdAt: { lt: expirationTime } } },
  });
  // const registerDeleted = await prisma.userCode.deleteMany({ where: {type:'REGISTER', createdAt: { lt: expirationTime } }, });

  const otherDeleted = await prisma.userCode.deleteMany({ where: { createdAt: { lt: expirationTime } } });
  return { count: unregisterUserDeleted.count + otherDeleted.count };
});

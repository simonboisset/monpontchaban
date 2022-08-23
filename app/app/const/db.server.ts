import { PrismaClient } from '@prisma/client';
import invariant from 'tiny-invariant';

let db: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

if (process.env.NODE_ENV === 'production') {
  db = getClient();
} else {
  if (!global.__db__) {
    global.__db__ = getClient();
  }
  db = global.__db__;
}

function getClient() {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === 'string', 'DATABASE_URL env var not set');

  const databaseUrl = new URL(DATABASE_URL);

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  });
  client.$connect();

  return client;
}

export default db;

import 'dotenv/config';
import { Client } from 'pg';

async function drop() {
  const dbName = 'pr' + process.env.DATABASE_URL?.split('/pr')[1]?.split('?')[0];
  if (!dbName) {
    throw new Error('Database name not found');
  }
  console.log(dbName);

  const client = new Client(process.env.DATABASE_URL);
  await client.connect();
  await client.query(`DROP DATABASE ${dbName} CASCADE;`);
  await client.end();
  console.log(`Database has been droped. 🌱`);
}

drop()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});

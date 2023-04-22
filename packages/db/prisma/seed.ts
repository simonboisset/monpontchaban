import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log(`Seeding database... 🌱`);
  const chabanChannel = await prisma.channel.create({ data: { name: 'Pont Chaban-Delmas' } });
  console.log(`Created channel: ${chabanChannel.name} id: ${chabanChannel.id}`);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

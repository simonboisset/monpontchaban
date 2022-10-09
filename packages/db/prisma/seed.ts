const { PrismaClient } = require('../dist');

const prisma = new PrismaClient();

async function seed() {
  await prisma.device.deleteMany();
  await prisma.device.create({ data: { active: true, token: 'test' } });
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

import { PrismaClient } from '@prisma/client';
import z from 'zod';
const prisma = new PrismaClient();

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

const dumpSchema = z.object({
  alerts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      startAt: z.string().transform((s) => new Date(s)),
      endAt: z.string().transform((s) => new Date(s)),
    }),
  ),
  devices: z.array(z.object({ id: z.string(), token: z.string() })),
  notificationRules: z.array(
    z.object({
      id: z.string(),
      active: z.boolean(),
      title: z.string(),
      delayMinBefore: z.number(),
      scheduleIds: z.array(z.number()),
      deviceId: z.string(),
    }),
  ),
  sessions: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string().transform((s) => new Date(s)),
      expiredAt: z
        .string()
        .transform((s) => new Date(s))
        .nullable(),
      deviceId: z.string(),
    }),
  ),
});
type Dump = z.infer<typeof dumpSchema>;
async function seed() {
  // await prisma.alert.deleteMany({});
  // await prisma.notificationRule.deleteMany({});
  // await prisma.session.deleteMany({});
  // await prisma.device.deleteMany({});

  // console.log(`Seeding database... 🌱`);
  // const alerts = await prisma.alert.findMany({});
  // const devices = await prisma.device.findMany({});
  // const notificationRules = await prisma.notificationRule.findMany({});
  // const sessions = await prisma.session.findMany({});
  // fs.writeFileSync('./dump.json', JSON.stringify({ alerts, devices, notificationRules, sessions }, null, 2));

  // const dump = fs.readFileSync('./dump.json', 'utf-8');
  // const { alerts, devices, notificationRules, sessions } = dumpSchema.parse(JSON.parse(dump));
  // for (const alert of alerts) {
  //   await prisma.alert.create({ data: alert });
  // }
  // for (const device of devices) {
  //   await prisma.device.create({ data: device });
  // }
  // for (const notificationRule  of notificationRules) {
  //   await prisma.notificationRule.create({ data: notificationRule });
  // }

  // for (const session of sessions) {
  //   await prisma.session.create({ data: session });
  // }

  await prisma.notificationRule.deleteMany({});
  const devices = await prisma.device.findMany({});
  prisma.$transaction(
    devices.map((device) =>
      prisma.notificationRule.createMany({
        data: [
          {
            title: `🌉 Demain Fermeture du pont chaban`,
            delayMinBefore: 300,
            scheduleIds: schedules.filter((s) => s.hour === 20).map((s) => s.id),
            deviceId: device.id,
          },
          {
            title: `📅 Récap Hebdos du pont chaban`,
            delayMinBefore: 300,
            scheduleIds: schedules.filter((s) => s.day === 0 && s.hour === 19).map((s) => s.id),
            deviceId: device.id,
          },
          {
            title: `⏰ Alerte Fermeture du pont chaban`,
            delayMinBefore: 60,
            scheduleIds: schedules.map((s) => s.id),
            deviceId: device.id,
          },
        ],
      }),
    ),
  );

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

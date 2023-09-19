import { prisma } from '@chaban/db';

const holdDevices = [
  {
    id: '0c3d9889-8939-421b-a654-bf20b7f791be',
    token: 'ExponentPushToken[-4VVGbIsx6IqOywR8loZw6]',
    active: true,
  },
  {
    id: '0cd332a7-f4b4-41f4-8eb4-7e35e093a214',
    token: 'ExponentPushToken[daOwBZIN37Fcg4jO2O4ccq]',
    active: true,
  },
  {
    id: '1400dc43-73fb-4bc3-8bab-d31c70407d61',
    token: 'ExponentPushToken[quX-vjI9TlKD1Z5Klm91lb]',
    active: true,
  },
  {
    id: '1b8e2497-037d-47a4-a996-741772e166c6',
    token: 'ExponentPushToken[yxQ2_FMGKS0ZzRumEslp5C]',
    active: true,
  },
  {
    id: '202fbc6d-f71d-4f03-864c-b38960ebc1c8',
    token: 'ExponentPushToken[PzRcs1JFulO3TdH9EDQz0R]',
    active: true,
  },
  {
    id: '2825e1d9-62fd-4dc1-8094-e3b35a5c66fb',
    token: 'ExponentPushToken[CONYuTCmDcjXNHdFxoIqZO]',
    active: true,
  },
  {
    id: '2ef3537c-6eca-46e2-a9f7-9e557e28d0bb',
    token: 'ExponentPushToken[aouhKxI8KBdOgTYv9bLSDc]',
    active: true,
  },
  {
    id: '3343c2d9-491e-44c2-998a-46e5910a1c28',
    token: 'ExponentPushToken[g1xkPAG1iX-WrxY0e6GtcA]',
    active: true,
  },
  {
    id: '360f9a11-320c-482f-a195-e06314994b0a',
    token: 'ExponentPushToken[4iAj4bMgf4-Ezj8Zv2Kvey]',
    active: true,
  },
  {
    id: '3cc68920-8c04-4ba3-bb67-34a4c96cbb77',
    token: 'ExponentPushToken[hgV-clB5cGnahbEEVU9qEm]',
    active: true,
  },
  {
    id: '3e9483a0-c46a-4391-ad74-ca647d30d221',
    token: 'ExponentPushToken[2iCOGXKF0i2R3RlDYamPIu]',
    active: true,
  },
  {
    id: '3fe6befb-a136-43b2-a45f-e7d2e1387ab4',
    token: 'ExponentPushToken[MiemM-OHcst9pd7YcVq7yi]',
    active: true,
  },
  {
    id: '43c4ce47-7a1d-41cb-b607-d9882b799e66',
    token: 'ExponentPushToken[HqC6jOEnGNCOd6atmjQxr3]',
    active: true,
  },
  {
    id: '443e8e48-e828-4222-8f78-f6fff51442b4',
    token: 'ExponentPushToken[kU4wS_ADD4SJn2HglQhUAt]',
    active: true,
  },
  {
    id: '4b3cc2f5-6c50-4770-b5fc-11a5907e46fe',
    token: 'ExponentPushToken[tvGD_dKGKVSPxZemqPtoS0]',
    active: true,
  },
  {
    id: '51f0085a-f794-47dc-aee0-de0e91386bee',
    token: 'ExponentPushToken[25KCMsOSSyzc8RGcYx_VZr]',
    active: true,
  },
  {
    id: '52d5d26f-18c9-4ae4-b444-d149c20e8cd9',
    token: 'ExponentPushToken[-a_7ZaPW3-vu2uuZE8qBqs]',
    active: true,
  },
  {
    id: '5610e467-4e68-4392-b570-a7f10723186a',
    token: 'ExponentPushToken[1HnqqzC8KasSLY7YOVf3X0]',
    active: true,
  },
  {
    id: '591c4174-3a14-49ee-8c92-59ecd8d67268',
    token: 'ExponentPushToken[hgMOkgGoeNUUqtDd0WvXdk]',
    active: true,
  },
  {
    id: '5cbf620a-3a9d-49b4-88ab-127a2b7b1080',
    token: 'ExponentPushToken[kAtRAtH05d2EbEQPXy7sRV]',
    active: true,
  },
  {
    id: '5d161cb6-c3ef-434d-9122-f99b807c964f',
    token: 'ExponentPushToken[wyihfAO9qSt91sZKSNuvwj]',
    active: true,
  },
  {
    id: '61aa089a-1d70-4071-9231-53ef107f6862',
    token: 'ExponentPushToken[feo5oyHCMI5gDSl-oRV0J1]',
    active: true,
  },
  {
    id: '68d3e512-8006-48e3-a730-ce3ad6d79af0',
    token: 'ExponentPushToken[r5HPOAMuHLDotZYyyQrdqJ]',
    active: true,
  },
  {
    id: '6adaf71c-cf9d-45ee-a212-2464bafb780d',
    token: 'ExponentPushToken[2MYjcOLqJynxnO4mm1EdzW]',
    active: true,
  },
  {
    id: '7a226d29-e8c0-4a07-a575-837107f87423',
    token: 'ExponentPushToken[mD3tgpP_-36AUQMcRWbZzZ]',
    active: true,
  },
  {
    id: '8443afbc-75a2-4e63-8bad-32d422d0daa9',
    token: 'ExponentPushToken[r1ZynwGKTKmlqQGWyxCB44]',
    active: true,
  },
  {
    id: '917242d6-6848-4070-8ff6-06227c4ec3d0',
    token: 'ExponentPushToken[qgW8X8MQcn7tzyFfraJIUO]',
    active: true,
  },
  {
    id: '935315aa-b65e-4208-ab73-e915a8a710c1',
    token: 'ExponentPushToken[rxYU8vAHB8gGec6UCjUHns]',
    active: true,
  },
  {
    id: '97bf4848-d5db-4ad3-a51b-2fcd69b80c1e',
    token: 'ExponentPushToken[eDB6V_KHoJmL6XbZkFrWjQ]',
    active: true,
  },
  {
    id: '9bc94a94-fad7-4ba7-a095-797e2f779d41',
    token: 'ExponentPushToken[-0ci2yJjNw3AwkMiZouvTQ]',
    active: true,
  },
  {
    id: '9f0bc770-7cd7-4055-87aa-93aa7757a70c',
    token: 'ExponentPushToken[Ny5w9UEB-YLr878tDJrpd1]',
    active: true,
  },
  {
    id: 'a11b1025-c39d-4b7b-9c22-ed51afbed5f6',
    token: 'ExponentPushToken[5ij0ngB6pmm2lZw1Q3okRh]',
    active: true,
  },
  {
    id: 'be9f519c-75d1-4909-9d60-f23a38930edf',
    token: 'ExponentPushToken[bVmOn8Dgd7ao1GNKcOnLBQ]',
    active: true,
  },
  {
    id: 'd3aa10f9-189e-4ef5-b9b0-ec724c64d709',
    token: 'ExponentPushToken[aqFXv_E7Q9o0rBknslfZBr]',
    active: true,
  },
  {
    id: 'd51fab59-549a-4e5e-abcb-0c8c2c41431d',
    token: 'ExponentPushToken[KqbSy3BN1wOZnf5zRmNFP1]',
    active: true,
  },
  {
    id: 'd60c338d-5eef-4d8d-9495-6b33093962a7',
    token: 'ExponentPushToken[HOoaC2IlVhbns1Uew5aqLP]',
    active: true,
  },
  {
    id: 'd816ad38-5173-49a5-a785-90f284cf1bf9',
    token: 'ExponentPushToken[HwlSW0KRqpvE3JUAhRa1i6]',
    active: true,
  },
  {
    id: 'd9074820-c8c1-41d1-b197-55d58fea78ef',
    token: 'ExponentPushToken[zuRgHPG58t9XN2K7WDhrMT]',
    active: true,
  },
  {
    id: 'dc5f1183-1867-40e1-b79d-ea8c4a763894',
    token: 'ExponentPushToken[c10C6aPfZVE-_KFo0O-Jnt]',
    active: true,
  },
  {
    id: 'e045904d-8b45-4fec-9130-f75a9213eede',
    token: 'ExponentPushToken[rcQBkMGn2Hz93_upBYq7wt]',
    active: true,
  },
  {
    id: 'e1f50596-6404-476d-b228-7b21cbb7537b',
    token: 'ExponentPushToken[90w4WuO_g6Rl725OBVVpIn]',
    active: true,
  },
  {
    id: 'efe9e5e6-bfb6-45f5-9456-e19d89a1a8b5',
    token: 'ExponentPushToken[kHKvZ6A_WZO9j5gxOQDVrX]',
    active: true,
  },
  {
    id: 'f8b1708d-daf8-48eb-a5a1-db124e22ab31',
    token: 'ExponentPushToken[jiw9TOBoISrerd44rFN0EX]',
    active: true,
  },
  {
    id: 'fc23f7c9-de1f-49aa-9eea-13884dfed079',
    token: 'ExponentPushToken[da8gkFEfy-to8aHbymsLg0]',
    active: true,
  },
];

const script = async () => {
  const devices = await prisma.$transaction(
    holdDevices.map((device) => prisma.device.create({ data: { active: true, token: device.token } })),
  );

  console.log('Devices created: ', devices.length);
};

script();

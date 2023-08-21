-- CreateTable
CREATE TABLE "ClientSession" (
    "id" STRING NOT NULL,
    "appName" STRING NOT NULL,
    "appVersion" STRING NOT NULL DEFAULT '0.0.0',
    "origin" STRING NOT NULL,
    "width" INT4 NOT NULL DEFAULT 0,
    "height" INT4 NOT NULL DEFAULT 0,
    "size" STRING NOT NULL DEFAULT 'none',
    "language" STRING NOT NULL DEFAULT 'none',
    "os" STRING NOT NULL DEFAULT 'OTHER',
    "browser" STRING NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appName" STRING NOT NULL,
    "appVersion" STRING NOT NULL DEFAULT '0.0.0',
    "origin" STRING NOT NULL,
    "width" INT4 NOT NULL DEFAULT 0,
    "height" INT4 NOT NULL DEFAULT 0,
    "size" STRING NOT NULL DEFAULT 'none',
    "language" STRING NOT NULL DEFAULT 'none',
    "os" STRING NOT NULL DEFAULT 'OTHER',
    "browser" STRING NOT NULL DEFAULT 'OTHER',
    "path" STRING,
    "referrer" STRING,
    "clientSessionId" STRING NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" STRING NOT NULL,
    "message" STRING NOT NULL,
    "appName" STRING NOT NULL,
    "appVersion" STRING NOT NULL DEFAULT '0.0.0',
    "serverSessionId" STRING,
    "clientSessionId" STRING,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monitor" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpu" FLOAT8 NOT NULL,
    "memory" FLOAT8 NOT NULL,
    "disk" FLOAT8 NOT NULL,
    "uptime" FLOAT8 NOT NULL,
    "appName" STRING NOT NULL,
    "appVersion" STRING NOT NULL DEFAULT '0.0.0',
    "serverSessionId" STRING NOT NULL,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Performance" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" FLOAT8 NOT NULL,
    "name" STRING NOT NULL,
    "appName" STRING NOT NULL,
    "appVersion" STRING NOT NULL DEFAULT '0.0.0',
    "serverSessionId" STRING,
    "clientSessionId" STRING,

    CONSTRAINT "Performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerSession" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appName" STRING NOT NULL,
    "appVersion" STRING NOT NULL DEFAULT '0.0.0',

    CONSTRAINT "ServerSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_clientSessionId_fkey" FOREIGN KEY ("clientSessionId") REFERENCES "ClientSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_serverSessionId_fkey" FOREIGN KEY ("serverSessionId") REFERENCES "ServerSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_clientSessionId_fkey" FOREIGN KEY ("clientSessionId") REFERENCES "ClientSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_serverSessionId_fkey" FOREIGN KEY ("serverSessionId") REFERENCES "ServerSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_serverSessionId_fkey" FOREIGN KEY ("serverSessionId") REFERENCES "ServerSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_clientSessionId_fkey" FOREIGN KEY ("clientSessionId") REFERENCES "ClientSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

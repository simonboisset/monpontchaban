-- CreateEnum
CREATE TYPE "DeviceOs" AS ENUM ('IOS', 'ANDROID');

-- CreateEnum
CREATE TYPE "UserCodeType" AS ENUM ('LOGIN', 'REGISTER', 'DELETE');

-- CreateEnum
CREATE TYPE "SupportIssueCategory" AS ENUM ('BUG', 'FEATURE', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportIssueStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Device" (
    "id" STRING NOT NULL,
    "token" STRING NOT NULL,
    "active" BOOL NOT NULL DEFAULT false,
    "os" "DeviceOs" NOT NULL DEFAULT 'ANDROID',
    "userId" STRING,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCode" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" STRING NOT NULL,
    "type" "UserCodeType" NOT NULL,
    "userId" STRING NOT NULL,
    "attempts" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "UserCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "emailHash" STRING NOT NULL,
    "isAdmin" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRule" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "channelId" STRING NOT NULL,
    "delayMinBefore" INT4 NOT NULL,

    CONSTRAINT "NotificationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" STRING NOT NULL,
    "day" INT4 NOT NULL,
    "hour" INT4 NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "channelId" STRING NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportIssue" (
    "id" STRING NOT NULL,
    "title" STRING,
    "category" "SupportIssueCategory" NOT NULL,
    "status" "SupportIssueStatus" NOT NULL DEFAULT 'OPEN',
    "userId" STRING NOT NULL,

    CONSTRAINT "SupportIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" STRING NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" STRING NOT NULL,
    "issueId" STRING NOT NULL,
    "isFromAdmin" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NotificationRuleToSchedule" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_token_key" ON "Device"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Device_userId_key" ON "Device"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCode_userId_key" ON "UserCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailHash_key" ON "User"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRule_userId_key" ON "NotificationRule"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_day_hour_key" ON "Schedule"("day", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "SupportIssue_userId_key" ON "SupportIssue"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_NotificationRuleToSchedule_AB_unique" ON "_NotificationRuleToSchedule"("A", "B");

-- CreateIndex
CREATE INDEX "_NotificationRuleToSchedule_B_index" ON "_NotificationRuleToSchedule"("B");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCode" ADD CONSTRAINT "UserCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRule" ADD CONSTRAINT "NotificationRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRule" ADD CONSTRAINT "NotificationRule_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportIssue" ADD CONSTRAINT "SupportIssue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "SupportIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationRuleToSchedule" ADD CONSTRAINT "_NotificationRuleToSchedule_A_fkey" FOREIGN KEY ("A") REFERENCES "NotificationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationRuleToSchedule" ADD CONSTRAINT "_NotificationRuleToSchedule_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

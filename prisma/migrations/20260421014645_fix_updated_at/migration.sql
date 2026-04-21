/*
  Warnings:

  - You are about to drop the `SmsQueue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SmsQueue";

-- CreateTable
CREATE TABLE "smsQueue" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smsQueue_pkey" PRIMARY KEY ("id")
);

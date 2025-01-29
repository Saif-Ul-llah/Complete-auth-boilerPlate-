/*
  Warnings:

  - You are about to drop the column `ownerName` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `ownerFirstName` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerLastName` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "auth"."Role" AS ENUM ('USER', 'ADMIN', 'TEAMLEAD', 'WORKER', 'SUPPLIER', 'CLIENT', 'REGIONALADMIN');

-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "ownerName",
ADD COLUMN     "ownerFirstName" TEXT NOT NULL,
ADD COLUMN     "ownerLastName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "auth"."User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "regionId" INTEGER NOT NULL,
    "location" TEXT,
    "Role" "auth"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "auth"."User"("email");

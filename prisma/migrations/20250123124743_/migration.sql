/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" SERIAL NOT NULL,
    "orgName" TEXT NOT NULL,
    "phone" TEXT,
    "ownerName" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "password" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgName_key" ON "public"."Organization"("orgName");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "public"."Organization"("email");

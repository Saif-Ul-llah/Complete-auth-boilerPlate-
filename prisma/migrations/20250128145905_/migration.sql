/*
  Warnings:

  - The values [ADMIN,TEAMLEAD,WORKER,SUPPLIER,CLIENT,REGIONALADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "auth"."Role_new" AS ENUM ('USER', 'BUILDER', 'CONSULTANT', 'PRE_INSPECTOR');
ALTER TABLE "auth"."User" ALTER COLUMN "Role" DROP DEFAULT;
ALTER TABLE "auth"."User" ALTER COLUMN "Role" TYPE "auth"."Role_new" USING ("Role"::text::"auth"."Role_new");
ALTER TYPE "auth"."Role" RENAME TO "Role_old";
ALTER TYPE "auth"."Role_new" RENAME TO "Role";
DROP TYPE "auth"."Role_old";
ALTER TABLE "auth"."User" ALTER COLUMN "Role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "auth"."User" DROP COLUMN "location",
DROP COLUMN "phone",
DROP COLUMN "regionId",
ADD COLUMN     "IsActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."Organization";

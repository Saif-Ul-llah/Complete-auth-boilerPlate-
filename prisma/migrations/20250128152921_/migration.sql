-- CreateEnum
CREATE TYPE "auth"."VerificationStatus" AS ENUM ('VERIFIED', 'NOT_VERIFIED');

-- CreateTable
CREATE TABLE "auth"."UserVerification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "resetOtp" INTEGER,
    "resetOtpExpiresAt" TIMESTAMP(3),
    "isEmailVerified" "auth"."VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_userId_key" ON "auth"."UserVerification"("userId");

-- AddForeignKey
ALTER TABLE "auth"."UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

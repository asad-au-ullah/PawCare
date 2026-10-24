-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EmailVerifications" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmailVerifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerifications_token_key" ON "EmailVerifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerifications_userId_key" ON "EmailVerifications"("userId");

-- AddForeignKey
ALTER TABLE "EmailVerifications" ADD CONSTRAINT "EmailVerifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

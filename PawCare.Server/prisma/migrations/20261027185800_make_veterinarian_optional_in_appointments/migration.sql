-- AlterTable
ALTER TABLE "Appointments" ALTER COLUMN "veterinarianId" DROP NOT NULL;

-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT IF EXISTS "Appointments_veterinarianId_fkey";

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

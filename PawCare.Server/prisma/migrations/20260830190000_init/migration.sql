CREATE TYPE "UserRole" AS ENUM ('PetOwner', 'Veterinarian');
CREATE TYPE "PetSpecies" AS ENUM ('Dog', 'Cat', 'Bird', 'Rabbit', 'Other');
CREATE TYPE "AppointmentStatus" AS ENUM ('Scheduled', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow');
CREATE TYPE "AppointmentReason" AS ENUM ('Checkup', 'Vaccination', 'Surgery', 'Grooming', 'Dental', 'Emergency', 'Consultation');
CREATE TYPE "VeterinarianSpecialty" AS ENUM ('GeneralPractice', 'InternalMedicine', 'Dermatology', 'Cardiology', 'Dentistry', 'Surgery', 'Oncology', 'ExoticAnimals');

CREATE TABLE "Users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'PetOwner',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

CREATE TABLE "PetOwners" (
  "id" SERIAL NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "applicationUserId" TEXT NOT NULL,
  CONSTRAINT "PetOwners_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PetOwners_applicationUserId_key" ON "PetOwners"("applicationUserId");

CREATE TABLE "Veterinarians" (
  "id" SERIAL NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "licenseNumber" TEXT NOT NULL,
  "yearsOfExperience" INTEGER NOT NULL,
  "consultationFee" DECIMAL(10,2) NOT NULL,
  "specialty" "VeterinarianSpecialty" NOT NULL,
  "applicationUserId" TEXT NOT NULL,
  CONSTRAINT "Veterinarians_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Veterinarians_licenseNumber_key" ON "Veterinarians"("licenseNumber");
CREATE UNIQUE INDEX "Veterinarians_applicationUserId_key" ON "Veterinarians"("applicationUserId");

CREATE TABLE "Pets" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "species" "PetSpecies" NOT NULL,
  "breed" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "isBirthDateEstimated" BOOLEAN NOT NULL,
  "weight" DOUBLE PRECISION,
  "ownerId" INTEGER NOT NULL,
  CONSTRAINT "Pets_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Pets_ownerId_idx" ON "Pets"("ownerId");

CREATE TABLE "Appointments" (
  "id" SERIAL NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'Scheduled',
  "reason" "AppointmentReason" NOT NULL DEFAULT 'Checkup',
  "notes" TEXT NOT NULL DEFAULT '',
  "durationMinutes" INTEGER NOT NULL DEFAULT 30,
  "petId" INTEGER NOT NULL,
  "veterinarianId" INTEGER NOT NULL,
  CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Appointments_petId_idx" ON "Appointments"("petId");
CREATE INDEX "Appointments_veterinarianId_idx" ON "Appointments"("veterinarianId");

ALTER TABLE "PetOwners" ADD CONSTRAINT "PetOwners_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Veterinarians" ADD CONSTRAINT "Veterinarians_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Pets" ADD CONSTRAINT "Pets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PetOwners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

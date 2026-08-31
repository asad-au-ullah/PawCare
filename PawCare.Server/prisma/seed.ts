import { PrismaClient, VeterinarianSpecialty } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const vets = [
  { id: 1, userId: 'vet-seed-0001', firstName: 'Sarah', lastName: 'Mitchell', licenseNumber: 'VET-0001', specialty: VeterinarianSpecialty.GeneralPractice, yearsOfExperience: 8, consultationFee: 50 },
  { id: 2, userId: 'vet-seed-0002', firstName: 'Daniel', lastName: 'Okafor', licenseNumber: 'VET-0002', specialty: VeterinarianSpecialty.Surgery, yearsOfExperience: 12, consultationFee: 120 },
  { id: 3, userId: 'vet-seed-0003', firstName: 'Priya', lastName: 'Nair', licenseNumber: 'VET-0003', specialty: VeterinarianSpecialty.Dermatology, yearsOfExperience: 6, consultationFee: 65 },
  { id: 4, userId: 'vet-seed-0004', firstName: 'James', lastName: 'Whitfield', licenseNumber: 'VET-0004', specialty: VeterinarianSpecialty.Cardiology, yearsOfExperience: 15, consultationFee: 150 },
  { id: 5, userId: 'vet-seed-0005', firstName: 'Elena', lastName: 'Vasquez', licenseNumber: 'VET-0005', specialty: VeterinarianSpecialty.ExoticAnimals, yearsOfExperience: 9, consultationFee: 90 },
];

async function main() {
  // Development-only password. Existing ASP.NET Identity hashes are intentionally
  // not copied into this new schema; see docs/migration-notes.md for that decision.
  const passwordHash = await bcrypt.hash('Password1', 12);

  for (const vet of vets) {
    const email = `${vet.firstName.toLowerCase()}.${vet.lastName.toLowerCase()}@pawcare-vet.test`;
    await prisma.user.upsert({
      where: { id: vet.userId },
      update: { email, passwordHash, role: 'Veterinarian', isEmailVerified: true },
      create: {
        id: vet.userId,
        email,
        passwordHash,
        role: 'Veterinarian',
        isEmailVerified: true,
        veterinarian: {
          create: {
            id: vet.id,
            firstName: vet.firstName,
            lastName: vet.lastName,
            licenseNumber: vet.licenseNumber,
            specialty: vet.specialty,
            yearsOfExperience: vet.yearsOfExperience,
            consultationFee: vet.consultationFee,
          },
        },
      },
    });
  }
}

main()
  .catch(async (error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });

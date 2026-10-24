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

// ─── Demo account ─────────────────────────────────────────────────────────────
// Credentials: demo@pawcare.com / Demo1234!
// Pre-verified so the one-click demo login works instantly without email flow.
const DEMO_USER_ID = 'demo-user-0001';
const DEMO_OWNER_ID = 100;
const DEMO_PET_MAX_ID = 100;
const DEMO_PET_LUNA_ID = 101;

async function main() {
  // Development-only password. Existing ASP.NET Identity hashes are intentionally
  // not copied into this new schema; see docs/migration-notes.md for that decision.
  const passwordHash = await bcrypt.hash('Password1', 12);
  const demoPasswordHash = await bcrypt.hash('Demo1234!', 12);

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

  // ─── Demo pet owner ─────────────────────────────────────────────────────────
  // Upsert keeps the seed idempotent — safe to run multiple times.
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: { email: 'demo@pawcare.com', passwordHash: demoPasswordHash, role: 'PetOwner', isEmailVerified: true },
    create: {
      id: DEMO_USER_ID,
      email: 'demo@pawcare.com',
      passwordHash: demoPasswordHash,
      role: 'PetOwner',
      isEmailVerified: true,
      petOwner: {
        create: {
          id: DEMO_OWNER_ID,
          firstName: 'Demo',
          lastName: 'User',
        },
      },
    },
  });

  // ─── Demo pets ──────────────────────────────────────────────────────────────
  await prisma.pet.upsert({
    where: { id: DEMO_PET_MAX_ID },
    update: {},
    create: {
      id: DEMO_PET_MAX_ID,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      dateOfBirth: new Date('2020-03-15'),
      isBirthDateEstimated: false,
      weight: 28.5,
      ownerId: DEMO_OWNER_ID,
    },
  });

  await prisma.pet.upsert({
    where: { id: DEMO_PET_LUNA_ID },
    update: {},
    create: {
      id: DEMO_PET_LUNA_ID,
      name: 'Luna',
      species: 'Cat',
      breed: 'British Shorthair',
      dateOfBirth: new Date('2021-07-20'),
      isBirthDateEstimated: false,
      weight: 4.2,
      ownerId: DEMO_OWNER_ID,
    },
  });

  // ─── Demo appointments ───────────────────────────────────────────────────────
  // Use fixed IDs so the upsert is idempotent.
  const pastAppt = new Date();
  pastAppt.setDate(pastAppt.getDate() - 7);
  pastAppt.setHours(10, 0, 0, 0);

  const upcomingAppt = new Date();
  upcomingAppt.setDate(upcomingAppt.getDate() + 5);
  upcomingAppt.setHours(14, 30, 0, 0);

  await prisma.appointment.upsert({
    where: { id: 1000 },
    update: {},
    create: {
      id: 1000,
      petId: DEMO_PET_MAX_ID,
      veterinarianId: 1, // Dr. Sarah Mitchell — GeneralPractice
      scheduledAt: pastAppt,
      status: 'Completed',
      reason: 'Checkup',
      notes: 'Annual wellness exam. Max is in great health!',
      durationMinutes: 30,
    },
  });

  await prisma.appointment.upsert({
    where: { id: 1001 },
    update: {},
    create: {
      id: 1001,
      petId: DEMO_PET_LUNA_ID,
      veterinarianId: 3, // Dr. Priya Nair — Dermatology
      scheduledAt: upcomingAppt,
      status: 'Scheduled',
      reason: 'Consultation',
      notes: 'Skin irritation follow-up.',
      durationMinutes: 45,
    },
  });

  console.log('✅ Seed complete. Demo account: demo@pawcare.com / Demo1234!');
}

main()
  .catch(async (error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });

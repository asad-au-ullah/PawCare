import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { AppointmentsService } from './appointments.service';
import { AppointmentReason } from './dto/create-appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: {
    pet: { findFirst: jest.Mock };
    veterinarian: { findUnique: jest.Mock };
    appointment: { findMany: jest.Mock; create: jest.Mock };
  };

  const mockUserId = 'user-123';
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  beforeEach(async () => {
    prisma = {
      pet: { findFirst: jest.fn() },
      veterinarian: { findUnique: jest.fn() },
      appointment: { findMany: jest.fn(), create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  describe('create without marketplace veterinarian (direct care)', () => {
    it('successfully creates a direct clinic appointment when veterinarianId is omitted', async () => {
      prisma.pet.findFirst.mockResolvedValue({ id: 1, name: 'Buddy' });
      prisma.appointment.findMany.mockResolvedValue([]); // no conflicts
      prisma.appointment.create.mockResolvedValue({
        id: 10,
        petId: 1,
        veterinarianId: null,
        scheduledAt: new Date(futureDate),
        reason: 'Checkup',
        durationMinutes: 30,
        notes: 'Annual routine checkup',
        status: 'Scheduled',
        pet: { name: 'Buddy' },
        veterinarian: null,
      });

      const result = await service.create(mockUserId, {
        petId: 1,
        scheduledAt: futureDate,
        reason: AppointmentReason.Checkup,
        durationMinutes: 30,
        notes: 'Annual routine checkup',
      });

      expect(prisma.pet.findFirst).toHaveBeenCalledWith({
        where: { id: 1, owner: { applicationUserId: mockUserId } },
      });
      expect(prisma.veterinarian.findUnique).not.toHaveBeenCalled();
      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: {
          petId: 1,
          veterinarianId: null,
          scheduledAt: expect.any(Date),
          reason: 'Checkup',
          durationMinutes: 30,
          notes: 'Annual routine checkup',
          status: 'Scheduled',
        },
        include: { pet: true, veterinarian: true },
      });
      expect(result.veterinarianId).toBeNull();
      expect(result.veterinarianFirstName).toBeNull();
      expect(result.veterinarianLastName).toBeNull();
      expect(result.petName).toBe('Buddy');
    });
  });

  describe('create with optional veterinarian preference', () => {
    it('successfully books with requested veterinarian when available', async () => {
      prisma.pet.findFirst.mockResolvedValue({ id: 1, name: 'Buddy' });
      prisma.veterinarian.findUnique.mockResolvedValue({ id: 5, firstName: 'Sarah', lastName: 'Mitchell' });
      prisma.appointment.findMany.mockResolvedValue([]); // no conflicts
      prisma.appointment.create.mockResolvedValue({
        id: 11,
        petId: 1,
        veterinarianId: 5,
        scheduledAt: new Date(futureDate),
        reason: 'Vaccination',
        durationMinutes: 15,
        notes: '',
        status: 'Scheduled',
        pet: { name: 'Buddy' },
        veterinarian: { firstName: 'Sarah', lastName: 'Mitchell' },
      });

      const result = await service.create(mockUserId, {
        petId: 1,
        veterinarianId: 5,
        scheduledAt: futureDate,
        reason: AppointmentReason.Vaccination,
        durationMinutes: 15,
      });

      expect(prisma.veterinarian.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(result.veterinarianId).toBe(5);
      expect(result.veterinarianFirstName).toBe('Sarah');
      expect(result.veterinarianLastName).toBe('Mitchell');
    });

    it('throws BadRequestException if requested veterinarian does not exist', async () => {
      prisma.pet.findFirst.mockResolvedValue({ id: 1, name: 'Buddy' });
      prisma.veterinarian.findUnique.mockResolvedValue(null);

      await expect(
        service.create(mockUserId, {
          petId: 1,
          veterinarianId: 999,
          scheduledAt: futureDate,
          reason: AppointmentReason.Checkup,
          durationMinutes: 30,
        }),
      ).rejects.toThrow(new BadRequestException('Veterinarian not found.'));
    });
  });

  describe('validations and authorization', () => {
    it('rejects appointments scheduled in the past', async () => {
      const pastDate = new Date(Date.now() - 60 * 1000).toISOString();

      await expect(
        service.create(mockUserId, {
          petId: 1,
          scheduledAt: pastDate,
          reason: AppointmentReason.Checkup,
          durationMinutes: 30,
        }),
      ).rejects.toThrow(new BadRequestException('Appointment must be scheduled in the future.'));
    });

    it('rejects appointments when pet does not belong to the authenticated user', async () => {
      prisma.pet.findFirst.mockResolvedValue(null);

      await expect(
        service.create(mockUserId, {
          petId: 99,
          scheduledAt: futureDate,
          reason: AppointmentReason.Checkup,
          durationMinutes: 30,
        }),
      ).rejects.toThrow(new BadRequestException('Pet not found or does not belong to you.'));
    });

    it('rejects appointments when pet already has an overlapping appointment', async () => {
      prisma.pet.findFirst.mockResolvedValue({ id: 1, name: 'Buddy' });
      const targetTime = new Date(futureDate);
      // Existing appointment overlaps with target time
      prisma.appointment.findMany.mockResolvedValue([
        { scheduledAt: targetTime, durationMinutes: 30 },
      ]);

      await expect(
        service.create(mockUserId, {
          petId: 1,
          scheduledAt: futureDate,
          reason: AppointmentReason.Checkup,
          durationMinutes: 30,
        }),
      ).rejects.toThrow(new BadRequestException('This pet already has an appointment scheduled at this time.'));
    });

    it('rejects appointments when chosen veterinarian has an overlapping appointment', async () => {
      prisma.pet.findFirst.mockResolvedValue({ id: 1, name: 'Buddy' });
      prisma.veterinarian.findUnique.mockResolvedValue({ id: 5 });
      const targetTime = new Date(futureDate);

      // First call for pet candidates returns none
      // Second call for vet candidates returns conflict
      prisma.appointment.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ scheduledAt: targetTime, durationMinutes: 30 }]);

      await expect(
        service.create(mockUserId, {
          petId: 1,
          veterinarianId: 5,
          scheduledAt: futureDate,
          reason: AppointmentReason.Checkup,
          durationMinutes: 30,
        }),
      ).rejects.toThrow(new BadRequestException('This veterinarian is not available at the requested time.'));
    });
  });
});

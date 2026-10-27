import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { PetsService } from './pets.service';

describe('PetsService', () => {
  let service: PetsService;
  let prisma: {
    pet: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
    petOwner: { findUnique: jest.Mock };
  };

  const mockUserId = 'user-owner-1';

  beforeEach(async () => {
    prisma = {
      pet: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      petOwner: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  describe('getMine', () => {
    it('returns pets scoped to the authenticated user', async () => {
      const mockPet = {
        id: 1,
        name: 'Milo',
        species: 'Dog',
        breed: 'Poodle',
        dateOfBirth: new Date('2022-01-01'),
        isBirthDateEstimated: false,
        weight: 10,
      };
      prisma.pet.findMany.mockResolvedValue([mockPet]);

      const result = await service.getMine(mockUserId);

      expect(prisma.pet.findMany).toHaveBeenCalledWith({
        where: { owner: { applicationUserId: mockUserId } },
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Milo');
      expect(result[0].species).toBe(1); // Dog = 1
    });
  });

  describe('create', () => {
    it('throws BadRequestException if owner profile is not found', async () => {
      prisma.petOwner.findUnique.mockResolvedValue(null);

      await expect(
        service.create(mockUserId, {
          name: 'Bella',
          species: 2,
          breed: 'Persian',
          ageInYears: 3,
        }),
      ).rejects.toThrow(new BadRequestException('Pet owner profile not found.'));
    });

    it('creates pet with estimated date of birth when ageInYears is provided', async () => {
      prisma.petOwner.findUnique.mockResolvedValue({ id: 10 });
      prisma.pet.create.mockImplementation(({ data }) =>
        Promise.resolve({
          id: 5,
          name: data.name,
          species: data.species,
          breed: data.breed,
          dateOfBirth: data.dateOfBirth,
          isBirthDateEstimated: data.isBirthDateEstimated,
          weight: data.weight,
        }),
      );

      const result = await service.create(mockUserId, {
        name: 'Charlie',
        species: 1, // Dog
        breed: 'Beagle',
        ageInYears: 4,
        weight: 12.5,
      });

      expect(result.name).toBe('Charlie');
      expect(result.isBirthDateEstimated).toBe(true);
      expect(result.ageInYears).toBe(4);
    });

    it('rejects if both DateOfBirth and AgeInYears are provided', async () => {
      prisma.petOwner.findUnique.mockResolvedValue({ id: 10 });

      await expect(
        service.create(mockUserId, {
          name: 'Charlie',
          species: 1,
          breed: 'Beagle',
          dateOfBirth: '2020-01-01',
          ageInYears: 4,
        }),
      ).rejects.toThrow(new BadRequestException('Provide either DateOfBirth or AgeInYears, not both.'));
    });
  });
});

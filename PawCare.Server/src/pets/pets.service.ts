import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly db: PrismaService) {}

  async getMine(userId: string) {
    const pets = await this.db.pet.findMany({ where: { owner: { applicationUserId: userId } } });
    return pets.map((pet) => this.toResponse(pet));
  }

  async getMineById(userId: string, id: number) {
    const pet = await this.db.pet.findFirst({ where: { id, owner: { applicationUserId: userId } } });
    return pet ? this.toResponse(pet) : null;
  }

  async create(userId: string, dto: CreatePetDto) {
    const owner = await this.db.petOwner.findUnique({ where: { applicationUserId: userId } });
    if (!owner) throw new BadRequestException('Pet owner profile not found.');
    const { dateOfBirth, isEstimated } = this.resolveDateOfBirth(dto);
    const pet = await this.db.pet.create({
      data: {
        name: dto.name,
        species: this.toPrismaSpecies(dto.species),
        breed: dto.breed,
        dateOfBirth,
        isBirthDateEstimated: isEstimated,
        weight: dto.weight ?? null,
        ownerId: owner.id,
      },
    });
    return this.toResponse(pet);
  }

  async update(userId: string, id: number, dto: UpdatePetDto) {
    const pet = await this.db.pet.findFirst({ where: { id, owner: { applicationUserId: userId } } });
    if (!pet) return false;
    const { dateOfBirth, isEstimated } = this.resolveDateOfBirth(dto);
    await this.db.pet.update({
      where: { id },
      data: {
        name: dto.name,
        species: this.toPrismaSpecies(dto.species),
        breed: dto.breed,
        dateOfBirth,
        isBirthDateEstimated: isEstimated,
        weight: dto.weight ?? null,
      },
    });
    return true;
  }

  async remove(userId: string, id: number) {
    const pet = await this.db.pet.findFirst({ where: { id, owner: { applicationUserId: userId } } });
    if (!pet) return false;
    await this.db.pet.delete({ where: { id } });
    return true;
  }

  private resolveDateOfBirth(dto: CreatePetDto | UpdatePetDto) {
    if (dto.dateOfBirth && dto.ageInYears !== null && dto.ageInYears !== undefined) {
      throw new BadRequestException('Provide either DateOfBirth or AgeInYears, not both.');
    }
    if (dto.dateOfBirth) {
      const date = new Date(dto.dateOfBirth);
      if (Number.isNaN(date.getTime()) || date.getTime() > Date.now()) throw new BadRequestException('DateOfBirth cannot be in the future.');
      return { dateOfBirth: date, isEstimated: false };
    }
    if (dto.ageInYears !== null && dto.ageInYears !== undefined) {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCFullYear(date.getUTCFullYear() - dto.ageInYears);
      return { dateOfBirth: date, isEstimated: true };
    }
    throw new BadRequestException('Either DateOfBirth or AgeInYears must be provided.');
  }

  private toResponse(pet: { id: number; name: string; species: any; breed: string; dateOfBirth: Date; isBirthDateEstimated: boolean; weight: number | null }) {
    const today = new Date();
    let age = today.getUTCFullYear() - pet.dateOfBirth.getUTCFullYear();
    const birthday = new Date(Date.UTC(today.getUTCFullYear(), pet.dateOfBirth.getUTCMonth(), pet.dateOfBirth.getUTCDate()));
    if (birthday > new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))) age--;
    return { id: pet.id, name: pet.name, species: this.numericPetSpecies(pet.species), breed: pet.breed, dateOfBirth: pet.dateOfBirth.toISOString(), isBirthDateEstimated: pet.isBirthDateEstimated, weight: pet.weight, ageInYears: age };
  }

  private toPrismaSpecies(species: any) {
    if (typeof species === 'string') {
      const valid = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
      if (valid.includes(species)) return species as any;
    }
    const map: Record<number, string> = {
      1: 'Dog',
      2: 'Cat',
      3: 'Bird',
      4: 'Rabbit',
      5: 'Other',
    };
    return (map[species as number] ?? 'Other') as any;
  }

  private numericPetSpecies(value: string | number) {
    if (typeof value === 'number') return value;
    const values: Record<string, number> = { Dog: 1, Cat: 2, Bird: 3, Rabbit: 4, Other: 5 };
    return values[value] ?? 5;
  }
}

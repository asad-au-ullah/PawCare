import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VeterinarianQueryDto, VeterinarianSpecialty } from './dto/veterinarian-query.dto';

@Injectable()
export class VeterinariansService {
  constructor(private readonly db: PrismaService) {}

  async getAll(query: VeterinarianQueryDto) {
    const vets = await this.db.veterinarian.findMany({
      where: query.specialty ? { specialty: this.toPrismaSpecialty(query.specialty) } : undefined,
      orderBy: { id: 'asc' },
    });
    return vets.map((vet) => this.toResponse(vet));
  }

  async getById(id: number) {
    const vet = await this.db.veterinarian.findUnique({ where: { id } });
    return vet ? this.toResponse(vet) : null;
  }

  private toPrismaSpecialty(value: VeterinarianSpecialty) {
    return ['GeneralPractice', 'InternalMedicine', 'Dermatology', 'Cardiology', 'Dentistry', 'Surgery', 'Oncology', 'ExoticAnimals'][value - 1] as any;
  }

  private toResponse(vet: { id: number; firstName: string; lastName: string; licenseNumber: string; specialty: string }) {
    return { id: vet.id, firstName: vet.firstName, lastName: vet.lastName, licenseNumber: vet.licenseNumber, specialty: this.toNumericSpecialty(vet.specialty) };
  }

  private toNumericSpecialty(value: string) {
    const values = ['GeneralPractice', 'InternalMedicine', 'Dermatology', 'Cardiology', 'Dentistry', 'Surgery', 'Oncology', 'ExoticAnimals'];
    return values.indexOf(value) + 1;
  }
}

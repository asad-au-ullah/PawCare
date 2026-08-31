import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum VeterinarianSpecialty {
  GeneralPractice = 1,
  InternalMedicine,
  Dermatology,
  Cardiology,
  Dentistry,
  Surgery,
  Oncology,
  ExoticAnimals,
}

export class VeterinarianQueryDto {
  @IsOptional() @Type(() => Number) @IsEnum(VeterinarianSpecialty) specialty?: VeterinarianSpecialty;
}

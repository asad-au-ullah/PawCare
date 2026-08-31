import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export enum PetSpecies {
  Dog = 1,
  Cat,
  Bird,
  Rabbit,
  Other,
}

export class CreatePetDto {
  @ApiProperty() @IsString() @MaxLength(100) @Matches(/^[a-zA-Z\s-]+$/, { message: 'Name can only contain letters, spaces, and hyphens.' }) name!: string;
  @ApiProperty({ enum: PetSpecies }) @IsEnum(PetSpecies) species!: PetSpecies;
  @ApiProperty() @IsString() @MaxLength(100) @Matches(/^[a-zA-Z\s-]+$/, { message: 'Breed can only contain letters, spaces, and hyphens.' }) breed!: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateOfBirth?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) ageInYears?: number | null;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @IsPositive({ message: 'Weight must be greater than zero.' }) weight?: number | null;
}

export class UpdatePetDto extends CreatePetDto {}

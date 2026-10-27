import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum AppointmentReason {
  Checkup = 1,
  Vaccination,
  Surgery,
  Grooming,
  Dental,
  Emergency,
  Consultation,
}

export class CreateAppointmentDto {
  @ApiProperty() @IsInt() @Min(1) petId!: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) veterinarianId?: number;
  @ApiProperty() @IsDateString() scheduledAt!: string;
  @ApiProperty({ enum: AppointmentReason }) @IsEnum(AppointmentReason) reason!: AppointmentReason;
  @ApiProperty({ minimum: 15, maximum: 240 }) @IsInt() @Min(15) @Max(240) durationMinutes!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AppointmentReason, CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt <= new Date()) throw new BadRequestException('Appointment must be scheduled in the future.');

    const pet = await this.db.pet.findFirst({ where: { id: dto.petId, owner: { applicationUserId: userId } } });
    if (!pet) throw new BadRequestException('Pet not found or does not belong to you.');

    const vet = await this.db.veterinarian.findUnique({ where: { id: dto.veterinarianId } });
    if (!vet) throw new BadRequestException('Veterinarian not found.');

    const newEnd = new Date(scheduledAt.getTime() + dto.durationMinutes * 60_000);
    const candidates = await this.db.appointment.findMany({
      where: {
        veterinarianId: dto.veterinarianId,
        NOT: [{ status: 'Cancelled' }, { status: 'NoShow' }],
      },
      select: { scheduledAt: true, durationMinutes: true },
    });

    const hasConflict = candidates.some((a) => {
      const existingEnd = new Date(a.scheduledAt.getTime() + a.durationMinutes * 60_000);
      return scheduledAt < existingEnd && a.scheduledAt < newEnd;
    });
    if (hasConflict) throw new BadRequestException('This veterinarian is not available at the requested time.');

    const appointment = await this.db.appointment.create({
      data: {
        petId: pet.id,
        veterinarianId: vet.id,
        scheduledAt,
        reason: this.toPrismaReason(dto.reason),
        durationMinutes: dto.durationMinutes,
        status: 'Scheduled',
      },
      include: { pet: true, veterinarian: true },
    });

    return this.toResponse(appointment);
  }

  async getMine(userId: string) {
    const appointments = await this.db.appointment.findMany({
      where: { pet: { owner: { applicationUserId: userId } } },
      include: { pet: true, veterinarian: true },
      orderBy: { scheduledAt: 'asc' },
    });
    return appointments.map((appointment) => this.toResponse(appointment));
  }

  private toPrismaReason(value: AppointmentReason) {
    return ['Checkup', 'Vaccination', 'Surgery', 'Grooming', 'Dental', 'Emergency', 'Consultation'][value - 1] as any;
  }

  private toResponse(a: { id: number; scheduledAt: Date; status: string; reason: string; notes: string; durationMinutes: number; petId: number; pet: { name: string }; veterinarianId: number; veterinarian: { firstName: string; lastName: string } }) {
    const status = ['Scheduled', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow'].indexOf(a.status) + 1;
    const reason = ['Checkup', 'Vaccination', 'Surgery', 'Grooming', 'Dental', 'Emergency', 'Consultation'].indexOf(a.reason) + 1;
    return { id: a.id, scheduledAt: a.scheduledAt.toISOString(), status, reason, notes: a.notes, durationMinutes: a.durationMinutes, petId: a.petId, petName: a.pet.name, veterinarianId: a.veterinarianId, veterinarianFirstName: a.veterinarian.firstName, veterinarianLastName: a.veterinarian.lastName };
  }
}

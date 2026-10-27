import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentReason, CreateAppointmentDto } from './dto/create-appointment.dto';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: { create: jest.Mock; getMine: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      getMine: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: service },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('delegates create to AppointmentsService with authenticated userId', async () => {
    const userPayload = { sub: 'user-abc', email: 'owner@example.com', role: 'PetOwner' } as any;
    const dto: CreateAppointmentDto = {
      petId: 1,
      scheduledAt: '2026-11-01T10:00:00.000Z',
      reason: AppointmentReason.Checkup,
      durationMinutes: 30,
    };

    const expectedResponse = { id: 10, petId: 1, veterinarianId: null } as any;
    service.create.mockResolvedValue(expectedResponse);

    const result = await controller.create(userPayload, dto);

    expect(service.create).toHaveBeenCalledWith('user-abc', dto);
    expect(result).toBe(expectedResponse);
  });

  it('delegates getMine to AppointmentsService with authenticated userId', async () => {
    const userPayload = { sub: 'user-abc', email: 'owner@example.com', role: 'PetOwner' } as any;
    const expected = [{ id: 1 }] as any;
    service.getMine.mockResolvedValue(expected);

    const result = await controller.getMine(userPayload);

    expect(service.getMine).toHaveBeenCalledWith('user-abc');
    expect(result).toBe(expected);
  });
});

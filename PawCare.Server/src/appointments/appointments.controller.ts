import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/authenticated-user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentsService } from './appointments.service';

@ApiTags('Appointments') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) { }
  @Post() create(@CurrentUser() user: JwtPayload, @Body() dto: CreateAppointmentDto) { return this.appointments.create(user.sub, dto); }
  @Get('me') getMine(@CurrentUser() user: JwtPayload) { return this.appointments.getMine(user.sub); }
}

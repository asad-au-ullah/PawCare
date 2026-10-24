import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PetsModule } from './pets/pets.module';
import { VeterinariansModule } from './veterinarians/veterinarians.module';
import { EmailModule } from './infrastructure/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PetsModule,
    VeterinariansModule,
    AppointmentsModule,
    EmailModule,

  ],
})
export class AppModule { }

import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VeterinarianQueryDto } from './dto/veterinarian-query.dto';
import { VeterinariansService } from './veterinarians.service';

@ApiTags('Veterinarians') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('veterinarians')
export class VeterinariansController {
  constructor(private readonly vets: VeterinariansService) {}
  @Get() getAll(@Query() query: VeterinarianQueryDto) { return this.vets.getAll(query); }
  @Get(':id') async getById(@Param('id', ParseIntPipe) id: number) { const vet = await this.vets.getById(id); if (!vet) throw new NotFoundException(); return vet; }
}

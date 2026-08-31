import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/authenticated-user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { PetsService } from './pets.service';

@ApiTags('Pets') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('pets')
export class PetsController {
  constructor(private readonly pets: PetsService) {}
  @Get() getAll(@CurrentUser() user: JwtPayload) { return this.pets.getMine(user.sub); }
  @Get(':id') async getOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) { const pet = await this.pets.getMineById(user.sub, id); if (!pet) throw new NotFoundException(); return pet; }
  @Post() create(@Body() dto: CreatePetDto, @CurrentUser() user: JwtPayload) { return this.pets.create(user.sub, dto); }
  @Put(':id') @HttpCode(204) async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePetDto, @CurrentUser() user: JwtPayload) { const ok = await this.pets.update(user.sub, id, dto); if (!ok) throw new NotFoundException(); }
  @Delete(':id') @HttpCode(204) async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) { const ok = await this.pets.remove(user.sub, id); if (!ok) throw new NotFoundException(); }
}

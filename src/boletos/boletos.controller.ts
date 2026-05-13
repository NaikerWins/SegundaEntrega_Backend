import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { AbordajeDto } from './dto/abordaje.dto';
import { DescensoDto } from './dto/descenso.dto';
import { SecurityGuard } from '../common/guards/security.guard';

@UseGuards(SecurityGuard)
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Get()
  findAll() {
    return this.boletosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.findOne(id);
  }

  // HU-2-003: Abordaje
  @Post('abordaje')
  abordaje(@Body() dto: AbordajeDto) {
    return this.boletosService.registrarAbordaje(dto);
  }

  // HU-2-004: Descenso
  @Post('descenso')
  descenso(@Body() dto: DescensoDto) {
    return this.boletosService.registrarDescenso(dto);
  }
}
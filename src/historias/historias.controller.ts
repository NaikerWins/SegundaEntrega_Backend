import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HistoriasService } from './historias.service';
import { SecurityGuard } from '../common/guards/security.guard';

@UseGuards(SecurityGuard)
@Controller('historias')
export class HistoriasController {
  constructor(private readonly historiasService: HistoriasService) {}

  // HU-2-005: Historial de viajes de un ciudadano
  @Get('ciudadano/:ciudadano_id')
  getHistorial(@Param('ciudadano_id', ParseIntPipe) ciudadano_id: number) {
    return this.historiasService.getHistorialCiudadano(ciudadano_id);
  }
}
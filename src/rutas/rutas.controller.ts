import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { MonitoreoService } from '../monitoreo/monitoreo.service';
@Controller('rutas')
export class RutasController {
  constructor(
  private readonly rutasService: RutasService,
  private readonly monitoreoService: MonitoreoService, // ← agregar
) {}

  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rutasService.findOne(id);
  }

  // NUEVO ENDPOINT
  @Get(':id/paraderos')
  getParaderos(@Param('id', ParseIntPipe) id: number) {
    return this.rutasService.getParaderos(id);
  }

  @Get(':id/tiempo-total')
  tiempoTotal(@Param('id', ParseIntPipe) id: number) {
    return this.rutasService.tiempoTotal(id);
  }

  @Get(':id/buses-activos')
async getBusesActivos(@Param('id', ParseIntPipe) id: number) {
  return this.monitoreoService.getBusesActivosPorRuta(id);
}
@Get('estimar-llegada/:rutaId/:paraderoId')
async estimarLlegada(
  @Param('rutaId', ParseIntPipe) rutaId: number,
  @Param('paraderoId', ParseIntPipe) paraderoId: number,
  @Query('busId') busId?: number,
) {
  return this.monitoreoService.estimarLlegada(rutaId, paraderoId, busId);
}
  @Post()
  create(@Body() dto: CreateRutaDto) {
    return this.rutasService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRutaDto,
  ) {
    return this.rutasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rutasService.remove(id);
  }
}
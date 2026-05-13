import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ParaderosService } from './paraderos.service';
import { CreateParaderoDto } from './dto/create-paradero.dto';
import { CercanosDto } from './dto/cercanos.dto';
import { SecurityGuard } from '../common/guards/security.guard';

@UseGuards(SecurityGuard)
@Controller('paraderos')
export class ParaderosController {
  constructor(private readonly paraderosService: ParaderosService) {}

  @Get()
  findAll() {
    return this.paraderosService.findAll();
  }

<<<<<<< HEAD
  // HU-2-002: Paraderos cercanos a una ubicación
  @Get('cercanos')
  getCercanos(@Query() dto: CercanosDto) {
    return this.paraderosService.getCercanos(dto.latitud, dto.longitud);
=======
  @Get(':id')
  findOne(@Param('id') id: string) {
    /* Sólo en caso de que haya algún tipo de error, se puede colocar lo siguiente:
    const numericId = +id;
    if (isNaN(numericId)) {
      Se maneja o se coloca un log con el error que lo puede causar
    }
   */
    return this.paraderosService.findOne(+id);
>>>>>>> 4821cec83bfbb19c3a7ea7337242b50e43b3fb17
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paraderosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateParaderoDto) {
    return this.paraderosService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateParaderoDto>) {
    return this.paraderosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paraderosService.remove(id);
  }
}
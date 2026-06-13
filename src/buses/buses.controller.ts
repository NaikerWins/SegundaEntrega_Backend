import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { ActualizarUbicacionDto } from 'src/monitoreo/dto/actualizar-ubicacion.dto';

@Controller('buses')
export class BusesController {

    constructor(private readonly busesService: BusesService) {}

    @Get()
    findAll() {
        return this.busesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.busesService.findOne(id);
    }

    @Post()
    async create(
        @Body() dto: CreateBusDto,
        @Query('empresaId', ParseIntPipe) empresaId: number,
    ) {
        console.log('DTO recibido:', JSON.stringify({ ...dto, fotoBus: dto.fotoBus ? 'base64...' : null }));
        console.log('empresaId:', empresaId);
        try {
            return await this.busesService.create(dto, empresaId);
        } catch(error) {
            console.error('Error creando bus:', error);
            throw error;
        }
    }

    

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBusDto,
    ) {
        return this.busesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.busesService.remove(id);
    }
    @Post(':id/ubicacion')
async actualizarUbicacion(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: ActualizarUbicacionDto,
) {
  return this.busesService.actualizarUbicacion(id, dto);
}
}
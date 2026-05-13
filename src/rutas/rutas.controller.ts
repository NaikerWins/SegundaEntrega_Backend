import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { SecurityGuard } from '../guards/security/security.guard';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@UseGuards(SecurityGuard)
@Controller('rutas')
export class RutasController {

    constructor(private readonly rutasService: RutasService) {}

    @Get()
    findAll() {
        return this.rutasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.rutasService.findOne(id);
    }

    // GET /rutas/:id/tiempo-total
    @Get(':id/tiempo-total')
    tiempoTotal(@Param('id', ParseIntPipe) id: number) {
        return this.rutasService.tiempoTotal(id);
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
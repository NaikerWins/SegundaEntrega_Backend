import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosPagoService } from './metodospago.service';
import { CreateMetodoPagoDto } from './dto/create-metodospago.dto';
import { UpdateMetodospagoDto } from './dto/update-metodospago.dto';

@Controller('metodospago')
export class MetodospagoController {
  constructor(private readonly metodospagoService: MetodosPagoService) {}

  @Post()
  create(@Body() createMetodospagoDto: CreateMetodoPagoDto) {
    return this.metodospagoService.create(createMetodospagoDto);
  }

  @Get()
  findAll() {
    return this.metodospagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodospagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodospagoDto: UpdateMetodospagoDto) {
    return this.metodospagoService.update(+id, updateMetodospagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodospagoService.remove(+id);
  }
}

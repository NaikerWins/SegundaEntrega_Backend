import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgramacionesService } from './programaciones.service';
import { CreateProgramacionDto } from './dto/create-programaciones.dto';
import { UpdateProgramacionDto } from './dto/update-programaciones.dto';

@Controller('programaciones')
export class ProgramacionesController {
  constructor(private readonly programacionesService: ProgramacionesService) {}

  @Post()
  create(@Body() createProgramacioneDto: CreateProgramacionDto) {
    return this.programacionesService.create(createProgramacioneDto);
  }

  @Get()
  findAll() {
    return this.programacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgramacioneDto: UpdateProgramacionDto) {
    return this.programacionesService.update(+id, updateProgramacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programacionesService.remove(+id);
  }
}

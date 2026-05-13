import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgramacionesService } from './programaciones.service';
import { CreateProgramacioneDto } from './dto/create-programacione.dto';
import { UpdateProgramacioneDto } from './dto/update-programacione.dto';

@Controller('programaciones')
export class ProgramacionesController {
  constructor(private readonly programacionesService: ProgramacionesService) {}

  @Post()
  create(@Body() createProgramacioneDto: CreateProgramacioneDto) {
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
  update(@Param('id') id: string, @Body() updateProgramacioneDto: UpdateProgramacioneDto) {
    return this.programacionesService.update(+id, updateProgramacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programacionesService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosPagoCiudadanoService } from './metodospagociudadano.service';
import { CreateMetodoPagoCiudadanoDto } from './dto/create-metodospagociudadano.dto';
import { UpdateMetodospagociudadanoDto } from './dto/update-metodospagociudadano.dto';

@Controller('metodospagociudadano')
export class MetodospagociudadanoController {
  constructor(private readonly metodospagociudadanoService: MetodosPagoCiudadanoService) {}

  @Post()
  create(@Body() createMetodospagociudadanoDto: CreateMetodoPagoCiudadanoDto) {
    return this.metodospagociudadanoService.create(createMetodospagociudadanoDto);
  }

  @Get()
  findAll() {
    return this.metodospagociudadanoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodospagociudadanoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodospagociudadanoDto: UpdateMetodospagociudadanoDto) {
    return this.metodospagociudadanoService.update(+id, updateMetodospagociudadanoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodospagociudadanoService.remove(+id);
  }

  @Post('iniciar-recarga/:id')
  iniciarRecarga(@Param('id') id: string, @Body('monto') monto: number, @Body('email') email: string) {
      return this.metodospagociudadanoService.iniciarRecarga(+id, monto, email);
  }

 @Post('confirmar-recarga')
 confirmarRecarga(@Body ('referencia') referencia:string, @Body ('estado') estado: string, @Body('monto') monto: number ){
  return this.metodospagociudadanoService.confirmarRecarga(referencia, estado, monto);
 }

}

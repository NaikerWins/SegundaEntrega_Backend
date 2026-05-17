import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramacionesService } from './programaciones.service';
import { ProgramacionesController } from './programaciones.controller';
import { Programacion } from './entities/programaciones.entity';
import { RutasModule } from '../rutas/rutas.module';
import { BusesModule } from '../buses/buses.module';
import { TurnosModule } from '../turnos/turnos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Programacion]), RutasModule, BusesModule, TurnosModule],
  controllers: [ProgramacionesController],
  providers: [ProgramacionesService],
})
export class ProgramacionesModule {}



import { Module } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { BoletosController } from './boletos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleto } from './entities/boleto.entity';
import { Paradero } from 'src/paraderos/entities/paradero.entity';
import { Programacion } from '../programaciones/entities/programaciones.entity';
import { MetodospagociudadanoModule } from 'src/metodospagociudadano/metodospagociudadano.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Programacion, Paradero]), MetodospagociudadanoModule],
  controllers: [BoletosController],
  providers: [BoletosService],
  exports: [BoletosService],
})
export class BoletosModule {}

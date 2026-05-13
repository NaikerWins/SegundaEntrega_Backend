import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPagoCiudadano } from './entities/metodospagociudadano.entity';
import { MetodosPagoCiudadanoService } from './metodospagociudadano.service';
import { MetodospagociudadanoController } from './metodospagociudadano.controller';
import { MetodospagoModule } from 'src/metodospago/metodospago.module';
import { Transaccion } from '../../src/transacciones/entities/transacciones.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPagoCiudadano, Transaccion]), MetodospagoModule],  controllers: [MetodospagociudadanoController],
  providers: [MetodosPagoCiudadanoService],
})
export class MetodospagociudadanoModule {}



import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion } from 'src/transacciones/entities/transacciones.entity';
import { MetodospagociudadanoModule } from 'src/metodospagociudadano/metodospagociudadano.module';
import { MetodoPagoCiudadano } from 'src/metodospagociudadano/entities/metodospagociudadano.entity';
import { Incidente } from 'src/incidentes/entities/incidente.entity';
import { IncidentesModule } from 'src/incidentes/incidentes.module';
import { BoletosModule } from 'src/boletos/boletos.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Transaccion, MetodoPagoCiudadano, Incidente]),
      MetodospagociudadanoModule,
      IncidentesModule,
      BoletosModule
  ],
  providers: [ReportesService],
  controllers: [ReportesController]
})
export class ReportesModule {}
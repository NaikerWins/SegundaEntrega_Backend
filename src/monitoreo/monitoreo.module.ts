import { Module } from '@nestjs/common';
import { MonitoreoGateway } from './monitoreo.gateway';
import { MonitoreoService } from './monitoreo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuscripcionParadero } from './entities/suscripcion-paradero.entity';
import { PreferenciasClima } from './entities/preferencias-clima.entity';
import { Bus } from '../buses/entities/bus.entity';
import { Programacion } from '../programaciones/entities/programaciones.entity';
import { Incidente } from '../incidentes/entities/incidente.entity';
import { Nodo } from '../nodos/entities/nodo.entity';
import { Paradero } from '../paraderos/entities/paradero.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { WeatherService } from './weather.service';
import { MonitoreoController } from './monitoreo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuscripcionParadero,
      PreferenciasClima,
      Bus,
      Programacion,
      Incidente,
      Nodo,
      Paradero,
      Ruta,
    ]),
  ],
  controllers: [MonitoreoController], 
  providers: [MonitoreoGateway, MonitoreoService,WeatherService],
  exports: [MonitoreoGateway, MonitoreoService,WeatherService],
})
export class MonitoreoModule {}
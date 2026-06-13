import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RutasModule } from './rutas/rutas.module';
import { ParaderosModule } from './paraderos/paraderos.module';
import { BoletosModule } from './boletos/boletos.module';
import { NodosModule } from './nodos/nodos.module';
import { HistoriasModule } from './historias/historias.module';
import { EmpresasModule } from './empresas/empresas.module';
import { GpsModule } from './gps/gps.module';
import { ProgramacionesModule } from './programaciones/programaciones.module';
import { MetodospagoModule } from './metodospago/metodospago.module';
import { MetodospagociudadanoModule } from './metodospagociudadano/metodospagociudadano.module';
import { ReportesModule } from './reportes/reportes.module';
import { TransaccionesModule } from './transacciones/transacciones.module';
import { SecurityGuard } from './guards/security/security.guard';
import { BusesModule } from './buses/buses.module';
import { GruposModule } from './grupos/grupos.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { MensajeriaModule } from './mensajeria/mensajeria.module';

import { MonitoreoModule } from './monitoreo/monitoreo.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PqrsModule } from './pqrs/pqrs.module';
import { PreferenciasClimaModule } from './preferencias-clima/preferencias-clima.module';


@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    RutasModule,
    MonitoreoModule,
    ScheduleModule,
    ParaderosModule,
    BoletosModule,
    NodosModule,
    HistoriasModule,
    EmpresasModule,
    BusesModule,
    GpsModule,
    ProgramacionesModule,
    MetodospagoModule,
    MetodospagociudadanoModule,
    ReportesModule,
    TransaccionesModule,
    GruposModule,
    MensajesModule,
    MensajeriaModule,
    MensajeriaModule,
    MensajesModule,
    GruposModule,
    PqrsModule,
    PreferenciasClimaModule,

  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SecurityGuard,
    },
  ],
})
export class AppModule {}
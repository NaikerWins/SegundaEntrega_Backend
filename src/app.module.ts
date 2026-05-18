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
import { BusesModule } from './buses/buses.module';
import { ConductoresModule } from './conductores/conductores.module';
import { IncidentesModule } from './incidentes/incidentes.module';
import { TurnosModule } from './turnos/turnos.module';
import { NotificacionesModule } from './gateways/notifications/notifications.module';
import { SecurityGuard } from './guards/security.guard';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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
        ParaderosModule,
        BoletosModule,
        NodosModule,
        HistoriasModule,
        EmpresasModule,
        GpsModule,
        BusesModule,
        ConductoresModule,
        TurnosModule,
        IncidentesModule,
        NotificacionesModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: SecurityGuard,  // ← NestJS inyecta Reflector automáticamente
        },
    ],
})
export class AppModule {}
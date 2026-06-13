import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { Nodo } from '../nodos/entities/nodo.entity';
import { Paradero } from '../paraderos/entities/paradero.entity';
import { RutasService } from './rutas.service';
import { MonitoreoModule } from '../monitoreo/monitoreo.module';
import { RutasController } from './rutas.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Ruta, Nodo, Paradero]), MonitoreoModule],
    controllers: [RutasController],
    providers: [RutasService],
    exports: [RutasService],
})
export class RutasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasService } from './historias.service';
import { HistoriasController } from './historias.controller';
import { Boleto } from '../boletos/entities/boleto.entity';
import { Nodo } from '../nodos/entities/nodo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Nodo])],
  controllers: [HistoriasController],
  providers: [HistoriasService],
})
export class HistoriasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { MiembroGrupo } from './entities/miembro-grupo.entity';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, MiembroGrupo])],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [GruposService],
})
export class GruposModule {}
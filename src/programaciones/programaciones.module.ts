import { Module } from '@nestjs/common';
import { ProgramacionesService } from './programaciones.service';
import { ProgramacionesController } from './programaciones.controller';

@Module({
  controllers: [ProgramacionesController],
  providers: [ProgramacionesService],
})
export class ProgramacionesModule {}

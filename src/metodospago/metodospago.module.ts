import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodospago.entity';
import { MetodosPagoService } from './metodospago.service';
import { MetodospagoController } from './metodospago.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago])],
  controllers: [MetodospagoController],
  providers: [MetodosPagoService],
  exports: [MetodosPagoService]
})
export class MetodospagoModule {}

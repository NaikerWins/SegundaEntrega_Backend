import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CercanosDto {
  @Type(() => Number)
  @IsNumber()
  latitud!: number;

  @Type(() => Number)
  @IsNumber()
  longitud!: number;
}
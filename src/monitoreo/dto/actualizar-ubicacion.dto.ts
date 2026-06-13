import { IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarUbicacionDto {
  @IsNumber()
  @IsNotEmpty()
  latitud!: number;

  @IsNumber()
  @IsNotEmpty()
  longitud!: number;
}
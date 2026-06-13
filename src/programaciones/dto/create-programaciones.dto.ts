import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsISO8601,
  IsObject,
} from "class-validator";

import { Ruta } from "src/rutas/entities/ruta.entity";
import { Bus } from "src/buses/entities/bus.entity";

export class CreateProgramacionDto {

  @IsISO8601()
  @IsNotEmpty()
  salida?: string;

  @IsNumber()
  @IsOptional()
  tolerancia?: number;

  @IsString()
  @IsOptional()
  recurrencia?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsNumber()
  @IsOptional()
  conductor_id?: number;

  @IsNumber()
  @IsOptional()
  capacidad_maxima?: number;

  @IsNumber()
  @IsOptional()
  ocupacion_actual?: number;

  @IsObject()
  @IsNotEmpty()
  ruta?: Ruta;

  @IsObject()
  @IsNotEmpty()
  bus?: Bus;
}
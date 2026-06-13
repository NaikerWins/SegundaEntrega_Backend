import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AbordajeDto {
  @IsString()             
  @IsNotEmpty()
  ciudadano_id!: string;

  @IsInt()
  @IsNotEmpty()
  programacion_id!: number;

  @IsInt()
  @IsNotEmpty()
  metodo_pago_id!: number;

  @IsInt()
  @IsNotEmpty()
  paradero_abordaje_id!: number;
}
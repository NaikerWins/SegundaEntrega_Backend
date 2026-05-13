import { IsInt, IsNotEmpty } from 'class-validator';

export class AbordajeDto {
  @IsInt()
  @IsNotEmpty()
  ciudadano_id!: number;

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
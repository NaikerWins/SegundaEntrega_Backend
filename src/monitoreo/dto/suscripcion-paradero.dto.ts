import { IsInt, IsNotEmpty, IsIn } from 'class-validator';

export class CreateSuscripcionDto {
  @IsInt()
  @IsNotEmpty()
  ruta_id!: number;

  @IsInt()
  @IsNotEmpty()
  paradero_id!: number;

  @IsInt()
  @IsIn([5, 10, 15])
  minutos_anticipacion!: number;
}
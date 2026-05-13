import { IsInt, IsNotEmpty } from 'class-validator';

export class DescensoDto {
  @IsInt()
  @IsNotEmpty()
  boleto_id!: number;

  @IsInt()
  @IsNotEmpty()
  paradero_descenso_id!: number;
}
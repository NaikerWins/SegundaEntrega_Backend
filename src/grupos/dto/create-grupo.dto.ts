import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGrupoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'])
  tipo?: 'PUBLIC' | 'PRIVATE';
}
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGrupoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  @IsIn(['publico', 'privado', 'PUBLIC', 'PRIVATE'])
  tipo?: string;

  @IsOptional()
  @IsArray()
  miembros?: {
    userId: string;
    nombre: string;
  }[];
}
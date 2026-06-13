import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateGrupoDto } from './create-grupo.dto';

export class UpdateGrupoDto extends PartialType(CreateGrupoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
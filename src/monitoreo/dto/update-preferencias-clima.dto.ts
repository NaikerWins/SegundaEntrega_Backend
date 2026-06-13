import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferenciasClimaDto {
  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsString()
  @IsOptional()
  horario_viaje?: string;

  @IsBoolean()
  @IsOptional()
  alertas_activas?: boolean;

  @IsString()
  @IsOptional()
  canal_preferido?: string;
}
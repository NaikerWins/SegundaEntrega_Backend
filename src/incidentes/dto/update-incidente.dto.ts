import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateIncidenteDto {
    @IsString()
    @IsOptional()
    @IsIn(['pendiente', 'en_revision', 'resuelto'])
    estado?: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(500)
    descripcion?: string;

    @IsString()
    @IsOptional()
    @IsIn(['bajo', 'medio', 'alto'])
    gravedad?: string;
}
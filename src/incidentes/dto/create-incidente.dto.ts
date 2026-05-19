import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

export class CreateFotoDto {
    @IsUrl()
    @IsNotEmpty()
    url?: string;
}

export class CreateIncidenteDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['accidente_menor', 'falla_mecanica', 'congestion_inesperada', 'problema_pasajeros'])
    tipo!: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['bajo', 'medio', 'alto', 'critico'])
    gravedad!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    descripcion!: string;

    @IsInt()
    @IsNotEmpty()
    busId!: number;

    @IsInt()
@IsNotEmpty()
conductorId!: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateFotoDto)
    fotos?: CreateFotoDto[];
}
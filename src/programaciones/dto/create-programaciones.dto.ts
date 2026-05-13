import { IsNumber, IsNotEmpty, IsOptional, IsString, IsISO8601 } from "class-validator";
import { Ruta } from "src/rutas/entities/ruta.entity";
import { Bus } from "src/buses/entities/bus.entity";

export class CreateProgramacionDto {

    @IsISO8601()
    @IsNotEmpty()
    salida?: string;

    @IsNumber()
    @IsOptional()
    tolerancia?: number;

    @IsString()
    @IsOptional()
    recurrencia?: string;
    
    @IsNotEmpty()
    ruta?: Ruta;

    @IsNotEmpty()
    bus?: Bus;

}
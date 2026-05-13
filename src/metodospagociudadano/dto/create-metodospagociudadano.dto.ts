import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";
import { MetodoPago } from "../../metodospago/entities/metodospago.entity";

export class CreateMetodoPagoCiudadanoDto {

    @IsString()
    @IsNotEmpty()
    id_ciudadano?: string;

    @IsNumber()
    @IsNotEmpty()
    saldo?: number;

    @IsNumber()
    @IsOptional()
    @Min(5000)
    @Max(500000)
    monto?: number;

    @IsNumber()
    @IsOptional()
    cargo?: number;

    @IsNotEmpty()
    metodopago?: MetodoPago;

}
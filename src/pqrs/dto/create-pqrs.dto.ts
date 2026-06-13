import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePqrsDto {
    @IsNotEmpty()
    @IsEnum(["PETICION", "QUEJA", "RECLAMO", "SUGERENCIA"])
    tipo!: string;

    @IsNotEmpty()
    @IsString()
    categoria!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    descripcion!: string;

    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    ciudadanoId?: string;
}
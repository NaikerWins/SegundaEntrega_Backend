import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PreferenciasClimaService } from "./preferencias-clima.service";

@Controller("preferencias-clima")
export class PreferenciasClimaController {
    constructor(private readonly service: PreferenciasClimaService) {}

    @Get(":usuarioId")
    findOne(@Param("usuarioId") usuarioId: string) {
        return this.service.findByUsuario(usuarioId);
    }

    @Post(":usuarioId")
    upsert(
        @Param("usuarioId") usuarioId: string,
        @Body() body: { alertasActivas: boolean; horarioViaje: string; email: string }
    ) {
        return this.service.upsert(usuarioId, body);
    }

    @Get()
    findActivas() {
        return this.service.findActivas();
    }
}
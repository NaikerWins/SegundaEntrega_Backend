import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PreferenciaClima } from "./entities/preferencias-clima.entity";
import { PreferenciasClimaService } from "./preferencias-clima.service";
import { PreferenciasClimaController } from "./preferencias-clima.controller";

@Module({
    imports: [TypeOrmModule.forFeature([PreferenciaClima])],
    controllers: [PreferenciasClimaController],
    providers: [PreferenciasClimaService],
})
export class PreferenciasClimaModule {}
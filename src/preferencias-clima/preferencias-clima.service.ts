import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PreferenciaClima } from "./entities/preferencias-clima.entity";

@Injectable()
export class PreferenciasClimaService {
    constructor(
        @InjectRepository(PreferenciaClima)
        private readonly repo: Repository<PreferenciaClima>,
    ) {}

    async findByUsuario(usuarioId: string): Promise<PreferenciaClima | null> {
        return this.repo.findOne({ where: { usuarioId } });
    }

    async upsert(usuarioId: string, data: Partial<PreferenciaClima>): Promise<PreferenciaClima> {
        let preferencia = await this.repo.findOne({ where: { usuarioId } });
        if (preferencia) {
            Object.assign(preferencia, data);
        } else {
            preferencia = this.repo.create({ usuarioId, ...data });
        }
        return this.repo.save(preferencia);
    }

    async findActivas(): Promise<PreferenciaClima[]> {
        return this.repo.find({ where: { alertasActivas: true } });
    }
}
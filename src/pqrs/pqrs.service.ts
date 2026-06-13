import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pqrs } from "./entities/pqrs.entity";
import { CreatePqrsDto } from "./dto/create-pqrs.dto";

@Injectable()
export class PqrsService {
    constructor(
        @InjectRepository(Pqrs)
        private readonly pqrsRepo: Repository<Pqrs>,
    ) {}

    async create(dto: CreatePqrsDto): Promise<Pqrs> {
        const radicado = `PQRS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 15);

        const pqrs = this.pqrsRepo.create({
            ...dto,
            radicado,
            estado: "RECIBIDO",
            fechaLimite,
        });

        return this.pqrsRepo.save(pqrs);
    }

    async findByRadicado(radicado: string): Promise<Pqrs> {
        const pqrs = await this.pqrsRepo.findOne({ where: { radicado } });
        if (!pqrs) throw new NotFoundException("PQRS no encontrada");
        return pqrs;
    }

    async findAll(): Promise<Pqrs[]> {
        return this.pqrsRepo.find({ order: { creadoEn: "DESC" } });
    }

    async createConRadicado(dto: CreatePqrsDto & { radicado: string }): Promise<Pqrs> {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 15);

        const pqrs = this.pqrsRepo.create({
            ...dto,
            estado: "RECIBIDO",
            fechaLimite,
        });

        return this.pqrsRepo.save(pqrs);
    }

    async cambiarEstado(radicado: string, estado: string, respuesta?: string): Promise<Pqrs> {
        const pqrs = await this.pqrsRepo.findOne({ where: { radicado } });
        if (!pqrs) throw new NotFoundException('PQRS no encontrada');
        pqrs.estado = estado;
        if (respuesta) pqrs.respuesta = respuesta;
        return this.pqrsRepo.save(pqrs);
    }
}
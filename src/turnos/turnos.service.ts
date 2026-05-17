import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { IniciarTurnoDto } from './dto/iniciar-turno.dto';
import { BusesService } from '../buses/buses.service';
import { ConductoresService } from '../conductores/conductores.service';
import { GpsService } from '../gps/gps.service';

@Injectable()
export class TurnosService {

    constructor(
        @InjectRepository(Turno)
        private readonly turnoRepository: Repository<Turno>,
        private readonly busesService: BusesService,
        private readonly conductoresService: ConductoresService,
        private readonly gpsService: GpsService,
    ) {}

    async findAll(): Promise<Turno[]> {
        return this.turnoRepository.find({
            relations: ['conductor', 'conductor.persona', 'bus'],
        });
    }

    async findOne(id: number): Promise<Turno> {
        const turno = await this.turnoRepository.findOne({
            where: { id },
            relations: ['conductor', 'conductor.persona', 'bus'],
        });
        if (!turno) {
            throw new NotFoundException(`Turno con id ${id} no encontrado`);
        }
        return turno;
    }

    async findTurnoActivo(conductorId: number): Promise<Turno> {
        const turno = await this.turnoRepository.findOne({
            where: {
                conductor: { id: conductorId },
                estado: 'en_curso',
            },
            relations: ['conductor', 'conductor.persona', 'bus'],
        });
        if (!turno) {
            throw new NotFoundException(`No hay turno activo para el conductor ${conductorId}`);
        }
        return turno;
    }

    async create(dto: CreateTurnoDto): Promise<Turno> {
        const conductor = await this.conductoresService.findOne(dto.conductorId);
        const bus = await this.busesService.findOne(dto.busId);

        // Validar que el conductor no tenga otro turno en curso
        const turnoEnCurso = await this.turnoRepository.findOne({
            where: {
                conductor: { id: dto.conductorId },
                estado: 'en_curso',
            },
        });
        if (turnoEnCurso) {
            throw new BadRequestException('El conductor ya tiene un turno en curso');
        }

        const turno = this.turnoRepository.create({
            ...dto,
            estado: 'programado',
            conductor,
            bus,
        });

        return this.turnoRepository.save(turno);
    }

    async iniciarTurno(conductorId: number, dto: IniciarTurnoDto): Promise<Turno> {
        const ahora = new Date();

        // Buscar turno programado del conductor
        const turno = await this.turnoRepository.findOne({
            where: {
                conductor: { id: conductorId },
                estado: 'programado',
            },
            relations: ['conductor', 'conductor.persona', 'bus', 'bus.gps'],
        });

        if (!turno) {
            throw new NotFoundException('No hay turno programado para este conductor');
        }

        // Validar que la fecha programada sea la de hoy (estricta)
        if (turno.fechaProgramada) {
            const fechaProgramada = new Date(turno.fechaProgramada);

            const mismoAnio = fechaProgramada.getFullYear() === ahora.getFullYear();
            const mismoMes = fechaProgramada.getMonth() === ahora.getMonth();
            const mismoDia = fechaProgramada.getDate() === ahora.getDate();
            const mismaHora = fechaProgramada.getHours() === ahora.getHours();
            const mismoMinuto = fechaProgramada.getMinutes() === ahora.getMinutes();

            if (!mismoAnio || !mismoMes || !mismoDia || !mismaHora || !mismoMinuto) {
                throw new BadRequestException(
                    `El turno está programado para ${fechaProgramada.toLocaleString()}. ` +
                    `No puede iniciarse en este momento.`
                );
            }
        }

        // Guardar observaciones si vienen
        if (dto.observaciones) {
            turno.observaciones = dto.observaciones;
        }

        // Actualizar estado del turno
        turno.estado = 'en_curso';
        turno.fechaInicio = ahora;

        const turnoActualizado = await this.turnoRepository.save(turno);

        // Activar GPS del bus
        if (turno.bus?.gps?.id) {
            await this.gpsService.activar(turno.bus.gps.id);
        }

        return turnoActualizado;
    }

    async finalizarTurno(conductorId: number): Promise<Turno> {
        const turno = await this.findTurnoActivo(conductorId);

        turno.estado = 'finalizado';
        turno.fechaFin = new Date();

        const turnoFinalizado = await this.turnoRepository.save(turno);

        // Desactivar GPS del bus
        if (turno.bus?.gps?.id) {
            await this.gpsService.desactivar(turno.bus.gps.id);
        }

        return turnoFinalizado;
    }

    async update(id: number, dto: UpdateTurnoDto): Promise<Turno> {
        const turno = await this.findOne(id);
        Object.assign(turno, dto);
        return this.turnoRepository.save(turno);
    }

    async validarConductorActivoPorBus(busId: number, fecha: Date): Promise<boolean> {
        const turno = await this.turnoRepository.findOne({
            where: {
                bus: { id: busId },
                estado: 'en_curso',
            },
            relations: ['conductor', 'bus'],
        });
        return !!turno;
    }
    
}
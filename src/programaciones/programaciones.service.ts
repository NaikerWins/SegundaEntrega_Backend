
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramacionDto } from './dto/create-programaciones.dto';
import { UpdateProgramacionDto } from './dto/update-programaciones.dto';
import { Programacion } from './entities/programaciones.entity';
import { RutasService } from '../rutas/rutas.service';
import { BusesService } from '../buses/buses.service';
import { TurnosService } from '../turnos/turnos.service';

@Injectable()
export class ProgramacionesService {
  constructor(
    @InjectRepository(Programacion)
    private readonly programacionesRepository: Repository<Programacion>,

    private readonly rutasService: RutasService,

    private readonly busesService: BusesService,

    private readonly turnosService: TurnosService,

  ) {}

  private resolveId(value: any): number | undefined {
    if (!value) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && 'id' in value) return (value as any).id;
    return undefined;
  }

  async create(dto: CreateProgramacionDto) {

    const programacion = this.programacionesRepository.create({

        salida: dto.salida ? new Date(dto.salida) : undefined,

        tolerancia: dto.tolerancia,

        recurrencia: dto.recurrencia,

        estado: dto.estado || 'activa',

        conductor_id: dto.conductor_id,

        capacidad_maxima: dto.capacidad_maxima,

        ocupacion_actual: dto.ocupacion_actual || 0,

        ruta: dto.ruta
            ? { id: dto.ruta.id }
            : undefined,

        bus: dto.bus
            ? { id: dto.bus.id }
            : undefined,
    });

    return await this.programacionesRepository.save(programacion);
}

  findAll(): Promise<Programacion[]> {
    return this.programacionesRepository.find({ relations: ['ruta', 'bus'] });
  }

  async findOne(id: number): Promise<Programacion> {
    const programacion = await this.programacionesRepository.findOne({
      where: { id },
      relations: ['ruta', 'bus'],
    });
    if (!programacion) throw new NotFoundException(`Programacion with id ${id} not found`);
    return programacion;
  }

  async update(id: number, updateProgramacionDto: UpdateProgramacionDto): Promise<Programacion> {
    const programacion = await this.programacionesRepository.findOne({ where: { id } });
    if (!programacion) throw new NotFoundException(`Programacion with id ${id} not found`);

    if (updateProgramacionDto.salida) programacion.salida = new Date(updateProgramacionDto.salida as any);

    if (updateProgramacionDto.ruta) {
      const rutaId = this.resolveId(updateProgramacionDto.ruta);
      if (!rutaId) throw new BadRequestException('ruta id is required');
      const ruta = await this.rutasService.findOne(rutaId);
      if (!ruta) throw new NotFoundException(`Ruta with id ${rutaId} not found`);
      programacion.ruta = ruta;
    }

    if (updateProgramacionDto.bus) {
      const busId = this.resolveId(updateProgramacionDto.bus);
      if (!busId) throw new BadRequestException('bus id is required');
      const bus = await this.busesService.findOne(busId);
      if (!bus) throw new NotFoundException(`Bus with id ${busId} not found`);
      programacion.bus = bus;
    }

    await this.programacionesRepository.save(programacion);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const programacion = await this.findOne(id);
    await this.programacionesRepository.remove(programacion);
  }
}



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

  async create(createProgramacionDto: CreateProgramacionDto): Promise<Programacion> {
    const rutaId = this.resolveId(createProgramacionDto.ruta);
    const busId = this.resolveId(createProgramacionDto.bus);

    if (!rutaId) throw new BadRequestException('ruta id is required');
    if (!busId) throw new BadRequestException('bus id is required');

    const ruta = await this.rutasService.findOne(rutaId);
    if (!ruta) throw new NotFoundException(`Ruta with id ${rutaId} not found`);

    if (!createProgramacionDto.salida) throw new BadRequestException('salida is required');

    const conflicto = await this.programacionesRepository.findOne({
        where: { bus: { id: busId }, salida: new Date(createProgramacionDto.salida) }
    });
    if (conflicto) throw new BadRequestException(`El bus ya tiene una programación en ese horario`);

    const bus = await this.busesService.findOne(busId);
    if (!bus) throw new NotFoundException(`Bus with id ${busId} not found`);

    const tieneConductor = await this.turnosService.validarConductorActivoPorBus(busId, new Date(createProgramacionDto.salida));
    if (!tieneConductor) throw new BadRequestException('El bus no tiene conductor asignado para ese horario');

    const programacion = this.programacionesRepository.create({
      salida: createProgramacionDto.salida ? new Date(createProgramacionDto.salida) : undefined,
      estado: 'programado',
      tolerancia: createProgramacionDto.tolerancia,
      recurrencia: createProgramacionDto.recurrencia,
      ruta,
      bus
    });

    return this.programacionesRepository.save(programacion);

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


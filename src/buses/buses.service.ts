import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { EmpresasService } from '../empresas/empresas.service';
import { GpsService } from '../gps/gps.service';
import { v4 as uuidv4 } from 'uuid';
import { ActualizarUbicacionDto } from 'src/monitoreo/dto/actualizar-ubicacion.dto';

@Injectable()
export class BusesService {

    constructor(
        @InjectRepository(Bus)
        private readonly busRepository: Repository<Bus>,
        private readonly empresasService: EmpresasService,
        private readonly gpsService: GpsService,
    ) {}

    async findAll(): Promise<Bus[]> {
        return this.busRepository.find({
            relations: ['empresa', 'gps'],
        });
    }

    async findOne(id: number): Promise<Bus> {
        const bus = await this.busRepository.findOne({
            where: { id },
            relations: ['empresa', 'gps'],
        });
        if (!bus) {
            throw new NotFoundException(`Bus con id ${id} no encontrado`);
        }
        return bus;
    }

    async create(dto: CreateBusDto, empresaId: number): Promise<Bus> {
    const placaExiste = await this.busRepository.findOne({
        where: { placa: dto.placa },
    });
    if (placaExiste) {
        throw new BadRequestException('Ya existe un bus con esa placa');
    }

    const empresa = await this.empresasService.findOne(empresaId);
    const gps = await this.gpsService.crear();
    const codigoQR = 'BUS-QR-' + uuidv4().substring(0, 8).toUpperCase();

    // Ubicación inicial aleatoria cerca de Manizales
    const ubicacionInicial = {
        lat: 5.06 + Math.random() * 0.03,   // Entre 5.06 y 5.09
        lng: -75.52 + Math.random() * 0.03, // Entre -75.52 y -75.49
    };

    const bus = this.busRepository.create({
        ...dto,
        codigoQR,
        empresa,
        gps,
        ubicacion: ubicacionInicial,
        ultima_actualizacion: new Date(),
    });

    return this.busRepository.save(bus);
}

    async update(id: number, dto: UpdateBusDto): Promise<Bus> {
        const bus = await this.findOne(id);
        Object.assign(bus, dto);
        return this.busRepository.save(bus);
    }

    async remove(id: number): Promise<{ mensaje: string }> {
        const bus = await this.findOne(id);
        await this.busRepository.remove(bus);
        return { mensaje: 'Bus eliminado correctamente' };
    }
    async actualizarUbicacion(busId: number, dto: ActualizarUbicacionDto) {
  const bus = await this.busRepository.findOneOrFail({ where: { id: busId } });
  bus.ubicacion = { lat: dto.latitud, lng: dto.longitud };
  bus.ultima_actualizacion = new Date();
  return this.busRepository.save(bus);
}
}
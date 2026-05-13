import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paradero } from './entities/paradero.entity';
import { Nodo } from '../nodos/entities/nodo.entity';
import { CreateParaderoDto } from './dto/create-paradero.dto';

@Injectable()
export class ParaderosService {
  constructor(
    @InjectRepository(Paradero)
    private readonly paraderoRepo: Repository<Paradero>,
    @InjectRepository(Nodo)
    private readonly nodoRepo: Repository<Nodo>,
  ) {}

  async findAll(): Promise<Paradero[]> {
    return await this.paraderoRepo.find();
  }

  async findOne(id: number): Promise<Paradero> {
    const paradero = await this.paraderoRepo.findOne({
      where: { id },
      relations: ['nodos', 'nodos.ruta'],
    });
    if (!paradero) throw new NotFoundException(`Paradero #${id} no encontrado`);
    return paradero;
  }

  // HU-2-002: Paraderos cercanos usando fórmula de Haversine
  async getCercanos(latitud: number, longitud: number) {
    const paraderos = await this.paraderoRepo.find({
      relations: ['nodos', 'nodos.ruta'],
    });

    const conDistancia = paraderos.map((paradero) => {
      const distancia = this.calcularDistancia(
        latitud,
        longitud,
        Number(paradero.latitud),
        Number(paradero.longitud),
      );

      const rutas = paradero.nodos.map((nodo) => ({
        id: nodo.ruta?.id,
        nombre: nodo.ruta?.nombre,
      }));

      return { ...paradero, distancia_metros: Math.round(distancia), rutas };
    });

    // Ordenar por distancia y retornar los 5 más cercanos
    return conDistancia
      .sort((a, b) => a.distancia_metros - b.distancia_metros)
      .slice(0, 5);
  }

  // Fórmula de Haversine para calcular distancia en metros
  private calcularDistancia(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
  ): number {
    const R = 6371000; // radio de la Tierra en metros
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  async create(dto: CreateParaderoDto): Promise<Paradero> {
    const paradero = this.paraderoRepo.create(dto);
    return await this.paraderoRepo.save(paradero);
  }

  async update(id: number, dto: Partial<CreateParaderoDto>): Promise<Paradero> {
    const paradero = await this.findOne(id);
    const updated = Object.assign(paradero, dto);
    return await this.paraderoRepo.save(updated);
  }

  async remove(id: number) {
    const paradero = await this.findOne(id);
    await this.paraderoRepo.remove(paradero);
    return { message: `Paradero #${id} eliminado` };
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleto } from './entities/boleto.entity';
import { Programacion } from '../programaciones/entities/programacione.entity';
import { Paradero } from '../paraderos/entities/paradero.entity';
import { AbordajeDto } from './dto/abordaje.dto';
import { DescensoDto } from './dto/descenso.dto';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
    @InjectRepository(Programacion)
    private readonly programacionRepo: Repository<Programacion>,
    @InjectRepository(Paradero)
    private readonly paraderoRepo: Repository<Paradero>,
  ) {}

  // HU-2-003: Abordaje y generación de boleto
  async registrarAbordaje(dto: AbordajeDto) {
    // 1. Buscar programación activa
    const programacion = await this.programacionRepo.findOne({
      where: { id: dto.programacion_id, estado: 'activa' },
      relations: ['ruta'],
    });

    if (!programacion) {
      throw new NotFoundException('No se encontró una programación activa');
    }

    // 2. Verificar capacidad
      if ((programacion.ocupacion_actual ?? 0) >= (programacion.capacidad_maxima ?? 0)) {
      throw new BadRequestException(
        'El bus está lleno, no se puede abordar',
      );
    }

    // 3. Verificar paradero de abordaje
    const paradero = await this.paraderoRepo.findOne({
      where: { id: dto.paradero_abordaje_id },
    });
    if (!paradero) throw new NotFoundException('Paradero no encontrado');

    // 4. Crear boleto
    const boleto = this.boletoRepo.create({
      ciudadano_id: dto.ciudadano_id,
      metodo_pago_id: dto.metodo_pago_id,
      programacion: programacion,
      paradero_abordaje_id: dto.paradero_abordaje_id,
      estado: 'activo',
      monto: programacion.ruta?.tarifa,
      fecha_abordaje: new Date(),
    });

    await this.boletoRepo.save(boleto);

    // 5. Incrementar ocupación del bus
    programacion.ocupacion_actual = (programacion.ocupacion_actual ?? 0) + 1;
    await this.programacionRepo.save(programacion);

    return {
      message: 'Abordaje exitoso',
      boleto_id: boleto.id,
      monto_cobrado: boleto.monto,
      ocupacion_actual: programacion.ocupacion_actual,
      capacidad_maxima: programacion.capacidad_maxima,
    };
  }

  // HU-2-004: Descenso y cierre de viaje
  async registrarDescenso(dto: DescensoDto) {
    // 1. Buscar boleto activo
    const boleto = await this.boletoRepo.findOne({
      where: { id: dto.boleto_id, estado: 'activo' },
      relations: ['programacion'],
    });

    if (!boleto) {
      throw new NotFoundException('No se encontró un boleto activo con ese ID');
    }

    // 2. Verificar paradero de descenso
    const paradero = await this.paraderoRepo.findOne({
      where: { id: dto.paradero_descenso_id },
    });
    if (!paradero) throw new NotFoundException('Paradero de descenso no encontrado');

    // 3. Actualizar boleto
    boleto.estado = 'completado';
    boleto.paradero_descenso_id = dto.paradero_descenso_id;
    boleto.fecha_descenso = new Date();
    await this.boletoRepo.save(boleto);

    // 4. Liberar cupo en la programación
    const programacion = boleto.programacion;
    if ((programacion.ocupacion_actual ?? 0) > 0) {
    programacion.ocupacion_actual = (programacion.ocupacion_actual ?? 0) - 1;
      await this.programacionRepo.save(programacion);
    }

    return {
      message: 'Viaje completado - Gracias por usar nuestro servicio',
      boleto_id: boleto.id,
      hora_descenso: boleto.fecha_descenso,
      paradero_descenso: paradero.nombre,
    };
  }

  async findAll(): Promise<Boleto[]> {
    return await this.boletoRepo.find({
      relations: ['programacion', 'paradero_abordaje', 'paradero_descenso'],
    });
  }

  async findOne(id: number): Promise<Boleto> {
    const boleto = await this.boletoRepo.findOne({
      where: { id },
      relations: ['programacion', 'paradero_abordaje', 'paradero_descenso'],
    });
    if (!boleto) throw new NotFoundException(`Boleto #${id} no encontrado`);
    return boleto;
  }
  
  async getCiudadanosPorRuta(rutaId: number): Promise<string[]> {
      const boletos = await this.boletoRepo
          .createQueryBuilder('b')
          .innerJoin('b.programacion', 'p')
          .innerJoin('p.ruta', 'r')
          .where('r.id = :rutaId', { rutaId })
          .select('b.ciudadano_id', 'ciudadano_id')
          .distinct(true)
          .getRawMany();
      
      console.log('Boletos encontrados:', boletos);
      return boletos.map(b => b.ciudadano_id);
  }

}
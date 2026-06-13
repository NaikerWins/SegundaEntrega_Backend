import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleto } from './entities/boleto.entity';
import { Programacion } from '../programaciones/entities/programaciones.entity';
import { Paradero } from '../paraderos/entities/paradero.entity';
import { AbordajeDto } from './dto/abordaje.dto';
import { DescensoDto } from './dto/descenso.dto';
import { MetodosPagoCiudadanoService } from '../metodospagociudadano/metodospagociudadano.service';
@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
    @InjectRepository(Programacion)
    private readonly programacionRepo: Repository<Programacion>,
    @InjectRepository(Paradero)
    private readonly paraderoRepo: Repository<Paradero>,
    
    private readonly mpcService: MetodosPagoCiudadanoService,
  ) {}

  // HU-2-003: Abordaje y generación de boleto
  async registrarAbordaje(dto: AbordajeDto) {
  // 1. Buscar programación activa (igual que antes)
  const programacion = await this.programacionRepo.findOne({
    where: { id: dto.programacion_id, estado: 'activa' },
    relations: ['ruta'],
  });
  if (!programacion) throw new NotFoundException('No se encontró una programación activa');

  // 2. Verificar capacidad (igual)
  if ((programacion.ocupacion_actual ?? 0) >= (programacion.capacidad_maxima ?? 0)) {
    throw new BadRequestException('El bus está lleno, no se puede abordar');
  }

  // 3. Verificar paradero de abordaje (igual)
  const paradero = await this.paraderoRepo.findOne({ where: { id: dto.paradero_abordaje_id } });
  if (!paradero) throw new NotFoundException('Paradero no encontrado');

  // 4. Obtener el método de pago del ciudadano
  const metodoPagoCiudadano = await this.mpcService.findOne(dto.metodo_pago_id);
  if (!metodoPagoCiudadano) throw new NotFoundException('Método de pago no encontrado');


  // 5. Validar saldo si es prepago
const tipoMetodo = metodoPagoCiudadano.metodopago?.tipo;
const tarifa = programacion.ruta?.tarifa ?? 0;

if (tipoMetodo === 'prepago') {
  const saldoActual = metodoPagoCiudadano.saldo ?? 0;
  if (saldoActual < tarifa) {
    throw new BadRequestException('Saldo insuficiente. Recargue su tarjeta.');
  }
  metodoPagoCiudadano.saldo = saldoActual - tarifa;
  // Asegura que pasamos un número definido
  await this.mpcService.update(metodoPagoCiudadano.id!, {
    saldo: metodoPagoCiudadano.saldo,
  });
}

  // 6. Crear boleto (igual)
  const boleto = this.boletoRepo.create({
    ciudadano_id: dto.ciudadano_id,
    metodo_pago_id: dto.metodo_pago_id,
    programacion: programacion,
    paradero_abordaje_id: dto.paradero_abordaje_id,
    estado: 'activo',
    monto: tarifa,
    fecha_abordaje: new Date(),
  });
  await this.boletoRepo.save(boleto);

  // 7. Incrementar ocupación (igual)
  programacion.ocupacion_actual = (programacion.ocupacion_actual ?? 0) + 1;
  await this.programacionRepo.save(programacion);

  // 8. Responder incluyendo saldo restante
  return {
    message: 'Abordaje exitoso',
    boleto_id: boleto.id,
    monto_cobrado: boleto.monto,
    saldo_restante: metodoPagoCiudadano.saldo,      // ← nuevo campo
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
  async getBoletosActivos(): Promise<Boleto[]> {

  return await this.boletoRepo.find({
    where: {
      estado: 'activo',
    },
    relations: [
      'programacion',
      'programacion.ruta',
      'programacion.bus',
    ],
    order: {
      fecha_abordaje: 'DESC',
    },
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

  async getProgramacionesActivas() {

  return await this.programacionRepo.find({
    where: {
      estado: 'activa',
    },
    relations: ['ruta', 'bus'],
    order: {
      salida: 'ASC',
    },
  });

}

}
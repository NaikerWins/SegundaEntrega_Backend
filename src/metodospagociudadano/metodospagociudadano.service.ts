import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoCiudadanoDto } from './dto/create-metodospagociudadano.dto';
import { UpdateMetodospagociudadanoDto } from './dto/update-metodospagociudadano.dto';
import { MetodoPagoCiudadano } from './entities/metodospagociudadano.entity';
import { MetodosPagoService } from '../metodospago/metodospago.service';
import { Transaccion } from '../transacciones/entities/transacciones.entity';

@Injectable()
export class MetodosPagoCiudadanoService {
  constructor(
    @InjectRepository(MetodoPagoCiudadano)
    private readonly mpcRepository: Repository<MetodoPagoCiudadano>,

    @InjectRepository(Transaccion)
    private readonly transaccionesRepository: Repository<Transaccion>,

    private readonly metodospagoService: MetodosPagoService,

  ) {}

  private resolveId(value: any): number | undefined {
    if (!value) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && 'id' in value) return (value as any).id;
    return undefined;
  }

  async create(createMetodoPagoCiudadanoDto: CreateMetodoPagoCiudadanoDto): Promise<MetodoPagoCiudadano> {
    const metodospagoId = this.resolveId(createMetodoPagoCiudadanoDto.metodopago);

    if (!metodospagoId) throw new BadRequestException('MetodoPago id is required');

    const metodopago = await this.metodospagoService.findOne(metodospagoId);
    if (!metodopago) throw new NotFoundException(`MetodoPago with id ${metodospagoId} not found`);

    const metodopagociudadano = this.mpcRepository.create({
      id_ciudadano: createMetodoPagoCiudadanoDto.id_ciudadano, 
      saldo: createMetodoPagoCiudadanoDto.saldo,
      monto: createMetodoPagoCiudadanoDto.monto,
      cargo: createMetodoPagoCiudadanoDto.cargo,
      metodopago,
    });

    return this.mpcRepository.save(metodopagociudadano);

  }

  findAll(): Promise<MetodoPagoCiudadano[]> {
    return this.mpcRepository.find({ relations: ['metodopago'] });
  }

  async findOne(id: number): Promise<MetodoPagoCiudadano> {
    const metodopagociudadano = await this.mpcRepository.findOne({
      where: { id },
      relations: ['metodopago'],
    });
    if (!metodopagociudadano) throw new NotFoundException(`MetodoPagoCiudadano with id ${id} not found`);
    return metodopagociudadano;
  }

  async update(id: number, UpdateMetodospagociudadanoDto: UpdateMetodospagociudadanoDto): Promise<MetodoPagoCiudadano> {
    const metodopagociudadano = await this.mpcRepository.findOne({ where: { id } });
    if (!metodopagociudadano) throw new NotFoundException(`MetodoPagoCiudadano with id ${id} not found`);

    if (UpdateMetodospagociudadanoDto.metodopago) {
      const metodopagoId = this.resolveId(UpdateMetodospagociudadanoDto.metodopago);
      if (!metodopagoId) throw new BadRequestException('MetodoPago id is required');
      const metodopago= await this.metodospagoService.findOne(metodopagoId);
      if (!metodopago) throw new NotFoundException(`MetodoPago with id ${metodopagoId} not found`);
      metodopagociudadano.metodopago = metodopago;
    }

    await this.mpcRepository.save(metodopagociudadano);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const metodopagociudadano = await this.findOne(id);
    await this.mpcRepository.remove(metodopagociudadano);
  }

  async iniciarRecarga(id: number, monto: number, email:string) {
      const mpc = await this.findOne(id);
      const referencia = `RECARGA-${id}-${Date.now()}`;
      return {
          referencia,
          monto,
          cargo : (monto * 0.029) + 900,
          descripcion: `Recarga tarjeta transporte #${id}`,
          email,
      };
  }

  async confirmarRecarga(referencia: string, estado: string, monto: number) {
      const id = parseInt(referencia.split('-')[1]);
      const mpc = await this.findOne(id);
      
      if (estado === 'Aceptada'){
        mpc.saldo = (mpc.saldo ?? 0) + monto
        await this.mpcRepository.save(mpc);
        const transaccion = this.transaccionesRepository.create({
        referencia,
        monto,
        fecha: new Date(),
        estado,
        metodopagociudadano: mpc,
    });
    await this.transaccionesRepository.save(transaccion);

      }
      
    return {
        saldo: mpc.saldo,
        descripcion: 'Recarga exitosa',
    };
  }

}


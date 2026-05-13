import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodospago.entity';
import { CreateMetodoPagoDto } from './dto/create-metodospago.dto';
import { UpdateMetodospagoDto } from './dto/update-metodospago.dto';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly MetodosPagoRepository: Repository<MetodoPago>,
  ) { }

  async create(createMetodoPagoDto: CreateMetodoPagoDto): Promise<MetodoPago> {	
    const metodoPago = this.MetodosPagoRepository.create({ ...createMetodoPagoDto });
    return this.MetodosPagoRepository.save(metodoPago);
  }

  findAll(): Promise<MetodoPago[]> {
    return this.MetodosPagoRepository.find();
  }

  async findOne(id: number): Promise<MetodoPago> {
    const MetodoPago = await this.MetodosPagoRepository.findOne({
      where: { id }
    });
    if (!MetodoPago) throw new NotFoundException(`MetodoPago with id ${id} not found`);
    return MetodoPago;
  }

  async update(id: number, updateMetodoDto: UpdateMetodospagoDto): Promise<MetodoPago> {
      const metodoPago = await this.MetodosPagoRepository.preload({ id, ...updateMetodoDto });
      if (!metodoPago) throw new NotFoundException(`MetodoPago with id ${id} not found`);
      return this.MetodosPagoRepository.save(metodoPago);
  }

  async remove(id: number): Promise<void> {
    const MetodoPago = await this.findOne(id);
    await this.MetodosPagoRepository.remove(MetodoPago);
  }
}
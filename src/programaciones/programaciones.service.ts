import { Injectable } from '@nestjs/common';
import { CreateProgramacioneDto } from './dto/create-programacione.dto';
import { UpdateProgramacioneDto } from './dto/update-programacione.dto';

@Injectable()
export class ProgramacionesService {
  create(createProgramacioneDto: CreateProgramacioneDto) {
    return 'This action adds a new programacione';
  }

  findAll() {
    return `This action returns all programaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} programacione`;
  }

  update(id: number, updateProgramacioneDto: UpdateProgramacioneDto) {
    return `This action updates a #${id} programacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} programacione`;
  }
}

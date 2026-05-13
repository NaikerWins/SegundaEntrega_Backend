import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodoPagoCiudadanoDto } from './create-metodospagociudadano.dto';

export class UpdateMetodospagociudadanoDto extends PartialType(CreateMetodoPagoCiudadanoDto) {}

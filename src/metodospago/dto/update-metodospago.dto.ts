import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodoPagoDto } from './create-metodospago.dto';

export class UpdateMetodospagoDto extends PartialType(CreateMetodoPagoDto) {}

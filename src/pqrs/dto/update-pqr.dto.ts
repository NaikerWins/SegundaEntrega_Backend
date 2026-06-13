import { PartialType } from '@nestjs/mapped-types';
import { CreatePqrsDto } from './create-pqrs.dto';

export class UpdatePqrDto extends PartialType(CreatePqrsDto) {}

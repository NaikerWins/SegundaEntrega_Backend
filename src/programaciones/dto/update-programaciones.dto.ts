import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramacionDto } from './create-programaciones.dto';

export class UpdateProgramacionDto extends PartialType(CreateProgramacionDto) {}

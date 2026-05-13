import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramacioneDto } from './create-programacione.dto';

export class UpdateProgramacioneDto extends PartialType(CreateProgramacioneDto) {}

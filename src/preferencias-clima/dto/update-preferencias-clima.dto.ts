import { PartialType } from '@nestjs/mapped-types';
import { CreatePreferenciasClimaDto } from './create-preferencias-clima.dto';

export class UpdatePreferenciasClimaDto extends PartialType(CreatePreferenciasClimaDto) {}

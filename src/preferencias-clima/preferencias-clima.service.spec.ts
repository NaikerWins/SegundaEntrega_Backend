import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciasClimaService } from './preferencias-clima.service';

describe('PreferenciasClimaService', () => {
  let service: PreferenciasClimaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferenciasClimaService],
    }).compile();

    service = module.get<PreferenciasClimaService>(PreferenciasClimaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

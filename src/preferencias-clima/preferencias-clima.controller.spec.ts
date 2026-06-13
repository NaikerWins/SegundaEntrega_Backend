import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciasClimaController } from './preferencias-clima.controller';
import { PreferenciasClimaService } from './preferencias-clima.service';

describe('PreferenciasClimaController', () => {
  let controller: PreferenciasClimaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferenciasClimaController],
      providers: [PreferenciasClimaService],
    }).compile();

    controller = module.get<PreferenciasClimaController>(PreferenciasClimaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

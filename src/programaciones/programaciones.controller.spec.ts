import { Test, TestingModule } from '@nestjs/testing';
import { ProgramacionesController } from './programaciones.controller';
import { ProgramacionesService } from './programaciones.service';

describe('ProgramacionesController', () => {
  let controller: ProgramacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramacionesController],
      providers: [ProgramacionesService],
    }).compile();

    controller = module.get<ProgramacionesController>(ProgramacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

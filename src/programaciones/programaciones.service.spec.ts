import { Test, TestingModule } from '@nestjs/testing';
import { ProgramacionesService } from './programaciones.service';

describe('ProgramacionesService', () => {
  let service: ProgramacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramacionesService],
    }).compile();

    service = module.get<ProgramacionesService>(ProgramacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MetodospagoService } from './metodospago.service';

describe('MetodospagoService', () => {
  let service: MetodospagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetodospagoService],
    }).compile();

    service = module.get<MetodospagoService>(MetodospagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MetodospagociudadanoService } from './metodospagociudadano.service';

describe('MetodospagociudadanoService', () => {
  let service: MetodospagociudadanoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetodospagociudadanoService],
    }).compile();

    service = module.get<MetodospagociudadanoService>(MetodospagociudadanoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

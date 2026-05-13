import { Test, TestingModule } from '@nestjs/testing';
import { MetodospagociudadanoController } from './metodospagociudadano.controller';
import { MetodospagociudadanoService } from './metodospagociudadano.service';

describe('MetodospagociudadanoController', () => {
  let controller: MetodospagociudadanoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodospagociudadanoController],
      providers: [MetodospagociudadanoService],
    }).compile();

    controller = module.get<MetodospagociudadanoController>(MetodospagociudadanoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

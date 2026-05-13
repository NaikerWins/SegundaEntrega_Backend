import { Test, TestingModule } from '@nestjs/testing';
import { MetodospagoController } from './metodospago.controller';
import { MetodospagoService } from './metodospago.service';

describe('MetodospagoController', () => {
  let controller: MetodospagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodospagoController],
      providers: [MetodospagoService],
    }).compile();

    controller = module.get<MetodospagoController>(MetodospagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

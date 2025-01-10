import { Test, TestingModule } from '@nestjs/testing';
import { AaController } from './aa.controller';
import { AaService } from './aa.service';

describe('AaController', () => {
  let controller: AaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AaController],
      providers: [AaService],
    }).compile();

    controller = module.get<AaController>(AaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

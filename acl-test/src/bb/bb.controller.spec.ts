import { Test, TestingModule } from '@nestjs/testing';
import { BbController } from './bb.controller';
import { BbService } from './bb.service';

describe('BbController', () => {
  let controller: BbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BbController],
      providers: [BbService],
    }).compile();

    controller = module.get<BbController>(BbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

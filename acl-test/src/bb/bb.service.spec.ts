import { Test, TestingModule } from '@nestjs/testing';
import { BbService } from './bb.service';

describe('BbService', () => {
  let service: BbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BbService],
    }).compile();

    service = module.get<BbService>(BbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

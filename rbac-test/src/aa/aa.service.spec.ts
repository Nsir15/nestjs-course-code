import { Test, TestingModule } from '@nestjs/testing';
import { AaService } from './aa.service';

describe('AaService', () => {
  let service: AaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AaService],
    }).compile();

    service = module.get<AaService>(AaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

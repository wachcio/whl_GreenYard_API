import { Test, TestingModule } from '@nestjs/testing';
import { MushroomService } from './mushroom.service';

describe('MushroomService', () => {
  let service: MushroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MushroomService],
    }).compile();

    service = module.get<MushroomService>(MushroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

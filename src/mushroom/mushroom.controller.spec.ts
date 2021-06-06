import { Test, TestingModule } from '@nestjs/testing';
import { MushroomController } from './mushroom.controller';

describe('MushroomController', () => {
  let controller: MushroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MushroomController],
    }).compile();

    controller = module.get<MushroomController>(MushroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

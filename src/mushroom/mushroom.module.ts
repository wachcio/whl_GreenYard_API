import { forwardRef, Module } from '@nestjs/common';
import { MushroomService } from './mushroom.service';
import { MushroomController } from './mushroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MushroomItem } from './mushroom-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MushroomItem]),
    forwardRef(() => MushroomModule),
  ],
  providers: [MushroomService],
  controllers: [MushroomController],
})
export class MushroomModule {}

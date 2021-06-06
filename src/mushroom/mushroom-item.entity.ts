import {
  MushroomDto,
  MushroomApplication,
} from 'src/mushroom/dto/mushroom.dto';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MushroomDescription } from './mushroom-description.entity';

@Entity()
export class MushroomItem extends BaseEntity implements MushroomDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  polishName: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  scientificName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  anotherNames: string;

  @Column({
    type: 'varchar',
    length: 36,
  })
  application: MushroomApplication;

  @Column({
    type: 'bool',
  })
  isLegallyProtected: boolean;

  @Column({
    type: 'bool',
  })
  approvedForTrade: boolean;

  @OneToOne(() => MushroomDescription, { cascade: true })
  @JoinColumn()
  description: MushroomDescription;

  @Column('timestamp', {
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  createAt: Date;

  @Column('timestamp', {
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updateAt: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  images: number;

  @Column('simple-array', { nullable: true })
  dataSources: string[];
}

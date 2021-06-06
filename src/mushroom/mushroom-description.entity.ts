import { MushroomDescriptionDto } from 'src/mushroom/dto/mushroom.dto';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MushroomDescription
  extends BaseEntity
  implements MushroomDescriptionDto {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  occurrence: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  dimensions: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  cap: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  underCap: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  capImprint: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  stem: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  flesh: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  characteristics: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  possibleConfusion: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  value: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  comments: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  frequency: string;

  @OneToOne(() => MushroomDescription, { cascade: true })
  description: MushroomDescription;
}

import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ImageDto } from '../dto/image.dto';

@Entity()
export class Image extends BaseEntity implements ImageDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  imageName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  mushroomId: string;
}

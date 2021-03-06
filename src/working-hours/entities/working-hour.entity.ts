import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

import { User } from '../../user/user.entity';

@Entity()
export class WorkingHour extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn()
  owner: User;

  @Column({
    type: 'date',
    default: null,
    // unique: true,
  })
  dateOfWork: Date | string;

  @Column({
    type: 'time',
    default: null,
  })
  startTimeOfWork: Date | string;

  @Column({
    type: 'time',
    default: null,
  })
  endTimeOfWork: Date | string;

  @Column({
    type: 'varchar',
    length: 200,
    default: null,
  })
  workDescription: string;

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
}

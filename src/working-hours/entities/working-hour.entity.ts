import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/user.entity';

@Entity()
export class WorkingHour extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    type: 'date',
    default: null,
    unique: true,
  })
  date: Date | string;

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
}

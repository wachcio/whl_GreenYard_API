import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { userRoleEnum } from './dto/register.dto';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    length: 255,
    // unique: true,
  })
  email: string;

  @Column()
  pwdHash: string;

  @Column({
    default: 'user',
    type: 'varchar',
    length: 20,
  })
  role: userRoleEnum;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  resetPasswordToken: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
    default: null,
  })
  resetPasswordExpirationDate: Date | string | null;
}

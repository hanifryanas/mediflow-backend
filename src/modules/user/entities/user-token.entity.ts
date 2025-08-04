import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserTokenType } from '../enums';
import { User } from './user.entity';

@Entity('UserToken')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  userTokenId: string;

  @Column()
  token: string

  @Column({ type: 'enum', enum: UserTokenType })
  type: UserTokenType;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

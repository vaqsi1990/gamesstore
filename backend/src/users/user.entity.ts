import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  password: string;

  @Column()
  @Expose()
  country: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose()
  referralCode?: string | null;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @Column('text', { array: true, default: [Role.USER] })
  @Expose()
  roles: Role[];

  @Column({ default: false })
  @Expose()
  isVerified: boolean;

  @Column({ type: 'varchar', length: 5, nullable: true })
  @Expose()
  emailOtp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  emailOtpExpiresAt: Date | null;
}

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity()
  export class Verification {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    userId: string; // User.id არის uuid, ამიტომ string
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;
  
    @Column({ unique: true })
    token: string; // შენი 5-ასოიანი კოდი
  
    @Column()
    expiresAt: Date;
  
    @CreateDateColumn()
    createdAt: Date;
  }
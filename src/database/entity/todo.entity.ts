import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'todo' })
export class TodoEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignee' })
  assignee: UserEntity;

  @Column({ type: 'boolean', default: false })
  done: boolean;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @CreateDateColumn({ select: false })
  updated_at: Date;
}
// more columns: deadline, status(todo, in progress, done) priority, story points, reporter ...

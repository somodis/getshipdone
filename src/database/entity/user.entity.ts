import { Role } from 'src/common/constants/role-enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { TodoEntity } from './todo.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: any;

  @Column({ type: 'varchar', nullable: true, default: Role.USER })
  role: Role;

  @OneToMany(() => TodoEntity, (todo) => todo.assignee)
  todos: TodoEntity[];
}

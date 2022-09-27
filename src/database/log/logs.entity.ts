import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Log {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public userId: number;

  @Column({ nullable: true })
  public context: string;

  @Column()
  public message: string;

  @Column()
  public level: string;

  @CreateDateColumn()
  creationDate: Date;
}

export default Log;

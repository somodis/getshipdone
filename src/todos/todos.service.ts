import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from 'src/common/constants/database-error';
import { TodoEntity } from 'src/database/entity/todo.entity';
import { Repository } from 'typeorm';
import { TodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todosRepository: Repository<TodoEntity>,
  ) {}

  async create(data: TodoDto) {
    try {
      const todo = await this.todosRepository.save(data);

      return this.findOne(todo.id);
    } catch (err) {
      if (err.errno === DatabaseError.CONSTRAINT) {
        throw new BadRequestException(err.message);
      }

      if (err.errno === DatabaseError.BUSY) {
        throw new InternalServerErrorException(err.message);
      }

      throw err;
    }
  }

  async findAll() {
    return this.todosRepository.find();
  }

  async findOne(id: number) {
    return this.todosRepository.findOne({
      where: { id: id },
      relations: ['assignee'],
    });
  }

  async update(id: number, data: UpdateTodoDto) {
    data.id = id;

    const todo = await this.todosRepository.save(data);

    return this.findOne(todo.id);
  }

  async remove(id: number) {
    await this.todosRepository.delete(id);
  }
}

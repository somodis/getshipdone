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

  /**
   * Creates a new TODD.
   * @param data
   * @returns newly created todo entity
   */
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

  /**
   * Returns all todos.
   */
  async findAll() {
    return this.todosRepository.find();
  }

  /**
   * Finds one todo based on todo id.
   * @param id
   * @returns one todo with it's assignee
   */
  async findOne(id: number) {
    return this.todosRepository.findOne({
      where: { id: id },
      relations: ['assignee'],
    });
  }

  /**
   * Updates a todo record.
   * @param id
   * @param data
   * @returns the updated todo.
   */
  async update(id: number, data: UpdateTodoDto) {
    data.id = id;

    const todo = await this.todosRepository.save(data);

    return this.findOne(todo.id);
  }

  /**
   * Deletes a todo from the database by id.
   * @param id
   */
  async remove(id: number) {
    await this.todosRepository.delete(id);
  }
}

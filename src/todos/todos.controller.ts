import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodoDto, UpdateTodoDto } from './dto/todo.dto';
import { UsersService } from 'src/users/users.service';

@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() data: TodoDto) {
    const user = await this.usersService.findOne(data.assignee.id);

    if (!user) {
      throw new BadRequestException('Assignee does not exist!');
    }

    return this.todosService.create(data);
  }

  @Get()
  async findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const todo = await this.todosService.findOne(+id);

    if (!todo) {
      throw new NotFoundException();
    }
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTodoDto) {
    const todo = await this.todosService.findOne(+id);

    if (!todo) {
      throw new NotFoundException();
    }

    if (data.assignee) {
      const user = await this.usersService.findOne(data.assignee.id);

      if (!user) {
        throw new BadRequestException('Assignee does not exist!');
      }
    }

    return this.todosService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const todo = await this.todosService.findOne(+id);

    if (!todo) {
      throw new NotFoundException();
    }
    return this.todosService.remove(+id);
  }
}

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
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodoDto, UpdateTodoDto } from './dto/todo.dto';
import { UsersService } from 'src/users/users.service';
import { TokenGuard } from 'src/auth/guards/token.guard';

@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(TokenGuard)
  async create(@Body() data: TodoDto) {
    const user = await this.usersService.findOne(data.assignee.id);

    if (!user) {
      throw new BadRequestException('Assignee does not exist!');
    }

    return this.todosService.create(data);
  }

  @Get()
  @UseGuards(TokenGuard)
  async findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  async findOne(@Param('id') id: string) {
    const todo = await this.todosService.findOne(+id);

    if (!todo) {
      throw new NotFoundException();
    }
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
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
  @UseGuards(TokenGuard)
  async remove(@Param('id') id: string) {
    const todo = await this.todosService.findOne(+id);

    if (!todo) {
      throw new NotFoundException();
    }
    return this.todosService.remove(+id);
  }
}

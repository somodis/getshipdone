import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TodoDto } from 'src/todos/dto/todo.dto';

export class UserDto {
  @IsString()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  avatar: any;

  @Type(() => TodoDto)
  @IsArray()
  @IsOptional()
  todos: TodoDto[];
}

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  avatar: any;

  @Type(() => TodoDto)
  @IsArray()
  @IsOptional()
  todos: TodoDto[];
}

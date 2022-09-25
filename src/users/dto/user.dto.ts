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
  avatar: string;
}

export class UpdateUserDto {
  id: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  avatar: string;
}

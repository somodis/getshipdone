import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/users/dto/user.dto';

export class TodoDto {
  @IsString()
  title: string;

  @Type(() => UpdateUserDto)
  @IsOptional()
  assignee: UpdateUserDto;

  @IsOptional()
  @IsBoolean()
  done: boolean;
}

export class UpdateTodoDto {
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @Type(() => UpdateUserDto)
  @IsOptional()
  assignee: UpdateUserDto;

  @IsOptional()
  @IsBoolean()
  done: boolean;
}

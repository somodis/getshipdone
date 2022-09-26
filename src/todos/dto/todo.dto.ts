import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty({
    description: 'What needs to be done?',
    default: 'thingtodo',
    type: 'string',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'User that is responsible for the todo, to be done.',
  })
  @Type(() => UpdateUserDto)
  @IsOptional()
  assignee: UpdateUserDto;

  @ApiProperty({
    description:
      'Value that indicates status. True if the todo is done, otherwise false.',
    default: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  done: boolean;
}

export class UpdateTodoDto {
  id: number;

  @ApiProperty({
    description: 'What needs to be done?',
    default: 'thingtodo',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'User that is responsible for the todo, to be done.',
  })
  @Type(() => UpdateUserDto)
  @IsOptional()
  assignee: UpdateUserDto;

  @ApiProperty({
    description:
      'Value that indicates status. True if the todo is done, otherwise false.',
    default: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  done: boolean;
}

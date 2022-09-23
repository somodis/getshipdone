import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class TodoDto {
  id: number;

  @IsString()
  title: string;

  @Type(() => UserDto)
  @IsNotEmpty()
  @IsOptional()
  assignee: UserDto;

  @IsOptional()
  @IsBoolean()
  done: boolean;
}

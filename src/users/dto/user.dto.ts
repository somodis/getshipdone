import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/constants/role-enum';

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
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
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
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}

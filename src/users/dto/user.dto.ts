import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/constants/role-enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ type: 'string', example: 'git.aron' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email address of the user.',
    example: 'git.aron@github.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ type: 'string', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class UpdateUserDto {
  id: number;

  @ApiProperty({ type: 'string', example: 'git.aron' })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email address of the user.',
    example: 'git.aron@github.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ type: 'string', minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
export class UploadPhotoDto {
  id: number;

  @ApiProperty({ description: 'User profile picture' })
  @IsOptional()
  @IsString()
  avatar: string;
}

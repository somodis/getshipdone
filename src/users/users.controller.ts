import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenGuard } from 'src/auth/guards/token.guard';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { Express } from 'express';
import { Request } from 'express';
import { UserEntity } from 'src/database/entity/user.entity';
import { localOptions } from './upload-options.constant';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/common/constants/role-enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(TokenGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(TokenGuard)
  async findMe(@Req() request: Request) {
    const me = request.user as UserEntity;
    const user = await this.usersService.findOne(me.id);

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get(':id')
  @UseGuards(TokenGuard, RoleGuard([Role.ADMIN]))
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Patch('me')
  @UseGuards(TokenGuard)
  async updateMe(@Body() data: UpdateUserDto, @Req() req) {
    const me = req.user as UserEntity;
    const user = await this.usersService.findOne(me.id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.update(me.id, data);
  }

  @Patch(':id')
  @UseGuards(TokenGuard, RoleGuard([Role.ADMIN]))
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.update(+id, data);
  }

  @Delete('me')
  @UseGuards(TokenGuard)
  async removeMe(@Req() req) {
    const me = req.user as UserEntity;
    const user = await this.usersService.findOne(me.id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.remove(me.id);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RoleGuard([Role.ADMIN]))
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.remove(+id);
  }

  @Post('/picture')
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('file', localOptions))
  handleUpload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const me = req.user as UserEntity;
    console.debug(`User: ${me.username} uploaded file: ${file.filename}`);
    return this.usersService.updateUserPicById(me.id, file.path);
  }
}

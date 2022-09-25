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
import { UserEntity } from 'src/database/entity/user.entity';
import { localOptions } from './upload-options.constant';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(TokenGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Get('me')
  @UseGuards(TokenGuard)
  async findMe(@Req() req) {
    const me: UserEntity = req.user;
    const user = await this.usersService.findOne(me.id);

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.update(+id, data);
  }

  @Patch('me')
  @UseGuards(TokenGuard)
  async updateMe(@Body() data: UpdateUserDto, @Req() req) {
    const me: UserEntity = req.user;
    const user = await this.usersService.findOne(me.id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.update(me.id, data);
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.remove(+id);
  }

  @Delete('me')
  @UseGuards(TokenGuard)
  async removeMe(@Req() req) {
    const me: UserEntity = req.user;
    const user = await this.usersService.findOne(me.id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.remove(me.id);
  }

  @Post('/picture')
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('file', localOptions))
  handleUpload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const user: UserEntity = req.user;
    console.debug(`User: ${user.username} uploaded file: ${file.filename}`);
    return this.usersService.updateUserPicById(user.id, file.path);
  }
}

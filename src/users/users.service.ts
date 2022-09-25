import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import { DatabaseError } from 'src/common/constants/database-error';
import { UserEntity } from 'src/database/entity/user.entity';
import { join } from 'path';
import { unlink } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: UserDto) {
    try {
      const user = await this.usersRepository.save(data);

      return this.findOne(user.id);
    } catch (err) {
      if (err.errno === DatabaseError.CONSTRAINT) {
        throw new BadRequestException(err.message);
      }

      if (err.errno === DatabaseError.BUSY) {
        throw new InternalServerErrorException(err.message);
      }

      throw err;
    }
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['todos'],
    });
  }

  async update(id: number, data: UpdateUserDto) {
    data.id = id;

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const user = await this.usersRepository.save(data);

    return this.findOne(user.id);
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findPasswordByUsername(username: string): Promise<string | undefined> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['password'],
    });

    return user?.password;
  }

  async updateUserPicById(userId: number, imagePath: string) {
    const updateData = new UpdateUserDto();
    updateData.avatar = imagePath;

    const user = await this.findOne(userId);

    // If user already has a profile picture/avatar we should delete the old image from the storage
    if (user.avatar) {
      const fullImagePath = join(process.cwd(), user.avatar);

      // Delete img from files
      unlink(fullImagePath, (err) => {
        if (err) throw new Error(err.message);
        console.log(`Image ${imagePath} was deleted.`);
      });
    }

    return await this.update(userId, updateData);
  }
}

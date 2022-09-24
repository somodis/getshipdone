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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: UserDto) {
    try {
      data.password = await hash(data.password, 10);
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
}

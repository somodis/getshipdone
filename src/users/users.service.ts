import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto, UploadPhotoDto, RegisterUserDto } from './dto/user.dto';
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

  /**
   * Creates a new user. RegisterDto does not contain role, therefore a new user's role defaults to 'user'. (Only an admin can grant admin role)
   * @param data username & password
   * @returns newly created user entity
   */
  async create(data: RegisterUserDto) {
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

  /**
   * Returns all users.
   */
  async findAll() {
    return this.usersRepository.find();
  }

  /**
   * Finds one user based on user id.
   * @returns one user with todos
   */
  async findOne(id: number): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['todos'],
    });
  }

  /**
   * Updates a user record.
   * @returns the updated user.
   */
  async update(id: number, data: UpdateUserDto) {
    data.id = id;

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const user = await this.usersRepository.save(data);

    return this.findOne(user.id);
  }

  /**
   * Updates a user's profile picture (avatar) by user id.
   * @param data path of uploaded image.
   * @returns updated user entity.
   */
  async updatePhoto(id: number, data: UploadPhotoDto) {
    data.id = id;

    const user = await this.usersRepository.save(data);

    return this.findOne(user.id);
  }

  /**
   * Deletes a user from the database by id.
   */
  async remove(id: number) {
    await this.usersRepository.delete(id);
  }

  /**
   * Finds a user by username.
   * @returns user entity or undefined if the search fails.
   */
  async findUserByUsername(username: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  /**
   * Finds the password of a user by username.
   * @returns the matched user's password or undefined if the search fails.
   */
  async findPasswordByUsername(username: string): Promise<string | undefined> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['password'],
    });

    return user?.password;
  }

  /**
   * Updates a user's profile picture.
   * @param userId user id you want to update
   * @param imagePath relative path of the previously uploaded image.
   * @returns updated user entity
   */
  async updateUserPicById(userId: number, imagePath: string) {
    const updateData = new UploadPhotoDto();
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

    return await this.updatePhoto(userId, updateData);
  }
}

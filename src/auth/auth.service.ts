import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'src/database/entity/user.entity';
import { RegisterUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: UserEntity) {
    return this.getJwtToken(user.id);
  }

  async register(registrationData: RegisterUserDto) {
    const hashedPassword = await hash(registrationData.password, 10);

    return await this.usersService.create({
      ...registrationData,
      password: hashedPassword,
    });
  }

  async validateUser(
    username: string,
    plainTextPassword: string,
  ): Promise<any> {
    const userPassword = await this.usersService.findPasswordByUsername(
      username,
    );

    if (!userPassword) {
      throw new UnauthorizedException();
    }

    const isValidPW = await compare(plainTextPassword, userPassword);

    if (!isValidPW) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...userToReturn } = user;

    return userToReturn;
  }

  async validateUserByToken(token: TokenPayload) {
    return this.usersService.findOne(token.userId);
  }

  async getJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}

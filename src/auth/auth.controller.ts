import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/database/entity/user.entity';
import { RegisterUserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterUserDto) {
    return this.authService.register(registrationData);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async logIn(@Req() request: Request) {
    const user = request.user as UserEntity;

    return this.authService.login(user);
  }
}

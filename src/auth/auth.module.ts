import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenStrategy } from './strategies/token.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'SuperSecret',
      signOptions: {
        expiresIn: '1w',
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, TokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

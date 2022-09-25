import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../database/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { mockedJwtService } from '../../util/mocks/jwt.service';
import { mockedConfigService } from '../../util/mocks/config.service';

describe('The AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();
    authService = await module.get<AuthService>(AuthService);
  });
  describe('when creating a jwt token', () => {
    it('should return a JwtToken type object', async () => {
      const userId = 1;
      type JwtToken = { token: string };
      const result = await authService.getJwtToken(userId);
      expect(typeof result.token).toMatchObject<JwtToken>;
    });
  });
});

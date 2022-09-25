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
  let usersService: UsersService;
  let findOne: jest.Mock;
  let findPasswordByUsername: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    findPasswordByUsername = jest.fn();
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
          useValue: { findOne },
        },
      ],
    }).compile();
    authService = await module.get(AuthService);
    usersService = await module.get(UsersService);
  });

  describe('when creating a jwt token', () => {
    it('should return a JwtToken type object', async () => {
      const userId = 1;
      type JwtToken = { token: string };
      const result = await authService.getJwtToken(userId);
      expect(typeof result.token).toMatchObject<JwtToken>;
    });
  });

  describe('when accessing the data of authenticating user', () => {
    let user: UserEntity;
    beforeEach(() => {
      user = new UserEntity();
      user.password = 'password';
      user.username = 'user';
      findOne.mockReturnValue(Promise.resolve(user));
      findPasswordByUsername.mockReturnValue(Promise.resolve('password'));
    });
    it('should throw after attempting to find password by username', async () => {
      const findPasswordByUsernameSpy = jest.spyOn(
        usersService,
        'findPasswordByUsername',
      );
      await expect(
        authService.validateUser('user', 'password'),
      ).rejects.toThrow();
      expect(findPasswordByUsernameSpy).toBeCalledTimes(1);
    });
  });
});

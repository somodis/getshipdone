import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { UsersService } from '../users.service';

describe('The UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: { findOne },
        },
      ],
    }).compile();
    usersService = await module.get(UsersService);
  });

  describe('when getting a user by username', () => {
    describe('and the user is matched', () => {
      let user: UserEntity;
      beforeEach(() => {
        user = new UserEntity();
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await usersService.findUserByUsername('git.aron');
        expect(fetchedUser).toEqual(user);
      });
    });
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should be undefined', async () => {
        const fetchedUser = await usersService.findUserByUsername(
          '7XaS7*ZCp1qn',
        );
        console.log(fetchedUser);
        expect(fetchedUser).toBeUndefined();
      });
    });
  });
});

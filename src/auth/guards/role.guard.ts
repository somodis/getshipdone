import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/database/entity/user.entity';

export function RoleGuard(roles?: string[]): Type<any> {
  @Injectable()
  class MixinRoleGuard extends AuthGuard('token') implements CanActivate {
    private static hasRole(user: UserEntity) {
      // If no roles has been specified for the endpoint then grant access
      if (!roles || !roles?.length) {
        return true;
      }

      // If there are no user available or the user has no role property then deny access
      if (!user || !user?.role) {
        return false;
      }

      // If the user's role is included in the roles list (specified in the roleguard decorator) then grant access, else deny access
      return roles.includes(user.role);
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      await super.canActivate(context);

      return MixinRoleGuard.hasRole(request.user);
    }
  }

  return mixin(MixinRoleGuard);
}

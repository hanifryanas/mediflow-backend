import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_ROLE_KEY } from 'common/decorators/required-role.decorator';
import { RoleHierarchy, UserRole } from 'modules/user/enums/user-role.enum';

@Injectable()
export class RequiredRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserRole>(
      REQUIRED_ROLE_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || !user.role) throw new ForbiddenException('No user role found');

    const userLevel = RoleHierarchy[user.role];
    const requiredLevel = RoleHierarchy[requiredRole];

    if (userLevel >= requiredLevel) return true;

    throw new ForbiddenException('Unauthorized access');
  }
}

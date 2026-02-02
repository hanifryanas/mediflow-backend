import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/user/enums/user-role.enum';

export const REQUIRED_ROLE_KEY = 'requiredRole';
export const RequiredRole = (role: UserRole) =>
  SetMetadata(REQUIRED_ROLE_KEY, role);

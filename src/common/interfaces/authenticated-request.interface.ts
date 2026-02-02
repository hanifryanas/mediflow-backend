import type { Request } from 'express';
import { UserRole } from '../../modules/user/enums/user-role.enum';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId?: string;
    role?: UserRole;
  };
}

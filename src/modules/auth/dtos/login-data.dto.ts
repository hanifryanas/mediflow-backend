import { UserRole } from 'modules/user/enums/user-role.enum';

export class LoginDataDto {
  userId: string;
  username: string;
  role: UserRole;
  accessToken?: string;
}

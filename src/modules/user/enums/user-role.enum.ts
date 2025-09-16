export enum UserRole {
  User = 'user',
  Staff = 'staff',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
}

export const RoleHierarchy = {
  [UserRole.User]: 0,
  [UserRole.Staff]: 1,
  [UserRole.Admin]: 2,
  [UserRole.SuperAdmin]: 3,
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  createdAt: string;
}

export type UserRole = 'Admin' | 'User' | 'Editor';

export type UserStatus = 'Active' | 'Inactive';
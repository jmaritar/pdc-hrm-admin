export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
}

export const users: User[] = [
  {
    id: 1,
    name: 'Super Admin',
    roles: ['SUPER_ADMIN'],
    email: 'super@pdc.com',
  },
  {
    id: 2,
    name: 'Admin',
    roles: ['ADMIN'],
    email: 'admin@pdc.com',
  },
  {
    id: 3,
    name: 'HR',
    roles: ['HR'],
    email: 'hr@pdc.com',
  },
];

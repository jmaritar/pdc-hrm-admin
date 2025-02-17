import { Injectable } from '@angular/core';

import { User } from './users.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      id_user: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      is_active: true,
    },
    { id_user: '2', email: 'john@example.com', name: 'John Doe', role: 'ADMIN', is_active: true },
    { id_user: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'HR', is_active: false },
  ];

  getUsers(): User[] {
    return this.users;
  }
}

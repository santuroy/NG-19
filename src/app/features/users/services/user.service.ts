import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { User } from '../models/user.model';
// import { MOCK_USERS } from '../user.data';

import type { User } from '../models/user.model';
import { MOCK_USERS } from '../user.data';


@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';

  private users: User[] = [...MOCK_USERS];

  // Get all users
  getUsers(): Observable<User[]> {
    return of([...this.users]);
  }

  // Get user by ID
  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(user => user.id === id);

    return of(user);
  }

  // Add new user
  addUser(user: Omit<User, 'id'>): Observable<User> {

    const newUser: User = {
      ...user,
      id: Math.max(0, ...this.users.map(u => u.id)) + 1
    };

    this.users = [...this.users, newUser];

    return of(newUser);
  }

  // Update existing user
  updateUser(updatedUser: User): Observable<User> {

    this.users = this.users.map(user =>
      user.id === updatedUser.id
        ? { ...updatedUser }
        : user
    );

    return of(updatedUser);
  }

  // Delete user
  deleteUser(id: number): Observable<void> {

    this.users = this.users.filter(
      user => user.id !== id
    );

    return of(undefined);
  }
  

  
//   getUsers(): Observable<User[]> {
//     return this.http.get<User[]>(this.apiUrl);
//   }

//   getUser(id: string): Observable<User> {
//     return this.http.get<User>(`${this.apiUrl}/${encodeURIComponent(id)}`);
//   }

//   createUser(user: Omit<User, 'id'>): Observable<User> {
//     return this.http.post<User>(this.apiUrl, user);
//   }

//   updateUser(id: string, user: Partial<Omit<User, 'id'>>): Observable<User> {
//     return this.http.patch<User>(`${this.apiUrl}/${encodeURIComponent(id)}`, user);
//   }

//   deleteUser(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`);
//   }

}

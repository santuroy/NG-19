import { Injectable, inject, signal } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly userService = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Users could not be loaded. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
